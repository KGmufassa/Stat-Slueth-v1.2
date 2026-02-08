// ============================================
// HEAD-TO-HEAD COMPARISON PAGE
// ============================================

function renderHeadToHeadPage() {
    const content = document.getElementById('app-content');
    if (!content) return;

    const leagueOptions = ['NBA', 'NFL', 'MLB', 'NHL'];
    const scopeOptions = [
        { id: 'player', label: 'Player' },
        { id: 'team', label: 'Team' }
    ];

    const playerDirectory = [
        { name: 'LeBron James', league: 'NBA', team: 'Los Angeles Lakers', position: 'Forward' },
        { name: 'Stephen Curry', league: 'NBA', team: 'Golden State Warriors', position: 'Guard' },
        { name: 'Giannis Antetokounmpo', league: 'NBA', team: 'Milwaukee Bucks', position: 'Forward' },
        { name: 'Kevin Durant', league: 'NBA', team: 'Phoenix Suns', position: 'Forward' },
        { name: 'Patrick Mahomes', league: 'NFL', team: 'Kansas City Chiefs', position: 'Quarterback' },
        { name: 'Josh Allen', league: 'NFL', team: 'Buffalo Bills', position: 'Quarterback' },
        { name: 'Justin Jefferson', league: 'NFL', team: 'Minnesota Vikings', position: 'Wide Receiver' },
        { name: 'Aaron Rodgers', league: 'NFL', team: 'New York Jets', position: 'Quarterback' },
        { name: 'Mookie Betts', league: 'MLB', team: 'Los Angeles Dodgers', position: 'Outfielder' },
        { name: 'Shohei Ohtani', league: 'MLB', team: 'Los Angeles Dodgers', position: 'Pitcher/DH' },
        { name: 'Ronald Acuna Jr.', league: 'MLB', team: 'Atlanta Braves', position: 'Outfielder' },
        { name: 'Mike Trout', league: 'MLB', team: 'Los Angeles Angels', position: 'Outfielder' },
        { name: 'Connor McDavid', league: 'NHL', team: 'Edmonton Oilers', position: 'Center' },
        { name: 'Auston Matthews', league: 'NHL', team: 'Toronto Maple Leafs', position: 'Center' },
        { name: 'Cale Makar', league: 'NHL', team: 'Colorado Avalanche', position: 'Defense' },
        { name: 'Sidney Crosby', league: 'NHL', team: 'Pittsburgh Penguins', position: 'Center' }
    ];

    const teamDirectory = [
        { name: 'Boston Celtics', league: 'NBA', conference: 'East', division: 'Atlantic' },
        { name: 'Milwaukee Bucks', league: 'NBA', conference: 'East', division: 'Central' },
        { name: 'Phoenix Suns', league: 'NBA', conference: 'West', division: 'Pacific' },
        { name: 'Denver Nuggets', league: 'NBA', conference: 'West', division: 'Northwest' },
        { name: 'Kansas City Chiefs', league: 'NFL', conference: 'AFC', division: 'West' },
        { name: 'Buffalo Bills', league: 'NFL', conference: 'AFC', division: 'East' },
        { name: 'Dallas Cowboys', league: 'NFL', conference: 'NFC', division: 'East' },
        { name: 'San Francisco 49ers', league: 'NFL', conference: 'NFC', division: 'West' },
        { name: 'Los Angeles Dodgers', league: 'MLB', conference: 'NL', division: 'West' },
        { name: 'Atlanta Braves', league: 'MLB', conference: 'NL', division: 'East' },
        { name: 'New York Yankees', league: 'MLB', conference: 'AL', division: 'East' },
        { name: 'Houston Astros', league: 'MLB', conference: 'AL', division: 'West' },
        { name: 'Edmonton Oilers', league: 'NHL', conference: 'West', division: 'Pacific' },
        { name: 'Toronto Maple Leafs', league: 'NHL', conference: 'East', division: 'Atlantic' },
        { name: 'Colorado Avalanche', league: 'NHL', conference: 'West', division: 'Central' },
        { name: 'New York Rangers', league: 'NHL', conference: 'East', division: 'Metropolitan' }
    ];

    const playerStats = {
        'LeBron James': { ppg: 25.7, threePct: 38.6, fgPct: 54.1, ast: 8.3, usg: 32.1, ts: 61.2 },
        'Stephen Curry': { ppg: 27.4, threePct: 41.2, fgPct: 47.8, ast: 5.1, usg: 30.4, ts: 64.3 },
        'Giannis Antetokounmpo': { ppg: 30.1, threePct: 29.1, fgPct: 57.8, ast: 6.3, usg: 33.8, ts: 61.8 },
        'Kevin Durant': { ppg: 28.2, threePct: 39.4, fgPct: 53.1, ast: 5.2, usg: 29.7, ts: 62.5 },
        'Patrick Mahomes': { ppg: 28.8, threePct: 0, fgPct: 0, ast: 6.2, usg: 31.2, ts: 0 },
        'Josh Allen': { ppg: 27.1, threePct: 0, fgPct: 0, ast: 6.0, usg: 30.1, ts: 0 },
        'Justin Jefferson': { ppg: 23.4, threePct: 0, fgPct: 0, ast: 2.1, usg: 28.7, ts: 0 },
        'Aaron Rodgers': { ppg: 24.6, threePct: 0, fgPct: 0, ast: 5.4, usg: 27.2, ts: 0 },
        'Mookie Betts': { ppg: 22.1, threePct: 0, fgPct: 0, ast: 4.8, usg: 27.5, ts: 0 },
        'Shohei Ohtani': { ppg: 24.0, threePct: 0, fgPct: 0, ast: 4.4, usg: 29.3, ts: 0 },
        'Ronald Acuna Jr.': { ppg: 23.5, threePct: 0, fgPct: 0, ast: 4.2, usg: 28.0, ts: 0 },
        'Mike Trout': { ppg: 21.8, threePct: 0, fgPct: 0, ast: 3.8, usg: 26.4, ts: 0 },
        'Connor McDavid': { ppg: 26.4, threePct: 0, fgPct: 0, ast: 7.1, usg: 29.1, ts: 0 },
        'Auston Matthews': { ppg: 24.3, threePct: 0, fgPct: 0, ast: 4.5, usg: 28.6, ts: 0 },
        'Cale Makar': { ppg: 21.4, threePct: 0, fgPct: 0, ast: 5.2, usg: 25.2, ts: 0 },
        'Sidney Crosby': { ppg: 22.9, threePct: 0, fgPct: 0, ast: 6.3, usg: 27.1, ts: 0 }
    };

    const teamStats = {
        'Boston Celtics': { winPct: 62.4, net: 7.8, ppg: 118.4, opp: 109.1, pace: 98.6, ortg: 119.5, drtg: 111.7, tov: 12.4 },
        'Milwaukee Bucks': { winPct: 58.1, net: 5.1, ppg: 116.1, opp: 110.2, pace: 99.4, ortg: 117.8, drtg: 112.7, tov: 13.1 },
        'Phoenix Suns': { winPct: 56.0, net: 4.6, ppg: 115.2, opp: 110.6, pace: 97.9, ortg: 116.2, drtg: 111.6, tov: 12.9 },
        'Denver Nuggets': { winPct: 59.3, net: 6.2, ppg: 114.6, opp: 108.7, pace: 97.4, ortg: 116.1, drtg: 109.9, tov: 12.2 },
        'Kansas City Chiefs': { winPct: 62.5, net: 6.8, ppg: 26.3, opp: 20.9, pace: 62.3, ortg: 0, drtg: 0, tov: 1.2 },
        'Buffalo Bills': { winPct: 61.2, net: 5.9, ppg: 27.1, opp: 21.4, pace: 63.1, ortg: 0, drtg: 0, tov: 1.1 },
        'Dallas Cowboys': { winPct: 58.6, net: 4.3, ppg: 25.6, opp: 22.1, pace: 62.9, ortg: 0, drtg: 0, tov: 1.3 },
        'San Francisco 49ers': { winPct: 63.0, net: 7.1, ppg: 27.8, opp: 20.4, pace: 61.8, ortg: 0, drtg: 0, tov: 1.0 },
        'Los Angeles Dodgers': { winPct: 60.4, net: 3.2, ppg: 5.2, opp: 4.4, pace: 0, ortg: 0, drtg: 0, tov: 0 },
        'Atlanta Braves': { winPct: 59.1, net: 2.9, ppg: 5.0, opp: 4.3, pace: 0, ortg: 0, drtg: 0, tov: 0 },
        'New York Yankees': { winPct: 57.6, net: 2.5, ppg: 4.8, opp: 4.2, pace: 0, ortg: 0, drtg: 0, tov: 0 },
        'Houston Astros': { winPct: 58.7, net: 2.7, ppg: 4.9, opp: 4.3, pace: 0, ortg: 0, drtg: 0, tov: 0 },
        'Edmonton Oilers': { winPct: 56.3, net: 5.4, ppg: 3.6, opp: 2.9, pace: 0, ortg: 0, drtg: 0, tov: 0 },
        'Toronto Maple Leafs': { winPct: 54.9, net: 4.2, ppg: 3.4, opp: 3.0, pace: 0, ortg: 0, drtg: 0, tov: 0 },
        'Colorado Avalanche': { winPct: 55.7, net: 4.8, ppg: 3.5, opp: 3.0, pace: 0, ortg: 0, drtg: 0, tov: 0 },
        'New York Rangers': { winPct: 53.8, net: 3.6, ppg: 3.2, opp: 2.9, pace: 0, ortg: 0, drtg: 0, tov: 0 }
    };

    const state = {
        mode: 'player',
        league: '',
        leftSelection: '',
        rightSelection: ''
    };

    content.innerHTML = `
        <div class="max-w-[1200px] mx-auto p-6 flex flex-col gap-6 fade-in">
            <section class="flex flex-col gap-6">
                <div class="flex flex-wrap justify-between items-end gap-4">
                    <div class="flex flex-col gap-1">
                        <h1 class="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Compare Entities</h1>
                        <p class="text-slate-500 dark:text-[#92a4c9] text-sm">Build side-by-side performance queries instantly</p>
                    </div>
                    <div class="flex gap-2">
                        <button id="clear-compare" class="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-[#232f48] text-slate-700 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-[#324467] transition-all">
                            <span class="material-symbols-outlined text-lg">delete</span>
                            <span>Clear All</span>
                        </button>
                        <button id="save-compare" class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
                            <span class="material-symbols-outlined text-lg">save</span>
                            <span>Save Report</span>
                        </button>
                    </div>
                </div>

                <div class="bg-white dark:bg-[#192233] p-6 rounded-xl border border-slate-200 dark:border-[#232f48] shadow-sm">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div class="lg:col-span-3">
                            <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider mb-3">Comparison Scope</p>
                            <div class="flex h-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#232f48] p-1">
                                ${scopeOptions.map((option) => `
                                    <button data-scope="${option.id}" class="scope-toggle flex h-full grow items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors ${option.id === 'player' ? 'bg-white dark:bg-background-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 dark:text-[#92a4c9] hover:text-slate-900 dark:hover:text-white'}">${option.label}</button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="lg:col-span-9 flex flex-wrap sm:flex-nowrap gap-4 items-center">
                            <div class="flex-1 min-w-[200px]">
                                <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider mb-3">Entity A</p>
                                <div class="relative group">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">person</span>
                                    <input id="player-left" class="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Select league first..." disabled />
                                    <div id="player-left-list" role="listbox" class="absolute top-full mt-2 w-full rounded-xl border border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] shadow-sm z-20 hidden max-h-64 overflow-y-auto"></div>
                                </div>
                            </div>
                            <div class="flex items-center justify-center pt-7">
                                <span class="text-slate-400 font-black text-xl italic">VS</span>
                            </div>
                            <div class="flex-1 min-w-[200px]">
                                <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider mb-3">Entity B</p>
                                <div class="relative group">
                                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">person</span>
                                    <input id="player-right" class="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Select league first..." disabled />
                                    <div id="player-right-list" role="listbox" class="absolute top-full mt-2 w-full rounded-xl border border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] shadow-sm z-20 hidden max-h-64 overflow-y-auto"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-[#232f48]">
                        <div class="relative">
                            <select id="compare-league" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#111722] text-xs font-semibold text-slate-600 dark:text-[#92a4c9]">
                                <option value="" selected>Select League</option>
                                ${leagueOptions.map((league) => `<option value="${league}">${league}</option>`).join('')}
                            </select>
                        </div>
                        <button class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#324467] flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-[#232f48]">
                            <span class="material-symbols-outlined text-sm">calendar_today</span>
                            <span>Last 10 Games</span>
                            <span class="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <button class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#324467] flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-[#232f48]">
                            <span class="material-symbols-outlined text-sm">location_on</span>
                            <span>All Venues</span>
                            <span class="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <button class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#324467] flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#92a4c9] hover:bg-slate-50 dark:hover:bg-[#232f48]">
                            <span class="material-symbols-outlined text-sm">history</span>
                            <span>Regular Season 23/24</span>
                            <span class="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                    </div>
                </div>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-[#192233] rounded-xl overflow-hidden border border-slate-200 dark:border-[#232f48] shadow-sm">
                    <div class="p-4 border-b border-slate-100 dark:border-[#232f48]">
                        <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider mb-3">Comparison Scope</p>
                        <div class="flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#232f48] p-1">
                            ${scopeOptions.map((option) => `
                                <button data-scope="${option.id}" class="scope-toggle-pane flex h-full grow items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors ${option.id === 'player' ? 'bg-white dark:bg-background-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 dark:text-[#92a4c9] hover:text-slate-900 dark:hover:text-white'}">${option.label}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div id="entity-left-card"></div>
                </div>
                <div class="bg-white dark:bg-[#192233] rounded-xl overflow-hidden border border-slate-200 dark:border-[#232f48] shadow-sm">
                    <div class="p-4 border-b border-slate-100 dark:border-[#232f48]">
                        <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase tracking-wider mb-3">Comparison Scope</p>
                        <div class="flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#232f48] p-1">
                            ${scopeOptions.map((option) => `
                                <button data-scope="${option.id}" class="scope-toggle-pane flex h-full grow items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors ${option.id === 'player' ? 'bg-white dark:bg-background-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 dark:text-[#92a4c9] hover:text-slate-900 dark:hover:text-white'}">${option.label}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div id="entity-right-card"></div>
                </div>
            </section>

            <section class="bg-white dark:bg-[#192233] rounded-xl border border-slate-200 dark:border-[#232f48] shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-[#232f48] flex justify-between items-center">
                    <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">data_thresholding</span>
                        Delta Analysis
                    </h4>
                    <span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded uppercase tracking-tighter">Live Engine</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-[#111722]">
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-[#92a4c9] uppercase tracking-wider">Statistic</th>
                                <th id="delta-left-label" class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-[#92a4c9] uppercase tracking-wider text-center">Entity A</th>
                                <th id="delta-right-label" class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-[#92a4c9] uppercase tracking-wider text-center">Entity B</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-[#92a4c9] uppercase tracking-wider text-right">Delta</th>
                            </tr>
                        </thead>
                        <tbody id="delta-rows" class="divide-y divide-slate-100 dark:divide-[#232f48]"></tbody>
                    </table>
                </div>
                <div class="px-6 py-4 bg-slate-50 dark:bg-[#111722] flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-primary">info</span>
                    <p class="text-[11px] font-medium text-slate-500 dark:text-[#92a4c9]">Delta is calculated as (Entity A - Entity B). Positive values indicate Entity A advantage.</p>
                </div>
            </section>

            <section class="bg-white dark:bg-[#192233] rounded-xl border border-slate-200 dark:border-[#232f48] shadow-sm p-6 mb-10">
                <div class="flex justify-between items-center mb-6">
                    <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">show_chart</span>
                        Efficiency Trajectory (Last 15 Games)
                    </h4>
                    <div class="flex gap-4">
                        <div class="flex items-center gap-2">
                            <span class="size-2 rounded-full bg-primary"></span>
                            <span class="text-[11px] font-bold text-slate-500 dark:text-[#92a4c9]">Entity A</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="size-2 rounded-full bg-slate-400"></span>
                            <span class="text-[11px] font-bold text-slate-500 dark:text-[#92a4c9]">Entity B</span>
                        </div>
                    </div>
                </div>
                <div class="h-48 w-full relative overflow-hidden flex items-end gap-1">
                    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div class="w-full h-px bg-slate-400 dark:bg-[#92a4c9]"></div>
                        <div class="w-full h-px bg-slate-400 dark:bg-[#92a4c9]"></div>
                        <div class="w-full h-px bg-slate-400 dark:bg-[#92a4c9]"></div>
                        <div class="w-full h-px bg-slate-400 dark:bg-[#92a4c9]"></div>
                    </div>
                    <div class="flex-1 h-full flex items-end justify-center relative">
                        <div class="w-1/2 bg-primary/20 absolute bottom-1/3 h-1/2 rounded-full"></div>
                        <div class="w-1/4 bg-primary h-[80%] rounded-full absolute bottom-4"></div>
                    </div>
                    <div class="flex-1 h-full flex items-end justify-center relative">
                        <div class="w-1/2 bg-slate-400/20 absolute bottom-1/4 h-1/3 rounded-full"></div>
                        <div class="w-1/4 bg-slate-400 h-[60%] rounded-full absolute bottom-4"></div>
                    </div>
                    <div class="flex-1 h-full flex items-end justify-center relative">
                        <div class="w-full h-full bg-gradient-to-t from-primary/10 to-transparent rounded-t-lg"></div>
                        <div class="absolute bottom-[70%] left-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(19,91,236,0.5)]"></div>
                        <div class="absolute bottom-[50%] left-0 w-full h-[2px] bg-slate-400/50"></div>
                    </div>
                </div>
                <div class="flex justify-between mt-4 text-[10px] font-bold text-slate-400 dark:text-[#92a4c9] px-2">
                    <span>OCT 25</span>
                    <span>NOV 10</span>
                    <span>NOV 25</span>
                    <span>DEC 10</span>
                    <span>DEC 25</span>
                </div>
            </section>
        </div>
    `;

    const leftInput = document.getElementById('player-left');
    const rightInput = document.getElementById('player-right');
    const leftList = document.getElementById('player-left-list');
    const rightList = document.getElementById('player-right-list');
    const scopeButtons = Array.from(document.querySelectorAll('.scope-toggle'));
    const scopeButtonsPane = Array.from(document.querySelectorAll('.scope-toggle-pane'));
    const leagueSelect = document.getElementById('compare-league');
    const entityLeftCard = document.getElementById('entity-left-card');
    const entityRightCard = document.getElementById('entity-right-card');
    const deltaRows = document.getElementById('delta-rows');
    const deltaLeftLabel = document.getElementById('delta-left-label');
    const deltaRightLabel = document.getElementById('delta-right-label');

    const getInitials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

    const formatPercent = (value) => `${value.toFixed(1)}%`;

    const computeSeed = (label) => label.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const getTeamMetrics = (teamName) => {
        if (teamStats[teamName]) return teamStats[teamName];
        const seed = computeSeed(teamName);
        return {
            winPct: 50 + (seed % 15),
            net: (seed % 10) - 2,
            ppg: 105 + (seed % 20),
            opp: 100 + (seed % 18),
            pace: 95 + (seed % 8),
            ortg: 110 + (seed % 10),
            drtg: 105 + (seed % 10),
            tov: 12 + (seed % 3)
        };
    };

    const getPlayerMetrics = (playerName) => {
        return playerStats[playerName] || { ppg: 0, threePct: 0, fgPct: 0, ast: 0, usg: 0, ts: 0 };
    };

    const getListByMode = (league) => {
        if (!league) return [];
        return state.mode === 'team'
            ? teamDirectory.filter((team) => team.league === league)
            : playerDirectory.filter((player) => player.league === league);
    };

    const renderDropdown = (listElement, items, highlightedIndex) => {
        listElement.innerHTML = items
            .map((item, index) => {
                const isActive = index === highlightedIndex;
                const subtitle = state.mode === 'team'
                    ? `${item.conference} • ${item.division}`
                    : `${item.team} • ${item.position}`;
                return `
                    <button type="button" role="option" aria-selected="${isActive ? 'true' : 'false'}" data-value="${item.name}"
                        class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-primary/15 text-white' : 'text-slate-700 dark:text-[#92a4c9] hover:bg-slate-100 dark:hover:bg-[#232f48]'}">
                        <div>
                            <p class="font-semibold">${item.name}</p>
                            <p class="text-[10px] text-slate-400 dark:text-[#92a4c9] uppercase tracking-wider">${subtitle}</p>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#232f48] text-slate-500 dark:text-[#92a4c9] px-2 py-1 rounded-full">${item.league}</span>
                    </button>
                `;
            })
            .join('');
        listElement.classList.toggle('hidden', items.length === 0);
    };

    const setupTypeahead = (inputElement, listElement, side) => {
        let available = [];
        let filtered = [];
        let highlighted = -1;

        const close = () => {
            listElement.classList.add('hidden');
            inputElement.setAttribute('aria-expanded', 'false');
            highlighted = -1;
        };

        const open = () => {
            if (!filtered.length) {
                close();
                return;
            }
            listElement.classList.remove('hidden');
            inputElement.setAttribute('aria-expanded', 'true');
        };

        const render = () => {
            renderDropdown(listElement, filtered, highlighted);
            open();
            listElement.querySelectorAll('[data-value]').forEach((button) => {
                button.addEventListener('click', () => {
                    const value = button.dataset.value;
                    inputElement.value = value;
                    if (side === 'left') state.leftSelection = value;
                    if (side === 'right') state.rightSelection = value;
                    close();
                    renderComparison();
                });
            });
        };

        const setItems = (items) => {
            available = items;
            filtered = items;
            highlighted = items.length ? 0 : -1;
            render();
        };

        inputElement.addEventListener('input', (event) => {
            const query = event.target.value.trim().toLowerCase();
            filtered = available.filter((item) => item.name.toLowerCase().includes(query));
            highlighted = filtered.length ? 0 : -1;
            render();
        });

        inputElement.addEventListener('focus', () => {
            filtered = available;
            render();
        });

        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (!filtered.length) return;
                highlighted = (highlighted + 1) % filtered.length;
                render();
                return;
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (!filtered.length) return;
                highlighted = (highlighted - 1 + filtered.length) % filtered.length;
                render();
                return;
            }
            if (event.key === 'Enter') {
                if (filtered.length && highlighted >= 0) {
                    event.preventDefault();
                    const value = filtered[highlighted].name;
                    inputElement.value = value;
                    if (side === 'left') state.leftSelection = value;
                    if (side === 'right') state.rightSelection = value;
                    close();
                    renderComparison();
                }
            }
            if (event.key === 'Escape') {
                close();
            }
        });

        document.addEventListener('click', (event) => {
            if (!listElement.contains(event.target) && event.target !== inputElement) {
                close();
            }
        });

        return { setItems, close };
    };

    const leftTypeahead = setupTypeahead(leftInput, leftList, 'left');
    const rightTypeahead = setupTypeahead(rightInput, rightList, 'right');

    const updateScopeButtons = () => {
        [...scopeButtons, ...scopeButtonsPane].forEach((button) => {
            const isActive = button.dataset.scope === state.mode;
            button.classList.toggle('bg-white', isActive);
            button.classList.toggle('dark:bg-background-dark', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('text-slate-900', isActive);
            button.classList.toggle('dark:text-white', isActive);
            button.classList.toggle('text-slate-400', !isActive);
            button.classList.toggle('dark:text-[#92a4c9]', !isActive);
        });
    };

    const renderEntityCard = (container, selection) => {
        if (!selection) {
            container.innerHTML = '<p class="text-slate-500 dark:text-[#92a4c9] text-sm p-6">Select an entity to view summary stats.</p>';
            return;
        }
        if (state.mode === 'team') {
            const team = teamDirectory.find((entry) => entry.name === selection);
            const metrics = getTeamMetrics(selection);
            container.innerHTML = `
                <div class="p-6 bg-primary/5 dark:bg-white/[0.02] border-b border-slate-100 dark:border-[#232f48] flex items-center gap-4">
                    <div class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">${getInitials(selection)}</div>
                    <div>
                        <h3 class="text-xl font-bold dark:text-white">${selection}</h3>
                        <p class="text-slate-500 dark:text-[#92a4c9] text-sm">${team?.conference} • ${team?.division}</p>
                    </div>
                </div>
                <div class="p-6 grid grid-cols-2 gap-4">
                    <div class="bg-slate-50 dark:bg-[#111722] p-4 rounded-lg">
                        <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase mb-1">Win %</p>
                        <p class="text-3xl font-black text-primary">${formatPercent(metrics.winPct)}</p>
                        <div class="flex items-center gap-1 text-[10px] text-green-500 font-bold mt-1">
                            <span class="material-symbols-outlined text-[12px]">trending_up</span>
                            <span>+2.1 vs Avg</span>
                        </div>
                    </div>
                    <div class="bg-slate-50 dark:bg-[#111722] p-4 rounded-lg">
                        <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase mb-1">Net Rating</p>
                        <p class="text-3xl font-black text-slate-900 dark:text-white">${metrics.net.toFixed(1)}</p>
                        <div class="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-1">
                            <span class="material-symbols-outlined text-[12px]">horizontal_rule</span>
                            <span>Neutral Trend</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        const player = playerDirectory.find((entry) => entry.name === selection);
        const stats = getPlayerMetrics(selection);
        container.innerHTML = `
            <div class="p-6 bg-primary/5 dark:bg-white/[0.02] border-b border-slate-100 dark:border-[#232f48] flex items-center gap-4">
                <div class="size-16 rounded-full bg-cover bg-center border-2 border-primary bg-primary/10 flex items-center justify-center text-primary font-bold">${getInitials(selection)}</div>
                <div>
                    <h3 class="text-xl font-bold dark:text-white">${selection}</h3>
                    <p class="text-slate-500 dark:text-[#92a4c9] text-sm">${player?.team} • ${player?.position}</p>
                </div>
            </div>
            <div class="p-6 grid grid-cols-2 gap-4">
                <div class="bg-slate-50 dark:bg-[#111722] p-4 rounded-lg">
                    <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase mb-1">PPG</p>
                    <p class="text-3xl font-black text-primary">${stats.ppg.toFixed(1)}</p>
                    <div class="flex items-center gap-1 text-[10px] text-green-500 font-bold mt-1">
                        <span class="material-symbols-outlined text-[12px]">trending_up</span>
                        <span>+2.1 vs Avg</span>
                    </div>
                </div>
                <div class="bg-slate-50 dark:bg-[#111722] p-4 rounded-lg">
                    <p class="text-slate-500 dark:text-[#92a4c9] text-xs font-bold uppercase mb-1">3P%</p>
                    <p class="text-3xl font-black text-slate-900 dark:text-white">${stats.threePct.toFixed(1)}%</p>
                    <div class="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-1">
                        <span class="material-symbols-outlined text-[12px]">horizontal_rule</span>
                        <span>Neutral Trend</span>
                    </div>
                </div>
            </div>
        `;
    };

    const renderDeltaTable = () => {
        if (!state.leftSelection || !state.rightSelection) {
            deltaRows.innerHTML = '';
            return;
        }

        if (state.mode === 'team') {
            const left = getTeamMetrics(state.leftSelection);
            const right = getTeamMetrics(state.rightSelection);
            const rows = [
                { label: 'Net Rating', left: left.net, right: right.net, fmt: (v) => v.toFixed(1) },
                { label: 'Off Rating', left: left.ortg, right: right.ortg, fmt: (v) => v.toFixed(1) },
                { label: 'Def Rating', left: left.drtg, right: right.drtg, fmt: (v) => v.toFixed(1) },
                { label: 'Pace', left: left.pace, right: right.pace, fmt: (v) => v.toFixed(1) },
                { label: 'Turnover %', left: left.tov, right: right.tov, fmt: (v) => v.toFixed(1) }
            ];
            deltaRows.innerHTML = rows.map((row) => {
                const delta = row.left - row.right;
                const deltaClass = delta >= 0 ? 'text-green-500' : 'text-red-400';
                return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td class="px-6 py-4 text-sm font-medium text-slate-700 dark:text-[#92a4c9]">${row.label}</td>
                        <td class="px-6 py-4 text-sm font-bold text-center">${row.fmt(row.left)}</td>
                        <td class="px-6 py-4 text-sm font-bold text-center">${row.fmt(row.right)}</td>
                        <td class="px-6 py-4 text-sm font-black text-right ${deltaClass}">${delta >= 0 ? '+' : ''}${delta.toFixed(1)}</td>
                    </tr>
                `;
            }).join('');
            return;
        }

        const left = getPlayerMetrics(state.leftSelection);
        const right = getPlayerMetrics(state.rightSelection);
        const rows = [
            { label: 'Field Goal %', left: left.fgPct, right: right.fgPct, fmt: (v) => `${v.toFixed(1)}%` },
            { label: 'Assists Per Game', left: left.ast, right: right.ast, fmt: (v) => v.toFixed(1) },
            { label: 'Usage Rate %', left: left.usg, right: right.usg, fmt: (v) => v.toFixed(1) },
            { label: 'True Shooting %', left: left.ts, right: right.ts, fmt: (v) => `${v.toFixed(1)}%` }
        ];
        deltaRows.innerHTML = rows.map((row) => {
            const delta = row.left - row.right;
            const deltaClass = delta >= 0 ? 'text-green-500' : 'text-red-400';
            return `
                <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-slate-700 dark:text-[#92a4c9]">${row.label}</td>
                    <td class="px-6 py-4 text-sm font-bold text-center">${row.fmt(row.left)}</td>
                    <td class="px-6 py-4 text-sm font-bold text-center">${row.fmt(row.right)}</td>
                    <td class="px-6 py-4 text-sm font-black text-right ${deltaClass}">${delta >= 0 ? '+' : ''}${delta.toFixed(1)}</td>
                </tr>
            `;
        }).join('');
    };

    const renderComparison = () => {
        renderEntityCard(entityLeftCard, state.leftSelection);
        renderEntityCard(entityRightCard, state.rightSelection);
        renderDeltaTable();
        deltaLeftLabel.textContent = state.leftSelection || 'Entity A';
        deltaRightLabel.textContent = state.rightSelection || 'Entity B';
    };

    const updateInputState = () => {
        if (!state.league) {
            leftInput.value = '';
            rightInput.value = '';
            leftInput.setAttribute('disabled', 'true');
            rightInput.setAttribute('disabled', 'true');
            leftInput.setAttribute('placeholder', 'Select league first...');
            rightInput.setAttribute('placeholder', 'Select league first...');
            leftTypeahead.close();
            rightTypeahead.close();
            return;
        }
        leftInput.removeAttribute('disabled');
        rightInput.removeAttribute('disabled');
        leftInput.setAttribute('placeholder', state.mode === 'team' ? 'Search Team...' : 'Search Player...');
        rightInput.setAttribute('placeholder', state.mode === 'team' ? 'Search Team...' : 'Search Player...');
        const items = getListByMode(state.league);
        leftTypeahead.setItems(items);
        rightTypeahead.setItems(items);
    };

    const setScope = (scope) => {
        state.mode = scope;
        updateScopeButtons();
        state.leftSelection = '';
        state.rightSelection = '';
        leftInput.value = '';
        rightInput.value = '';
        updateInputState();
        renderComparison();
    };

    scopeButtons.forEach((button) => {
        button.addEventListener('click', () => setScope(button.dataset.scope));
    });

    scopeButtonsPane.forEach((button) => {
        button.addEventListener('click', () => setScope(button.dataset.scope));
    });

    leagueSelect.addEventListener('change', () => {
        state.league = leagueSelect.value;
        state.leftSelection = '';
        state.rightSelection = '';
        updateInputState();
        renderComparison();
    });

    document.getElementById('clear-compare').addEventListener('click', () => {
        state.league = '';
        state.leftSelection = '';
        state.rightSelection = '';
        leagueSelect.value = '';
        updateInputState();
        renderComparison();
    });

    updateScopeButtons();
    updateInputState();
    renderComparison();
}

window.renderHeadToHeadPage = renderHeadToHeadPage;
