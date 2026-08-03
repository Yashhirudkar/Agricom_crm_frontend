import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import axiosClient from "@/lib/axios";

// Moved outside the component to prevent recreating the class on every render
class Particle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * (height * 0.5) - 50;
    this.vx = Math.random() * 8 - 4; // Wider spread
    this.vy = Math.random() * 6 + 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.size = Math.random() * 12 + 4;
    this.alpha = 1;
    this.decay = Math.random() * 0.008 + 0.004;
    this.gravity = 0.15;
    this.drag = 0.98;
    this.shape = Math.random() > 0.5 ? "circle" : "ribbon";
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
  }

  update() {
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.vy += this.gravity;
    this.vx += Math.sin(this.y * 0.05) * 0.1; // Gentle sway
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Ribbon shape for better confetti look
      ctx.fillRect(-this.size / 2, -this.size, this.size, this.size * 2);
    }
    ctx.restore();
  }
}

const BALLOON_COLORS = [
  { bg: "radial-gradient(circle at 30% 30%, #ff8ebb, #ff1a53)", knot: "#ff1a53" },
  { bg: "radial-gradient(circle at 30% 30%, #8ee0ff, #0099ff)", knot: "#0099ff" },
  { bg: "radial-gradient(circle at 30% 30%, #ffe88e, #ffbb00)", knot: "#ffbb00" },
  { bg: "radial-gradient(circle at 30% 30%, #b38eff, #6600ff)", knot: "#6600ff" },
  { bg: "radial-gradient(circle at 30% 30%, #8eff99, #00cc22)", knot: "#00cc22" }
];

export default function BirthdayBalloon({ employeeName = "Team Member", onPopComplete, maxPops = 2, userMetadata }) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [animationState, setAnimationState] = useState("idle"); // "idle" | "falling" | "floating"
  const [tapCount, setTapCount] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [isExploding, setIsExploding] = useState(false);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  const currentBalloonColor = BALLOON_COLORS[poppedCount % BALLOON_COLORS.length];

  const triggerExplosion = useCallback(() => {
    setIsExploding(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Generate more particles for a grander effect
    particlesRef.current = Array.from({ length: 300 }, () => new Particle(width, height));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activeParticles = particlesRef.current.filter(p => p.alpha > 0);

      activeParticles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      particlesRef.current = activeParticles;

      if (activeParticles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsExploding(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const startCelebration = useCallback(() => {
    if (animationState !== "idle") return;
    setTapCount(0);
    setAnimationState("falling");
    setTimeout(() => {
      setAnimationState("floating");
    }, 1000);
  }, [animationState]);

  const handleLargeBalloonTap = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (animationState !== "floating") return;

    if (tapCount < 2) {
      setTapCount(prev => prev + 1);
      // Optional: Add haptic feedback for mobile devices
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } else {
      // Pop Action
      setAnimationState("idle");

      if (poppedCount === 0) {
        triggerExplosion();
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100]); // Heavier vibration on pop
        }
      }

      const newPoppedCount = poppedCount + 1;
      setPoppedCount(newPoppedCount);

      const todayStr = new Date().toLocaleDateString("en-CA");
      axiosClient
        .put("/profile/update-preferences", {
          birthdayMetadata: {
            lastPoppedDate: todayStr,
            poppedCount: newPoppedCount,
          },
        })
        .then(() => {
          dispatch(fetchCurrentUser());
        })
        .catch((err) => {
          console.error("Failed to save birthday popped state:", err);
        });

      if (newPoppedCount >= maxPops) {
        if (onPopComplete) onPopComplete();
      } else {
        setTimeout(() => {
          setTapCount(0);
          setAnimationState("floating");
        }, 1200);
      }
    }
  }, [animationState, tapCount, poppedCount, maxPops, triggerExplosion, onPopComplete]);

  // Keyboard accessibility handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLargeBalloonTap(e);
    }
  };

  useEffect(() => {
    if (userMetadata) {
      const todayStr = new Date().toLocaleDateString("en-CA");
      if (userMetadata.lastPoppedDate === todayStr) {
        setPoppedCount(userMetadata.poppedCount || 0);
      } else {
        setPoppedCount(0);
      }
    }
  }, [userMetadata]);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const isFalling = animationState === "falling";
  const isFloating = animationState === "floating";

  // Wiggle effect based on tap count
  const tapRotation = tapCount === 1 ? "-10deg" : tapCount === 2 ? "10deg" : "0deg";

  const outerStyle = isFalling
    ? {
      animation: "balloon-fall 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards",
    }
    : isFloating
      ? {
        transform: `translate(calc(50vw - 60px), calc(100vh - 280px)) scale(${1.5 + tapCount * 0.45}) rotate(${tapRotation})`,
        transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)", // Springy transition
      }
      : { display: "none" };

  const renderOverlays = () => {
    if (!mounted) return null;

    return createPortal(
      <>
        {/* Falling or Floating Large Balloon Container */}
        {(isFalling || isFloating) && (
          <div
            onClick={handleLargeBalloonTap}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Tap balloon to pop it. ${3 - tapCount} taps remaining.`}
            style={outerStyle}
            className="fixed left-0 top-0 z-[99999] select-none cursor-pointer outline-none"
          >
            {/* Inner bobbing container */}
            <div className={`flex flex-col items-center relative ${isFloating ? "animate-inner-bob" : ""}`}>
              {/* Glossy Balloon Shape */}
              <div
                style={{ background: currentBalloonColor.bg }}
                className="w-20 h-24 rounded-t-full rounded-b-[70%] shadow-[0_15px_25px_rgba(0,0,0,0.2)] relative transition-all duration-200"
              >
                {/* Gloss highlight */}
                <div className="absolute top-3 left-4 w-6 h-3 bg-white/50 rounded-full rotate-[-30deg] blur-[1px]"></div>
              </div>
              {/* Knot */}
              <div
                style={{ borderBottomColor: currentBalloonColor.knot }}
                className="w-0 h-0 border-l-[6.5px] border-l-transparent border-r-[6.5px] border-r-transparent border-b-[10px] mt-[-1px]"
              ></div>
              {/* String */}
              <svg className="w-4 h-12 mt-[-1px] text-slate-400 overflow-visible opacity-80" fill="none" viewBox="0 0 10 25">
                <path d="M5,0 C2,6 8,12 5,18 C2,24 8,28 5,35" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>

              {/* Tap count bubble overlay */}
              {isFloating && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap animate-bounce pointer-events-none border border-slate-700">
                  {3 - tapCount} Taps to Pop! 🎈
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pop Canvas */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[100000]"
          style={{
            width: "100vw",
            height: "100vh",
            display: isExploding ? "block" : "none"
          }}
        />

        {/* Happy Birthday text overlay */}
        {isExploding && (
          <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-[99999] animate-pop-text bg-white/10 backdrop-blur-[2px]">
            {/* Removed drop-shadow-md from here to fix the blurring issue */}
            <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 tracking-tight select-none text-center leading-tight">
              Happy Birthday!
            </h1>
            <p className="text-sm sm:text-base font-extrabold text-indigo-800 uppercase tracking-widest mt-4 select-none text-center px-4 bg-white/50 py-2 rounded-full shadow-sm backdrop-blur-md">
              Wishing a very happy birthday to you, {employeeName}! 🎉
            </p>
          </div>
        )}
      </>,
      document.body
    );
  };

  return (
    <div className="relative flex items-center shrink-0">
      {/* Small Header Balloon Button */}
      {poppedCount < maxPops && (
        <button
          onClick={startCelebration}
          aria-label="Release birthday balloon"
          className={`relative p-2 text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-300 cursor-pointer animate-float-icon group focus:outline-none focus:ring-2 focus:ring-pink-300 ${animationState !== "idle" ? "opacity-50 pointer-events-none grayscale" : ""
            }`}
          title="Click to release a birthday balloon!"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
            <defs>
              <radialGradient id="smallBalloonGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ff8ebb" />
                <stop offset="100%" stopColor="#ff1a53" />
              </radialGradient>
            </defs>
            <path
              d="M12 2C7.5 2 4 5.5 4 10C4 13.5 6.5 16 9 17.5L10 18.5H14L15 17.5C17.5 16 20 13.5 20 10C20 5.5 16.5 2 12 2Z"
              fill="url(#smallBalloonGrad)"
            />
            <ellipse cx="9" cy="6" rx="2.5" ry="1.2" fill="white" fillOpacity="0.5" transform="rotate(-30 9 6)" />
            <path d="M12 18.5L9.5 21H14.5L12 18.5Z" fill="#ff1a53" />
            <path d="M12 21C11 23 13 24 12 26" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          {animationState === "idle" && (
            <span className="absolute left-1/2 -translate-x-1/2 top-10 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg pointer-events-none animate-pulse-fast whitespace-nowrap z-50">
              Tap me! 🎈
            </span>
          )}
        </button>
      )}

      {renderOverlays()}

      <style>{`
        @keyframes balloon-fall {
          0% {
            transform: translate(calc(100vw - 100px), -50px) scale(0.1);
            opacity: 0;
          }
          100% {
            transform: translate(calc(50vw - 40px), calc(100vh - 280px)) scale(1.5);
            opacity: 1;
          }
        }
        
        @keyframes inner-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-inner-bob {
          animation: inner-bob 2.5s infinite ease-in-out;
        }

        @keyframes float-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-float-icon {
          animation: float-icon 3s infinite ease-in-out;
        }

        @keyframes pulse-fast {
          0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, 0) scale(1.05); opacity: 1; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1.5s infinite ease-in-out;
        }

        @keyframes pop-text {
          0% { opacity: 0; transform: scale(0.3) translateY(40px); }
          15% { opacity: 1; transform: scale(1.1) translateY(-10px); }
          25% { opacity: 1; transform: scale(1.0) translateY(0); }
          85% { opacity: 1; transform: scale(1.0) translateY(0); }
          /* Removed filter: blur(5px) to keep text crisp while fading out */
          100% { opacity: 0; transform: scale(1.05) translateY(-20px); }
        }
        .animate-pop-text {
          animation: pop-text 3.2s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
}