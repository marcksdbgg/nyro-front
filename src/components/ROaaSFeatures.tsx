import React from "react";

export function ROaaSFeatures() {
  return (
    <>
      {/* Desktop ROaaS Section */}
      <section className="hidden md:block py-24 bg-on-surface text-surface" id="roaas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Operaciones como Servicio (ROaaS): <br />
                <span className="text-primary-fixed">Mucho más que una App</span>
              </h2>
              <p className="text-lg text-surface-dim leading-relaxed">
                A diferencia del software tradicional (SaaS), Nyro te ofrece <strong>acompañamiento estratégico continuo</strong>. No solo te entregamos las llaves; nos sentamos contigo a diseñar la cerradura.
              </p>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-surface-bright">Consultoría de Flujo</h4>
                    <p className="text-surface-dim text-sm">Adaptamos la aplicación exactamente a cómo se mueve tu mercancía y tu dinero.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed">
                    <span className="material-symbols-outlined">integration_instructions</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-surface-bright">Implementación Guiada</h4>
                    <p className="text-surface-dim text-sm">Tu experto dedicado configura tu inventario y entrena a tu equipo personalmente.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-surface-bright">Alineación Estratégica</h4>
                    <p className="text-surface-dim text-sm">Revisamos tus KPI mensualmente para asegurar que el sistema esté eliminando fugas operativas.</p>
                  </div>
                </div>
              </div>
              <button className="bg-surface-container-lowest text-on-surface px-8 py-4 rounded-xl font-bold hover:bg-primary-fixed hover:text-on-primary-fixed transition-all">
                Hablar con un Experto ROaaS
              </button>
            </div>
            <div className="bg-primary/5 rounded-[3rem] p-8 border border-white/10">
              <img
                alt="Operaciones Retail"
                className="rounded-2xl opacity-90 mix-blend-lighten"
                src="https://lh3.googleusercontent.com/aida/ADBb0ujlDrcmZmAxSSJaaYp859AKRXSWlwvFvXElEzYZ7neypgoXrd97GSp5pJCbCmuLcAAJZDrckXOg3GqB4nW9HFRLvEzC4WTCTRVL7txK_ZmRM4B_U2QZi7I_oo9PQ_vL-b1o0UUTFfwkJ9P7VuSBXCVf4Tusg4G6Ep44QzQ-qeObT3Ac4if286gVwXTyqZyZa8hvTuusqmLXBNmvLL6-24bH2qOA4P3ZZYJH9mbfTXIdfowbWJ2PL6Z89XZyqUoXjiR6Fitx5fpl9O4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile ROaaS Highlight */}
      <section className="md:hidden px-6 space-y-4 mb-20">
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary text-on-primary">
            <span className="material-symbols-outlined">settings_suggest</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-lg">Servicio Personalizado</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Software que evoluciona contigo. Adaptamos cada módulo a los procesos específicos de tu retail.</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl flex items-start gap-4 purple-mist">
          <div className="p-3 rounded-lg bg-surface text-primary">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Omnicanalidad Real</h3>
            <p className="text-sm text-on-surface-variant">Stock y ventas sincronizadas en tiempo real en todos tus canales físicos y digitales.</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl flex items-start gap-4 purple-mist">
          <div className="p-3 rounded-lg bg-surface text-primary">
            <span className="material-symbols-outlined">insights</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Reportes Estratégicos</h3>
            <p className="text-sm text-on-surface-variant">Métricas personalizadas para tomar decisiones basadas en datos operativos exactos.</p>
          </div>
        </div>
      </section>

      {/* Mobile Consulting Section */}
      <section className="md:hidden px-6 py-12 bg-on-surface text-surface-bright rounded-t-[3rem] -mb-10">
        <div className="max-w-sm mx-auto text-center">
          <span className="material-symbols-outlined text-primary-fixed text-5xl mb-4">partner_exchange</span>
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Más que software, somos tus consultores</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8 opacity-80">
            Nuestro equipo de expertos analiza tu flujo actual de retail para identificar cuellos de botella y optimizar cada paso antes de la implementación.
          </p>
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-fixed text-sm">check_circle</span>
              <span className="text-sm font-medium">Auditoría de flujo operativo</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-fixed text-sm">check_circle</span>
              <span className="text-sm font-medium">Optimización de procesos de venta</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-fixed text-sm">check_circle</span>
              <span className="text-sm font-medium">Acompañamiento estratégico continuo</span>
            </div>
          </div>
          <button className="tap-scale mt-10 w-full py-4 bg-primary-fixed text-on-primary-fixed rounded-xl font-bold">
            Consultoría de Negocio
          </button>
        </div>
      </section>
    </>
  );
}
