import React from "react";

export function CoreFeatures() {
  return (
    <section className="hidden md:block py-24 max-w-7xl mx-auto px-6" id="features">
      <div className="text-center mb-16 space-y-4">
        <span className="text-primary font-bold tracking-widest uppercase text-xs">Potencia sin complicaciones</span>
        <h2 className="text-4xl font-extrabold tracking-tight">Diseñado para la Velocidad</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">Elimina la fricción en el punto de venta y toma el control absoluto de tus activos.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="group p-10 bg-surface-container-lowest rounded-[2rem] hover:bg-primary transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/20 border border-surface-container-high">
          <span className="material-symbols-outlined text-5xl text-primary group-hover:text-on-primary mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
          <h4 className="text-2xl font-bold mb-4 group-hover:text-on-primary tracking-tight">Venta en <span className="underline decoration-secondary-fixed decoration-4">3 segundos</span></h4>
          <p className="text-on-surface-variant group-hover:text-on-primary/80 leading-relaxed">Workflow optimizado de 2 toques. Procesa ventas más rápido que cualquier otro sistema en el mercado.</p>
        </div>
        {/* Card 2 */}
        <div className="group p-10 bg-surface-container-lowest rounded-[2rem] hover:bg-primary transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/20 border border-surface-container-high">
          <span className="material-symbols-outlined text-5xl text-primary group-hover:text-on-primary mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          <h4 className="text-2xl font-bold mb-4 group-hover:text-on-primary tracking-tight">Control Total de Stock</h4>
          <p className="text-on-surface-variant group-hover:text-on-primary/80 leading-relaxed">Trazabilidad inmutable tipo Ledger. Cada unidad cuenta, cada movimiento queda registrado.</p>
        </div>
        {/* Card 3 */}
        <div className="group p-10 bg-surface-container-lowest rounded-[2rem] hover:bg-primary transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/20 border border-surface-container-high">
          <span className="material-symbols-outlined text-5xl text-primary group-hover:text-on-primary mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          <h4 className="text-2xl font-bold mb-4 group-hover:text-on-primary tracking-tight">Reconciliación Multicanal</h4>
          <p className="text-on-surface-variant group-hover:text-on-primary/80 leading-relaxed">Consolida efectivo, tarjetas y apps de pago en un solo reporte de cierre automatizado.</p>
        </div>
      </div>
    </section>
  );
}
