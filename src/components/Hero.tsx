import React from "react";

export function Hero() {
  return (
    <>
      {/* Desktop Hero Section */}
      <section className="hidden md:grid max-w-7xl mx-auto px-6 py-16 md:py-28 grid-cols-1 md:grid-cols-2 gap-16 items-center hero-gradient">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Operaciones como Servicio
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.05]">
            No solo software. <br />
            <span className="text-primary italic">Resultados</span> para tu negocio.
          </h1>
          <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
            Gestiona tu retail con un flujo de trabajo de <span className="text-on-surface font-bold text-primary">2 toques y 3 segundos</span>. Control total de inventario y cierres multicanal automatizados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg purple-mist hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-xl shadow-primary/30">
              Agendar Asesoría Personalizada
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-on-surface-variant">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
            </div>
            <p className="text-sm font-medium">Más de <span className="text-primary font-bold">500 negocios</span> ya operan con ROaaS</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/15 blur-[120px] rounded-full"></div>
          <div className="relative transform hover:rotate-0 transition-transform duration-700 rotate-2">
            <div className="bg-surface-container-lowest p-2 rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden">
              <img
                alt="Nyro ROaaS Admin Dashboard"
                className="rounded-[2rem] w-full"
                src="https://lh3.googleusercontent.com/aida/ADBb0ugJpmrcI92oHVUM671mngPECjH36dNeoM4Ge7501EiEtoxCiLwWLZwrv72OYXhx-TQycvk-2BMxj03fFm7Ajj89tuzXFf_Kq9vbTT8u5MVqoYXHKE12wHAqCJPsZ3zkoOlevAg0i0ou95Ge-iKAoDpeBA-DcWf4l6B9QTpHPlIMpHkCVtPTSzr_xe9KedE_0VdhdEc71Q4C0tPPTfBx5kmb7VIC1kS6qYnF9GeLU42bSXjEruLI1vo4JVLcpkM7YXDWNC9-VTW_5Xk"
              />
            </div>
            {/* Floating Mobile Preview */}
            <div className="absolute -bottom-10 -left-10 w-48 md:w-64 transform -rotate-6 shadow-2xl border-4 border-white rounded-[2rem] overflow-hidden hidden sm:block">
              <img
                alt="Nyro Mobile PWA"
                src="https://lh3.googleusercontent.com/aida/ADBb0ujmwKKuzCwAsGYiEflHKDZPIgGHMzvmY9nRfgWFVMKdtKRWKaV0DdsiZzx6dOTNV8-8Es8sPfHExNRe6VQuRBIlSQZpcjybni4BBVuTO_cgReUFSmViOraFiJWG3zLc35Du-t5qhDcFVJz-qRZAwGlgtLxTKCOwlKNxgko7812MqOza9mQW3nZmIU8hfpXSa9F5pJ9t873qC7pCcSKWxQCckMJLXpv29oosr5c1Qe8WIKyDOASN4wCYxlqCFXMZZ4tqbPTVdipV6l0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Section */}
      <section className="md:hidden px-6 flex flex-col items-center text-center pt-8">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-black tracking-widest uppercase mb-6">
          Retail Operating as a Service
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
          Tu negocio escalable <br />
          <span className="text-primary">bajo tu propio flujo</span>
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-sm">
          No adaptes tu negocio a un software. Nosotros adaptamos Nyro a tu operación real.
        </p>
        <button className="tap-scale w-full max-w-xs mb-12 py-5 bg-primary text-on-primary rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
          Agendar Demo Gratis
          <span className="material-symbols-outlined">calendar_today</span>
        </button>
        <div className="relative w-full max-w-[280px] mx-auto mb-16">
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10"></div>
          <div className="bg-on-surface rounded-[3rem] p-3 shadow-2xl">
            <img
              alt="Nyro PWA Interface"
              className="w-full rounded-[2.2rem] shadow-inner"
              src="https://lh3.googleusercontent.com/aida/ADBb0ujmwKKuzCwAsGYiEflHKDZPIgGHMzvmY9nRfgWFVMKdtKRWKaV0DdsiZzx6dOTNV8-8Es8sPfHExNRe6VQuRBIlSQZpcjybni4BBVuTO_cgReUFSmViOraFiJWG3zLc35Du-t5qhDcFVJz-qRZAwGlgtLxTKCOwlKNxgko7812MqOza9mQW3nZmIU8hfpXSa9F5pJ9t873qC7pCcSKWxQCckMJLXpv29oosr5c1Qe8WIKyDOASN4wCYxlqCFXMZZ4tqbPTVdipV6l0"
            />
          </div>
        </div>
      </section>
    </>
  );
}
