import React, { useState } from "react";
import { subscribeToNewsletter } from "../services/firebase";

const LockScreen = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // password states
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await subscribeToNewsletter(email);

      if (result.status === "already_subscribed") {
        setError("You're already on the list.");
      } else {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    // TODO: hook to your real password logic
    if (password.trim() !== "moda2025") {
      setPasswordError("Incorrect password. Try again.");
      return;
    }
    // on success — redirect or unlock
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-0 z-50 bg-white text-black overflow-y-auto">

      {/* Very subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(#000 1px, transparent 1px),
              linear-gradient(90deg, #000 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main */}
      <main className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-14">

        <div className="w-full max-w-[440px] flex flex-col items-center text-center">

          {/* ── LOGO ── */}
          <div className="relative flex items-center justify-center mb-4">
            {!imageLoaded && (
              <div className="absolute flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
              </div>
            )}

            <img
              src="/assets/logoWhite.png"
              alt="MODA WRLD"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                setImageLoaded(true);
              }}
              className={`
                w-auto h-auto
                max-w-[120px] sm:max-w-[140px]
                max-h-[95px] sm:max-h-[110px]
                object-contain
                transition-all duration-1000 ease-out
                ${imageLoaded
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-2 scale-95"}
              `}
            />
          </div>

          {/* ── BRAND ── */}
          <h1 className="text-lg sm:text-xl font-light tracking-[0.28em] uppercase">
            MODA WRLD
          </h1>

          <div className="flex items-center justify-center gap-2.5 mt-2.5 mb-8">
            <span className="h-px w-5 bg-black" />
            <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.35em] text-gray-500">
              The Swag World
            </p>
            <span className="h-px w-5 bg-black" />
          </div>

          {/* ── NEWSLETTER ── */}
          <div className="w-full mb-6">
            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed mb-4 px-2">
              Sign up for our newsletter to be the first to know when we launch.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="w-full">
                <div
                  className="
                    group flex items-center
                    w-full h-[52px] sm:h-[56px]
                    rounded-lg
                    border border-black/15
                    bg-white
                    pl-4 pr-1.5
                    transition-all duration-300
                    focus-within:border-black
                    focus-within:shadow-[0_6px_25px_rgba(0,0,0,0.06)]
                  "
                >
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Email"
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="
                      flex-1 min-w-0
                      bg-transparent border-none outline-none
                      text-[13px] sm:text-[14px]
                      text-black
                      placeholder:text-gray-400
                      placeholder:tracking-wide
                      py-2
                      disabled:opacity-50
                    "
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      flex items-center justify-center
                      h-[40px] sm:h-[44px]
                      px-5 sm:px-6
                      rounded-md
                      bg-black text-white
                      text-[9px] sm:text-[10px]
                      uppercase tracking-[0.22em] font-semibold
                      whitespace-nowrap
                      transition-all duration-300
                      hover:bg-gray-800
                      active:scale-[0.97]
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    {loading ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </div>

                {error && (
                  <p className="mt-2.5 text-[10px] text-red-500 tracking-wide text-left pl-1">
                    {error}
                  </p>
                )}
              </form>
            ) : (
              /* SUCCESS */
              <div
                className="
                  flex items-center justify-center gap-2.5
                  w-full h-[52px] sm:h-[56px]
                  rounded-lg
                  border border-black
                  bg-black text-white
                  animate-[fadeIn_0.4s_ease-out]
                "
              >
                <span className="text-[12px]">✓</span>
                <p className="text-[10px] uppercase tracking-[0.28em] font-semibold">
                  Thanks for subscribing!
                </p>
              </div>
            )}
          </div>

          {/* ── PASSWORD SECTION ── */}
          <div className="w-full">

            <form onSubmit={handlePasswordSubmit} className="w-full">

              {/* Collapsible toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="
                  w-full text-[10px] sm:text-[11px]
                  uppercase tracking-[0.28em]
                  text-gray-500 hover:text-black
                  transition-colors duration-300
                  py-3
                  flex items-center justify-center gap-2
                "
              >
                <span className="h-px w-4 bg-current opacity-40" />
                {showPassword ? "Hide password" : "Enter using password"}
                <span className="h-px w-4 bg-current opacity-40" />
              </button>

              {/* Password form */}
              <div
                className={`
                  grid transition-all duration-500 ease-out overflow-hidden
                  ${showPassword
                    ? "grid-rows-[1fr] opacity-100 mt-3"
                    : "grid-rows-[0fr] opacity-0 mt-0"}
                `}
              >
                <div className="min-h-0">
                  <div
                    className="
                      group flex items-center
                      w-full h-[52px] sm:h-[56px]
                      rounded-lg
                      border border-black/15
                      bg-white
                      pl-4 pr-1.5
                      transition-all duration-300
                      focus-within:border-black
                      focus-within:shadow-[0_6px_25px_rgba(0,0,0,0.06)]
                    "
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="
                        flex-1 min-w-0
                        bg-transparent border-none outline-none
                        text-[13px] sm:text-[14px]
                        text-black
                        placeholder:text-gray-400
                        placeholder:tracking-wide
                        py-2
                      "
                    />

                    <button
                      type="submit"
                      className="
                        flex items-center justify-center
                        h-[40px] sm:h-[44px]
                        px-5 sm:px-6
                        rounded-md
                        bg-black text-white
                        text-[9px] sm:text-[10px]
                        uppercase tracking-[0.22em] font-semibold
                        whitespace-nowrap
                        transition-all duration-300
                        hover:bg-gray-800
                        active:scale-[0.97]
                      "
                    >
                      Submit
                    </button>
                  </div>

                  {passwordError && (
                    <p className="mt-2.5 text-[10px] text-red-500 tracking-wide text-left pl-1">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>
            </form>

          </div>

          {/* ── FOOTER ── */}
          <div className="mt-12 flex flex-col items-center">

            <div className="flex items-center gap-3 sm:gap-4 mb-5">
              <a
                href="https://www.instagram.com/mvdebymoda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  w-8 h-8 sm:w-9 sm:h-9 rounded-full
                  border border-gray-200
                  flex items-center justify-center
                  text-gray-500
                  hover:text-black hover:border-black hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@mvdebymoda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="
                  w-8 h-8 sm:w-9 sm:h-9 rounded-full
                  border border-gray-200
                  flex items-center justify-center
                  text-gray-500
                  hover:text-black hover:border-black hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>

              <a
                href="mailto:moda61wrld@gmail.com"
                aria-label="Email"
                className="
                  w-8 h-8 sm:w-9 sm:h-9 rounded-full
                  border border-gray-200
                  flex items-center justify-center
                  text-gray-500
                  hover:text-black hover:border-black hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>

            <p className="text-[8px] text-gray-400 uppercase tracking-[0.25em]">
              © {new Date().getFullYear()} MODA WRLD
            </p>

            <p className="text-[8px] text-gray-300 mt-1.5 tracking-wider">
              Built for those who move different.
            </p>
          </div>

        </div>
      </main>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LockScreen;