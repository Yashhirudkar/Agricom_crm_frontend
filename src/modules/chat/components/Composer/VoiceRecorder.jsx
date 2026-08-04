import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, Trash2, Pause, Play, Send, X } from "lucide-react";
import { toast } from "sonner";

const VoiceRecorder = React.memo(({ onSend, onClose }) => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Clean cleanup of observers/streams/audioContext
  const cleanup = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch((e) => console.error("AudioContext close error:", e));
    }

    mediaRecorderRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  // Ensure cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!recording || paused) return;

      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#F8FAFC"; // slate-50
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#3B82F6"; // blue-500
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }, [recording, paused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start(100);
      setRecording(true);
      setPaused(false);
      setDuration(0);

      // Start duration clock
      timerIntervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // Live waveform AnalyserNode setup
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setTimeout(drawWaveform, 100);
    } catch (e) {
      console.error(e);
      toast.error("Microphone access denied or unsupported.");
    }
  };

  const handlePauseToggle = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (paused) {
      recorder.resume();
      setPaused(false);
      // Restart canvas loop
      setTimeout(drawWaveform, 50);
    } else {
      recorder.pause();
      setPaused(true);
    }
  }, [paused, drawWaveform]);

  const handleCancel = useCallback(() => {
    cleanup();
    setRecording(false);
    setPaused(false);
    setDuration(0);
    if (onClose) onClose();
  }, [cleanup, onClose]);

  const handleStopAndSend = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || chunksRef.current.length === 0) {
      cleanup();
      return;
    }

    recorder.onstop = () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" });
      onSend(audioBlob);
      cleanup();
      setRecording(false);
      if (onClose) onClose();
    };

    recorder.stop();
  }, [onSend, onClose, cleanup]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-80 bg-slate-50 border border-slate-200 rounded-xl shadow-xl p-4 flex flex-col items-center gap-3.5 z-30 select-none animate-in zoom-in-95 duration-150">
      <div className="w-full flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Voice Message
        </span>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          title="Abort"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {!recording ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <button
            onClick={startRecording}
            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md"
            title="Start Recording"
          >
            <Mic className="h-6 w-6" />
          </button>
          <span className="text-[11px] font-semibold text-slate-500">Tap to record</span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          {/* Waveform Canvas display */}
          <div className="h-10 w-full bg-white rounded-lg border border-slate-100 overflow-hidden flex items-center justify-center">
            {paused ? (
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider animate-pulse">
                Recording Paused
              </span>
            ) : (
              <canvas
                ref={canvasRef}
                width={260}
                height={40}
                className="w-full h-full"
              />
            )}
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-red-500 font-mono">
              {formatTime(duration)}
            </span>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-red-100 text-red-500 rounded-full cursor-pointer transition-colors"
                title="Discard"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                onClick={handlePauseToggle}
                className="p-2 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer transition-colors"
                title={paused ? "Resume" : "Pause"}
              >
                {paused ? <Play className="h-4 w-4 fill-slate-600" /> : <Pause className="h-4 w-4 fill-slate-600" />}
              </button>

              <button
                onClick={handleStopAndSend}
                className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-105"
                title="Send"
              >
                <Send className="h-4 w-4 fill-white ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

VoiceRecorder.displayName = "VoiceRecorder";

export default VoiceRecorder;
