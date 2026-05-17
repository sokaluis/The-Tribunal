export function Hero() {
  return (
    <div className="text-center pt-20 pb-12 px-4">
      <div className="inline-flex items-center gap-2 text-[#d4a853] text-xs uppercase tracking-widest font-medium mb-6 border border-[#d4a853]/30 rounded-full px-4 py-1.5 animate-fade-in">
        <span>⚖</span>
        <span>The court is in session</span>
      </div>
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#f0ead6] mb-6 leading-[1.05] tracking-tight animate-fade-in-up" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
        Put yourself<br />
        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #d4a853 0%, #8b5cf6 100%)' }}>
          on trial.
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-[#9ca3af] max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
        Submit a dilemma, confession, opinion, or idea. A panel of AI judges will prosecute it, defend it, and deliver a verdict.
      </p>
    </div>
  )
}
