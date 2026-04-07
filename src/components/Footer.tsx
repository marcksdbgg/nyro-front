import React from "react";

export function Footer() {
  return (
    <footer className="hidden md:block w-full border-t border-surface-container bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-start px-8 py-16 max-w-7xl mx-auto w-full gap-12">
        <div className="max-w-xs">
          <div className="text-2xl font-black text-primary mb-4">Nyro ROaaS</div>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Redefiniendo el retail a través de operaciones inteligentes y servicio dedicado.</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">alternate_email</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">public</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-bold text-on-surface tracking-widest uppercase">Producto</span>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Soluciones ROaaS</a>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Funcionalidades</a>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Historias de Éxito</a>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-bold text-on-surface tracking-widest uppercase">Compañía</span>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Sobre Nyro</a>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Blog de Operaciones</a>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Contacto</a>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-bold text-on-surface tracking-widest uppercase">Legal</span>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Privacidad</a>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">Términos</a>
            <a className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium" href="#">SLA</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-surface-container text-center text-xs text-on-surface-variant/60 font-medium">
        © 2024 Nyro ROaaS. Todos los derechos reservados. El control total de tu negocio está a un clic.
      </div>
    </footer>
  );
}
