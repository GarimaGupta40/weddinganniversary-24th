import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, Check, Delete } from "lucide-react";
import weddingImage from "../assets/wedding.jpeg";

interface PreloaderGateProps {
  onAccessGranted: () => void;
}

export default function PreloaderGate({ onAccessGranted }: PreloaderGateProps) {
  // Screens: "loading" | "gate" | "success" | "transition"
  const [screen, setScreen] = useState<"loading" | "gate" | "success" | "transition">("loading");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [successStep, setSuccessStep] = useState(0); // 0: Granted, 1: Date reveal, 2: Final transition text

  // 1. Loading Screen Timer (3 seconds)
  useEffect(() => {
    if (screen === "loading") {
      const timer = setTimeout(() => {
        setScreen("gate");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // 3. Handle Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== "gate") return;
      if (e.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [password, screen]);

  // 4. Submit logic
  const handleSubmit = () => {
    if (password.trim().toLowerCase() === "20 june") {
      setScreen("success");
      // Success sequence
      // Step 0: "❤️ Access Granted ❤️" -> "Welcome Mom & Dad"
      // Wait 3s -> Step 1: "20 June 2002" -> "The day our story began ❤️"
      // Wait 5s -> Step 2: "Preparing 24 Years of Memories..."
      // Wait 2.5s -> trigger onAccessGranted
      setTimeout(() => {
        setSuccessStep(1);
        setTimeout(() => {
          setSuccessStep(2);
          setTimeout(() => {
            onAccessGranted();
          }, 2500);
        }, 5000);
      }, 3000);
    } else {
      setIsShaking(true);
      setErrorMsg("Oops...\n\nThat's not the memory we're looking for ❤️\n\nTry typing '20 June' to unlock.");
      setPassword("");
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Golden floating particles for background
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 6,
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-[#070302] select-none"
    >
      {/* Background Gradient & Glows */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-[#100705] to-black"
        style={{
          background: "radial-gradient(circle at center, rgba(92, 32, 24, 0.25) 0%, rgba(7, 3, 2, 1) 80%)"
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-b from-[#f5d77a] to-[#d4af37]/40"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px rgba(245,215,122,0.6)",
            }}
            animate={{
              y: ["0vh", "-110vh"],
              x: ["0vw", `${Math.random() * 10 - 5}vw`],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Ambient center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full pointer-events-none blur-[120px]" 
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)"
        }}
      />

      <AnimatePresence mode="wait">
        {/* ================= SCREEN 1: LOADING SCREEN ================= */}
        {screen === "loading" && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="relative flex flex-col items-center justify-center text-center p-6"
          >
            {/* Pulsing Golden Heart Outline */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Outer glow aura */}
              <motion.div 
                className="absolute w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(245, 215, 122, 0.25) 0%, transparent 70%)"
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="1.2"
                className="w-24 h-24 drop-shadow-[0_0_15px_rgba(245,215,122,0.6)]"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5d77a" />
                    <stop offset="50%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#b8860b" />
                  </linearGradient>
                </defs>
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </motion.svg>
            </div>

            {/* Elegantly Styled Text */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-serif italic text-xl sm:text-2xl text-[#f5d77a] glow-gold tracking-[0.2em] font-light mt-4"
            >
              Loading Our Story...
            </motion.h2>
          </motion.div>
        )}

        {/* ================= SCREEN 2: SECRET FAMILY ACCESS ================= */}
        {screen === "gate" && (
          <motion.div
            key="gate-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md px-6 z-10"
          >
            {/* Glassmorphic Golden Card */}
            <div className="glass-strong rounded-3xl p-8 text-center relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-[#d4af37]/35">
              
              {/* Lock Icon Header */}
              <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-b from-[#d4af37]/15 to-[#5c2018]/10 flex items-center justify-center border border-[#d4af37]/30 mb-5 shadow-[inset_0_0_15px_rgba(212,175,55,0.1)]">
                <Lock className="w-5 h-5 text-[#f5d77a]" />
              </div>

              {/* Headings */}
              <h2 className="font-serif text-2xl sm:text-3xl text-warm-white mb-2 tracking-wide">
                A Special Memory Awaits
              </h2>
              <p className="text-sm text-warm-white/70 max-w-xs mx-auto leading-relaxed mb-6 font-light">
                This journey is reserved for the two people who made our world beautiful ❤️
              </p>

              <div className="mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mb-6" />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-6 max-w-xs mx-auto text-left"
              >
                <div className="space-y-3">
                  <span className="block text-center text-xs uppercase tracking-[0.2em] text-[#f5d77a]/90 font-serif italic">
                    Please type "20 June" to unlock
                  </span>
                  
                  <motion.div
                    animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => {
                        setErrorMsg("");
                        setPassword(e.target.value);
                      }}
                      placeholder="Type here..."
                      autoFocus
                      className="w-full text-center py-3.5 px-4 rounded-xl bg-white/5 border border-[#d4af37]/40 text-[#f5d77a] placeholder-[#f5d77a]/30 focus:outline-none focus:border-[#f5d77a] focus:ring-1 focus:ring-[#f5d77a] transition-all text-lg tracking-wide font-serif"
                    />
                  </motion.div>
                </div>

                {/* Wrong Password Message */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-rose-300/90 leading-relaxed font-hindi px-2.5 bg-rose-950/20 py-3 rounded-xl border border-rose-950/40 text-center whitespace-pre-line">
                        {errorMsg}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77a] to-[#b8860b] text-[#1a0a05] font-serif font-medium tracking-widest text-xs hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Unlock Story
                </motion.button>
              </form>

            </div>
          </motion.div>
        )}

        {/* ================= SCREEN 3: SUCCESS & REVEAL SEQUENCE ================= */}
        {screen === "success" && (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center justify-center text-center p-6 z-10 max-w-2xl"
          >
            {/* Glowing Bright Heart */}
            <motion.div 
              className="relative mb-10 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {/* Pulsing Success Rings */}
              <motion.div 
                className="absolute w-44 h-44 rounded-full border border-[#f5d77a]/30"
                animate={{
                  scale: [1, 2.2],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.div 
                className="absolute w-36 h-36 rounded-full bg-[#f5d77a]/10 filter blur-xl"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Heart 
                className="w-28 h-28 text-[#f5d77a] fill-[#f5d77a] drop-shadow-[0_0_35px_rgba(245,215,122,0.9)]" 
                style={{
                  animation: "loader-pulse 1.2s ease-in-out infinite"
                }}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {/* SUCCESS STEP 0: Access Granted & Welcome */}
              {successStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4"
                >
                  <h1 className="font-serif text-3xl sm:text-4xl text-[#f5d77a] glow-gold tracking-widest uppercase font-light">
                    ❤️ Access Granted ❤️
                  </h1>
                  <h2 className="font-serif italic text-2xl sm:text-3xl text-warm-white font-light tracking-wide">
                    Welcome Mom & Dad
                  </h2>
                </motion.div>
              )}

              {/* SUCCESS STEP 1: Date reveal */}
              {successStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 flex flex-col items-center"
                >
                  <div className="space-y-2">
                    <h1 className="font-serif text-4xl sm:text-5xl text-[#f5d77a] glow-gold tracking-[0.1em] font-light">
                      20 June 2002
                    </h1>
                    <h2 className="font-serif italic text-xl sm:text-2xl text-warm-white/95 font-light tracking-widest mt-2">
                      The day our story began ❤️
                    </h2>
                  </div>

                  {/* Spinning/Rolling Wedding Photo */}
                  <motion.div
                    initial={{ scale: 0, rotate: -720, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      delay: 0.4,
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="frame w-72 sm:w-[450px] md:w-[500px]"
                  >
                    <img
                      src={weddingImage}
                      alt="Wedding Day"
                      className="w-full h-auto rounded-xl object-contain"
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* SUCCESS STEP 2: Transition Text */}
              {successStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <p className="font-serif italic text-xl sm:text-2xl text-[#f5d77a]/90 tracking-widest font-light">
                    Preparing 24 Years of Memories...
                  </p>
                  
                  {/* Small elegant progress indicator */}
                  <div className="w-48 h-[2px] bg-white/5 mx-auto rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#f5d77a] to-[#d4af37] shadow-[0_0_8px_rgba(245,215,122,0.8)]"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.2, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Curtains of Light / Doors of Light for Final Transition */}
      <AnimatePresence>
        {successStep === 2 && (
          <>
            {/* Left Door of Light */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{
                delay: 2.0,
                duration: 1.2,
                ease: [0.85, 0, 0.15, 1],
              }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#070302] border-r border-[#d4af37]/30 z-[1100] shadow-[10px_0_40px_rgba(212,175,55,0.1)]"
            >
              {/* Soft vertical light beam */}
              <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#f5d77a] to-transparent shadow-[0_0_20px_#f5d77a]" />
            </motion.div>
            
            {/* Right Door of Light */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{
                delay: 2.0,
                duration: 1.2,
                ease: [0.85, 0, 0.15, 1],
              }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#070302] border-l border-[#d4af37]/30 z-[1100] shadow-[-10px_0_40px_rgba(212,175,55,0.1)]"
            >
              {/* Soft vertical light beam */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#f5d77a] to-transparent shadow-[0_0_20px_#f5d77a]" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
