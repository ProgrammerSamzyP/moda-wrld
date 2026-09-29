// src/pages/Home.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Music, Pause } from 'lucide-react'

const INSTAGRAM_URL = 'https://www.instagram.com/mvdebymoda'

function Home() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // A detached <audio> keeps playing, so stop it when leaving the page
  useEffect(() => {
    const audio = audioRef.current
    return () => audio?.pause()
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/assets/music.mp4" loop preload="none" />

      {/* Fills the screen below the 4rem (h-16) sticky navbar */}
      <section className="relative w-full overflow-hidden bg-black h-[calc(100dvh-4rem)] min-h-[480px]">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/hero-fallback.jpg"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/assets/herovid.mp4" type="video/mp4" />
          <source src="/assets/modavidnew.webm" type="video/webm" />
        </video>

        {/* Fallback image while the video loads */}
        {!isVideoLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/hero-fallback.jpg')" }}
          />
        )}

        {/* Overlay: slightly darkened so the button always reads */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-black/20" />

        {/* Hero content, centred */}
        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-none border border-white bg-transparent px-10 py-4 text-sm font-black uppercase tracking-[0.3em] text-white no-underline backdrop-blur-[2px] transition-all duration-300 hover:bg-white hover:text-black active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-12 sm:py-5 sm:text-base"
          >
            ENTER
          </Link>
        </div>

        {/* Music toggle, bottom-right, safe-area aware */}
        <div
          className="absolute right-4 z-30 sm:right-6 lg:right-8"
          style={{ bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
        >
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            aria-pressed={isPlaying}
            className={`relative flex h-12 w-12 items-center justify-center rounded-full border text-white backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-14 sm:w-14 ${
              isVideoLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            } ${
              isPlaying
                ? 'border-white/30 bg-white/15'
                : 'border-white/20 bg-white/10 hover:bg-white/20'
            }`}
          >
            {isPlaying && (
              <>
                <span className="absolute inset-0 rounded-full border border-white/30 animate-ping [animation-duration:2.2s]" />
                <span className="absolute inset-0 rounded-full border border-white/20 animate-ping [animation-duration:2.2s] [animation-delay:0.6s]" />
              </>
            )}

            <span className="relative flex h-5 w-5 items-center justify-center">
              <Music
                strokeWidth={1.8}
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  isPlaying ? 'scale-75 rotate-12 opacity-0' : 'scale-100 rotate-0 opacity-100'
                }`}
              />
              <Pause
                strokeWidth={1.8}
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  isPlaying ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-12 opacity-0'
                }`}
              />
            </span>

            {isPlaying && (
              <span className="absolute -top-2.5 left-1/2 flex h-2.5 -translate-x-1/2 items-end gap-[3px]">
                {[0, 180, 360].map((delay) => (
                  <span
                    key={delay}
                    className="w-[2.5px] rounded-full bg-white/80 animate-[eqBar_0.9s_ease-in-out_infinite]"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* No footer here: the app layout already mounts the global <Footer /> */}

      <style>{`
        @keyframes eqBar {
          0%, 100% { height: 3px; }
          50% { height: 10px; }
        }
      `}</style>
    </>
  )
}

export default Home