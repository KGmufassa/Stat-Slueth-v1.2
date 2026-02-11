// ============================================
// HEAD-TO-HEAD COMPARISON PAGE
// ============================================

function renderHeadToHeadPage() {
    const content = document.getElementById('app-content');
    if (!content) return;

    const leaguePositions = {
        NBA: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
        NFL: ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety'],
        MLB: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter']
    };

    const nbaSchema = [
        'G', 'GS', 'MP', 'PTS', 'FG', 'FGA', 'FG%', '3P', '3PA', '3P%', '2P', '2PA', '2P%', 'eFG%', 'FT', 'FTA', 'FT%',
        'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF', '2Dbl', 'Trp-Dbl'
    ];

    const nflSchema = {
        QB: ['GP', 'Pass Yds', 'Pass TD', 'INT', 'Comp %', 'Att', 'Sacks', 'Rush Yds/TD', 'Y/A', 'TD%', 'INT%', 'Passer Rating'],
        RB: ['Carries', 'Rush Yds', 'Rush TD', 'Rec', 'Rec Yds', 'Touches', 'YPC', 'YAC'],
        WRTE: ['Targets', 'Rec', 'Rec Yds', 'TD', 'Drops'],
        DLLB: ['Tackles', 'Sacks', 'Pressures', 'Forced Fumbles'],
        CBS: ['Tackles', 'Sacks', 'Pressures', 'INT', 'Forced Fumbles', 'Pat downs']
    };

    const mlbSchema = {
        PITCHER: ['G', 'GS', 'IP', 'W', 'L', 'ERA', 'WHIP', 'SO', 'BB', 'H', 'HR'],
        HITTER: ['G', 'AB', 'R', 'H', '2B', '3B', 'HR', 'RBI', 'BB', 'SO', 'SB', 'AVG', 'OBP', 'SLG', 'OPS']
    };

    const state = {
        league: 'NBA',
        leftPosition: 'Small Forward',
        rightPosition: 'Power Forward',
        season: '2023-24 Season',
        statView: 'stats',
        gameTab: 'L10',
        showAllGames: false
    };

    content.innerHTML = `
        <style>
            .h2h-show-scrollbar::-webkit-scrollbar { height: 8px; }
            .h2h-show-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .h2h-show-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 999px; }
            .h2h-show-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
            .h2h-show-scrollbar { scrollbar-width: thin; scrollbar-color: #334155 transparent; }

            .h2h-split-scroll-lock {
                scrollbar-width: none;
                -ms-overflow-style: none;
                touch-action: pan-y;
            }

            .h2h-split-scroll-lock::-webkit-scrollbar {
                display: none;
            }

            .h2h-section-title {
                font-size: 1.125rem;
                line-height: 1.75rem;
                font-weight: 900;
                letter-spacing: -0.01em;
                color: rgb(15 23 42);
            }

            .dark .h2h-section-title {
                color: rgb(248 250 252);
            }

            .h2h-col-highlight {
                background-color: rgba(241, 245, 249, 0.03);
            }

            .dark .h2h-col-highlight {
                background-color: rgba(255, 255, 255, 0.02);
            }

            .h2h-table th,
            .h2h-table td {
                white-space: nowrap;
            }

            .h2h-table th {
                font-size: 10px;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: rgb(100 116 139);
            }

            .h2h-table td {
                font-size: 12px;
                color: rgb(15 23 42);
            }

            .dark .h2h-table td {
                color: rgb(226 232 240);
            }
        </style>

        <div class="max-w-7xl mx-auto px-4 py-8 space-y-8 fade-in">
            <section class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div class="flex flex-col lg:flex-row gap-6 items-end">
                    <div class="flex-1 space-y-3">
                        <div>
                            <select id="h2h-league-select" aria-label="Select league" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-32 focus:ring-primary">
                                <option value="NBA" selected>NBA</option>
                                <option value="NFL">NFL</option>
                                <option value="MLB">MLB</option>
                            </select>
                        </div>
                        <div class="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit" role="tablist" aria-label="Left compare mode">
                            <button aria-selected="true" class="px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold shadow-sm" role="tab" type="button">Player</button>
                            <button aria-selected="false" class="px-3 py-1 text-xs font-medium opacity-60" role="tab" type="button">Team</button>
                        </div>
                        <div class="flex gap-2">
                            <select id="h2h-left-position" aria-label="Select player A position" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-44 focus:ring-primary"></select>
                            <input id="h2h-left-player" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full focus:ring-primary" placeholder="Search Player A..." type="text" value="LeBron James" />
                        </div>
                    </div>

                    <div class="hidden lg:flex items-center justify-center py-2 px-2">
                        <span class="text-xl font-black text-slate-300 dark:text-slate-600 italic">VS</span>
                    </div>

                    <div class="flex-1 space-y-3">
                        <div class="h-[38px]"></div>
                        <div class="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit" role="tablist" aria-label="Right compare mode">
                            <button aria-selected="true" class="px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold shadow-sm" role="tab" type="button">Player</button>
                            <button aria-selected="false" class="px-3 py-1 text-xs font-medium opacity-60" role="tab" type="button">Team</button>
                        </div>
                        <div class="flex gap-2">
                            <select id="h2h-right-position" aria-label="Select player B position" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-44 focus:ring-primary"></select>
                            <input id="h2h-right-player" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full focus:ring-primary" placeholder="Search Player B..." type="text" value="Kevin Durant" />
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex items-center gap-3">
                    <button id="h2h-compare-btn" class="bg-primary hover:bg-blue-600 text-white px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20" type="button">
                        <span class="material-symbols-outlined text-sm">search</span>
                        Compare Stats
                    </button>
                    <p id="h2h-feedback" class="text-xs text-orange-400 font-semibold hidden"></p>
                </div>
            </section>

            <section class="space-y-3">
                <h3 class="h2h-section-title flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-lg">insights</span>
                    Head-to-Head Comparison
                </h3>
                <div class="bg-[#111827] text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-slate-800">
                    <div class="grid grid-cols-3 gap-8 items-start mb-10">
                        <div class="flex flex-col items-center text-center gap-3">
                            <img alt="Player A" class="w-20 h-20 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD916xGAXKiQ5A6lHLS1-YYoWCyIvU4-rigNJQS5f7ufIOxMc0bAIYiL2pPadaayrnES2A31iKcO-cHIkSD5Nj2oPXbQZJGnFTyHPY6tAA34WwrlfehXWGt3ugVb7-ectJiHhppDlsrLRMaZAhPzm6XdaXsN4Ve-k410TLrxWqqAZweXRb4xl7RWb1ovTycVdbbBq0uQ1IFq7MF7ELbC98PB3H7jYDSb7K0nVtDe6kqfbPM5xxntFgpGUZbnjtFlHnAzRY0gwn3-nA" />
                            <div>
                                <div id="h2h-left-hero-name" class="text-lg font-bold">LeBron James</div>
                                <div id="h2h-left-hero-meta" class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">NBA | SMALL FORWARD</div>
                            </div>
                        </div>
                        <div class="flex items-center justify-center h-full">
                            <span class="text-4xl font-black text-slate-800 italic">VS</span>
                        </div>
                        <div class="flex flex-col items-center text-center gap-3">
                            <img alt="Player B" class="w-20 h-20 rounded-full border-2 border-slate-700 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRdWLw23lfYLinZrYSSIU__GlJekkaZTmvWQFPcPnll3WMyJ__-2xbSqhp3VSsbkFpGJPpkCUTDWVNMjf1ieNxki6oKHRXPMk0qBcKtrbByeHFoQpxMsxJFGHbY21z2DLjeigZEA8lqrYfLVVE_tRLhzyXKb2sDoEWiwZv69raripeykBRfwz7fwYV4ABZrThxBRR-H2WhszyBRWWEk5p5fC2AxMVJy1ikPnETRCiMBlS_U44ngfsH2cEh8-3jaqduA_0E_qtLA3M" />
                            <div>
                                <div id="h2h-right-hero-name" class="text-lg font-bold">Kevin Durant</div>
                                <div id="h2h-right-hero-meta" class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">NBA | POWER FORWARD</div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-8 max-w-4xl mx-auto">
                        <div class="space-y-2">
                            <div class="flex justify-between items-end text-sm font-bold">
                                <span>25.7</span>
                                <span class="text-slate-500 tracking-widest">PPG</span>
                                <span>27.1</span>
                            </div>
                            <div class="flex gap-2 h-1.5">
                                <div class="flex-1 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-primary" style="width: 85%"></div></div>
                                <div class="flex-1 bg-slate-800 rounded-full overflow-hidden flex justify-end"><div class="h-full bg-slate-400" style="width: 90%"></div></div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between items-end text-sm font-bold">
                                <span>54.2%</span>
                                <span class="text-slate-500 tracking-widest">FG%</span>
                                <span>52.8%</span>
                            </div>
                            <div class="flex gap-2 h-1.5">
                                <div class="flex-1 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-primary" style="width: 95%"></div></div>
                                <div class="flex-1 bg-slate-800 rounded-full overflow-hidden flex justify-end"><div class="h-full bg-slate-400" style="width: 88%"></div></div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between items-end text-sm font-bold">
                                <span>7.3</span>
                                <span class="text-slate-500 tracking-widest">APG</span>
                                <span>5.0</span>
                            </div>
                            <div class="flex gap-2 h-1.5">
                                <div class="flex-1 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-primary" style="width: 78%"></div></div>
                                <div class="flex-1 bg-slate-800 rounded-full overflow-hidden flex justify-end"><div class="h-full bg-slate-400" style="width: 55%"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="space-y-3">
                <h3 class="h2h-section-title">Averages</h3>
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="relative">
                        <select id="h2h-season-select" aria-label="Select season" class="appearance-none bg-slate-100 dark:bg-slate-800 pl-8 pr-8 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:ring-primary cursor-pointer">
                            <option>2023-24 Season</option>
                            <option>2022-23 Season</option>
                            <option>2021-22 Season</option>
                        </select>
                        <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none">calendar_today</span>
                        <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-60">expand_more</span>
                    </div>

                    <div class="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                        <button id="h2h-stats-tab" class="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-sm" type="button">Stats</button>
                        <button id="h2h-diff-tab" class="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-60" type="button">Differentials</button>
                    </div>
                </div>

                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div id="h2h-averages-scroll" class="overflow-x-auto h2h-show-scrollbar">
                        <div id="h2h-averages-wrap" class="min-w-[1200px]"></div>
                    </div>
                </div>
            </section>

            <section class="space-y-3">
                <div class="flex items-center justify-between">
                    <h3 class="h2h-section-title flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-base">history</span>
                        Versus-Game Log
                    </h3>
                    <div class="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                        <button data-game-tab="L10" class="h2h-game-tab px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-sm" type="button">L10</button>
                        <button data-game-tab="Playoffs" class="h2h-game-tab px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-60" type="button">Playoffs</button>
                        <button data-game-tab="All-Time" class="h2h-game-tab px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-60" type="button">All-Time</button>
                    </div>
                </div>

                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800">
                        <div class="bg-white dark:bg-surface-dark">
                            <div id="h2h-gamelog-left-name" class="sticky top-0 z-40 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
                                Player A
                            </div>
                            <div id="h2h-gamelog-left-scroll" class="overflow-x-auto h2h-split-scroll-lock">
                                <div id="h2h-gamelog-left-wrap"></div>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-surface-dark">
                            <div id="h2h-gamelog-right-name" class="sticky top-0 z-40 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
                                Player B
                            </div>
                            <div id="h2h-gamelog-right-scroll" class="overflow-x-auto h2h-split-scroll-lock">
                                <div id="h2h-gamelog-right-wrap"></div>
                            </div>
                        </div>
                    </div>
                    <div id="h2h-gamelog-sync" class="overflow-x-auto h2h-show-scrollbar border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div id="h2h-gamelog-sync-width" class="h-3"></div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button id="h2h-show-games" class="text-primary hover:underline text-xs font-bold flex items-center gap-1" type="button">
                        Show All Games
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </section>

            <section class="space-y-3">
                <h3 class="h2h-section-title flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-primary">filter_list</span>
                    Contextual Analysis
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all cursor-pointer">
                        <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined">home</span></div>
                        <h4 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">Home vs Away</h4>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Compare performance splits based on venue location and crowd impact.</p>
                    </div>
                    <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all cursor-pointer">
                        <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined">trending_up</span></div>
                        <h4 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">Vs Teams Above .500</h4>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Evaluate clutch performance against elite-level competition.</p>
                    </div>
                    <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all cursor-pointer">
                        <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined">hotel</span></div>
                        <h4 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">Rest Days</h4>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Analysis of production on back-to-backs vs multi-day breaks.</p>
                    </div>
                </div>
            </section>
        </div>
    `;

    const leagueSelect = document.getElementById('h2h-league-select');
    const leftPositionSelect = document.getElementById('h2h-left-position');
    const rightPositionSelect = document.getElementById('h2h-right-position');
    const leftPlayerInput = document.getElementById('h2h-left-player');
    const rightPlayerInput = document.getElementById('h2h-right-player');
    const compareButton = document.getElementById('h2h-compare-btn');
    const feedback = document.getElementById('h2h-feedback');
    const leftHeroName = document.getElementById('h2h-left-hero-name');
    const leftHeroMeta = document.getElementById('h2h-left-hero-meta');
    const rightHeroName = document.getElementById('h2h-right-hero-name');
    const rightHeroMeta = document.getElementById('h2h-right-hero-meta');
    const seasonSelect = document.getElementById('h2h-season-select');
    const statsTab = document.getElementById('h2h-stats-tab');
    const diffTab = document.getElementById('h2h-diff-tab');
    const averagesWrap = document.getElementById('h2h-averages-wrap');
    const gameLogLeftWrap = document.getElementById('h2h-gamelog-left-wrap');
    const gameLogRightWrap = document.getElementById('h2h-gamelog-right-wrap');
    const gameLogLeftName = document.getElementById('h2h-gamelog-left-name');
    const gameLogRightName = document.getElementById('h2h-gamelog-right-name');
    const gameLogLeftScroll = document.getElementById('h2h-gamelog-left-scroll');
    const gameLogRightScroll = document.getElementById('h2h-gamelog-right-scroll');
    const gameLogSyncScroll = document.getElementById('h2h-gamelog-sync');
    const gameLogSyncWidth = document.getElementById('h2h-gamelog-sync-width');
    const showGamesButton = document.getElementById('h2h-show-games');
    let gameLogMaxScroll = 0;

    const setFeedback = (message = '') => {
        if (!feedback) return;
        if (!message) {
            feedback.textContent = '';
            feedback.classList.add('hidden');
            return;
        }
        feedback.textContent = message;
        feedback.classList.remove('hidden');
    };

    const normalizeNFLGroup = (position) => {
        if (position === 'Quarterback') return 'QB';
        if (position === 'Running Back') return 'RB';
        if (position === 'Wide Receiver' || position === 'Tight End') return 'WRTE';
        if (position === 'Defensive Line' || position === 'Linebacker') return 'DLLB';
        if (position === 'Cornerback' || position === 'Safety') return 'CBS';
        return 'QB';
    };

    const normalizeMLBGroup = (position) => {
        return position === 'Pitcher' ? 'PITCHER' : 'HITTER';
    };

    const getDynamicSchema = () => {
        if (state.league === 'NBA') return nbaSchema;
        if (state.league === 'NFL') return nflSchema[normalizeNFLGroup(state.leftPosition)] || nflSchema.QB;
        return mlbSchema[normalizeMLBGroup(state.leftPosition)] || mlbSchema.HITTER;
    };

    const createSeed = (text) => {
        return String(text).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    };

    const formatRank = (index) => {
        const rank = (index % 75) + 1;
        return `RK${String(rank).padStart(2, '0')}`;
    };

    const generateValueForStat = (label, seed) => {
        const pctLike = label.includes('%') || ['AVG', 'OBP', 'SLG', 'OPS', 'WHIP', 'ERA', 'Y/A', 'Passer Rating', 'YPC', 'TD%', 'INT%'].includes(label);
        const timeLike = label === 'MP' || label === 'Min';
        const counterLike = ['INT', 'Sacks', 'Drops', 'Forced Fumbles', 'Pat downs', 'Trp-Dbl', '2Dbl', 'W', 'L', 'HR', 'SO', 'BB', 'SB', 'GS', 'G', 'GP'].includes(label);

        if (timeLike) {
            const mins = 24 + (seed % 18);
            const secs = String(seed % 60).padStart(2, '0');
            return `${mins}:${secs}`;
        }

        if (pctLike) {
            if (['AVG', 'OBP', 'SLG', 'OPS', 'WHIP', 'ERA'].includes(label)) {
                const value = ((seed % 180) / 100) + 0.2;
                return value.toFixed(3);
            }
            const value = 20 + (seed % 61) + ((seed % 10) / 10);
            return `${value.toFixed(1)}%`;
        }

        if (counterLike) {
            return String(1 + (seed % 18));
        }

        const value = 5 + (seed % 35) + ((seed % 10) / 10);
        return value.toFixed(1);
    };

    const getPositionOptions = (league) => leaguePositions[league] || [];

    const syncRightPositionForNFL = () => {
        if (state.league !== 'NFL') {
            rightPositionSelect.disabled = false;
            rightPositionSelect.classList.remove('opacity-70', 'cursor-not-allowed');
            return;
        }

        state.rightPosition = state.leftPosition;
        rightPositionSelect.value = state.leftPosition;
        rightPositionSelect.disabled = true;
        rightPositionSelect.classList.add('opacity-70', 'cursor-not-allowed');
    };

    const renderPositionSelects = () => {
        const positions = getPositionOptions(state.league);
        const optionsMarkup = ['<option value="">Position</option>', ...positions.map((position) => `<option value="${position}">${position}</option>`)].join('');
        leftPositionSelect.innerHTML = optionsMarkup;
        rightPositionSelect.innerHTML = optionsMarkup;

        state.leftPosition = positions[0] || '';
        state.rightPosition = positions[1] || positions[0] || '';

        leftPositionSelect.value = state.leftPosition;
        rightPositionSelect.value = state.rightPosition;
        syncRightPositionForNFL();
    };

    const updateHeroMeta = () => {
        leftHeroName.textContent = leftPlayerInput.value.trim() || 'Player A';
        rightHeroName.textContent = rightPlayerInput.value.trim() || 'Player B';
        leftHeroMeta.textContent = `${state.league} | ${state.leftPosition || 'POSITION'}`;
        rightHeroMeta.textContent = `${state.league} | ${state.rightPosition || 'POSITION'}`;
    };

    const renderAveragesTable = () => {
        const columns = getDynamicSchema();
        const players = [
            { name: leftPlayerInput.value.trim() || 'Player A', side: 'left' },
            { name: rightPlayerInput.value.trim() || 'Player B', side: 'right' }
        ];

        const colWidth = 96;
        const minWidth = Math.max(1200, 240 + (columns.length * colWidth));

        averagesWrap.style.minWidth = `${minWidth}px`;
        averagesWrap.innerHTML = `
            <table class="h2h-table w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th class="px-4 py-3 sticky left-0 bg-slate-50 dark:bg-slate-800/50 z-10">Player</th>
                        ${columns.map((label, index) => `<th class="px-3 py-3 ${index % 2 === 0 ? 'h2h-col-highlight' : ''}">${label}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                    ${players.map((player, rowIndex) => `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td class="px-4 py-3 sticky left-0 bg-white dark:bg-surface-dark z-10"><span class="font-bold text-slate-900 dark:text-white">${player.name}</span></td>
                            ${columns.map((label, colIndex) => {
                                const seed = createSeed(`${player.side}-${label}-${colIndex}-${rowIndex}-${state.league}-${state.leftPosition}-${state.rightPosition}`);
                                const value = generateValueForStat(label, seed);
                                return `<td class="px-3 py-3 font-mono ${colIndex % 2 === 0 ? 'h2h-col-highlight' : ''}">${value} <span class="text-[10px] text-slate-500 font-bold ml-1">${formatRank(seed)}</span></td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    const buildGameRows = (side) => {
        const columns = getDynamicSchema();
        const games = Array.from({ length: 14 }, (_, index) => {
            const gameNumber = index + 1;
            const day = String(28 - (index % 20)).padStart(2, '0');
            const month = String(((index % 6) + 1)).padStart(2, '0');
            const isHome = index % 2 === 0;
            const opponent = state.league === 'NBA' ? 'PHX' : state.league === 'NFL' ? 'BUF' : 'NYY';
            const seedBase = createSeed(`${side}-${state.league}-${state.leftPosition}-${state.rightPosition}-${gameNumber}`);

            return {
                Date: `${month}/${day}/24`,
                Team: `${isHome ? 'vs' : '@'} ${opponent}`,
                'H/A': isHome ? 'Home' : 'Away',
                GS: '1',
                Min: `${28 + (seedBase % 13)}:${String(seedBase % 60).padStart(2, '0')}`,
                dynamic: columns.reduce((acc, label, idx) => {
                    acc[label] = generateValueForStat(label, seedBase + idx + 11);
                    return acc;
                }, {})
            };
        });

        return state.showAllGames ? games : games.slice(0, 5);
    };

    const renderSingleGameTable = (title, rows, playerName, winsText, sideLabel, tableMinWidth) => {
        const dynamicColumns = getDynamicSchema();
        const baseColumns = ['Date', 'Team', 'H/A', 'GS', 'Min'];
        const finalDynamicColumns = dynamicColumns.filter((label) => !baseColumns.includes(label));
        const dateWidth = 108;
        const teamWidth = 124;

        const getHeaderClass = (label, index) => {
            if (label === 'Date') {
                return 'px-2 py-2 sticky left-0 z-30 bg-slate-50 dark:bg-slate-800/95 shadow-[2px_0_0_rgba(148,163,184,0.2)]';
            }
            if (label === 'Team') {
                return `px-2 py-2 sticky z-20 bg-slate-50 dark:bg-slate-800/95 shadow-[2px_0_0_rgba(148,163,184,0.2)]`;
            }
            return `px-2 py-2 ${index % 2 === 1 ? 'h2h-col-highlight' : ''}`;
        };

        const getCellClass = (label, index) => {
            if (label === 'Date') {
                return 'px-2 py-2 font-mono sticky left-0 z-20 bg-white dark:bg-surface-dark shadow-[2px_0_0_rgba(148,163,184,0.2)]';
            }
            if (label === 'Team') {
                return 'px-2 py-2 font-mono sticky z-10 bg-white dark:bg-surface-dark shadow-[2px_0_0_rgba(148,163,184,0.2)]';
            }
            return `px-2 py-2 font-mono ${index % 2 === 1 ? 'h2h-col-highlight' : ''}`;
        };

        return `
            <div class="p-4 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 last:border-r-0">
                <div class="mb-3 text-xs font-bold uppercase tracking-widest ${sideLabel === 'left' ? 'text-primary' : 'text-slate-400'} flex items-center justify-between">
                    <span>${title}</span>
                    <span class="${sideLabel === 'left' ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-800'} px-2 py-0.5 rounded">${winsText}</span>
                </div>
                <table class="h2h-table w-full text-[11px] text-left border-collapse" style="min-width:${tableMinWidth}px;">
                    <thead>
                        <tr class="border-b border-slate-200 dark:border-slate-800">
                            ${baseColumns.map((label, idx) => {
                                const style = label === 'Date'
                                    ? `style="min-width:${dateWidth}px;width:${dateWidth}px;left:0;"`
                                    : label === 'Team'
                                        ? `style="min-width:${teamWidth}px;width:${teamWidth}px;left:${dateWidth}px;"`
                                        : '';
                                return `<th ${style} class="${getHeaderClass(label, idx)}">${label}</th>`;
                            }).join('')}
                            ${finalDynamicColumns.map((label, idx) => `<th class="px-2 py-2 ${(idx + baseColumns.length) % 2 === 1 ? 'h2h-col-highlight' : ''}">${label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${rows.map((row) => `
                            <tr>
                                ${baseColumns.map((label, idx) => {
                                    const style = label === 'Date'
                                        ? `style="min-width:${dateWidth}px;width:${dateWidth}px;left:0;"`
                                        : label === 'Team'
                                            ? `style="min-width:${teamWidth}px;width:${teamWidth}px;left:${dateWidth}px;"`
                                            : '';
                                    return `<td ${style} class="${getCellClass(label, idx)}">${row[label]}</td>`;
                                }).join('')}
                                ${finalDynamicColumns.map((label, idx) => `<td class="px-2 py-2 font-mono ${((idx + baseColumns.length) % 2) === 1 ? 'h2h-col-highlight' : ''}">${row.dynamic[label]}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    const renderGameLogTables = () => {
        const leftName = leftPlayerInput.value.trim() || 'Player A';
        const rightName = rightPlayerInput.value.trim() || 'Player B';
        const leftRows = buildGameRows('left');
        const rightRows = buildGameRows('right');
        const dynamicColumns = getDynamicSchema();
        const finalDynamicColumns = dynamicColumns.filter((label) => !['Date', 'Team', 'H/A', 'GS', 'Min'].includes(label));
        const minWidth = Math.max(1180, 108 + 124 + (3 * 92) + (finalDynamicColumns.length * 108));

        gameLogLeftName.textContent = leftName;
        gameLogRightName.textContent = rightName;

        gameLogLeftWrap.innerHTML = renderSingleGameTable(`${leftName} Stats`, leftRows, leftName, '6-4 in L10', 'left', minWidth);
        gameLogRightWrap.innerHTML = renderSingleGameTable(`${rightName} Stats`, rightRows, rightName, '4-6 in L10', 'right', minWidth);
        const moreGamesAvailable = 14 > 5;
        if (!moreGamesAvailable) {
            showGamesButton.classList.add('hidden');
        } else {
            showGamesButton.classList.remove('hidden');
            showGamesButton.innerHTML = state.showAllGames
                ? 'Show Fewer Games <span class="material-symbols-outlined text-sm">expand_less</span>'
                : 'Show All Games <span class="material-symbols-outlined text-sm">chevron_right</span>';
        }

        refreshGameLogSyncMetrics();
        requestAnimationFrame(refreshGameLogSyncMetrics);
    };

    const refreshGameLogSyncMetrics = () => {
        if (!gameLogLeftScroll || !gameLogRightScroll || !gameLogSyncScroll || !gameLogSyncWidth) return;

        const maxLeft = Math.max(0, gameLogLeftScroll.scrollWidth - gameLogLeftScroll.clientWidth);
        const maxRight = Math.max(0, gameLogRightScroll.scrollWidth - gameLogRightScroll.clientWidth);
        gameLogMaxScroll = Math.max(maxLeft, maxRight);

        const syncClientWidth = gameLogSyncScroll.clientWidth;
        const syncTrackWidth = Math.max(syncClientWidth + gameLogMaxScroll, syncClientWidth + 1);
        gameLogSyncWidth.style.width = `${syncTrackWidth}px`;

        const syncedBar = Math.max(0, Math.min(gameLogSyncScroll.scrollLeft, gameLogMaxScroll));
        gameLogSyncScroll.scrollLeft = syncedBar;
        const syncedLeft = Math.max(0, Math.min(syncedBar, maxLeft));
        const syncedRight = Math.max(0, Math.min(syncedBar, maxRight));
        gameLogLeftScroll.scrollLeft = syncedLeft;
        gameLogRightScroll.scrollLeft = syncedRight;
    };

    const setupGameLogScrollSync = () => {
        const syncFromBottomBar = () => {
            const desired = Math.max(0, Math.min(gameLogSyncScroll.scrollLeft, gameLogMaxScroll));
            if (desired !== gameLogSyncScroll.scrollLeft) {
                gameLogSyncScroll.scrollLeft = desired;
            }

            const leftMax = Math.max(0, gameLogLeftScroll.scrollWidth - gameLogLeftScroll.clientWidth);
            const rightMax = Math.max(0, gameLogRightScroll.scrollWidth - gameLogRightScroll.clientWidth);
            gameLogLeftScroll.scrollLeft = Math.min(desired, leftMax);
            gameLogRightScroll.scrollLeft = Math.min(desired, rightMax);
        };

        const blockHorizontalInput = (event) => {
            if (Math.abs(event.deltaX) > 0 || event.shiftKey) {
                event.preventDefault();
            }
        };

        gameLogLeftScroll.addEventListener('wheel', blockHorizontalInput, { passive: false });
        gameLogRightScroll.addEventListener('wheel', blockHorizontalInput, { passive: false });
        gameLogSyncScroll.addEventListener('scroll', syncFromBottomBar);
    };

    const updateGameTabs = () => {
        document.querySelectorAll('.h2h-game-tab').forEach((button) => {
            const isActive = button.dataset.gameTab === state.gameTab;
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('opacity-60', !isActive);
        });
    };

    const updateStatTabs = () => {
        const statsActive = state.statView === 'stats';
        statsTab.classList.toggle('bg-primary', statsActive);
        statsTab.classList.toggle('text-white', statsActive);
        statsTab.classList.toggle('shadow-sm', statsActive);
        statsTab.classList.toggle('opacity-60', !statsActive);

        diffTab.classList.toggle('bg-primary', !statsActive);
        diffTab.classList.toggle('text-white', !statsActive);
        diffTab.classList.toggle('shadow-sm', !statsActive);
        diffTab.classList.toggle('opacity-60', statsActive);
    };

    const validateNFLPositionRule = () => {
        if (state.league !== 'NFL') return true;
        const valid = state.leftPosition === state.rightPosition;
        if (!valid) {
            setFeedback('NFL comparisons require both players to use the same position.');
            return false;
        }
        return true;
    };

    const rerenderTables = () => {
        renderAveragesTable();
        renderGameLogTables();
        updateHeroMeta();
        updateStatTabs();
        updateGameTabs();
    };

    renderPositionSelects();
    updateHeroMeta();
    renderAveragesTable();
    renderGameLogTables();
    updateStatTabs();
    updateGameTabs();
    setupGameLogScrollSync();

    leagueSelect.addEventListener('change', (event) => {
        state.league = event.target.value;
        state.showAllGames = false;
        setFeedback('');
        renderPositionSelects();
        rerenderTables();
    });

    leftPositionSelect.addEventListener('change', (event) => {
        state.leftPosition = event.target.value;
        if (state.league === 'NFL') {
            state.rightPosition = state.leftPosition;
            rightPositionSelect.value = state.leftPosition;
        }
        setFeedback('');
        rerenderTables();
    });

    rightPositionSelect.addEventListener('change', (event) => {
        state.rightPosition = event.target.value;
        if (state.league === 'NFL' && state.rightPosition !== state.leftPosition) {
            state.rightPosition = state.leftPosition;
            rightPositionSelect.value = state.leftPosition;
            setFeedback('NFL comparisons require matching positions. Right position was synced to the left.');
        } else {
            setFeedback('');
        }
        rerenderTables();
    });

    leftPlayerInput.addEventListener('input', () => {
        updateHeroMeta();
        rerenderTables();
    });

    rightPlayerInput.addEventListener('input', () => {
        updateHeroMeta();
        rerenderTables();
    });

    compareButton.addEventListener('click', () => {
        if (!validateNFLPositionRule()) return;
        setFeedback('');
        rerenderTables();
    });

    seasonSelect.addEventListener('change', () => {
        state.season = seasonSelect.value;
        rerenderTables();
    });

    statsTab.addEventListener('click', () => {
        state.statView = 'stats';
        setFeedback('');
        rerenderTables();
    });

    diffTab.addEventListener('click', () => {
        state.statView = 'differentials';
        setFeedback('');
        rerenderTables();
    });

    document.querySelectorAll('.h2h-game-tab').forEach((button) => {
        button.addEventListener('click', () => {
            state.gameTab = button.dataset.gameTab;
            setFeedback('');
            rerenderTables();
        });
    });

    showGamesButton.addEventListener('click', () => {
        state.showAllGames = !state.showAllGames;
        rerenderTables();
    });
}

window.renderHeadToHeadPage = renderHeadToHeadPage;
