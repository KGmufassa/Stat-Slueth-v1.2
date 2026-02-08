// ============================================
// QUERY PAGE - Dynamic Query Canvas Pattern
// ============================================

function renderQueryPage() {
    const content = document.getElementById('app-content');
    
    // Using the 'Query Canvas' structure from sample
    content.innerHTML = `
        <div class="flex flex-col h-full gap-6">
            <!-- Search / Intent Section -->
            <section class="flex flex-col lg:flex-row items-stretch gap-4">
                <div class="w-full lg:w-48 shrink-0">
                    <label class="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1">Sport</label>
                    <div class="relative">
                        <select id="league-select" class="appearance-none w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-white dark:bg-[#192233] h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer">
                            <option value="auto">Auto-Detect</option>
                            <option value="nba">NBA Basketball</option>
                            <option value="nfl">NFL Football</option>
                            <option value="mlb">MLB Baseball</option>
                        </select>
                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">unfold_more</span>
                        <span class="absolute -top-2 -right-1 bg-primary text-[9px] px-1.5 py-0.5 rounded font-bold text-white shadow-lg">AI</span>
                    </div>
                </div>
                <div class="flex-1">
                    <label class="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1">NLP Intent Query</label>
                    <div class="flex w-full items-stretch rounded-lg h-11 bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-primary transition-all shadow-sm">
                        <div class="text-slate-400 flex items-center justify-center px-4">
                            <span class="material-symbols-outlined text-lg">search</span>
                        </div>
                        <input id="query-input" class="flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-500 text-sm" 
                            placeholder="Compare LeBron James and Kevin Durant..." 
                            value="Compare LeBron James and Kevin Durant shooting efficiency last 2 seasons"/>
                        <button id="clear-query-btn" class="px-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <span class="material-symbols-outlined text-lg">close</span>
                        </button>
                        <div class="flex items-center pr-1.5">
                            <button id="run-query-btn" class="bg-primary hover:brightness-110 text-white text-[11px] font-bold px-6 h-8 rounded transition-all uppercase tracking-wider shadow-lg shadow-primary/20">Analyze</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Results Container -->
            <div id="query-results" class="flex-1 flex flex-col gap-6">
                <!-- Initial State / Empty State -->
                <div class="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-white/5">
                    <div class="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span class="material-symbols-outlined text-3xl text-primary">auto_awesome</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to Analyze</h3>
                    <p class="text-slate-500 max-w-sm text-sm">Enter a query above to generate comprehensive statistical breakdowns and comparisons.</p>
                </div>
            </div>
        </div>
    `;

    // Event listeners
    document.getElementById('run-query-btn').addEventListener('click', executeQuery);
    
    // Add clear button listener
    const clearBtn = document.getElementById('clear-query-btn');
    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('query-input').value = '';
        });
    }
}

async function executeQuery() {
    const query = document.getElementById('query-input').value.trim();
    const league = document.getElementById('league-select').value;

    if (!query) {
        alert('Please enter a query');
        return;
    }

    // Show Loading Overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');

    try {
        // Simulate processing
        await Utils.simulateDelay(1500);

        const resultsDiv = document.getElementById('query-results');
        
        // Render the "Canvas" Result
        resultsDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2 fade-in">
                <div class="flex items-center gap-4">
                    <h2 class="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Query Canvas</h2>
                    <div class="flex items-center gap-2">
                        <span class="bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-white/10 text-slate-500 text-[9px] px-2 py-0.5 rounded font-mono">N: 20</span>
                        <span class="bg-primary/20 border border-primary/30 text-primary text-[9px] px-2 py-0.5 rounded font-mono">Last 2 Seasons</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="flex items-center gap-2 bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-white/10 hover:border-primary/50 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold text-[10px] transition-all uppercase tracking-wide">
                        <span class="material-symbols-outlined text-[16px]">bookmark</span>
                        <span>Save Preset</span>
                    </button>
                    <button class="flex items-center gap-2 bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-white/10 hover:border-primary/50 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold text-[10px] transition-all uppercase tracking-wide">
                        <span class="material-symbols-outlined text-[16px]">ios_share</span>
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6 fade-in">
                
                <!-- Player Comparison Card -->
                <div class="col-span-12 xl:col-span-4 flex flex-col gap-3">
                    <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div class="flex items-center gap-2">
                            <div class="size-9 rounded-full border-2 border-primary overflow-hidden shadow-lg shadow-primary/20">
                                <img alt="Player A" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtkxM6dhsG0mnXJGL0-oGsUL2oYjl1qoCEv1zJj2MLdtUZwi_cjJljaKm6znqln-hz0urGpwtQAasoEvTuIc2Vy1ywdDAQh3DiItIWjW_zob2Zxvo7sngm8r98lQ8CjMIafRhk5dRS6BqgzxnwMgAIoN7Yr_hjkOfgwYFjCqzJzzERVwhVCuCwlnFRCzEcqMbVV_Qin-0IN_8qkqYyUAofXrmiLogkyCBz73aZVyf8mFpuZjgt954UrziCz21mwTkEonR-JBcm_O8"/>
                            </div>
                            <div>
                                <h4 class="text-slate-900 dark:text-white font-bold text-xs">LeBron James</h4>
                                <p class="text-slate-500 text-[8px] font-bold uppercase">LAL | F</p>
                            </div>
                        </div>
                        <div class="text-slate-300 dark:text-slate-600 font-black text-[10px] italic">VS</div>
                        <div class="flex items-center gap-2 text-right">
                            <div>
                                <h4 class="text-slate-900 dark:text-white font-bold text-xs">Kevin Durant</h4>
                                <p class="text-slate-500 text-[8px] font-bold uppercase">PHX | F</p>
                            </div>
                            <div class="size-9 rounded-full border-2 border-slate-300 dark:border-slate-600 overflow-hidden shadow-lg shadow-black/10">
                                <img alt="Player B" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7DAP-0_ggB_Vsi2wvY7iU7xNRSoXnd43uJxfGlTL8FYQ2iJ55bioWXNGoY2n-0-12tjgOMFaTMA54FtPIDMRu631wTwlC9TwMNEBoqOoGx63TLuyW1dNTKk9HpoC7ch7_5J41fiOoZUITd-kRn_6sns9YLd0CTJURJSI6auwSa96P1jOxNyy3s-fNEUqq3yF-nUTrjfR1xYWQvgKi0haXH0CQ2POp6CG36cbzew0JxW3V19Mse2tiRDFeYUuMXsMkZo0lZSAk9cc"/>
                            </div>
                        </div>
                    </div>

                    <!-- Metrics -->
                    <div class="flex flex-col gap-1.5 p-1.5 border border-primary/10 rounded-xl bg-primary/5">
                        <div class="metric-row dark:hover:bg-white/10 hover:bg-black/5">
                            <span class="metric-value text-left text-emerald-500 font-bold dark:text-emerald-400">64.2%</span>
                            <span class="metric-label">TRUE SHOOTING</span>
                            <span class="metric-value text-right font-bold text-slate-700 dark:text-white">62.8%</span>
                        </div>
                        <div class="metric-row dark:hover:bg-white/10 hover:bg-black/5">
                            <span class="metric-value text-left text-slate-700 dark:text-white font-bold">31.5%</span>
                            <span class="metric-label">USAGE RATE</span>
                            <span class="metric-value text-right text-emerald-500 font-bold dark:text-emerald-400">32.1%</span>
                        </div>
                        <div class="metric-row dark:hover:bg-white/10 hover:bg-black/5">
                            <span class="metric-value text-left text-emerald-500 font-bold dark:text-emerald-400">26.4</span>
                            <span class="metric-label">PER</span>
                            <span class="metric-value text-right text-slate-700 dark:text-white font-bold">25.9</span>
                        </div>
                        <div class="metric-row dark:hover:bg-white/10 hover:bg-black/5">
                            <span class="metric-value text-left text-slate-700 dark:text-white font-bold">118.4</span>
                            <span class="metric-label">OFF RATING</span>
                            <span class="metric-value text-right text-emerald-500 font-bold dark:text-emerald-400">121.2</span>
                        </div>
                         <div class="metric-row dark:hover:bg-white/10 hover:bg-black/5">
                            <span class="metric-value text-left text-emerald-500 font-bold dark:text-emerald-400">8.4</span>
                            <span class="metric-label">WIN SHARES</span>
                            <span class="metric-value text-right text-slate-700 dark:text-white font-bold">7.9</span>
                        </div>
                    </div>
                </div>

                <!-- Head-to-Head Visual -->
                <div class="col-span-12 xl:col-span-8 flex flex-col gap-6">
                    <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
                        <div class="px-5 py-3 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                            <h3 class="text-slate-900 dark:text-white font-bold flex items-center gap-2 text-[10px] uppercase tracking-wider">
                                <span class="material-symbols-outlined text-primary text-sm">compare_arrows</span>
                                Head-to-Head Comparison
                            </h3>
                            <span class="text-slate-500 text-[8px] font-bold uppercase tracking-widest">Last 2 Seasons [N=20]</span>
                        </div>
                        <div class="px-8 py-6">
                            <!-- Comparison Content -->
                            <div class="flex items-center justify-between mb-8 max-w-xl mx-auto">
                                <div class="flex items-center gap-4">
                                    <div class="size-14 rounded-full border-2 border-primary/40 overflow-hidden shadow-xl shadow-primary/10">
                                        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtkxM6dhsG0mnXJGL0-oGsUL2oYjl1qoCEv1zJj2MLdtUZwi_cjJljaKm6znqln-hz0urGpwtQAasoEvTuIc2Vy1ywdDAQh3DiItIWjW_zob2Zxvo7sngm8r98lQ8CjMIafRhk5dRS6BqgzxnwMgAIoN7Yr_hjkOfgwYFjCqzJzzERVwhVCuCwlnFRCzEcqMbVV_Qin-0IN_8qkqYyUAofXrmiLogkyCBz73aZVyf8mFpuZjgt954UrziCz21mwTkEonR-JBcm_O8"/>
                                    </div>
                                    <div>
                                        <h4 class="text-slate-900 dark:text-white font-bold text-base leading-tight">LeBron James</h4>
                                        <p class="text-slate-500 text-[9px] uppercase font-bold tracking-tighter">LAL | FORWARD</p>
                                    </div>
                                </div>
                                <div class="px-6 text-slate-300 dark:text-slate-600 font-black text-lg italic">VS</div>
                                <div class="flex items-center gap-4 flex-row-reverse text-right">
                                    <div class="size-14 rounded-full border-2 border-slate-300 dark:border-slate-600 overflow-hidden shadow-xl shadow-black/10">
                                        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7DAP-0_ggB_Vsi2wvY7iU7xNRSoXnd43uJxfGlTL8FYQ2iJ55bioWXNGoY2n-0-12tjgOMFaTMA54FtPIDMRu631wTwlC9TwMNEBoqOoGx63TLuyW1dNTKk9HpoC7ch7_5J41fiOoZUITd-kRn_6sns9YLd0CTJURJSI6auwSa96P1jOxNyy3s-fNEUqq3yF-nUTrjfR1xYWQvgKi0haXH0CQ2POp6CG36cbzew0JxW3V19Mse2tiRDFeYUuMXsMkZo0lZSAk9cc"/>
                                    </div>
                                    <div>
                                        <h4 class="text-slate-900 dark:text-white font-bold text-base leading-tight">Kevin Durant</h4>
                                        <p class="text-slate-500 text-[9px] uppercase font-bold tracking-tighter">PHX | FORWARD</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Stat Bars -->
                            <div class="space-y-4 max-w-xl mx-auto pb-2">
                                <div class="relative">
                                    <div class="flex justify-between text-[10px] font-bold mb-1">
                                        <span class="text-slate-400">25.7</span>
                                        <span class="text-slate-400 uppercase tracking-widest text-[8px]">PPG</span>
                                        <span class="text-slate-900 dark:text-white">27.1</span>
                                    </div>
                                    <div class="h-1.5 flex bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                        <div class="w-1/2 flex justify-end">
                                            <div class="w-[85%] bg-slate-400 dark:bg-slate-600 h-full rounded-l-full"></div>
                                        </div>
                                        <div class="w-1/2">
                                            <div class="w-[95%] bg-primary h-full rounded-r-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="relative">
                                    <div class="flex justify-between text-[10px] font-bold mb-1">
                                        <span class="text-slate-900 dark:text-white">54.2%</span>
                                        <span class="text-slate-400 uppercase tracking-widest text-[8px]">FG%</span>
                                        <span class="text-slate-400">52.8%</span>
                                    </div>
                                    <div class="h-1.5 flex bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                        <div class="w-1/2 flex justify-end">
                                            <div class="w-[95%] bg-primary h-full rounded-l-full"></div>
                                        </div>
                                        <div class="w-1/2">
                                            <div class="w-[88%] bg-slate-400 dark:bg-slate-600 h-full rounded-r-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="relative">
                                    <div class="flex justify-between text-[10px] font-bold mb-1">
                                        <span class="text-slate-900 dark:text-white">7.3</span>
                                        <span class="text-slate-400 uppercase tracking-widest text-[8px]">APG</span>
                                        <span class="text-slate-400">5.0</span>
                                    </div>
                                    <div class="h-1.5 flex bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                        <div class="w-1/2 flex justify-end">
                                            <div class="w-[90%] bg-primary h-full rounded-l-full"></div>
                                        </div>
                                        <div class="w-1/2">
                                            <div class="w-[60%] bg-slate-400 dark:bg-slate-600 h-full rounded-r-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Game Logs Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
                <!-- Log 1 -->
                <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col shadow-sm">
                    <div class="px-4 py-2.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                        <div class="flex items-center gap-2">
                             <div class="size-6 rounded-full border border-primary overflow-hidden">
                                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtkxM6dhsG0mnXJGL0-oGsUL2oYjl1qoCEv1zJj2MLdtUZwi_cjJljaKm6znqln-hz0urGpwtQAasoEvTuIc2Vy1ywdDAQh3DiItIWjW_zob2Zxvo7sngm8r98lQ8CjMIafRhk5dRS6BqgzxnwMgAIoN7Yr_hjkOfgwYFjCqzJzzERVwhVCuCwlnFRCzEcqMbVV_Qin-0IN_8qkqYyUAofXrmiLogkyCBz73aZVyf8mFpuZjgt954UrziCz21mwTkEonR-JBcm_O8"/>
                            </div>
                            <h3 class="text-slate-900 dark:text-white font-bold text-[10px] uppercase">James Game Logs</h3>
                        </div>
                        <span class="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[7px] font-bold uppercase">LAL</span>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left text-[10px] border-collapse">
                            <thead>
                                <tr class="bg-slate-50 dark:bg-background-dark/50 text-slate-400 font-bold uppercase text-[7px] tracking-widest border-b border-slate-200 dark:border-white/10">
                                    <th class="px-4 py-2">Date</th>
                                    <th class="px-4 py-2">Opp</th>
                                    <th class="px-4 py-2">PTS</th>
                                    <th class="px-4 py-2 text-right">+/-</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                                <tr class="hover:bg-primary/5 transition-colors">
                                    <td class="px-4 py-2 text-slate-500 dark:text-slate-300">Mar 24</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">vs PHX</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">28</td>
                                    <td class="px-4 py-2 text-right text-emerald-500 font-bold">+12</td>
                                </tr>
                                <tr class="hover:bg-primary/5 transition-colors">
                                    <td class="px-4 py-2 text-slate-500 dark:text-slate-300">Mar 22</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">@ PHI</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">23</td>
                                    <td class="px-4 py-2 text-right text-rose-500 font-bold">-4</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                 <!-- Log 2 -->
                <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col shadow-sm">
                    <div class="px-4 py-2.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                        <div class="flex items-center gap-2">
                             <div class="size-6 rounded-full border border-slate-300 dark:border-slate-600 overflow-hidden">
                                <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7DAP-0_ggB_Vsi2wvY7iU7xNRSoXnd43uJxfGlTL8FYQ2iJ55bioWXNGoY2n-0-12tjgOMFaTMA54FtPIDMRu631wTwlC9TwMNEBoqOoGx63TLuyW1dNTKk9HpoC7ch7_5J41fiOoZUITd-kRn_6sns9YLd0CTJURJSI6auwSa96P1jOxNyy3s-fNEUqq3yF-nUTrjfR1xYWQvgKi0haXH0CQ2POp6CG36cbzew0JxW3V19Mse2tiRDFeYUuMXsMkZo0lZSAk9cc"/>
                            </div>
                            <h3 class="text-slate-900 dark:text-white font-bold text-[10px] uppercase">Durant Game Logs</h3>
                        </div>
                        <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 text-[7px] font-bold uppercase">PHX</span>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                         <table class="w-full text-left text-[10px] border-collapse">
                            <thead>
                                <tr class="bg-slate-50 dark:bg-background-dark/50 text-slate-400 font-bold uppercase text-[7px] tracking-widest border-b border-slate-200 dark:border-white/10">
                                    <th class="px-4 py-2">Date</th>
                                    <th class="px-4 py-2">Opp</th>
                                    <th class="px-4 py-2">PTS</th>
                                    <th class="px-4 py-2 text-right">+/-</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                                <tr class="hover:bg-primary/5 transition-colors">
                                    <td class="px-4 py-2 text-slate-500 dark:text-slate-300">Mar 25</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">@ SAS</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">29</td>
                                    <td class="px-4 py-2 text-right text-rose-500 font-bold">-2</td>
                                </tr>
                                <tr class="hover:bg-primary/5 transition-colors">
                                    <td class="px-4 py-2 text-slate-500 dark:text-slate-300">Mar 23</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">@ SAS</td>
                                    <td class="px-4 py-2 font-bold text-slate-900 dark:text-white text-[9px]">25</td>
                                    <td class="px-4 py-2 text-right text-emerald-500 font-bold">+18</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

    } catch (e) {
        console.error(e);
        alert('Error executing query');
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}

// Export for router
window.renderQueryPage = renderQueryPage;
