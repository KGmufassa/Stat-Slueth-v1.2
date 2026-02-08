// ============================================
// TEAM STATS PAGE (PLAYER-STATS PARITY)
// ============================================

function renderComparePage() {
    const content = document.getElementById('app-content');
    if (!content) return;

    const visualizationPreferenceKey = 'teamStatVizPreference';
    let selectedVisualization = localStorage.getItem(visualizationPreferenceKey) || 'bar';

    const parseNumber = (value) => {
        if (value === null || value === undefined) return null;
        const cleaned = String(value).replace(/[^0-9.-]/g, '');
        if (!cleaned || cleaned === '-' || cleaned === '.') return null;
        const parsed = Number(cleaned);
        return Number.isNaN(parsed) ? null : parsed;
    };

    const formatStatValue = (original, valueNumber) => {
        const trimmed = String(original).trim();
        const hasPercent = trimmed.includes('%');
        const hasComma = trimmed.includes(',');
        const hasDecimal = trimmed.includes('.');
        const hasLeadingDot = trimmed.startsWith('.');
        const decimals = hasDecimal ? trimmed.split('.')[1].length : 0;
        let formattedValue = valueNumber;

        if (hasPercent) {
            formattedValue = valueNumber.toFixed(1);
            return `${formattedValue}%`;
        }

        if (hasDecimal) {
            if (hasLeadingDot) {
                formattedValue = valueNumber.toFixed(3);
                return formattedValue.replace(/^0/, '');
            }
            formattedValue = decimals >= 2 ? valueNumber.toFixed(2) : valueNumber.toFixed(1);
            return `${formattedValue}`;
        }

        formattedValue = Math.round(valueNumber);
        if (hasComma) {
            return formattedValue.toLocaleString('en-US');
        }

        return `${formattedValue}`;
    };

    const adjustStatValue = (original, yearOffset) => {
        const baseValue = parseNumber(original);
        if (baseValue === null) return original;
        const multiplier = 1 + yearOffset * 0.012;
        let adjusted = baseValue * multiplier;
        if (String(original).includes('%')) {
            adjusted = Math.min(Math.max(adjusted, 0), 100);
        }
        return formatStatValue(original, adjusted);
    };

    const opponentPools = {
        NBA: ['@ BOS', 'vs MIA', '@ MIL', 'vs PHX', '@ DEN', 'vs GSW', '@ NYK', 'vs DAL', '@ SAC', 'vs LAC'],
        NFL: ['@ BUF', 'vs CIN', '@ BAL', 'vs MIA', '@ DAL', 'vs PIT', '@ KC', 'vs NYJ', '@ LV', 'vs GB'],
        MLB: ['@ NYY', 'vs BOS', '@ HOU', 'vs STL', '@ CHC', 'vs SD', '@ SF', 'vs SEA', '@ ATL', 'vs NYM'],
        NHL: ['@ BOS', 'vs NYR', '@ TBL', 'vs TOR', '@ VGK', 'vs COL', '@ EDM', 'vs PIT', '@ WSH', 'vs DAL']
    };

    const buildTeamSeasonGames = (league, year, currentYear) => {
        const opponents = opponentPools[league] || opponentPools.NBA;
        const yearOffset = year - currentYear;
        const buildGame = (label, index) => {
            const basePts = 108 + yearOffset * 1.2;
            const variance = (index % 5) - 2;
            const pts = Math.max(80, Math.round(basePts + variance * 3));
            const opp = Math.max(78, Math.round(basePts - variance * 2));
            const isWin = pts >= opp;
            return {
                date: `${label} ${String(28 - index).padStart(2, '0')}`,
                opponent: opponents[index % opponents.length],
                result: `${isWin ? 'W' : 'L'} ${pts}-${opp}`,
                min: '240',
                pts: String(pts),
                reb: String(44 + variance),
                ast: String(24 + (index % 4)),
                fgPct: `${(45 + variance).toFixed(1)}%`,
                plusMinus: `${isWin ? '+' : '-'}${Math.abs(variance) + 2}`
            };
        };

        return {
            last10: Array.from({ length: 10 }, (_, index) => buildGame('Apr', index)),
            season: Array.from({ length: 10 }, (_, index) => buildGame('Mar', index)),
            postseason: Array.from({ length: 4 }, (_, index) => buildGame('May', index))
        };
    };

    const buildSeasonData = (primaryStats, extraStats, startYear, endYear, league) => {
        const seasons = {};
        for (let year = startYear; year <= endYear; year += 1) {
            const yearOffset = year - endYear;
            seasons[year] = {
                primaryStats: primaryStats.map((stat) => ({
                    ...stat,
                    value: adjustStatValue(stat.value, yearOffset)
                })),
                extraStats: extraStats.map((stat) => ({
                    ...stat,
                    value: adjustStatValue(stat.value, yearOffset)
                })),
                recentGames: buildTeamSeasonGames(league, year, endYear)
            };
        }
        return seasons;
    };

    const teamDirectory = [
        {
            name: 'Boston Celtics',
            league: 'NBA',
            conference: 'East',
            division: 'Atlantic',
            activeStartYear: 2019,
            activeEndYear: 2025,
            primaryStats: [
                { label: 'Win%', value: '62.4%' },
                { label: 'Net Rtg', value: '7.8' },
                { label: 'Off Rtg', value: '119.5' },
                { label: 'Def Rtg', value: '111.7' },
                { label: 'Pace', value: '98.6' }
            ],
            extraStats: [
                { label: 'PPG', value: '118.4' },
                { label: 'Opp PPG', value: '109.1' },
                { label: 'eFG%', value: '56.8%' },
                { label: '3P%', value: '38.4%' },
                { label: 'FT%', value: '79.6%' },
                { label: 'REB%', value: '51.2%' },
                { label: 'AST%', value: '61.4%' },
                { label: 'TOV%', value: '12.4%' }
            ]
        },
        {
            name: 'Denver Nuggets',
            league: 'NBA',
            conference: 'West',
            division: 'Northwest',
            activeStartYear: 2019,
            activeEndYear: 2025,
            primaryStats: [
                { label: 'Win%', value: '59.3%' },
                { label: 'Net Rtg', value: '6.2' },
                { label: 'Off Rtg', value: '116.1' },
                { label: 'Def Rtg', value: '109.9' },
                { label: 'Pace', value: '97.4' }
            ],
            extraStats: [
                { label: 'PPG', value: '114.6' },
                { label: 'Opp PPG', value: '108.7' },
                { label: 'eFG%', value: '55.4%' },
                { label: '3P%', value: '37.2%' },
                { label: 'FT%', value: '77.9%' },
                { label: 'REB%', value: '50.6%' },
                { label: 'AST%', value: '63.1%' },
                { label: 'TOV%', value: '12.2%' }
            ]
        },
        {
            name: 'Kansas City Chiefs',
            league: 'NFL',
            conference: 'AFC',
            division: 'West',
            activeStartYear: 2019,
            activeEndYear: 2025,
            primaryStats: [
                { label: 'Win%', value: '62.5%' },
                { label: 'Net Rtg', value: '6.8' },
                { label: 'Off PPG', value: '26.3' },
                { label: 'Def PPG', value: '20.9' },
                { label: 'Pace', value: '62.3' }
            ],
            extraStats: [
                { label: 'Yds/G', value: '387.4' },
                { label: 'Pass Yds', value: '265.2' },
                { label: 'Rush Yds', value: '122.2' },
                { label: '3rd% ', value: '44.1%' },
                { label: 'RedZone%', value: '61.3%' },
                { label: 'Sacks', value: '42' },
                { label: 'Takeaways', value: '26' },
                { label: 'TOV%', value: '1.2%' }
            ]
        },
        {
            name: 'Los Angeles Dodgers',
            league: 'MLB',
            conference: 'NL',
            division: 'West',
            activeStartYear: 2019,
            activeEndYear: 2025,
            primaryStats: [
                { label: 'Win%', value: '60.4%' },
                { label: 'Run Diff', value: '3.2' },
                { label: 'Runs/G', value: '5.2' },
                { label: 'Runs A', value: '4.4' },
                { label: 'Pace', value: '0.0' }
            ],
            extraStats: [
                { label: 'AVG', value: '.261' },
                { label: 'HR', value: '212' },
                { label: 'OBP', value: '.334' },
                { label: 'SLG', value: '.438' },
                { label: 'ERA', value: '3.82' },
                { label: 'WHIP', value: '1.22' },
                { label: 'SO', value: '1475' },
                { label: 'TOV%', value: '0.0%' }
            ]
        },
        {
            name: 'Edmonton Oilers',
            league: 'NHL',
            conference: 'West',
            division: 'Pacific',
            activeStartYear: 2019,
            activeEndYear: 2025,
            primaryStats: [
                { label: 'Win%', value: '56.3%' },
                { label: 'Goal Diff', value: '5.4' },
                { label: 'GF/G', value: '3.6' },
                { label: 'GA/G', value: '2.9' },
                { label: 'Pace', value: '0.0' }
            ],
            extraStats: [
                { label: 'PP%', value: '26.4%' },
                { label: 'PK%', value: '81.1%' },
                { label: 'SOG', value: '32.4' },
                { label: 'SA', value: '28.6' },
                { label: 'FO%', value: '52.1%' },
                { label: 'Hits', value: '20.6' },
                { label: 'Blocks', value: '15.2' },
                { label: 'TOV%', value: '0.0%' }
            ]
        }
    ].map((team) => ({
        ...team,
        seasons: buildSeasonData(team.primaryStats, team.extraStats, team.activeStartYear, team.activeEndYear, team.league)
    }));

    const leagueOptions = ['NBA', 'NFL', 'MLB', 'NHL'];
    const defaultTeam = teamDirectory[0];
    let activeTeam = defaultTeam;
    let activeSeasonYear = activeTeam.activeEndYear;

    content.innerHTML = `
        <div class="flex flex-col gap-8 fade-in">
            <div class="flex flex-col gap-8">
                <div class="bg-surface-dark border border-slate-800 rounded-xl p-4 @container shadow-card">
                    <div class="flex flex-col gap-3 @[520px]:flex-row @[520px]:items-center">
                        <div class="flex flex-col gap-2 flex-1">
                            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-500">League</label>
                            <div class="relative">
                                <select id="league-select" aria-label="Select league"
                                    class="form-select w-full bg-transparent border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-primary focus:border-primary">
                                    <option value="" selected>Select league</option>
                                    ${leagueOptions.map((league) => `<option value="${league}">${league}</option>`).join('')}
                                </select>
                                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 flex-[1.4] relative">
                            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Team</label>
                            <input id="team-input" type="text" aria-label="Search team" aria-expanded="false" aria-controls="team-dropdown" disabled
                                placeholder="Select a league first..."
                                class="form-input w-full bg-transparent border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed" />
                            <div id="team-dropdown" role="listbox"
                                class="absolute top-full mt-2 w-full rounded-xl border border-slate-800 bg-[#0B101B] shadow-card z-20 hidden max-h-64 overflow-y-auto"></div>
                        </div>
                        <div class="flex flex-col gap-2 @[520px]:self-end">
                            <button id="team-search"
                                class="h-10 px-5 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wide shadow-glow hover:bg-primary-hover transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                    <p id="team-feedback" class="text-xs text-orange-400 font-semibold mt-3 hidden"></p>
                </div>

                <div class="flex flex-col @container">
                    <div class="flex w-full flex-col gap-6 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center bg-surface-dark p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div class="flex gap-6 relative z-10">
                            <div class="relative group">
                                <div id="team-avatar" class="bg-center bg-no-repeat aspect-square bg-cover rounded-xl min-h-32 w-32 shadow-lg ring-1 ring-white/10 bg-[#0B101B] flex items-center justify-center text-primary text-2xl font-black">
                                    ${defaultTeam.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                                </div>
                                <div class="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">Active</div>
                            </div>
                            <div class="flex flex-col justify-center">
                                <div class="flex items-center gap-3">
                                    <h1 id="team-name" class="text-white text-3xl font-black leading-tight tracking-tight">${defaultTeam.name}</h1>
                                    <span id="team-league" class="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">${defaultTeam.league}</span>
                                </div>
                                <p id="team-meta" class="text-slate-400 text-lg font-medium mt-1">${defaultTeam.conference} • ${defaultTeam.division}</p>
                                <div class="flex items-center gap-2 mt-2">
                                    <span class="material-symbols-outlined text-sm text-emerald-500 animate-pulse">sync</span>
                                    <p class="text-slate-500 text-xs font-bold uppercase tracking-wide">Updated 2 mins ago (Real-time Feed)</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 relative z-10">
                            <button class="flex items-center justify-center rounded-lg h-9 px-4 bg-slate-800 text-white text-xs font-bold transition-all hover:bg-slate-700 flex-1 @[480px]:flex-auto border border-white/5">
                                <span class="material-symbols-outlined mr-2 text-lg">person_add</span>
                                <span class="truncate">Follow</span>
                            </button>
                            <button class="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary-hover transition-all flex-1 @[480px]:flex-auto">
                                <span class="material-symbols-outlined mr-2 text-lg">download</span>
                                <span class="truncate">Export Stats</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 px-2 mt-6">
                        <div class="flex items-center gap-3">
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Year</span>
                            <div class="relative">
                                <select id="season-select" class="form-select bg-slate-900 border border-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-2 pr-8"></select>
                                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stat View</span>
                            <div id="viz-controls" class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                                <button data-viz="bar" class="viz-button px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Bar</button>
                                <button data-viz="sparkline" class="viz-button px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Sparkline</button>
                                <button data-viz="delta" class="viz-button px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Delta</button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <div id="primary-stats" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3"></div>
                    </div>

                    <div class="bg-surface-dark border border-slate-800 rounded-xl p-4 shadow-card mt-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">stacked_bar_chart</span>
                                <h3 class="text-white text-lg font-black tracking-tight">More Stats</h3>
                            </div>
                            <button id="toggle-extra-stats" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors" aria-expanded="false" aria-controls="extra-stats">Show</button>
                        </div>
                        <div id="extra-stats" class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 hidden"></div>
                    </div>

                    <div class="flex flex-col gap-6 mt-8">
                        <div class="flex flex-wrap justify-between items-center gap-3">
                            <div>
                                <h3 class="text-white text-xl font-black tracking-tight">Recent Games</h3>
                                <p class="text-slate-400 text-sm">Last games performance and outcomes.</p>
                            </div>
                            <div class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                                <button data-tab="last10" class="recent-tab px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Last 10</button>
                                <button data-tab="season" class="recent-tab px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Season</button>
                                <button data-tab="postseason" class="recent-tab px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Post-Season</button>
                            </div>
                        </div>

                        <div class="overflow-hidden rounded-xl border border-slate-800 bg-surface-dark shadow-card">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="bg-[#0B101B] text-xs uppercase tracking-widest text-slate-500">
                                            <th class="px-6 py-4">Date</th>
                                            <th class="px-6 py-4">Opponent</th>
                                            <th class="px-6 py-4">Result</th>
                                            <th class="px-6 py-4">MIN</th>
                                            <th class="px-6 py-4">PTS</th>
                                            <th class="px-6 py-4">REB</th>
                                            <th class="px-6 py-4">AST</th>
                                            <th class="px-6 py-4">FG%</th>
                                            <th class="px-6 py-4 text-right">+/-</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recent-games-body" class="divide-y divide-slate-800 text-sm font-medium"></tbody>
                                </table>
                            </div>
                            <div class="p-4 border-t border-slate-800 bg-[#0B101B] flex justify-between items-center">
                                <p id="recent-games-footer" class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Showing 0 of 0 games</p>
                                <button class="text-[10px] font-bold text-primary hover:text-white uppercase tracking-wider transition-colors">View Full Game Log</button>
                            </div>
                        </div>
                    </div>

                    <div class="relative group mt-8">
                        <h2 class="text-white text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">rocket_launch</span>
                            The Launchpad
                        </h2>
                        <div class="flex items-center gap-3 @container bg-surface-dark p-1.5 rounded-xl border border-primary/20 focus-within:border-primary transition-all shadow-glow-sm">
                            <div class="flex flex-1 flex-col">
                                <div class="flex flex-1 items-stretch">
                                    <div class="flex items-center pl-4 pr-2">
                                        <div id="launchpad-avatar" class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 shrink-0 shadow-sm ring-1 ring-white/10 bg-[#0B101B] flex items-center justify-center text-primary font-bold">
                                            ${defaultTeam.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                                        </div>
                                    </div>
                                    <div class="flex flex-1 flex-col">
                                        <textarea id="launchpad-input" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-transparent border-none text-white focus:ring-0 text-lg font-medium leading-normal py-4 placeholder:text-slate-500" placeholder="Ask a question about ${defaultTeam.name}... (e.g. 'Home vs Away performance?')"></textarea>
                                        <div class="flex items-center justify-between px-4 pb-4">
                                            <div class="flex items-center gap-1">
                                                <button class="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
                                                    <span class="material-symbols-outlined">mic</span>
                                                </button>
                                                <button class="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
                                                    <span class="material-symbols-outlined">attach_file</span>
                                                </button>
                                                <button class="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-primary transition-colors">
                                                    <span class="material-symbols-outlined">magic_button</span>
                                                </button>
                                            </div>
                                            <button class="min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all uppercase tracking-wide">Analyze Query</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4 px-2">
                            <span class="text-xs text-slate-500 font-bold uppercase tracking-wider py-1">Try:</span>
                            <button class="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/30">Offense vs Top Defenses</button>
                            <button class="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/30">Road efficiency split</button>
                            <button class="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/30">Pace impact on scoring</button>
                        </div>
                    </div>

                    <div class="bg-surface-dark border border-slate-800 rounded-xl p-5 shadow-card mt-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">insights</span>
                                <h3 class="text-white text-lg font-black tracking-tight">Query Results</h3>
                            </div>
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mock Results</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            ${['Tempo impact', 'Clutch profile', 'Opponent trend'].map((title) => `
                                <div class="rounded-xl border border-slate-800 bg-[#0B101B] p-4 hover:border-primary/40 transition-colors">
                                    <div class="flex items-center justify-between">
                                        <p class="text-white font-bold text-sm">${title}</p>
                                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">High</span>
                                    </div>
                                    <p class="text-slate-400 text-xs mt-2 leading-relaxed">Mock insight for ${defaultTeam.name}.</p>
                                    <span class="inline-flex mt-3 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">Team Data</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const leagueSelect = document.getElementById('league-select');
    const teamInput = document.getElementById('team-input');
    const teamDropdown = document.getElementById('team-dropdown');
    const searchButton = document.getElementById('team-search');
    const feedback = document.getElementById('team-feedback');
    const teamName = document.getElementById('team-name');
    const teamLeague = document.getElementById('team-league');
    const teamMeta = document.getElementById('team-meta');
    const teamAvatar = document.getElementById('team-avatar');
    const launchpadAvatar = document.getElementById('launchpad-avatar');
    const launchpadInput = document.getElementById('launchpad-input');
    const primaryStats = document.getElementById('primary-stats');
    const extraStats = document.getElementById('extra-stats');
    const toggleExtraStats = document.getElementById('toggle-extra-stats');
    const vizButtons = Array.from(document.querySelectorAll('.viz-button'));
    const recentTabButtons = Array.from(document.querySelectorAll('.recent-tab'));
    const recentGamesBody = document.getElementById('recent-games-body');
    const recentGamesFooter = document.getElementById('recent-games-footer');
    const seasonSelect = document.getElementById('season-select');

    let availableTeams = [];
    let filteredTeams = [];
    let highlightedIndex = -1;
    let activeRecentTab = 'last10';

    const buildTrend = (baseValue) => {
        if (baseValue === null) return null;
        const steps = [0.92, 0.96, 0.99, 1.02, 0.98, 1.04, 1];
        return steps.map((multiplier) => Number((baseValue * multiplier).toFixed(2)));
    };

    const getStatMeta = (stat, index, total = 120) => {
        const valueNumber = parseNumber(stat.value);
        const avgValue = stat.avg ?? (valueNumber !== null ? Number((valueNumber * 0.92).toFixed(2)) : null);
        const rankValue = stat.rank ?? `${Math.min(index + 7, total)}/${total}`;
        const trendValue = stat.trend ?? buildTrend(valueNumber);
        return { valueNumber, avgValue, rankValue, trendValue };
    };

    const buildDelta = (value, avg) => {
        if (value === null || avg === null || avg === 0) return null;
        const deltaValue = ((value - avg) / avg) * 100;
        return {
            value: deltaValue,
            text: `${deltaValue >= 0 ? '+' : ''}${deltaValue.toFixed(1)}%`
        };
    };

    const renderBar = (value, avg, delta) => {
        if (value === null || avg === null) {
            return '<span class="text-[10px] text-slate-500">No avg</span>';
        }
        const maxValue = Math.max(Math.abs(value), Math.abs(avg), 1);
        const playerWidth = (Math.abs(value) / maxValue) * 100;
        const avgWidth = (Math.abs(avg) / maxValue) * 100;
        const deltaClass = delta && delta.value >= 0 ? 'text-emerald-400' : 'text-orange-400';
        const deltaText = delta ? delta.text : '--';

        return `
            <div class="flex items-center gap-2">
                <div class="flex-1 space-y-1">
                    <div class="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div class="h-full bg-primary/70" style="width: ${playerWidth}%;"></div>
                    </div>
                    <div class="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-slate-500" style="width: ${avgWidth}%;"></div>
                    </div>
                </div>
                <span class="text-[10px] font-bold ${deltaClass}">${deltaText}</span>
            </div>
        `;
    };

    const renderSparkline = (trend, delta) => {
        if (!trend || trend.length < 2) {
            return '<span class="text-[10px] text-slate-500">No trend</span>';
        }
        const width = 72;
        const height = 20;
        const min = Math.min(...trend);
        const max = Math.max(...trend);
        const range = max - min || 1;
        const points = trend
            .map((value, index) => {
                const x = (index / (trend.length - 1)) * width;
                const y = height - ((value - min) / range) * height;
                return `${x},${y}`;
            })
            .join(' ');
        const deltaClass = delta && delta.value >= 0 ? 'text-emerald-400' : 'text-orange-400';
        const deltaText = delta ? delta.text : '--';

        return `
            <div class="flex items-center gap-2">
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" aria-hidden="true">
                    <polyline points="${points}" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="text-[10px] font-bold ${deltaClass}">${deltaText}</span>
            </div>
        `;
    };

    const renderDeltaBadge = (delta) => {
        if (!delta) {
            return '<span class="text-[10px] text-slate-500">--</span>';
        }
        const deltaClass = delta.value >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-orange-400 bg-orange-400/10';
        return `<span class="text-[10px] font-bold px-2 py-1 rounded-full ${deltaClass}">${delta.text}</span>`;
    };

    const renderVisualization = (stat, index, variant) => {
        const totalRank = variant === 'primary' ? 120 : 200;
        const { valueNumber, avgValue, rankValue, trendValue } = getStatMeta(stat, index, totalRank);
        const delta = buildDelta(valueNumber, avgValue);

        if (selectedVisualization === 'sparkline') {
            return renderSparkline(trendValue, delta);
        }
        if (selectedVisualization === 'delta') {
            return renderDeltaBadge(delta);
        }
        return renderBar(valueNumber, avgValue, delta);
    };

    const renderStats = (stats, container, variant = 'primary') => {
        const cardClass = variant === 'primary'
            ? 'flex flex-col gap-2 rounded-xl p-4 bg-surface-dark border border-slate-800 shadow-card hover:border-primary/50 transition-colors'
            : 'flex flex-col gap-2 rounded-lg p-3 bg-[#0B101B] border border-slate-800';
        const labelClass = variant === 'primary'
            ? 'text-slate-400 text-[10px] font-bold uppercase tracking-widest'
            : 'text-slate-500 text-[10px] font-bold uppercase tracking-widest';
        const valueClass = variant === 'primary'
            ? 'text-white tracking-tight text-2xl font-black leading-tight'
            : 'text-white text-lg font-bold';

        container.innerHTML = stats
            .map((stat, index) => {
                const { rankValue } = getStatMeta(stat, index, variant === 'primary' ? 120 : 200);
                return `
                    <div class="${cardClass}">
                        <p class="${labelClass}">${stat.label}</p>
                        <div class="flex items-center justify-between gap-2">
                            <p class="${valueClass}">${stat.value}</p>
                            <span class="text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded-full">Rank ${rankValue}</span>
                        </div>
                        ${renderVisualization(stat, index, variant)}
                    </div>
                `;
            })
            .join('');
    };

    const resetExtraStats = () => {
        extraStats.classList.add('hidden');
        toggleExtraStats.textContent = 'Show';
        toggleExtraStats.setAttribute('aria-expanded', 'false');
    };

    const updateVisualizationControls = () => {
        const allowed = ['bar', 'sparkline', 'delta'];
        if (!allowed.includes(selectedVisualization)) {
            selectedVisualization = 'bar';
            localStorage.setItem(visualizationPreferenceKey, selectedVisualization);
        }
        vizButtons.forEach((button) => {
            const isActive = button.dataset.viz === selectedVisualization;
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('text-slate-500', !isActive);
            button.classList.toggle('hover:text-white', !isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const renderRecentGames = (games) => {
        recentGamesBody.innerHTML = games
            .map((game) => {
                const isWin = game.result.trim().startsWith('W');
                const resultParts = game.result.split(' ');
                const resultLabel = resultParts[0];
                const resultScore = resultParts.slice(1).join(' ');
                const resultClass = isWin ? 'text-emerald-500' : 'text-red-500';
                const plusClass = String(game.plusMinus).startsWith('-') ? 'text-red-500' : 'text-emerald-500';
                return `
                    <tr class="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <td class="px-6 py-4 text-slate-400">${game.date}</td>
                        <td class="px-6 py-4 flex items-center gap-2 text-white">
                            <div class="size-6 bg-slate-700 rounded-full"></div>
                            ${game.opponent}
                        </td>
                        <td class="px-6 py-4 text-slate-300"><span class="${resultClass} font-bold">${resultLabel}</span> ${resultScore}</td>
                        <td class="px-6 py-4 text-slate-300">${game.min}</td>
                        <td class="px-6 py-4 font-black text-white text-lg">${game.pts}</td>
                        <td class="px-6 py-4 text-slate-300">${game.reb}</td>
                        <td class="px-6 py-4 text-slate-300">${game.ast}</td>
                        <td class="px-6 py-4 text-slate-300">${game.fgPct}</td>
                        <td class="px-6 py-4 text-right font-black ${plusClass}">${game.plusMinus}</td>
                    </tr>
                `;
            })
            .join('');
        recentGamesFooter.textContent = `Showing ${games.length} of ${games.length} games`;
    };

    const updateRecentTabs = () => {
        const isCurrent = activeSeasonYear === activeTeam.activeEndYear;
        recentTabButtons.forEach((button) => {
            const tabKey = button.dataset.tab;
            const isDisabled = !isCurrent && tabKey !== 'last10';
            button.classList.toggle('cursor-not-allowed', isDisabled);
            button.classList.toggle('opacity-50', isDisabled);
            button.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
            button.disabled = isDisabled;
        });
        recentTabButtons.forEach((button) => {
            const isActive = button.dataset.tab === activeRecentTab;
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('text-slate-500', !isActive);
            button.classList.toggle('hover:text-white', !isActive);
        });
    };

    const loadRecentGames = (team) => {
        if (activeSeasonYear !== team.activeEndYear) {
            activeRecentTab = 'last10';
        }
        const seasonData = team.seasons?.[activeSeasonYear] || {};
        const games = seasonData.recentGames?.[activeRecentTab] || [];
        renderRecentGames(games);
        updateRecentTabs();
    };

    const renderAllStats = (team) => {
        const seasonData = team.seasons?.[activeSeasonYear] || team;
        renderStats(seasonData.primaryStats, primaryStats, 'primary');
        renderStats(seasonData.extraStats, extraStats, 'extra');
    };

    const renderSeasonOptions = (team) => {
        const years = [];
        for (let year = team.activeStartYear; year <= team.activeEndYear; year += 1) {
            years.push(year);
        }
        seasonSelect.innerHTML = years.map((year) => `<option value="${year}">${year}</option>`).join('');
        seasonSelect.value = String(activeSeasonYear);
        seasonSelect.disabled = years.length === 0;
    };

    const setTeamHero = (team) => {
        teamName.textContent = team.name;
        teamLeague.textContent = team.league;
        teamMeta.textContent = `${team.conference} • ${team.division}`;
        const initials = team.name.split(' ').map((part) => part[0]).join('').slice(0, 2);
        teamAvatar.textContent = initials;
        launchpadAvatar.textContent = initials;
        launchpadInput.setAttribute('placeholder', `Ask a question about ${team.name}... (e.g. 'Home vs Away performance?')`);
    };

    const closeDropdown = () => {
        teamDropdown.classList.add('hidden');
        teamInput.setAttribute('aria-expanded', 'false');
        highlightedIndex = -1;
    };

    const renderDropdown = () => {
        teamDropdown.innerHTML = filteredTeams
            .map((team, index) => {
                const isActive = index === highlightedIndex;
                return `
                    <button type="button" role="option" aria-selected="${isActive ? 'true' : 'false'}" data-value="${team.name}"
                        class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-primary/15 text-white' : 'text-slate-200 hover:bg-white/5'}">
                        <div>
                            <p class="font-semibold">${team.name}</p>
                            <p class="text-[10px] text-slate-400 uppercase tracking-wider">${team.conference} • ${team.division}</p>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-1 rounded-full">${team.league}</span>
                    </button>
                `;
            })
            .join('');
        if (!filteredTeams.length) {
            closeDropdown();
            return;
        }
        teamDropdown.classList.remove('hidden');
        teamInput.setAttribute('aria-expanded', 'true');
    };

    const updateSuggestions = (league) => {
        availableTeams = [];
        filteredTeams = [];
        teamInput.value = '';
        highlightedIndex = -1;
        if (!league) {
            teamInput.setAttribute('disabled', 'true');
            teamInput.setAttribute('placeholder', 'Select a league first...');
            closeDropdown();
            return;
        }
        teamInput.removeAttribute('disabled');
        teamInput.setAttribute('placeholder', 'Start typing a team name...');
        availableTeams = teamDirectory.filter((team) => team.league === league);
        filteredTeams = availableTeams;
        renderDropdown();
    };

    const filterTeams = (query) => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            filteredTeams = availableTeams;
            highlightedIndex = -1;
            renderDropdown();
            return;
        }
        filteredTeams = availableTeams.filter((team) => team.name.toLowerCase().includes(normalized));
        highlightedIndex = filteredTeams.length ? 0 : -1;
        renderDropdown();
    };

    const setFeedback = (message = '') => {
        if (!message) {
            feedback.textContent = '';
            feedback.classList.add('hidden');
            return;
        }
        feedback.textContent = message;
        feedback.classList.remove('hidden');
    };

    const applySearch = () => {
        const league = leagueSelect.value.trim();
        const query = teamInput.value.trim().toLowerCase();

        if (!league) {
            setFeedback('Select a league to search teams.');
            return;
        }
        if (!query) {
            setFeedback('Select a team from the list.');
            return;
        }

        const match = teamDirectory.find((team) => team.league === league && team.name.toLowerCase() === query)
            || teamDirectory.find((team) => team.league === league && team.name.toLowerCase().includes(query));

        if (!match) {
            setFeedback('No matching team found in this league.');
            return;
        }

        setFeedback('');
        activeTeam = match;
        activeSeasonYear = match.activeEndYear;
        setTeamHero(match);
        renderSeasonOptions(match);
        renderAllStats(match);
        loadRecentGames(match);
        resetExtraStats();
    };

    updateVisualizationControls();
    renderSeasonOptions(activeTeam);
    setTeamHero(activeTeam);
    renderAllStats(activeTeam);
    resetExtraStats();
    loadRecentGames(activeTeam);
    updateSuggestions(leagueSelect.value);

    leagueSelect.addEventListener('change', () => {
        updateSuggestions(leagueSelect.value);
        setFeedback('');
    });

    teamInput.addEventListener('input', (event) => {
        if (teamInput.disabled) return;
        filterTeams(event.target.value);
    });

    teamInput.addEventListener('focus', () => {
        if (teamInput.disabled) return;
        filteredTeams = availableTeams;
        renderDropdown();
    });

    teamInput.addEventListener('keydown', (event) => {
        if (teamInput.disabled) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!filteredTeams.length) return;
            highlightedIndex = (highlightedIndex + 1) % filteredTeams.length;
            renderDropdown();
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!filteredTeams.length) return;
            highlightedIndex = (highlightedIndex - 1 + filteredTeams.length) % filteredTeams.length;
            renderDropdown();
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (filteredTeams.length && highlightedIndex >= 0) {
                teamInput.value = filteredTeams[highlightedIndex].name;
                closeDropdown();
            }
            applySearch();
            return;
        }
        if (event.key === 'Escape') {
            closeDropdown();
        }
    });

    teamDropdown.addEventListener('click', (event) => {
        const target = event.target.closest('[data-value]');
        if (!target) return;
        teamInput.value = target.dataset.value;
        closeDropdown();
        applySearch();
    });

    document.addEventListener('click', (event) => {
        if (!teamDropdown.contains(event.target) && event.target !== teamInput) {
            closeDropdown();
        }
    });

    searchButton.addEventListener('click', applySearch);

    vizButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextValue = button.dataset.viz;
            if (!nextValue) return;
            selectedVisualization = nextValue;
            localStorage.setItem(visualizationPreferenceKey, selectedVisualization);
            updateVisualizationControls();
            renderAllStats(activeTeam);
            resetExtraStats();
        });
    });

    recentTabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            activeRecentTab = button.dataset.tab;
            loadRecentGames(activeTeam);
        });
    });

    seasonSelect.addEventListener('change', () => {
        const nextYear = Number(seasonSelect.value);
        if (!nextYear) return;
        activeSeasonYear = nextYear;
        renderAllStats(activeTeam);
        loadRecentGames(activeTeam);
        resetExtraStats();
    });

    toggleExtraStats.addEventListener('click', () => {
        const isHidden = extraStats.classList.contains('hidden');
        extraStats.classList.toggle('hidden');
        toggleExtraStats.textContent = isHidden ? 'Hide' : 'Show';
        toggleExtraStats.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
}

window.renderComparePage = renderComparePage;
