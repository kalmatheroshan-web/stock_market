import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

function NotFound() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 140, 0, ${this.opacity})`
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 150)
      for (let i = 0; i < count; i++) {
        particles.push(new Particle())
      }
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.3
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 140, 0, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      initParticles()
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0807] via-[#1a1410] to-[#0d0b0a]">
      {/* Animated Background Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Gradient Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] animate-pulse-slower" />
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[800px] h-[800px] bg-orange-400/5 rounded-full blur-[150px]" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="relative max-w-3xl w-full">
          {/* Glossy Card */}
          <div className="relative bg-gradient-to-br from-[#1a1410]/80 via-[#0d0b0a]/90 to-[#0a0807]/95 
                          backdrop-blur-2xl backdrop-saturate-150
                          rounded-[3rem] p-8 sm:p-12 lg:p-16
                          border border-orange-500/20 
                          shadow-[0_0_80px_rgba(255,120,0,0.08)]
                          hover:shadow-[0_0_120px_rgba(255,120,0,0.15)]
                          transition-all duration-700 ease-out
                          hover:scale-[1.01]
                          group">

            {/* Glass Reflection Effect */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-orange-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Animated Border Glow */}
            <div className="absolute -inset-0.5 rounded-[3rem] bg-gradient-to-r from-orange-400/0 via-orange-400/20 to-orange-600/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl" />

            {/* Decorative Corner Accents */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-orange-400/20 rounded-tr-2xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-orange-400/20 rounded-bl-2xl" />

            {/* Content */}
            <div className="relative text-center">
              {/* 404 with Glitch Effect */}
              <div className="relative inline-block mb-2">
                <h1 className="text-[10rem] sm:text-[12rem] lg:text-[14rem] font-black leading-none tracking-tighter
                               bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 
                               bg-clip-text text-transparent
                               drop-shadow-[0_0_60px_rgba(255,120,0,0.2)]
                               animate-shimmer">
                  404
                </h1>
                {/* Glitch overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-orange-400/10 
                                mix-blend-overlay animate-glitch" />
              </div>

              {/* Subtitle with animated line */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-orange-400/50" />
                <span className="text-orange-400/60 text-xs sm:text-sm tracking-[0.3em] uppercase font-light">
                  Lost in Space
                </span>
                <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-orange-400/50" />
              </div>

              {/* Message */}
              <div className="max-w-md mx-auto mb-10">
                <p className="text-orange-200/70 text-base sm:text-lg font-light leading-relaxed">
                  The page you're looking for has drifted into the void.
                  <br />
                  <span className="text-orange-400/40 text-sm">Error 404 • Resource Not Found</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={"/"}
                  className="group relative px-10 py-4 rounded-full font-semibold text-base sm:text-lg
                             bg-gradient-to-r from-orange-500 to-orange-600 
                             hover:from-orange-400 hover:to-orange-500
                             text-[#0d0b0a] 
                             shadow-lg shadow-orange-500/30
                             hover:shadow-2xl hover:shadow-orange-500/50 
                             hover:scale-105
                             transition-all duration-300 
                             flex items-center gap-3
                             overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                  </svg>
                  <span className="relative z-10">Return Home</span>
                </Link>

                <a
                  href="#"
                  className="group px-10 py-4 rounded-full font-semibold text-base sm:text-lg
                             bg-orange-500/10 backdrop-blur-sm
                             border border-orange-400/30 
                             text-orange-200/80
                             hover:bg-orange-500/20 
                             hover:border-orange-400/50 
                             hover:text-orange-100
                             hover:scale-105
                             transition-all duration-300 
                             flex items-center gap-3
                             shadow-lg shadow-orange-500/5 
                             hover:shadow-orange-500/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore
                </a>
              </div>

              {/* Quick Links */}
              <div className="mt-10 pt-8 border-t border-orange-500/10">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-orange-400/40">
                  <a href="#" className="hover:text-orange-400/70 transition-colors">Support</a>
                  <span className="w-px h-4 bg-orange-400/20" />
                  <a href="#" className="hover:text-orange-400/70 transition-colors">Documentation</a>
                  <span className="w-px h-4 bg-orange-400/20" />
                  <a href="#" className="hover:text-orange-400/70 transition-colors">Status</a>
                  <span className="w-px h-4 bg-orange-400/20" />
                  <a href="#" className="hover:text-orange-400/70 transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-4 -right-4 sm:bottom-0 sm:right-0 
                          bg-orange-500/10 backdrop-blur-md 
                          border border-orange-400/20 
                          rounded-full px-4 py-2
                          text-orange-400/60 text-xs tracking-widest uppercase
                          animate-float">
            ✦ Dark & Orange ✦
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); opacity: 0.3; }
          20% { transform: translate(-2px, 2px); opacity: 0.5; }
          40% { transform: translate(2px, -2px); opacity: 0.2; }
          60% { transform: translate(-1px, -1px); opacity: 0.4; }
          80% { transform: translate(1px, 2px); opacity: 0.3; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.2); }
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 6s ease-in-out infinite alternate;
        }
        
        .animate-glitch {
          animation: glitch 3s infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default NotFound