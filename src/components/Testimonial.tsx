import React from "react";

export function Testimonial() {
  return (
    <section className="md:hidden mt-20 px-6">
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 purple-mist">
        <p className="text-xl font-medium mb-6 italic text-on-surface">&quot;Con Nyro no compramos una app, compramos un socio tecnológico que entiende cómo vendemos.&quot;</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
            <img
              alt="Client"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdesc_l5abwRWWXe8iimOM4V4YHmVHlOYYihiX1CUdu7e9FqN5D7QdxcxXYOquGmBwSCaCmM44wklC6cWpJgp4CFYZIPFPQgvr8EY2Dp5LIjKamUR5H8jAPbxRrcAivCRHvHppv3snxuGmfd8e8mXsLPh2xydwAvJvX80tB5mT-o_-ZJ8baYgFBAidUmXtFMnMhJVNDU82JTpSokh8XFS960nhFvGH5vjE-fcJe8hye0mv3dBbyEjIiPjJlPBKKB-dDlZLLlZW52R2"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Carlos M.</p>
            <p className="text-xs text-on-surface-variant">Logística Global</p>
          </div>
        </div>
      </div>
    </section>
  );
}
