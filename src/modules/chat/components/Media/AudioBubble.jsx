import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { getAvatarUrl } from "@/lib/axios";

const AudioBubble = React.memo(({ msg }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playSpeed, setPlaySpeed] = useState(1); // 1.0, 1.5, 2.0

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const canvasRef = useRef(null);

  const attachment = msg.attachments?.[0] || msg.attachment || {};
  const rawSrc = attachment.filePath || msg.payload?.filePath || "";
  const src = rawSrc ? getAvatarUrl(rawSrc) : "";

  // Initialize and track audio metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Initial check in case it loaded fast
    if (audio.readyState >= 2) {
      setDuration(audio.duration || 0);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  // Adjust play speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playSpeed;
    }
  }, [playSpeed]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(e => console.error("Audio play failure:", e));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Speed toggles
  const handleSpeedToggle = useCallback(() => {
    setPlaySpeed(speed => {
      if (speed === 1) return 1.5;
      if (speed === 1.5) return 2;
      return 1;
    });
  }, []);

  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercent = clickX / width;

    audio.currentTime = newPercent * duration;
    setCurrentTime(audio.currentTime);
  }, [duration]);

  // Waveform visualization inside canvas element
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Generate static simulated waveform bars
    const barCount = 35;
    const barWidth = 3;
    const gap = 2;
    const barsData = [];

    // Seed repeatable data depending on message ID hash
    const seed = Number(msg.id) || 42;
    for (let i = 0; i < barCount; i++) {
      const h = Math.abs(Math.sin(seed + i * 0.4)) * (height * 0.7) + 2;
      barsData.push(h);
    }

    const currentPercent = duration > 0 ? currentTime / duration : 0;
    const activeBarIndex = Math.floor(currentPercent * barCount);

    // Draw
    for (let i = 0; i < barCount; i++) {
      const h = barsData[i];
      const x = i * (barWidth + gap);
      const y = (height - h) / 2;

      ctx.fillStyle = i < activeBarIndex ? "#3B82F6" : "#E2E8F0"; // Blue if played, slate if pending
      ctx.fillRect(x, y, barWidth, h);
    }
  }, [currentTime, duration, msg.id]);

  const formatSeconds = (sec) => {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-72 bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 flex items-center gap-3 shadow-xs select-none">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer transition-transform duration-100 hover:scale-105 active:scale-95 flex-shrink-0 shadow-sm"
      >
        {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
      </button>

      {/* Control panel details */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        {/* Waveform rendering screen */}
        <div className="h-7 w-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={175}
            height={28}
            className="w-full h-full"
          />
        </div>

        {/* Progress Seekbar */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="w-full bg-slate-200 h-1 rounded-full cursor-pointer overflow-hidden relative"
        >
          <div
            className="bg-blue-500 h-full transition-all duration-75"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Timer stats */}
        <div className="flex justify-between text-[9px] font-bold text-slate-400">
          <span>{formatSeconds(currentTime)}</span>
          <span>{formatSeconds(duration)}</span>
        </div>
      </div>

      {/* Speed Rate Button */}
      <button
        onClick={handleSpeedToggle}
        className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded hover:bg-slate-300 transition-colors cursor-pointer shrink-0"
      >
        {playSpeed.toFixed(1)}x
      </button>
    </div>
  );
});

AudioBubble.displayName = "AudioBubble";

export default AudioBubble;
