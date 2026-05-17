import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(212,168,83,0.08) 0%, transparent 50%), #0a0a0f' }}>
      <header className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-[#d4a853] text-lg">⚖</span>
            <span className="font-bold text-[#f0ead6] tracking-wide text-sm uppercase">The Tribunal</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {!isHome && (
              <Link to="/" className="text-[#9ca3af] hover:text-[#f0ead6] transition-colors">
                New Trial
              </Link>
            )}
            <Link to="/gallery" className="text-[#9ca3af] hover:text-[#f0ead6] transition-colors">
              Gallery
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-[#1e1e2e] py-6 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-[#6b7280] text-xs">
          <p>The Tribunal is a theatrical AI exercise. Not legal, medical, or professional advice.</p>
          <p className="mt-1">All verdicts are for entertainment. The court is always in session.</p>
        </div>
      </footer>
    </div>
  )
}
