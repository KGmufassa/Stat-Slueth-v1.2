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
        leftMode: 'player',
        rightMode: 'player',
        gameTab: 'L10',
        showAllGames: false,
        showAllHeroStats: false,
        contextExpanded: {
            accolades: false,
            homeAway: false,
            restDays: false
        }
    };

    const positionAbbrev = {
        'Point Guard': 'PG',
        'Shooting Guard': 'SG',
        'Small Forward': 'SF',
        'Power Forward': 'PF',
        'Center': 'C',
        'Quarterback': 'QB',
        'Running Back': 'RB',
        'Wide Receiver': 'WR',
        'Tight End': 'TE',
        'Defensive Line': 'DL',
        'Linebacker': 'LB',
        'Cornerback': 'CB',
        'Safety': 'S',
        'Pitcher': 'P',
        'Catcher': 'C',
        'First Base': '1B',
        'Second Base': '2B',
        'Third Base': '3B',
        'Shortstop': 'SS',
        'Left Field': 'LF',
        'Center Field': 'CF',
        'Right Field': 'RF',
        'Designated Hitter': 'DH'
    };

    const leagueTaxonomy = {
        NBA: {
            division: ['Atlantic', 'Central', 'Southeast', 'Northwest', 'Pacific', 'Southwest'],
            conference: ['Eastern', 'Western']
        },
        NFL: {
            division: ['AFC East', 'AFC North', 'AFC South', 'AFC West', 'NFC East', 'NFC North', 'NFC South', 'NFC West'],
            conference: ['AFC', 'NFC']
        },
        MLB: {
            league: ['American', 'National']
        }
    };

    const searchDirectory = {
        NBA: {
            player: [
                { name: 'LeBron James', position: 'Small Forward' },
                { name: 'Kevin Durant', position: 'Power Forward' },
                { name: 'Stephen Curry', position: 'Point Guard' },
                { name: 'Jayson Tatum', position: 'Small Forward' },
                { name: 'Nikola Jokic', position: 'Center' },
                { name: 'Luka Doncic', position: 'Point Guard' },
                { name: 'Anthony Davis', position: 'Power Forward' },
                { name: 'Devin Booker', position: 'Shooting Guard' }
            ],
            team: [
                { name: 'Los Angeles Lakers' },
                { name: 'Phoenix Suns' },
                { name: 'Boston Celtics' },
                { name: 'Denver Nuggets' },
                { name: 'Golden State Warriors' },
                { name: 'Dallas Mavericks' }
            ]
        },
        NFL: {
            player: [
                { name: 'Patrick Mahomes', position: 'Quarterback' },
                { name: 'Josh Allen', position: 'Quarterback' },
                { name: 'Christian McCaffrey', position: 'Running Back' },
                { name: 'Tyreek Hill', position: 'Wide Receiver' },
                { name: 'Travis Kelce', position: 'Tight End' },
                { name: 'Micah Parsons', position: 'Linebacker' },
                { name: 'Myles Garrett', position: 'Defensive Line' },
                { name: 'Sauce Gardner', position: 'Cornerback' }
            ],
            team: [
                { name: 'Kansas City Chiefs' },
                { name: 'Buffalo Bills' },
                { name: 'San Francisco 49ers' },
                { name: 'Baltimore Ravens' },
                { name: 'Dallas Cowboys' },
                { name: 'Miami Dolphins' }
            ]
        },
        MLB: {
            player: [
                { name: 'Shohei Ohtani', position: 'Pitcher' },
                { name: 'Mookie Betts', position: 'Right Field' },
                { name: 'Aaron Judge', position: 'Right Field' },
                { name: 'Freddie Freeman', position: 'First Base' },
                { name: 'Ronald Acuna Jr.', position: 'Right Field' },
                { name: 'Gerrit Cole', position: 'Pitcher' },
                { name: 'Francisco Lindor', position: 'Shortstop' }
            ],
            team: [
                { name: 'Los Angeles Dodgers' },
                { name: 'New York Yankees' },
                { name: 'Atlanta Braves' },
                { name: 'Houston Astros' },
                { name: 'Philadelphia Phillies' },
                { name: 'San Diego Padres' }
            ]
        }
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
            <section class="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <label for="h2h-league-select" class="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">League</label>
                    <select id="h2h-league-select" aria-label="Select league" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-36 focus:ring-primary">
                        <option value="NBA" selected>NBA</option>
                        <option value="NFL">NFL</option>
                        <option value="MLB">MLB</option>
                    </select>
                    <p class="text-[10px] font-semibold text-slate-500 mt-1">League selection controls all search options below.</p>
                </div>
            </section>

            <section class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div class="flex flex-col lg:flex-row gap-6 items-end">
                    <div class="flex-1 space-y-3">
                        <div class="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit" role="tablist" aria-label="Left compare mode">
                            <button id="h2h-left-mode-player" data-side="left" data-mode="player" aria-selected="true" class="h2h-mode-tab px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold shadow-sm" role="tab" type="button">Player</button>
                            <button id="h2h-left-mode-team" data-side="left" data-mode="team" aria-selected="false" class="h2h-mode-tab px-3 py-1 text-xs font-medium opacity-60" role="tab" type="button">Team</button>
                        </div>
                        <div class="flex gap-2">
                            <div class="relative w-44">
                                <button id="h2h-left-position-trigger" aria-haspopup="listbox" aria-expanded="false" type="button" class="h2h-position-trigger bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full focus:ring-primary h-10 px-3 flex items-center justify-between">
                                    <span id="h2h-left-position-label">Position</span>
                                    <span class="material-symbols-outlined text-base opacity-60">expand_more</span>
                                </button>
                                <div id="h2h-left-position-dropdown" role="listbox" class="absolute top-full mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-30 hidden max-h-64 overflow-y-auto"></div>
                            </div>
                            <div class="relative w-full">
                                <input id="h2h-left-player" aria-label="Search Player A" aria-expanded="false" aria-controls="h2h-left-search-dropdown" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full focus:ring-primary" placeholder="Search Player A..." type="text" value="" />
                                <div id="h2h-left-search-dropdown" role="listbox" class="absolute top-full mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-30 hidden max-h-64 overflow-y-auto"></div>
                            </div>
                        </div>
                    </div>

                    <div class="hidden lg:flex items-center justify-center py-2 px-2">
                        <span class="text-xl font-black text-slate-300 dark:text-slate-600 italic">VS</span>
                    </div>

                    <div class="flex-1 space-y-3">
                        <div class="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit" role="tablist" aria-label="Right compare mode">
                            <button id="h2h-right-mode-player" data-side="right" data-mode="player" aria-selected="true" class="h2h-mode-tab px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold shadow-sm" role="tab" type="button">Player</button>
                            <button id="h2h-right-mode-team" data-side="right" data-mode="team" aria-selected="false" class="h2h-mode-tab px-3 py-1 text-xs font-medium opacity-60" role="tab" type="button">Team</button>
                            <button id="h2h-right-mode-division" data-side="right" data-mode="division" aria-selected="false" class="h2h-mode-tab px-3 py-1 text-xs font-medium opacity-60" role="tab" type="button">Division</button>
                            <button id="h2h-right-mode-conference" data-side="right" data-mode="conference" aria-selected="false" class="h2h-mode-tab px-3 py-1 text-xs font-medium opacity-60" role="tab" type="button">Conference</button>
                            <button id="h2h-right-mode-league" data-side="right" data-mode="league" aria-selected="false" class="h2h-mode-tab px-3 py-1 text-xs font-medium opacity-60 hidden" role="tab" type="button">League</button>
                        </div>
                        <div class="flex gap-2">
                            <div class="relative w-44">
                                <button id="h2h-right-position-trigger" aria-haspopup="listbox" aria-expanded="false" type="button" class="h2h-position-trigger bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full focus:ring-primary h-10 px-3 flex items-center justify-between">
                                    <span id="h2h-right-position-label">Position</span>
                                    <span class="material-symbols-outlined text-base opacity-60">expand_more</span>
                                </button>
                                <div id="h2h-right-position-dropdown" role="listbox" class="absolute top-full mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-30 hidden max-h-64 overflow-y-auto"></div>
                            </div>
                            <div class="relative w-full">
                                <input id="h2h-right-player" aria-label="Search Player B" aria-expanded="false" aria-controls="h2h-right-search-dropdown" class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full focus:ring-primary" placeholder="Search Player B..." type="text" value="" />
                                <div id="h2h-right-search-dropdown" role="listbox" class="absolute top-full mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-30 hidden max-h-64 overflow-y-auto"></div>
                            </div>
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
                    <div id="h2h-hero-layout"></div>
                </div>
                <div class="flex justify-end">
                    <button id="h2h-hero-show-all" type="button" class="text-primary text-xs font-bold uppercase tracking-wider hover:underline">Show All</button>
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
                    <div class="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <h4 class="text-base font-bold text-slate-900 dark:text-white">Accolades</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Career-level achievements and honors.</p>
                            </div>
                            <button type="button" data-context-card="accolades" class="h2h-context-toggle text-primary text-[10px] font-bold uppercase tracking-wider">Show More</button>
                        </div>
                        <div id="h2h-context-accolades" class="hidden mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            <p>- 4x Championship appearances</p>
                            <p>- 12x All-League selections</p>
                            <p>- 6x All-Star starter</p>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <h4 class="text-base font-bold text-slate-900 dark:text-white">Home vs Away</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Split production by venue context.</p>
                            </div>
                            <button type="button" data-context-card="homeAway" class="h2h-context-toggle text-primary text-[10px] font-bold uppercase tracking-wider">Show More</button>
                        </div>
                        <div id="h2h-context-homeAway" class="hidden mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            <p>- Home: stronger efficiency and pace control</p>
                            <p>- Away: lower turnover margin, steadier rebounding</p>
                            <p>- Late game execution improves at home</p>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <h4 class="text-base font-bold text-slate-900 dark:text-white">Rest Days</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Production shifts with recovery windows.</p>
                            </div>
                            <button type="button" data-context-card="restDays" class="h2h-context-toggle text-primary text-[10px] font-bold uppercase tracking-wider">Show More</button>
                        </div>
                        <div id="h2h-context-restDays" class="hidden mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            <p>- 0 rest: lower efficiency and reduced usage</p>
                            <p>- 1 rest: balanced playmaking and shot quality</p>
                            <p>- 2+ rest: stronger defensive impact metrics</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;

    const leagueSelect = document.getElementById('h2h-league-select');
    const leftPositionTrigger = document.getElementById('h2h-left-position-trigger');
    const rightPositionTrigger = document.getElementById('h2h-right-position-trigger');
    const leftPositionLabel = document.getElementById('h2h-left-position-label');
    const rightPositionLabel = document.getElementById('h2h-right-position-label');
    const leftPositionDropdown = document.getElementById('h2h-left-position-dropdown');
    const rightPositionDropdown = document.getElementById('h2h-right-position-dropdown');
    const leftPlayerInput = document.getElementById('h2h-left-player');
    const rightPlayerInput = document.getElementById('h2h-right-player');
    const leftSearchDropdown = document.getElementById('h2h-left-search-dropdown');
    const rightSearchDropdown = document.getElementById('h2h-right-search-dropdown');
    const compareButton = document.getElementById('h2h-compare-btn');
    const feedback = document.getElementById('h2h-feedback');
    const heroLayout = document.getElementById('h2h-hero-layout');
    const heroShowAllButton = document.getElementById('h2h-hero-show-all');
    const seasonSelect = document.getElementById('h2h-season-select');
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
    const contextToggleButtons = Array.from(document.querySelectorAll('.h2h-context-toggle'));
    const modeTabs = Array.from(document.querySelectorAll('.h2h-mode-tab'));
    let gameLogMaxScroll = 0;
    let leftSearchResults = [];
    let rightSearchResults = [];
    let leftHighlightedIndex = -1;
    let rightHighlightedIndex = -1;

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

    const getHeroStatLabels = () => {
        if (state.league === 'NBA') return ['W/L%', 'PPG', 'REB', 'AST', 'STL', 'BLK', 'FG%', 'FT%'];
        if (state.league === 'NFL') return ['W/L%', 'Pass Yds', 'Pass TD', 'Rush Yds', 'Comp %', 'INT', 'Sacks', 'Passer Rating'];
        return ['W/L%', 'AVG', 'RBI', 'HR', 'OBP', 'SLG', 'OPS', 'SB'];
    };

    const getDefaultHeroStatLabels = () => ['W/L%', 'PPG', 'REB', 'AST'];

    const getDisplayPositionLabel = (position) => {
        return positionAbbrev[position] || position || 'Position';
    };

    const getRightAllowedModes = () => {
        const baseModes = state.league === 'MLB'
            ? ['player', 'team', 'league']
            : ['player', 'team', 'division', 'conference'];
        if (state.leftMode === 'team') {
            return baseModes.filter((mode) => mode !== 'player');
        }
        return baseModes;
    };

    const getFallbackRightMode = () => {
        if (state.leftMode === 'team') return 'team';
        return state.league === 'MLB' ? 'league' : 'team';
    };

    const getSideLabel = (side) => {
        const mode = side === 'left' ? state.leftMode : state.rightMode;
        if (mode === 'player') return side === 'left' ? 'Player A' : 'Player B';
        if (mode === 'team') return side === 'left' ? 'Team A' : 'Team B';
        if (mode === 'division') return 'Division';
        if (mode === 'conference') return 'Conference';
        if (mode === 'league') return 'League';
        return side === 'left' ? 'Side A' : 'Side B';
    };

    const getComparisonContext = () => {
        const leftMode = state.leftMode;
        const rightMode = state.rightMode;
        const leftName = leftPlayerInput.value.trim();
        const rightName = rightPlayerInput.value.trim();
        const leftIsPlayer = leftMode === 'player';
        const rightIsPlayer = rightMode === 'player';

        if (leftIsPlayer && rightIsPlayer) {
            return {
                type: 'player-vs-player',
                ready: Boolean(leftName && rightName),
                leftName,
                rightName
            };
        }

        if (leftMode === 'team' && rightMode === 'team') {
            return {
                type: 'team-vs-team',
                ready: Boolean(leftName && rightName),
                leftName,
                rightName
            };
        }

        if (leftIsPlayer !== rightIsPlayer) {
            const playerSide = leftIsPlayer ? 'left' : 'right';
            const groupSide = playerSide === 'left' ? 'right' : 'left';
            const groupMode = groupSide === 'left' ? leftMode : rightMode;
            const playerName = playerSide === 'left' ? leftName : rightName;
            const groupName = groupSide === 'left' ? leftName : rightName;
            return {
                type: 'player-vs-group',
                ready: Boolean(playerName && groupName),
                playerSide,
                groupSide,
                groupMode,
                playerName,
                groupName,
                leftName,
                rightName
            };
        }

        return {
            type: 'unsupported',
            ready: false,
            leftName,
            rightName
        };
    };

    const isComparisonReady = () => getComparisonContext().ready;

    const getGroupDescriptor = (context) => {
        if (!context || context.type !== 'player-vs-group') return '';
        const label = context.groupMode === 'team'
            ? 'team'
            : context.groupMode === 'division'
                ? 'division'
                : context.groupMode === 'conference'
                    ? 'conference'
                    : 'league';
        return `${label}: ${context.groupName}`;
    };

    const abbreviateEntity = (name) => {
        const cleaned = String(name || '').trim();
        if (!cleaned) return 'OPP';
        const parts = cleaned.split(/\s+/).filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
        return parts.slice(0, 3).map((part) => part[0]).join('').toUpperCase();
    };

    const getDynamicSchema = () => {
        const schemaPosition = state.leftMode === 'player'
            ? state.leftPosition
            : state.rightMode === 'player'
                ? state.rightPosition
                : state.leftPosition;
        if (state.league === 'NBA') return nbaSchema;
        if (state.league === 'NFL') return nflSchema[normalizeNFLGroup(schemaPosition)] || nflSchema.QB;
        return mlbSchema[normalizeMLBGroup(schemaPosition)] || mlbSchema.HITTER;
    };

    const createSeed = (text) => {
        return String(text).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    };

    const formatRank = (index) => {
        const rank = (index % 75) + 1;
        return `RK${String(rank).padStart(2, '0')}`;
    };

    const parseRankValue = (rankText) => {
        const matched = String(rankText).match(/RK(\d{1,2})/i);
        return matched ? Number(matched[1]) : null;
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

    const getSearchEntries = (side) => {
        const sideMode = side === 'left' ? state.leftMode : state.rightMode;
        const sidePosition = side === 'left' ? state.leftPosition : state.rightPosition;
        if (sideMode === 'division' || sideMode === 'conference' || sideMode === 'league') {
            const values = leagueTaxonomy[state.league]?.[sideMode] || [];
            return values.map((name) => ({ name }));
        }
        const entries = searchDirectory[state.league]?.[sideMode] || [];
        if (sideMode !== 'player') return entries;
        return entries.filter((entry) => !entry.position || entry.position === sidePosition);
    };

    const closeSearchDropdown = (side) => {
        const dropdown = side === 'left' ? leftSearchDropdown : rightSearchDropdown;
        const input = side === 'left' ? leftPlayerInput : rightPlayerInput;
        if (!dropdown || !input) return;
        dropdown.classList.add('hidden');
        input.setAttribute('aria-expanded', 'false');
        if (side === 'left') {
            leftHighlightedIndex = -1;
        } else {
            rightHighlightedIndex = -1;
        }
    };

    const renderSearchDropdown = (side) => {
        const dropdown = side === 'left' ? leftSearchDropdown : rightSearchDropdown;
        const input = side === 'left' ? leftPlayerInput : rightPlayerInput;
        const results = side === 'left' ? leftSearchResults : rightSearchResults;
        const highlightedIndex = side === 'left' ? leftHighlightedIndex : rightHighlightedIndex;
        if (!dropdown || !input) return;

        dropdown.innerHTML = results.length
            ? results.map((entry, index) => {
                const isActive = index === highlightedIndex;
                return `
                    <button type="button" role="option" aria-selected="${isActive ? 'true' : 'false'}" data-side="${side}" data-value="${entry.name}" class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-primary/15 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'}">
                        <span class="font-semibold">${entry.name}</span>
                        ${entry.position ? `<span class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">${getDisplayPositionLabel(entry.position)}</span>` : ''}
                    </button>
                `;
            }).join('')
            : '<div class="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">No matches for this selection.</div>';

        dropdown.classList.remove('hidden');
        input.setAttribute('aria-expanded', 'true');
    };

    const filterSearchEntries = (side, query = '') => {
        const normalized = query.trim().toLowerCase();
        const baseEntries = getSearchEntries(side);
        const filtered = normalized
            ? baseEntries.filter((entry) => entry.name.toLowerCase().includes(normalized))
            : baseEntries;

        if (side === 'left') {
            leftSearchResults = filtered;
            leftHighlightedIndex = filtered.length ? 0 : -1;
        } else {
            rightSearchResults = filtered;
            rightHighlightedIndex = filtered.length ? 0 : -1;
        }

        renderSearchDropdown(side);
    };

    const applySearchSelection = (side, value) => {
        const input = side === 'left' ? leftPlayerInput : rightPlayerInput;
        if (!input) return;
        input.value = value;
        closeSearchDropdown(side);
        rerenderTables();
    };

    const closePositionDropdown = (side) => {
        const dropdown = side === 'left' ? leftPositionDropdown : rightPositionDropdown;
        const trigger = side === 'left' ? leftPositionTrigger : rightPositionTrigger;
        if (!dropdown || !trigger) return;
        dropdown.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
    };

    const closeAllPositionDropdowns = () => {
        closePositionDropdown('left');
        closePositionDropdown('right');
    };

    const setPositionTriggerState = (side, disabled) => {
        const trigger = side === 'left' ? leftPositionTrigger : rightPositionTrigger;
        if (!trigger) return;
        trigger.disabled = disabled;
        trigger.classList.toggle('opacity-70', disabled);
        trigger.classList.toggle('cursor-not-allowed', disabled);
    };

    const setPositionVisibility = (side, visible) => {
        const trigger = side === 'left' ? leftPositionTrigger : rightPositionTrigger;
        if (!trigger) return;
        const wrapper = trigger.parentElement;
        if (!wrapper) return;
        wrapper.classList.toggle('hidden', !visible);
    };

    const syncRightModeOptions = () => {
        const allowed = new Set(getRightAllowedModes());
        modeTabs.forEach((button) => {
            if (button.dataset.side !== 'right') return;
            button.classList.toggle('hidden', !allowed.has(button.dataset.mode));
        });

        const hadInvalidMode = !allowed.has(state.rightMode);
        if (!allowed.has(state.rightMode)) {
            state.rightMode = getFallbackRightMode();
        }
        if (hadInvalidMode) {
            rightPlayerInput.value = '';
        }
    };

    const renderPositionDropdown = (side) => {
        const dropdown = side === 'left' ? leftPositionDropdown : rightPositionDropdown;
        const currentPosition = side === 'left' ? state.leftPosition : state.rightPosition;
        const positions = getPositionOptions(state.league);
        if (!dropdown) return;

        dropdown.innerHTML = positions.map((position) => {
            const isActive = position === currentPosition;
            return `
                <button type="button" role="option" aria-selected="${isActive ? 'true' : 'false'}" data-side="${side}" data-position="${position}" class="w-full text-left px-3 py-2 text-sm transition-colors ${isActive ? 'bg-primary/15 text-slate-900 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'}">
                    ${getDisplayPositionLabel(position)}
                </button>
            `;
        }).join('');
    };

    const setSideMode = (side, mode) => {
        const previousMode = side === 'left' ? state.leftMode : state.rightMode;
        if (side === 'left') {
            state.leftMode = mode;
        } else {
            state.rightMode = mode;
        }
        const input = side === 'left' ? leftPlayerInput : rightPlayerInput;
        if (input) {
            input.placeholder = `Search ${getSideLabel(side)}...`;
        }
        const usesPosition = mode === 'player';
        setPositionVisibility(side, usesPosition);
        setPositionTriggerState(side, !usesPosition);
        if (!usesPosition) {
            closePositionDropdown(side);
        }
        if (previousMode !== mode && input) {
            input.value = '';
        }
        filterSearchEntries(side, input ? input.value : '');
        rerenderTables();
    };

    const updateModeTabs = () => {
        modeTabs.forEach((button) => {
            const side = button.dataset.side;
            const mode = button.dataset.mode;
            const activeMode = side === 'left' ? state.leftMode : state.rightMode;
            const isActive = mode === activeMode;
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('rounded-md', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('opacity-60', !isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    const syncRightPositionForNFL = () => {
        if (state.league !== 'NFL') {
            if (state.rightMode === 'player') {
                setPositionTriggerState('right', false);
            }
            return;
        }

        state.rightPosition = state.leftPosition;
        rightPositionLabel.textContent = getDisplayPositionLabel(state.leftPosition);
        if (state.rightMode === 'player') {
            setPositionTriggerState('right', true);
        }
    };

    const renderPositionSelects = () => {
        const positions = getPositionOptions(state.league);
        state.leftPosition = positions[0] || '';
        state.rightPosition = positions[1] || positions[0] || '';

        leftPositionLabel.textContent = getDisplayPositionLabel(state.leftPosition);
        rightPositionLabel.textContent = getDisplayPositionLabel(state.rightPosition);
        renderPositionDropdown('left');
        renderPositionDropdown('right');
        syncRightPositionForNFL();
    };

    const getHeroName = (side) => {
        const input = side === 'left' ? leftPlayerInput : rightPlayerInput;
        return input.value.trim() || getSideLabel(side);
    };

    const getHeroMeta = (side) => {
        const mode = side === 'left' ? state.leftMode : state.rightMode;
        const position = side === 'left' ? state.leftPosition : state.rightPosition;
        const modeLabel = mode === 'player' ? getDisplayPositionLabel(position) : mode.toUpperCase();
        return `${state.league} | ${modeLabel}`;
    };

    const getComparisonLayoutType = () => {
        const context = getComparisonContext();
        return context.type === 'player-vs-group' ? 'mixed' : 'standard';
    };

    const getPlayerSubjectSide = () => {
        const context = getComparisonContext();
        return context.playerSide || 'left';
    };

    const getHeroAvatarBySide = (side) => {
        return side === 'left'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD916xGAXKiQ5A6lHLS1-YYoWCyIvU4-rigNJQS5f7ufIOxMc0bAIYiL2pPadaayrnES2A31iKcO-cHIkSD5Nj2oPXbQZJGnFTyHPY6tAA34WwrlfehXWGt3ugVb7-ectJiHhppDlsrLRMaZAhPzm6XdaXsN4Ve-k410TLrxWqqAZweXRb4xl7RWb1ovTycVdbbBq0uQ1IFq7MF7ELbC98PB3H7jYDSb7K0nVtDe6kqfbPM5xxntFgpGUZbnjtFlHnAzRY0gwn3-nA'
            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRdWLw23lfYLinZrYSSIU__GlJekkaZTmvWQFPcPnll3WMyJ__-2xbSqhp3VSsbkFpGJPpkCUTDWVNMjf1ieNxki6oKHRXPMk0qBcKtrbByeHFoQpxMsxJFGHbY21z2DLjeigZEA8lqrYfLVVE_tRLhzyXKb2sDoEWiwZv69raripeykBRfwz7fwYV4ABZrThxBRR-H2WhszyBRWWEk5p5fC2AxMVJy1ikPnETRCiMBlS_U44ngfsH2cEh8-3jaqduA_0E_qtLA3M';
    };

    const getHeroStatValue = (label, side, index) => {
        const seed = createSeed(`${side}-${label}-${index}-${state.league}-${state.leftPosition}-${state.rightPosition}-${state.leftMode}-${state.rightMode}-${leftPlayerInput.value.trim()}-${rightPlayerInput.value.trim()}`);
        if (label === 'W/L%') {
            const winPct = 40 + (seed % 51) + ((seed % 10) / 10);
            return `${Math.min(winPct, 99.9).toFixed(1)}%`;
        }
        return generateValueForStat(label, seed);
    };

    const toPercentWidth = (valueText) => {
        const parsed = Number(String(valueText).replace(/[^0-9.-]/g, ''));
        if (Number.isNaN(parsed)) return 50;
        if (String(valueText).includes('%')) {
            return Math.max(5, Math.min(100, parsed));
        }
        return Math.max(5, Math.min(100, parsed * 3));
    };

    const renderHeroStatsRows = (leftKey, rightKey) => {
        const labels = state.showAllHeroStats ? getHeroStatLabels() : getDefaultHeroStatLabels();
        return labels.map((label, index) => {
            const leftValue = getHeroStatValue(label, leftKey, index);
            const rightValue = getHeroStatValue(label, rightKey, index + 3);
            const leftWidth = toPercentWidth(leftValue);
            const rightWidth = toPercentWidth(rightValue);
            return `
                <div class="space-y-2">
                    <div class="flex justify-between items-end text-sm font-bold">
                        <span>${leftValue}</span>
                        <span class="text-slate-500 tracking-widest">${label}</span>
                        <span>${rightValue}</span>
                    </div>
                    <div class="flex gap-2 h-1.5">
                        <div class="flex-1 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-primary" style="width: ${leftWidth}%"></div></div>
                        <div class="flex-1 bg-slate-800 rounded-full overflow-hidden flex justify-end"><div class="h-full bg-slate-400" style="width: ${rightWidth}%"></div></div>
                    </div>
                </div>
            `;
        }).join('');
    };

    const renderHeroComparison = () => {
        if (!heroLayout) return;
        const context = getComparisonContext();
        if (heroShowAllButton) {
            heroShowAllButton.classList.toggle('hidden', !context.ready);
            heroShowAllButton.textContent = state.showAllHeroStats ? 'Show Less' : 'Show All';
        }

        if (!context.ready) {
            heroLayout.innerHTML = `
                <div class="h-44"></div>
            `;
            return;
        }

        const comparisonType = getComparisonLayoutType();
        if (comparisonType === 'standard') {
            heroLayout.innerHTML = `
                <div class="grid grid-cols-3 gap-8 items-start mb-10">
                    <div class="flex flex-col items-center text-center gap-3">
                        <img alt="Left entity" class="w-24 h-24 rounded-full border-2 border-primary object-cover" src="${getHeroAvatarBySide('left')}" />
                        <div>
                            <div class="text-lg font-bold">${getHeroName('left')}</div>
                            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">${getHeroMeta('left')}</div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center h-full">
                        <span class="text-4xl font-black text-slate-800 italic">VS</span>
                    </div>
                    <div class="flex flex-col items-center text-center gap-3">
                        <img alt="Right entity" class="w-24 h-24 rounded-full border-2 border-slate-700 object-cover" src="${getHeroAvatarBySide('right')}" />
                        <div>
                            <div class="text-lg font-bold">${getHeroName('right')}</div>
                            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">${getHeroMeta('right')}</div>
                        </div>
                    </div>
                </div>
                <div class="space-y-8 max-w-4xl mx-auto">${renderHeroStatsRows('left', 'right')}</div>
            `;
            return;
        }

        const playerSide = getPlayerSubjectSide();
        const groupDescriptor = getGroupDescriptor(context).toUpperCase();
        heroLayout.innerHTML = `
            <div class="grid grid-cols-3 gap-8 items-start mb-10">
                <div class="text-center pt-6">
                    <div class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Home</div>
                </div>
                <div class="flex flex-col items-center text-center gap-3">
                    <img alt="Selected player" class="w-24 h-24 rounded-full border-2 border-primary object-cover" src="${getHeroAvatarBySide(playerSide)}" />
                    <div>
                        <div class="text-lg font-bold">${getHeroName(playerSide)}</div>
                        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">${getHeroMeta(playerSide)}</div>
                        <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">VS ${groupDescriptor}</div>
                    </div>
                </div>
                <div class="text-center pt-6">
                    <div class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Away</div>
                </div>
            </div>
            <div class="space-y-8 max-w-4xl mx-auto">${renderHeroStatsRows('home', 'away')}</div>
        `;
    };

    const renderAveragesTable = () => {
        const context = getComparisonContext();
        if (!context.ready) {
            averagesWrap.style.minWidth = '100%';
            averagesWrap.innerHTML = '';
            return;
        }

        const columns = getDynamicSchema();
        const players = context.type === 'player-vs-group'
            ? [
                { name: `Home vs ${context.groupName}`, side: 'home' },
                { name: `Away vs ${context.groupName}`, side: 'away' }
            ]
            : [
                { name: leftPlayerInput.value.trim() || getSideLabel('left'), side: 'left' },
                { name: rightPlayerInput.value.trim() || getSideLabel('right'), side: 'right' }
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
                                const seed = createSeed(`${player.side}-${label}-${colIndex}-${rowIndex}-${state.league}-${state.leftPosition}-${state.rightPosition}-${context.type}-${context.groupName || ''}`);
                                const value = generateValueForStat(label, seed);
                                const rankText = formatRank(seed);
                                const rankValue = parseRankValue(rankText);
                                const rankClass = rankValue !== null && rankValue <= 20
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                    : 'text-slate-500';
                                return `<td class="px-3 py-3 font-mono ${colIndex % 2 === 0 ? 'h2h-col-highlight' : ''}">${value} <span class="text-[10px] font-bold ml-1 px-1.5 py-0.5 rounded ${rankClass}">${rankText}</span></td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    const buildGameRows = (side, context) => {
        const columns = getDynamicSchema();
        const totalPool = 30;
        const games = Array.from({ length: totalPool }, (_, index) => {
            const gameNumber = index + 1;
            const day = String(28 - (index % 20)).padStart(2, '0');
            const month = String(((index % 6) + 1)).padStart(2, '0');
            const isHome = side === 'home' ? true : side === 'away' ? false : index % 2 === 0;
            const isPlayoff = index % 4 === 0;
            const fallbackOpponent = state.league === 'NBA' ? 'PHX' : state.league === 'NFL' ? 'BUF' : 'NYY';
            let opponent = fallbackOpponent;

            if (context.type === 'player-vs-group') {
                opponent = abbreviateEntity(context.groupName);
            } else if (context.type === 'player-vs-player' || context.type === 'team-vs-team') {
                const oppositeName = side === 'left' ? context.rightName : context.leftName;
                opponent = abbreviateEntity(oppositeName);
            }

            const seedBase = createSeed(`${side}-${state.league}-${state.leftPosition}-${state.rightPosition}-${context.type}-${context.groupName || ''}-${gameNumber}`);

            return {
                Date: `${month}/${day}/24`,
                Team: `${isHome ? 'vs' : '@'} ${opponent}`,
                'H/A': isHome ? 'Home' : 'Away',
                Playoff: isPlayoff,
                GS: '1',
                Min: `${28 + (seedBase % 13)}:${String(seedBase % 60).padStart(2, '0')}`,
                dynamic: columns.reduce((acc, label, idx) => {
                    acc[label] = generateValueForStat(label, seedBase + idx + 11);
                    return acc;
                }, {})
            };
        });

        let filtered = games;
        if (state.gameTab === 'L10') {
            filtered = games.slice(0, 10);
        } else if (state.gameTab === 'Playoffs') {
            filtered = games.filter((game) => game.Playoff);
        }

        return state.showAllGames ? filtered : filtered.slice(0, 5);
    };

    const renderSingleGameTable = (rows, sideLabel, tableMinWidth) => {
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
        const context = getComparisonContext();
        if (!context.ready) {
            gameLogLeftName.innerHTML = '<div class="flex items-center justify-between"><span>--</span><span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">W/L -- IN L10</span></div>';
            gameLogRightName.innerHTML = '<div class="flex items-center justify-between"><span>--</span><span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">W/L -- IN L10</span></div>';
            gameLogLeftWrap.innerHTML = '';
            gameLogRightWrap.innerHTML = '';
            showGamesButton.classList.add('hidden');
            refreshGameLogSyncMetrics();
            return;
        }

        const isPlayerVsGroup = context.type === 'player-vs-group';
        const leftName = isPlayerVsGroup
            ? `Home vs ${context.groupName}`
            : (leftPlayerInput.value.trim() || getSideLabel('left'));
        const rightName = isPlayerVsGroup
            ? `Away vs ${context.groupName}`
            : (rightPlayerInput.value.trim() || getSideLabel('right'));
        const leftRows = buildGameRows(isPlayerVsGroup ? 'home' : 'left', context);
        const rightRows = buildGameRows(isPlayerVsGroup ? 'away' : 'right', context);
        const dynamicColumns = getDynamicSchema();
        const finalDynamicColumns = dynamicColumns.filter((label) => !['Date', 'Team', 'H/A', 'GS', 'Min'].includes(label));
        const minWidth = Math.max(1180, 108 + 124 + (3 * 92) + (finalDynamicColumns.length * 108));

        const summaryLabel = state.gameTab === 'Playoffs' ? 'PLAYOFFS' : state.gameTab;
        const leftWin = 4 + (createSeed(`${leftName}-${summaryLabel}`) % 7);
        const rightWin = 4 + (createSeed(`${rightName}-${summaryLabel}`) % 7);
        const total = Math.max(leftWin, rightWin) + 4;
        const leftLoss = Math.max(0, total - leftWin);
        const rightLoss = Math.max(0, total - rightWin);

        gameLogLeftName.innerHTML = `<div class="flex items-center justify-between"><span>${leftName}</span><span class="text-[10px] font-bold uppercase tracking-widest text-primary">W/L ${leftWin}-${leftLoss} IN ${summaryLabel}</span></div>`;
        gameLogRightName.innerHTML = `<div class="flex items-center justify-between"><span>${rightName}</span><span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">W/L ${rightWin}-${rightLoss} IN ${summaryLabel}</span></div>`;

        gameLogLeftWrap.innerHTML = renderSingleGameTable(leftRows, 'left', minWidth);
        gameLogRightWrap.innerHTML = renderSingleGameTable(rightRows, 'right', minWidth);
        const activeCount = state.gameTab === 'L10' ? 10 : state.gameTab === 'Playoffs' ? Math.ceil(30 / 4) : 30;
        const moreGamesAvailable = activeCount > 5;
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

    const buildContextPpg = (seedKey, min, spread) => {
        const seed = createSeed(seedKey);
        return (min + (seed % spread) + ((seed % 10) / 10)).toFixed(1);
    };

    const renderContextualCards = () => {
        const context = getComparisonContext();
        const accolades = document.getElementById('h2h-context-accolades');
        const homeAway = document.getElementById('h2h-context-homeAway');
        const restDays = document.getElementById('h2h-context-restDays');
        if (!accolades || !homeAway || !restDays) return;

        if (!context.ready) {
            accolades.innerHTML = '';
            homeAway.innerHTML = '';
            restDays.innerHTML = '';
            return;
        }

        if (context.type === 'player-vs-group') {
            const seedBase = `${state.league}-${context.playerName}-${context.groupName}-${context.groupMode}`;
            accolades.innerHTML = `
                <p>- Most Points: ${Math.round(Number(buildContextPpg(`${seedBase}-pts`, 35, 20)))} vs ${context.groupName}</p>
                <p>- Most Rebounds: ${Math.round(Number(buildContextPpg(`${seedBase}-reb`, 10, 10)))} vs ${context.groupName}</p>
                <p>- Most Assists: ${Math.round(Number(buildContextPpg(`${seedBase}-ast`, 6, 9)))} vs ${context.groupName}</p>
            `;
            homeAway.innerHTML = `
                <p>- Home PPG: ${buildContextPpg(`${seedBase}-home`, 20, 14)}</p>
                <p>- Away PPG: ${buildContextPpg(`${seedBase}-away`, 18, 12)}</p>
            `;
            restDays.innerHTML = `
                <p>- 0 rest days: ${buildContextPpg(`${seedBase}-rest0`, 16, 10)} PPG</p>
                <p>- 1-2 rest days: ${buildContextPpg(`${seedBase}-rest12`, 19, 11)} PPG</p>
                <p>- 3+ rest days: ${buildContextPpg(`${seedBase}-rest3`, 22, 12)} PPG</p>
            `;
            return;
        }

        const seedBase = `${state.league}-${context.leftName}-${context.rightName}-${context.type}`;
        accolades.innerHTML = `
            <p>- Most Points: ${Math.round(Number(buildContextPpg(`${seedBase}-pts`, 30, 16)))}</p>
            <p>- Most Rebounds: ${Math.round(Number(buildContextPpg(`${seedBase}-reb`, 8, 10)))}</p>
            <p>- Most Assists: ${Math.round(Number(buildContextPpg(`${seedBase}-ast`, 5, 8)))}</p>
        `;
        homeAway.innerHTML = `
            <p>- Home PPG: ${buildContextPpg(`${seedBase}-home`, 18, 12)}</p>
            <p>- Away PPG: ${buildContextPpg(`${seedBase}-away`, 17, 11)}</p>
        `;
        restDays.innerHTML = `
            <p>- 0 rest days: ${buildContextPpg(`${seedBase}-rest0`, 15, 10)} PPG</p>
            <p>- 1-2 rest days: ${buildContextPpg(`${seedBase}-rest12`, 18, 10)} PPG</p>
            <p>- 3+ rest days: ${buildContextPpg(`${seedBase}-rest3`, 20, 11)} PPG</p>
        `;
    };

    const updateContextCards = () => {
        const context = getComparisonContext();
        renderContextualCards();
        if (!context.ready) {
            Object.keys(state.contextExpanded).forEach((key) => {
                state.contextExpanded[key] = false;
            });
        }
        Object.keys(state.contextExpanded).forEach((key) => {
            const section = document.getElementById(`h2h-context-${key}`);
            if (section) {
                section.classList.toggle('hidden', !state.contextExpanded[key]);
            }
        });

        contextToggleButtons.forEach((button) => {
            const key = button.dataset.contextCard;
            const expanded = Boolean(state.contextExpanded[key]);
            button.disabled = !context.ready;
            button.classList.toggle('opacity-40', !context.ready);
            button.classList.toggle('cursor-not-allowed', !context.ready);
            button.textContent = expanded ? 'Show Less' : 'Show More';
        });
    };

    const validateNFLPositionRule = () => {
        if (state.league !== 'NFL') return true;
        if (state.leftMode !== 'player' || state.rightMode !== 'player') return true;
        const valid = state.leftPosition === state.rightPosition;
        if (!valid) {
            setFeedback('NFL comparisons require both players to use the same position.');
            return false;
        }
        return true;
    };

    const rerenderTables = () => {
        syncRightModeOptions();
        leftPlayerInput.placeholder = `Search ${getSideLabel('left')}...`;
        rightPlayerInput.placeholder = `Search ${getSideLabel('right')}...`;
        setPositionVisibility('left', state.leftMode === 'player');
        setPositionVisibility('right', state.rightMode === 'player');
        syncRightPositionForNFL();
        renderAveragesTable();
        renderGameLogTables();
        renderHeroComparison();
        updateModeTabs();
        renderPositionDropdown('left');
        renderPositionDropdown('right');
        updateGameTabs();
        updateContextCards();
    };

    syncRightModeOptions();
    leftPlayerInput.placeholder = `Search ${getSideLabel('left')}...`;
    rightPlayerInput.placeholder = `Search ${getSideLabel('right')}...`;
    setPositionVisibility('left', state.leftMode === 'player');
    setPositionVisibility('right', state.rightMode === 'player');
    renderPositionSelects();
    renderHeroComparison();
    renderAveragesTable();
    renderGameLogTables();
    updateModeTabs();
    updateGameTabs();
    updateContextCards();
    setupGameLogScrollSync();
    filterSearchEntries('left', leftPlayerInput.value);
    filterSearchEntries('right', rightPlayerInput.value);

    leagueSelect.addEventListener('change', (event) => {
        state.league = event.target.value;
        state.showAllGames = false;
        state.showAllHeroStats = false;
        setFeedback('');
        syncRightModeOptions();
        renderPositionSelects();
        filterSearchEntries('left', leftPlayerInput.value);
        filterSearchEntries('right', rightPlayerInput.value);
        rerenderTables();
    });

    leftPlayerInput.addEventListener('input', () => {
        filterSearchEntries('left', leftPlayerInput.value);
        rerenderTables();
    });

    rightPlayerInput.addEventListener('input', () => {
        filterSearchEntries('right', rightPlayerInput.value);
        rerenderTables();
    });

    leftPlayerInput.addEventListener('focus', () => {
        filterSearchEntries('left', leftPlayerInput.value);
    });

    rightPlayerInput.addEventListener('focus', () => {
        filterSearchEntries('right', rightPlayerInput.value);
    });

    const handleSearchKeydown = (side, event) => {
        const results = side === 'left' ? leftSearchResults : rightSearchResults;
        const highlighted = side === 'left' ? leftHighlightedIndex : rightHighlightedIndex;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!results.length) return;
            if (side === 'left') {
                leftHighlightedIndex = (highlighted + 1) % results.length;
            } else {
                rightHighlightedIndex = (highlighted + 1) % results.length;
            }
            renderSearchDropdown(side);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!results.length) return;
            if (side === 'left') {
                leftHighlightedIndex = (highlighted - 1 + results.length) % results.length;
            } else {
                rightHighlightedIndex = (highlighted - 1 + results.length) % results.length;
            }
            renderSearchDropdown(side);
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            if (results.length) {
                const index = side === 'left' ? leftHighlightedIndex : rightHighlightedIndex;
                const safeIndex = index >= 0 ? index : 0;
                applySearchSelection(side, results[safeIndex].name);
                return;
            }
            rerenderTables();
            return;
        }

        if (event.key === 'Escape') {
            closeSearchDropdown(side);
        }
    };

    leftPlayerInput.addEventListener('keydown', (event) => handleSearchKeydown('left', event));
    rightPlayerInput.addEventListener('keydown', (event) => handleSearchKeydown('right', event));

    const handleSearchDropdownClick = (side, event) => {
        const target = event.target.closest('[data-value]');
        if (!target) return;
        applySearchSelection(side, target.dataset.value);
    };

    leftSearchDropdown.addEventListener('click', (event) => handleSearchDropdownClick('left', event));
    rightSearchDropdown.addEventListener('click', (event) => handleSearchDropdownClick('right', event));

    const setSidePosition = (side, position) => {
        if (!position) return;
        if (side === 'left') {
            state.leftPosition = position;
            leftPositionLabel.textContent = getDisplayPositionLabel(position);
            if (state.league === 'NFL') {
                state.rightPosition = position;
                rightPositionLabel.textContent = getDisplayPositionLabel(position);
            }
        } else {
            state.rightPosition = position;
            rightPositionLabel.textContent = getDisplayPositionLabel(position);
            if (state.league === 'NFL' && state.rightPosition !== state.leftPosition) {
                state.rightPosition = state.leftPosition;
                rightPositionLabel.textContent = getDisplayPositionLabel(state.leftPosition);
                setFeedback('NFL comparisons require matching positions. Right position was synced to the left.');
            } else {
                setFeedback('');
            }
        }

        closePositionDropdown(side);
        filterSearchEntries('left', leftPlayerInput.value);
        filterSearchEntries('right', rightPlayerInput.value);
        rerenderTables();
    };

    const togglePositionDropdown = (side) => {
        const dropdown = side === 'left' ? leftPositionDropdown : rightPositionDropdown;
        const trigger = side === 'left' ? leftPositionTrigger : rightPositionTrigger;
        if (!dropdown || !trigger || trigger.disabled) return;

        const opening = dropdown.classList.contains('hidden');
        closeAllPositionDropdowns();
        if (opening) {
            dropdown.classList.remove('hidden');
            trigger.setAttribute('aria-expanded', 'true');
        }
    };

    leftPositionTrigger.addEventListener('click', () => togglePositionDropdown('left'));
    rightPositionTrigger.addEventListener('click', () => togglePositionDropdown('right'));

    const handlePositionDropdownClick = (side, event) => {
        const target = event.target.closest('[data-position]');
        if (!target) return;
        setSidePosition(side, target.dataset.position);
    };

    leftPositionDropdown.addEventListener('click', (event) => handlePositionDropdownClick('left', event));
    rightPositionDropdown.addEventListener('click', (event) => handlePositionDropdownClick('right', event));

    compareButton.addEventListener('click', () => {
        if (!validateNFLPositionRule()) return;
        setFeedback('');
        rerenderTables();
    });

    seasonSelect.addEventListener('change', () => {
        state.season = seasonSelect.value;
        rerenderTables();
    });

    modeTabs.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.classList.contains('hidden')) return;
            setSideMode(button.dataset.side, button.dataset.mode);
            setFeedback('');
        });
    });

    if (heroShowAllButton) {
        heroShowAllButton.addEventListener('click', () => {
            state.showAllHeroStats = !state.showAllHeroStats;
            renderHeroComparison();
        });
    }

    contextToggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.dataset.contextCard;
            if (!key || !(key in state.contextExpanded)) return;
            state.contextExpanded[key] = !state.contextExpanded[key];
            updateContextCards();
        });
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

    document.addEventListener('click', (event) => {
        if (!leftSearchDropdown.contains(event.target) && event.target !== leftPlayerInput) {
            closeSearchDropdown('left');
        }
        if (!rightSearchDropdown.contains(event.target) && event.target !== rightPlayerInput) {
            closeSearchDropdown('right');
        }

        const leftPositionContains = leftPositionDropdown.contains(event.target) || leftPositionTrigger.contains(event.target);
        const rightPositionContains = rightPositionDropdown.contains(event.target) || rightPositionTrigger.contains(event.target);
        if (!leftPositionContains) {
            closePositionDropdown('left');
        }
        if (!rightPositionContains) {
            closePositionDropdown('right');
        }
    });
}

window.renderHeadToHeadPage = renderHeadToHeadPage;
