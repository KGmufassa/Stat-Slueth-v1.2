// ============================================
// INJURIES PAGE
// ============================================

function renderInjuriesPage() {
    const content = document.getElementById('app-content');
    if (!content) return;

    const mockInjuries = [
        { player: 'LeBron James', team: 'Lakers', status: 'Questionable', detail: 'Ankle soreness' },
        { player: 'Stephen Curry', team: 'Warriors', status: 'Out', detail: 'Knee management' },
        { player: 'Josh Allen', team: 'Bills', status: 'Probable', detail: 'Shoulder' },
        { player: 'Mookie Betts', team: 'Dodgers', status: 'Day-to-Day', detail: 'Wrist' }
    ];

    content.innerHTML = `
        <div class="flex flex-col gap-6 fade-in">
            <div>
                <h1 class="text-white text-3xl font-black tracking-tight">Injuries</h1>
                <p class="text-slate-400 text-sm mt-1">League-wide injury status and updates.</p>
            </div>

            <div class="bg-surface-dark border border-slate-800 rounded-xl shadow-card overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Latest Updates
                </div>
                <div class="divide-y divide-slate-800">
                    ${mockInjuries.map((item) => `
                        <div class="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                                <p class="text-white font-semibold">${item.player}</p>
                                <p class="text-slate-400 text-xs">${item.team} • ${item.detail}</p>
                            </div>
                            <span class="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">${item.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

window.renderInjuriesPage = renderInjuriesPage;
