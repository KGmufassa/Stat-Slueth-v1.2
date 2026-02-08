// ============================================
// SCANNER PAGE - TREND SCANNER
// ============================================

function renderScannerPage() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <div class="flex flex-col gap-8 fade-in">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 class="text-white text-3xl font-black leading-tight tracking-tight">Trend Scanner</h1>
                    <p class="text-slate-400 text-sm mt-1">Identifying breakout and cooldown patterns across the league.</p>
                </div>
                <div class="flex items-center gap-3">
                    <button class="bg-primary/10 text-primary border border-primary/20 px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-primary/20 transition-all flex items-center gap-2 shadow-glow-sm">
                        <span class="material-symbols-outlined text-[18px]">bolt</span>
                        <span>Run New Scan</span>
                    </button>
                    <button class="bg-surface-dark border border-slate-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">save</span>
                        <span>Save Scanner</span>
                    </button>
                </div>
            </div>

            <!-- Filters Section -->
            <section class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-surface-dark border border-slate-800 p-5 rounded-xl shadow-card">
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trend Type</label>
                    <div class="flex p-1 bg-[#050911] rounded-lg border border-slate-800">
                        <button class="flex-1 bg-primary text-white text-[10px] font-bold py-1.5 rounded shadow-lg uppercase tracking-wider">Breakout</button>
                        <button class="flex-1 text-slate-400 text-[10px] font-bold py-1.5 rounded hover:text-white uppercase tracking-wider transition-colors">Cooldown</button>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stat Type</label>
                    <div class="relative">
                        <select class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 appearance-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
                            <option>Points Per Game (PPG)</option>
                            <option>Assists (APG)</option>
                            <option>Rebounds (RPG)</option>
                            <option>Three Pointers (3PM)</option>
                            <option>True Shooting (TS%)</option>
                        </select>
                         <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-base">expand_more</span>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Threshold (%)</label>
                    <div class="relative">
                        <input class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary" type="number" value="25"/>
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-bold">%</span>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Streak (Games)</label>
                    <div class="relative">
                        <input class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary" type="number" value="5"/>
                        <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">calendar_today</span>
                    </div>
                </div>
                <div class="flex items-end">
                    <button class="w-full bg-white text-slate-900 h-9 rounded-lg font-bold text-xs hover:bg-slate-200 transition-all uppercase tracking-wide">Apply Filters</button>
                </div>
            </section>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Comparison & Results -->
                <div class="lg:col-span-8 flex flex-col gap-6">
                    
                    <!-- Head-to-Head Visual -->
                    <div class="bg-surface-dark border border-slate-800 rounded-xl overflow-hidden shadow-card">
                        <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-white/[0.02]">
                            <h3 class="text-white font-bold flex items-center gap-2 text-[10px] uppercase tracking-wider">
                                <span class="material-symbols-outlined text-primary text-sm">compare_arrows</span>
                                Head-to-Head Comparison
                            </h3>
                            <span class="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Live Scan Data [N=20]</span>
                        </div>
                        <div class="px-8 py-8">
                            <div class="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                                <div class="flex items-center gap-4">
                                    <div class="size-16 rounded-full border-2 border-primary/50 overflow-hidden shadow-glow p-0.5 bg-[#050911]">
                                        <div class="w-full h-full rounded-full bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtkxM6dhsG0mnXJGL0-oGsUL2oYjl1qoCEv1zJj2MLdtUZwi_cjJljaKm6znqln-hz0urGpwtQAasoEvTuIc2Vy1ywdDAQh3DiItIWjW_zob2Zxvo7sngm8r98lQ8CjMIafRhk5dRS6BqgzxnwMgAIoN7Yr_hjkOfgwYFjCqzJzzERVwhVCuCwlnFRCzEcqMbVV_Qin-0IN_8qkqYyUAofXrmiLogkyCBz73aZVyf8mFpuZjgt954UrziCz21mwTkEonR-JBcm_O8")'></div>
                                    </div>
                                    <div>
                                        <h4 class="text-white font-black text-xl leading-none tracking-tight">LeBron James</h4>
                                        <p class="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1.5">LAL | FORWARD</p>
                                    </div>
                                </div>
                                <div class="px-6 relative">
                                    <span class="text-slate-800 font-black text-4xl italic select-none">VS</span>
                                    <span class="absolute inset-0 flex items-center justify-center text-slate-700 font-black text-4xl italic select-none opacity-30 blur-sm">VS</span>
                                </div>
                                <div class="flex items-center gap-4 flex-row-reverse text-right">
                                    <div class="size-16 rounded-full border-2 border-slate-700 overflow-hidden shadow-lg p-0.5 bg-[#050911]">
                                        <div class="w-full h-full rounded-full bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB7DAP-0_ggB_Vsi2wvY7iU7xNRSoXnd43uJxfGlTL8FYQ2iJ55bioWXNGoY2n-0-12tjgOMFaTMA54FtPIDMRu631wTwlC9TwMNEBoqOoGx63TLuyW1dNTKk9HpoC7ch7_5J41fiOoZUITd-kRn_6sns9YLd0CTJURJSI6auwSa96P1jOxNyy3s-fNEUqq3yF-nUTrjfR1xYWQvgKi0haXH0CQ2POp6CG36cbzew0JxW3V19Mse2tiRDFeYUuMXsMkZo0lZSAk9cc")'></div>
                                    </div>
                                    <div>
                                        <h4 class="text-white font-black text-xl leading-none tracking-tight">Kevin Durant</h4>
                                        <p class="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1.5">PHX | FORWARD</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Comparison Bars -->
                            <div class="space-y-6 max-w-xl mx-auto">
                                <div class="relative">
                                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                                        <span class="text-slate-400">25.7</span>
                                        <span class="text-slate-500">PPG</span>
                                        <span class="text-white">27.1</span>
                                    </div>
                                    <div class="h-2 flex bg-slate-800/50 rounded-full overflow-hidden">
                                        <div class="w-1/2 flex justify-end border-r border-slate-800">
                                            <div class="w-[85%] bg-slate-600 h-full rounded-l-full"></div>
                                        </div>
                                        <div class="w-1/2">
                                            <div class="w-[95%] bg-primary h-full rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="relative">
                                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                                        <span class="text-white">54.2%</span>
                                        <span class="text-slate-500">FG%</span>
                                        <span class="text-slate-400">52.8%</span>
                                    </div>
                                    <div class="h-2 flex bg-slate-800/50 rounded-full overflow-hidden">
                                        <div class="w-1/2 flex justify-end border-r border-slate-800">
                                            <div class="w-[95%] bg-primary h-full rounded-l-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        </div>
                                        <div class="w-1/2">
                                            <div class="w-[88%] bg-slate-600 h-full rounded-r-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Ranked Results Table -->
                    <div class="bg-surface-dark border border-slate-800 rounded-xl overflow-hidden shadow-card">
                        <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-white/[0.02]">
                            <h3 class="text-white font-bold text-[10px] uppercase tracking-wider">Ranked Scan Results</h3>
                            <div class="flex gap-2 items-center">
                                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sort By:</span>
                                <div class="flex items-center gap-1 cursor-pointer group">
                                    <span class="text-[10px] text-primary font-bold uppercase tracking-wider group-hover:text-white transition-colors">Trend Velocity</span>
                                    <span class="material-symbols-outlined text-primary text-sm">expand_more</span>
                                </div>
                            </div>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-left text-xs">
                                <thead>
                                    <tr class="bg-[#050911] text-slate-500 font-bold uppercase text-[9px] tracking-widest border-b border-slate-800">
                                        <th class="px-6 py-4">Player</th>
                                        <th class="px-6 py-4">Team</th>
                                        <th class="px-6 py-4">Current Avg</th>
                                        <th class="px-6 py-4">Season Avg</th>
                                        <th class="px-6 py-4">Velocity</th>
                                        <th class="px-6 py-4 text-right">Trend</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-800">
                                    <tr class="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="size-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-slate-700">
                                                    <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtkxM6dhsG0mnXJGL0-oGsUL2oYjl1qoCEv1zJj2MLdtUZwi_cjJljaKm6znqln-hz0urGpwtQAasoEvTuIc2Vy1ywdDAQh3DiItIWjW_zob2Zxvo7sngm8r98lQ8CjMIafRhk5dRS6BqgzxnwMgAIoN7Yr_hjkOfgwYFjCqzJzzERVwhVCuCwlnFRCzEcqMbVV_Qin-0IN_8qkqYyUAofXrmiLogkyCBz73aZVyf8mFpuZjgt954UrziCz21mwTkEonR-JBcm_O8"/>
                                                </div>
                                                <span class="font-bold text-white group-hover:text-primary transition-colors">LeBron James</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-slate-400 font-bold text-[10px]">LAL</td>
                                        <td class="px-6 py-4 font-black text-white">31.2</td>
                                        <td class="px-6 py-4 text-slate-400 font-medium">25.7</td>
                                        <td class="px-6 py-4">
                                            <div class="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div class="w-[85%] h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <div class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">
                                                <span class="material-symbols-outlined text-[12px]">trending_up</span> 
                                                +21.4%
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="size-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-slate-700">
                                                    <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9YyH3ahnjhbr0HgJMn65bRWMz9k2ppWx1EKsWkqSPMO1ssMf6vs6nUvkSm-QNJeSB7DnzdoXe7dNQqcfsVzs4iVwkwFrsWxbtdgidXmO6f7iKZGDYafFz3u6ORXG6imqr3vOid2nuJrmGrU5C_aT-GfRoiXhIi9O0dkhLx4Fcqynn5l1M6v7-FrLlcfaE2E50c6qxdhJ3t-KgoInDCDaVNzH93TxMA3x-WCKCDJb8C74lp6INSqRayYZLJGQWZMambX0EVzvgI1w"/>
                                                </div>
                                                <span class="font-bold text-white group-hover:text-primary transition-colors">Kevin Durant</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-slate-400 font-bold text-[10px]">PHX</td>
                                        <td class="px-6 py-4 font-black text-white">28.9</td>
                                        <td class="px-6 py-4 text-slate-400 font-medium">27.1</td>
                                        <td class="px-6 py-4">
                                            <div class="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div class="w-[45%] h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                             <div class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">
                                                <span class="material-symbols-outlined text-[12px]">trending_up</span> 
                                                +6.6%
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Widgets -->
                <div class="lg:col-span-4 flex flex-col gap-6">
                    <!-- Scan Summary -->
                    <div class="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-glow-sm">
                        <h4 class="text-white font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary text-base">analytics</span>
                            Scan Summary
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-dark border border-slate-800 p-4 rounded-lg">
                                <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">Total Analyzed</p>
                                <p class="text-white text-2xl font-black">482</p>
                            </div>
                            <div class="bg-surface-dark border border-slate-800 p-4 rounded-lg">
                                <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">Qualifiers</p>
                                <p class="text-primary text-2xl font-black">12</p>
                            </div>
                        </div>
                        <div class="mt-4 p-4 bg-[#050911]/50 rounded-lg border border-slate-800/50">
                            <p class="text-slate-400 text-[10px] italic leading-relaxed font-medium">"Scan identified a 15% league-wide increase in 3P% over the last 5 game rolling average."</p>
                        </div>
                    </div>

                    <!-- Saved Presets -->
                    <div class="bg-surface-dark border border-slate-800 rounded-xl p-6 shadow-card">
                        <h4 class="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Saved Presets</h4>
                        <div class="space-y-3">
                            <button class="w-full flex items-center justify-between p-4 bg-[#050911] border border-slate-800 rounded-lg hover:border-primary/50 transition-all group">
                                <div class="text-left">
                                    <p class="text-white font-bold text-sm group-hover:text-primary transition-colors">Hot Hands: Shooters</p>
                                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">3PM > 3.0 | 5 Games</p>
                                </div>
                                <span class="material-symbols-outlined text-slate-600 text-sm group-hover:text-white transition-colors">chevron_right</span>
                            </button>
                            <button class="w-full flex items-center justify-between p-4 bg-[#050911] border border-slate-800 rounded-lg hover:border-primary/50 transition-all group">
                                <div class="text-left">
                                    <p class="text-white font-bold text-sm group-hover:text-primary transition-colors">Rookie Wall Check</p>
                                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">Usage < 20% | 10 Games</p>
                                </div>
                                <span class="material-symbols-outlined text-slate-600 text-sm group-hover:text-white transition-colors">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Floating Status Bar -->
            <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0F1623]/90 backdrop-blur-md border border-slate-700 px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-6 text-[10px] z-[60] animate-in slide-in-from-bottom-5 fade-in duration-500">
                <div class="flex items-center gap-2 text-slate-300">
                    <span class="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span class="font-bold tracking-widest uppercase">Scanning Engine Active</span>
                </div>
                <div class="w-px h-3 bg-slate-700"></div>
                <div class="flex items-center gap-2 text-slate-400">
                    <span class="material-symbols-outlined text-[14px]">bolt</span>
                    <span class="font-bold tracking-wider">42ms Latency</span>
                </div>
            </div>
        </div>
    `;
}

// Export for router
window.renderScannerPage = renderScannerPage;
