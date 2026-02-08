// ============================================
// ADVANCED ANALYTICS (PRO LOCKED)
// ============================================

function renderAdvancedAnalyticsPage() {
    const content = document.getElementById('app-content');
    if (!content) return;

    content.innerHTML = `
        <div class="flex flex-col gap-8 fade-in">
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary text-3xl">lock</span>
                    <h1 class="text-white text-3xl font-black tracking-tight">Advanced Analytics</h1>
                    <span class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-full">Pro Required</span>
                </div>
                <p class="text-slate-400 text-sm max-w-2xl">Unlock advanced player modeling, custom projections, and correlation insights with Stat Sleuth Pro.</p>
            </div>

            <div class="bg-surface-dark border border-slate-800 rounded-xl p-6 shadow-card">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex flex-col gap-2">
                        <h2 class="text-white text-xl font-black">Pro Insights Suite</h2>
                        <p class="text-slate-400 text-sm">Gain access to premium analytics tools and multi‑season modeling.</p>
                    </div>
                    <button class="h-10 px-5 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wide shadow-glow hover:bg-primary-hover transition-colors">Upgrade to Pro</button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${[1, 2, 3].map((index) => `
                    <div class="bg-[#0B101B] border border-slate-800 rounded-xl p-4 relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-60"></div>
                        <div class="relative">
                            <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Feature ${index}</p>
                            <p class="text-white font-semibold mt-2">Modeling Module ${index}</p>
                            <p class="text-slate-500 text-xs mt-1">Preview locked — upgrade to view.</p>
                            <div class="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div class="h-full w-1/3 bg-primary/60"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.renderAdvancedAnalyticsPage = renderAdvancedAnalyticsPage;
