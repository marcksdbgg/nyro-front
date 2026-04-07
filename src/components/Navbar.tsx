import React from "react";

export function Navbar() {
  return (
    <>
      {/* Desktop TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-surface-container hidden md:block">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="text-2xl font-extrabold text-primary tracking-tighter flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              settings_suggest
            </span>
            Nyro ROaaS
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-slate-600 hover:text-primary transition-colors font-semibold text-sm" href="#roaas">
              ¿Qué es ROaaS?
            </a>
            <a className="text-slate-600 hover:text-primary transition-colors font-semibold text-sm" href="#features">
              Funciones
            </a>
            <a className="text-slate-600 hover:text-primary transition-colors font-semibold text-sm" href="#precios">
              Precios
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm tracking-tight hover:opacity-90 transition-all duration-200 active:scale-95 shadow-lg shadow-primary/20">
              Hablar con un Experto
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm border-b border-slate-100 md:hidden">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="text-2xl font-black text-primary tracking-tighter uppercase italic">
            Nyro
          </div>
          <button className="material-symbols-outlined text-on-surface-variant">
            menu
          </button>
        </nav>
      </header>
    </>
  );
}
