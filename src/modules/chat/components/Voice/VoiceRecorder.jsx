"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, StopCircle, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

export default function VoiceRecorder({ onSendVoice }) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recorder, setRecorder] = useState(null);
  const intervalRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        onSendVoice(audioBlob);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Audio recording permission denied.");
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(intervalRef.current);
    setIsRecording(false);
  };

  const discardRecording = () => {
    if (recorder) {
      recorder.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(intervalRef.current);
    setIsRecording(false);
    setDuration(0);
    toast.info("Recording discarded.");
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-650 bg-red-655 bg-red-600 rounded-lg text-white text-xs font-bold animate-pulse">
          <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
          <span>Recording ({duration}s)</span>
          <button type="button" onClick={stopRecording} className="ml-2 hover:opacity-80">
            <StopCircle className="h-4 w-4" />
          </button>
          <button type="button" onClick={discardRecording} className="ml-1 hover:opacity-80">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="p-1.5 hover:bg-slate-900 text-slate-500 hover:text-slate-200 rounded-lg transition-colors"
          title="Record voice message"
        >
          <Mic className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
