import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, Play, Pause, Volume2, VolumeX, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import heroPoster from "../assets/hero-poster.jpg";
import storyVideo from "../assets/0617.mp4";
import heroBgVideo from "../assets/0617 (1)(1).mp4";
import mem1 from "../assets/mem-1.jpeg";
import mem2 from "../assets/mem-2.jpeg";
import mem3 from "../assets/mem-3.jpeg";
import mem4 from "../assets/mem-4.jpeg";
import mem5 from "../assets/mem-5.jpeg";
import mem6 from "../assets/mem-6.jpeg";
import Dadu from "../assets/Dadu.jpeg";
import Garima from "../assets/Garima.jpeg";
import Lakshu from "../assets/Lakshu.jpeg";
import Mridul from "../assets/Mridul.jpeg";
import image2002 from "../assets/2002.jpeg";
import withGarima from "../assets/With-garima.png";
import withMridul from "../assets/With-Mridul.png";
import withLakshu from "../assets/With-Lakshu.png";

import CoverFlow from "../components/CoverFlow";
import PreloaderGate from "../components/PreloaderGate";

export const Route = createFileRoute("/")({ component: Index });

/* ---------- Floating golden particles ---------- */
function Particles({ count = 40, className = "" }: { count?: number; className?: string }) {
  const items = Array.from({ length: count });
  return (
    <div className={`particles ${className}`} aria-hidden>
      {items.map((_, i) => {
        const size = 2 + Math.random() * 5;
        const left = Math.random() * 100;
        const dur = 8 + Math.random() * 14;
        const delay = -Math.random() * dur;
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              width: size, height: size,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              opacity: 0.4 + Math.random() * 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------- Scroll reveal wrapper ---------- */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("in"), delay);
          io.unobserve(el);
        }
      }),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

/* ---------- Music toggle ---------- */
function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full glass-strong px-4 py-3 text-[#f5d77a] hover:scale-105 transition-transform"
      style={{ boxShadow: "0 0 30px rgba(212,175,55,.3)" }}
    >
      {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      <span className="text-xs tracking-widest font-serif italic hidden sm:inline">
        {playing ? "Music On" : "Music Off"}
      </span>
    </button>
  );
}

/* ---------- Confetti for finale ---------- */
function Confetti() {
  const colors = ["#f5d77a", "#d4af37", "#5c2018", "#f9e6a1", "#ffffff"];
  const pieces = Array.from({ length: 60 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const dur = 6 + Math.random() * 8;
        const delay = Math.random() * 6;
        const size = 6 + Math.random() * 8;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-10vh",
              left: `${left}%`,
              width: size, height: size * 0.4,
              background: colors[i % colors.length],
              borderRadius: 2,
              opacity: 0.85,
              animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
              boxShadow: "0 0 6px rgba(245,215,122,.4)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================== */
function Index() {
  const [authenticated, setAuthenticated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showStoryVideo, setShowStoryVideo] = useState(false);
  const [wasMusicPlaying, setWasMusicPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (authenticated && videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Video autoplay failed/blocked:", err));
    }
  }, [authenticated]);

  const handlePlayVideo = () => {
    if (playing) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlaying(false);
      setWasMusicPlaying(true);
    } else {
      setWasMusicPlaying(false);
    }
    setShowStoryVideo(true);
  };

  const handleCloseVideo = () => {
    setShowStoryVideo(false);
    if (wasMusicPlaying) {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setPlaying(true))
          .catch((err) => console.log("Audio resume blocked:", err));
      }
    }
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch((err) => console.log("Audio play blocked:", err));
    }
  };

  const gallery = [mem1, mem2, mem3, mem4, mem5, mem6];
  const family = [
    { src: Dadu, name: "Papa", role: "हमारी ताकत और सहारा", message: "आपका प्यार हमारी सबसे बड़ी दौलत है ❤️" },
    { src: Garima, name: "Elder Daughter", role: "हमारी पहली खुशी", message: "आपकी मुस्कान घर की रौशनी है ✨" },
    { src: Lakshu, name: "Lovely Younger Daughter", role: "घर की मिठास", message: "आप हमारे दिल का सुकून हैं 🌸" },
    { src: Mridul, name: "Sweetest Son", role: "हमारा नन्हा राजकुमार", message: "आप हमारी दुनिया के राजा हैं 👑", position: "object-top" },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0504] text-[color:var(--warm-white)]">
      <audio ref={audioRef} loop preload="auto" src="https://cdn.pixabay.com/audio/2022/10/18/audio_31c5e9f0fa.mp3" />

      <AnimatePresence>
        {!authenticated && (
          <PreloaderGate
            key="preloader-gate"
            onAccessGranted={() => {
              setAuthenticated(true);
              // Music stays off by default until manually toggled
            }}
          />
        )}
      </AnimatePresence>

      {authenticated && (
        <>
          {/* ============ HERO ============ */}
          <section className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden">
            {/* Video / poster */}
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover opacity-60 filter brightness-[0.7] contrast-[1.1] saturate-[0.85]"
              autoPlay muted loop playsInline
              poster={heroPoster}
              src={heroBgVideo}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0.6;
                }
              }}
            />
        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,5,4,.85) 80%)" }} />
        <Particles count={50} />

        {/* Top glowing title */}
        <div className="absolute top-8 left-0 right-0 flex justify-center px-4 z-10 animate-fade-in">
          <h2 className="font-serif text-center text-lg sm:text-2xl md:text-3xl text-[#f5d77a] glow-gold animate-pulse-glow tracking-wide">
            Happy 24<sup className="text-xs">th</sup> Wedding Anniversary <span className="text-rose-400">❤️</span>
          </h2>
        </div>

        {/* Main hero text */}
        <div className="relative z-10 max-w-5xl px-6 text-center">
          <p className="font-serif italic text-[#f5d77a]/80 text-sm sm:text-base tracking-[0.4em] uppercase mb-6 animate-fade-up" style={{ animationDelay: ".2s" }}>
            — Since 2002 —
          </p>

          <h1
            className="font-hindi text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-warm-white animate-fade-up"
            style={{ animationDelay: ".5s", color: "#fdf6e3", textShadow: "0 4px 30px rgba(0,0,0,.8), 0 0 60px rgba(212,175,55,.25)" }}
          >
            <span className="font-hindi text-gold glow-gold">24 साल…</span>
            <br />
            <span className="text-2xl sm:text-4xl md:text-5xl block mt-4 font-normal">सिर्फ समय नहीं,</span>
            <span className="text-2xl sm:text-4xl md:text-5xl block mt-2 font-normal">
              प्यार, विश्वास और साथ का सफर <span className="text-rose-400">❤️</span>
            </span>
          </h1>

          <div className="mt-12 animate-fade-up" style={{ animationDelay: "1.1s" }}>
            <button
              onClick={handlePlayVideo}
              className="btn-gold inline-flex items-center gap-3 rounded-full px-8 py-4 font-serif text-base sm:text-lg cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span className="font-hindi">हमारी कहानी देखें</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
          <div className="h-12 w-[2px] bg-gradient-to-b from-[#f5d77a] to-transparent" />
        </div>
      </section>

      {/* ============ SECTION 2 — TIMELINE ============ */}
      <section id="story" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at top, rgba(92,32,24,.4), transparent 60%)" }} />
        <Particles count={20} />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <h2 className="font-hindi text-center text-4xl sm:text-5xl md:text-6xl text-gold glow-gold mb-4">
              हमारे परिवार की कहानी
            </h2>
            <div className="mx-auto h-px w-40 shimmer mb-20" />
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#d4af37] to-transparent hidden md:block" />

            {[
              { year: "2002", title: "Wedding Day", sub: "जहाँ से सफर शुरू हुआ ❤️", img: image2002, position: "object-top" },
              { year: "2003", title: "Welcoming Elder Daughter", sub: "हमारी पहली खुशी ✨", img: withGarima, position: "object-top" },
              { year: "2006", title: "Welcoming Younger Daughter", sub: "घर में और मुस्कानें आईं ❤️", img: withLakshu, position: "object-top" },
              { year: "2014", title: "Welcoming Sweetest Son", sub: "हमारा नन्हा राजकुमार 👑", img: withMridul, position: "object-top" },
              { year: "2026", title: "24 Years Together", sub: "एक खूबसूरत रिश्ता, हमेशा के लिए", img: mem1, position: "object-top" },
            ].map((it, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className={`relative mb-16 md:mb-24 flex flex-col md:flex-row items-center gap-8 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                  <div className="md:w-1/2">
                    <div className="frame animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                      <img
                        src={it.img}
                        alt={it.title}
                        loading="lazy"
                        className={`w-full h-72 sm:h-[350px] md:h-[400px] object-cover rounded-xl ${it.position || "object-center"}`}
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 text-center md:text-left">
                    <span className="font-serif italic text-gold text-sm tracking-[0.3em]">{it.year}</span>
                    <h3 className="font-serif text-3xl sm:text-4xl mt-2 text-warm-white">{it.title}</h3>
                    <p className="font-hindi text-lg mt-3 text-warm-white/70">{it.sub}</p>
                  </div>
                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                    <div className="h-5 w-5 rounded-full bg-[#f5d77a]" style={{ boxShadow: "0 0 20px #d4af37, 0 0 40px rgba(212,175,55,.5)" }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 3 — EMOTIONAL MESSAGE ============ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,.12), transparent 70%)" }} />
        <Reveal className="relative mx-auto max-w-3xl">
          <div className="glass-strong rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,215,122,.3), transparent 70%)" }} />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full" style={{ background: "radial-gradient(circle, rgba(92,32,24,.4), transparent 70%)" }} />
            <Sparkles className="mx-auto h-8 w-8 text-[#f5d77a] mb-6" style={{ filter: "drop-shadow(0 0 12px #d4af37)" }} />
            <p
              className="font-hindi text-2xl sm:text-3xl md:text-4xl"
              style={{ color: "#fdf6e3" }}
            >
              मम्मी-पापा,
              <br /><br />
              आप दोनों ने हमें सिर्फ एक घर नहीं,
              <br />
              बल्कि प्यार, सम्मान और रिश्तों की
              <br />
              असली अहमियत सिखाई है।
              <br /><br />
              <span className="font-hindi text-gold glow-gold">24वीं सालगिरह की दिल से शुभकामनाएँ ❤️</span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* ============ SECTION 4 — COVERFLOW GALLERY ============ */}
      <section
        className="relative py-32 px-4 sm:px-6 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(70,30,18,.55), transparent 60%), linear-gradient(180deg, #050302 0%, #1a0a06 50%, #050302 100%)",
        }}
      >
        <Particles count={30} />
        <Reveal>
          <h2 className="font-hindi text-center text-4xl sm:text-5xl md:text-6xl text-gold glow-gold">
            कुछ खूबसूरत यादें ✨
          </h2>
          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <Heart className="h-4 w-4 text-[#f5d77a] glow-gold" />
            <span className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>
          <p className="font-hindi mt-6 mb-14 text-center text-base sm:text-lg text-[#f5e8c8]/80 max-w-2xl mx-auto px-4">
            हर तस्वीर एक कहानी कहती है, हर याद दिल के करीब है।
          </p>
        </Reveal>
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <CoverFlow images={gallery} />
          </div>
        </Reveal>
      </section>

      {/* ============ SECTION 5 — BLESSINGS / WISHES ============ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at bottom, rgba(92,32,24,.5), transparent 70%)" }} />
        <Particles count={25} />
        <Reveal>
          <h2 className="font-hindi text-center text-4xl sm:text-5xl md:text-6xl text-gold glow-gold">
            प्यार भरी शुभकामनाएँ ✨
          </h2>
          <div className="mx-auto mt-4 h-px w-40 shimmer mb-16" />
        </Reveal>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {family.map((f, i) => (
            <Reveal key={i} delay={i * 120}>
              <div
                className="frame glass-strong rounded-2xl p-4 animate-float transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  animationDelay: `${i * 0.4}s`,
                  boxShadow: "0 0 30px rgba(212,175,55,.15), inset 0 0 20px rgba(212,175,55,.05)",
                }}
              >
                <div className="relative overflow-hidden rounded-xl" style={{ border: "1px solid rgba(212,175,55,.4)" }}>
                  <img
                    src={f.src}
                    alt={f.name}
                    loading="lazy"
                    className={`h-64 sm:h-72 w-full object-cover transition-transform duration-1000 hover:scale-110 ${f.position || "object-center"}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="px-2 pt-5 pb-2 text-center">
                  <h3 className="font-serif italic text-2xl text-gold glow-gold">{f.name}</h3>
                  <p className="font-hindi text-xs tracking-wider text-warm-white/60 mt-1 uppercase">{f.role}</p>
                  <div className="mx-auto my-3 h-px w-16 shimmer" />
                  <p className="font-hindi text-sm sm:text-base text-warm-white/85" style={{ fontSize: "1.15rem" }}>
                    {f.message}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ============ SECTION 6 — FINALE ============ */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden py-32 px-6">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(92,32,24,.5), #0a0504 75%)" }} />
        <Particles count={70} />
        <Confetti />

        <Reveal className="relative z-10 text-center max-w-4xl">
          <Heart className="mx-auto h-10 w-10 text-rose-400 mb-8 animate-pulse-glow" style={{ filter: "drop-shadow(0 0 20px rgba(245,215,122,.7))" }} />
          <p
            className="font-hindi text-3xl sm:text-4xl md:text-5xl leading-relaxed text-warm-white"
            style={{ textShadow: "0 0 30px rgba(212,175,55,.4)" }}
          >
            कुछ रिश्ते वक्त के साथ
            <br />
            पुराने नहीं होते,
            <br />
            <span className="font-hindi text-gold glow-gold">बल्कि और खूबसूरत हो जाते हैं ❤️</span>
          </p>
          <h3 className="mt-12 font-serif italic text-3xl sm:text-5xl text-gold glow-gold animate-pulse-glow">
            Happy 24<sup className="text-base">th</sup> Anniversary
          </h3>
          <p className="mt-6 font-serif italic text-warm-white/50 tracking-[0.5em] text-xs uppercase">
            with all our love
          </p>
        </Reveal>
      </section>

      <footer className="relative py-10 text-center text-warm-white/40 text-xs tracking-widest font-serif italic">
        — Made with <span className="text-rose-400">❤</span> for Mummy & Papa —
      </footer>

      <AnimatePresence>
        {showStoryVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl rounded-2xl border border-[#d4af37]/40 bg-[#0a0504] p-1.5 shadow-2xl"
              style={{ boxShadow: "0 0 50px rgba(212,175,55,.2)" }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-[#f5d77a] hover:bg-black/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close video"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Video Element */}
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <video
                  src={storyVideo}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </main>
  );
}
