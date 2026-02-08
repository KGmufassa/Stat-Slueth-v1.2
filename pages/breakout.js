// ============================================
// BREAKOUT / COOLDOWN PAGE
// ============================================

function renderBreakoutPage() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <h2 class="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Breakout / Cooldown</h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm">Surface players near historical streak ceilings and regressions</p>
            </div>
            
            <!-- Controls Card -->
             <div class="bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-[#1e293b] shadow-sm">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                     <div class="form-group">
                        <label class="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 block">League</label>
                        <select id="bo-league" class="w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0e17] h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none outline-none">
                            <option value="nba">NBA</option>
                            <option value="nfl">NFL</option>
                            <option value="nhl">NHL</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 block">Stat Type</label>
                        <select id="bo-stat-type" class="w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0e17] h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none outline-none">
                            <option value="points">Points</option>
                            <option value="rebounds">Rebounds</option>
                            <option value="assists">Assists</option>
                            <option value="steals">Steals</option>
                            <option value="blocks">Blocks</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 block">Threshold</label>
                         <input type="number" id="bo-threshold" class="w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0e17] h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none outline-none" value="25" placeholder="25">
                    </div>

                    <div class="form-group">
                        <label class="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 block">Streak Window</label>
                        <select id="bo-window" class="w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0e17] h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none outline-none">
                            <option value="5">Last 5 games</option>
                            <option value="10">Last 10 games</option>
                            <option value="20">Last 20 games</option>
                        </select>
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                     <button id="run-breakout-btn" class="px-6 py-2.5 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">radar</span>
                        <span>Analyze Patterns</span>
                    </button>
                </div>
            </div>
            
            <div id="breakout-results" class="flex-1"></div>
        </div>
    `;

    document.getElementById('run-breakout-btn').addEventListener('click', executeBreakoutAnalysis);
}

async function executeBreakoutAnalysis() {
    const resultsDiv = document.getElementById('breakout-results');
    // Using simple HTML loading state
    resultsDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12">
             <div class="spinner !border-slate-200 dark:!border-white/10 !border-t-primary"></div>
             <p class="mt-4 text-slate-500 text-sm font-bold uppercase tracking-wider">Analyzing Streak Patterns...</p>
        </div>
    `;

    await Utils.simulateDelay(1500);

    const streakData = MockData.generateStreakData(15);

    // Sort by percent of max (descending)
    streakData.sort((a, b) => parseFloat(b.percentOfMax) - parseFloat(a.percentOfMax));

    const league = document.getElementById('bo-league').value.toUpperCase();
    const statType = document.getElementById('bo-stat-type').selectedOptions[0].text;
    const threshold = document.getElementById('bo-threshold').value;

    resultsDiv.innerHTML = `
        <div class="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-[#1e293b] shadow-sm overflow-hidden fade-in">
            <div class="px-6 py-4 border-b border-slate-200 dark:border-[#1e293b] flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-white/[0.01]">
                <div>
                     <h3 class="text-lg font-bold text-slate-900 dark:text-white">Breakout Candidates</h3>
                    <p class="text-xs text-slate-500 font-medium mt-0.5">${league} • ${statType} • Threshold: ${threshold}+</p>
                </div>
                <button id="save-breakout-preset-btn" class="text-[10px] font-bold px-3 py-1.5 bg-slate-100 dark:bg-[#1e293b] rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[14px]">bookmark</span>
                    Save Preset
                </button>
            </div>
            
            <div class="px-6 py-4 flex flex-wrap gap-3 border-b border-slate-100 dark:border-[#1e293b]">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-500/20">
                    <span class="material-symbols-outlined text-[14px]">bolt</span>
                    ${streakData.filter(s => parseFloat(s.percentOfMax) > 85).length} players at risk of cooldown
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                    <span class="material-symbols-outlined text-[14px]">trending_up</span>
                    ${streakData.filter(s => parseFloat(s.percentOfMax) > 90).length} near historical max
                </span>
            </div>
            
            ${createDataTable({
        columns: [
            { key: 'player', label: 'Player' },
            { key: 'currentStreak', label: 'Current Streak', numeric: true },
            { key: 'historicalMax', label: 'Historical Max', numeric: true },
            { key: 'percentOfMax', label: '% of Max Score', numeric: true },
            { key: 'status', label: 'Risk Status' }
        ],
        data: streakData.map(s => ({
            ...s,
            percentOfMax: `${s.percentOfMax}%`,
            status: getStreakStatus(parseFloat(s.percentOfMax))
        }))
    })}
        </div>
    `;

    document.getElementById('save-breakout-preset-btn')?.addEventListener('click', () => {
        saveBreakoutAsPreset(league, statType, threshold, streakData);
    });
}

function getStreakStatus(percentOfMax) {
    if (percentOfMax >= 95) {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase">Critical</span>';
    } else if (percentOfMax >= 85) {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase">High</span>';
    } else if (percentOfMax >= 70) {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase">Elevated</span>';
    } else {
        return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">Normal</span>';
    }
}

function saveBreakoutAsPreset(league, statType, threshold, data) {
    const presetName = prompt('Enter a name for this breakout analysis:', `${league} ${statType} ${threshold}+ Streaks`);
    if (presetName) {
        AppState.addPreset({
            name: presetName,
            type: 'Breakout Analysis',
            league: league,
            metric: `${statType} ${threshold}+`,
            query: `Breakout analysis: ${statType} threshold ${threshold}+`,
            results: data
        });
        alert('Breakout analysis saved as preset!');
    }
}

// Export for router
window.renderBreakoutPage = renderBreakoutPage;
