import React from "react";

export function CTASection() {
  return (
    <>
      {/* Desktop CTA Section */}
      <section className="hidden md:block max-w-7xl mx-auto px-6 pb-24">
        <div className="relative bg-primary p-12 md:p-24 rounded-[4rem] overflow-hidden shadow-2xl shadow-primary/40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] -mr-64 -mt-64 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary-container/20 blur-[80px] -ml-32 -mb-32 rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <h2 className="text-4xl md:text-6xl font-bold text-on-primary tracking-tighter max-w-3xl leading-[1.1]">
              ¿Listo para profesionalizar la operación de tu negocio?
            </h2>
            <p className="text-on-primary/80 text-xl max-w-2xl font-medium">
              Únete a las empresas que han reducido sus fugas operativas en un 40% delegando la tecnología en expertos.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-black/10">
                Agendar Asesoría Personalizada
              </button>
              <button className="bg-primary-dim text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary-dim/80 transition-all">
                Ver Demo en Vivo
              </button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <span className="text-on-primary/60 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span> Sin compromisos
              </span>
              <span className="text-on-primary/60 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">schedule</span> Configuración en 48h
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 w-full z-50 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-slate-100 px-6 pt-4 pb-8 flex flex-col gap-4">
        <button className="tap-scale w-full py-5 bg-primary text-on-primary rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
          Agendar Demo Gratis
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <footer className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-on-surface-variant px-2">
          <span>© 2024 Nyro ROaaS</span>
          <div className="flex gap-4">
            <span>Privacidad</span>
            <span>Soporte</span>
          </div>
        </footer>
      </div>
    </>
  );
}
