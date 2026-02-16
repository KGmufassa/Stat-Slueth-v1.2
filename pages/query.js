// ============================================
// QUERY PAGE - Convex-Powered Query Canvas
// ============================================

const QUERY_PAGE_STATE = {
    rows: [],
    continueCursor: null,
    isDone: true,
    isLoading: false,
    error: null,
    seasonYear: 2023,
    pageSize: 25,
};

function getConvexUrl() {
    const runtimeConfig = window.RUNTIME_CONFIG || {};
    const configuredUrl = runtimeConfig.convexUrl || localStorage.getItem('statsleuths_convex_url') || 'http://127.0.0.1:3210';
    return String(configuredUrl).replace(/\/$/, '');
}

async function runConvexQuery(path, args) {
    const response = await fetch(`${getConvexUrl()}/api/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, args }),
    });

    if (!response.ok) {
        throw new Error(`Convex request failed (${response.status})`);
    }

    const payload = await response.json();
    if (payload.status !== 'success') {
        const message = payload.errorMessage || 'Convex query failed.';
        throw new Error(message);
    }

    return payload.value;
}

function getQueryInputValue() {
    const input = document.getElementById('query-input');
    return input ? input.value.trim() : '';
}

function updateResultsMarkup() {
    const resultsDiv = document.getElementById('query-results');
    if (!resultsDiv) return;

    if (QUERY_PAGE_STATE.isLoading) {
        resultsDiv.innerHTML = getQueryLoadingMarkup();
        return;
    }

    if (QUERY_PAGE_STATE.error) {
        resultsDiv.innerHTML = getQueryErrorMarkup(QUERY_PAGE_STATE.error);
        attachResultActions();
        return;
    }

    if (QUERY_PAGE_STATE.rows.length === 0) {
        resultsDiv.innerHTML = getQueryEmptyStateMarkup();
        return;
    }

    resultsDiv.innerHTML = getQueryResultsMarkup(QUERY_PAGE_STATE);
    attachResultActions();
}

function renderQueryPage() {
    const content = document.getElementById('app-content');
    if (!content) return;
    const activeQuery = window.AppState && typeof AppState.getActiveQuery === 'function'
        ? AppState.getActiveQuery()
        : null;

    content.innerHTML = `
        <div class="flex flex-col h-full gap-6">
            <section class="flex flex-col lg:flex-row items-stretch gap-4">
                <div class="w-full lg:w-44 shrink-0">
                    <label class="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1">Sport</label>
                    <div class="relative">
                        <select id="league-select" class="appearance-none w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-white dark:bg-[#192233] h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer">
                            <option value="nba">NBA Basketball</option>
                            <option value="auto">Auto-Detect</option>
                            <option value="nfl">NFL Football</option>
                            <option value="mlb">MLB Baseball</option>
                        </select>
                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">unfold_more</span>
                    </div>
                </div>
                <div class="w-full lg:w-36 shrink-0">
                    <label class="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1">Season</label>
                    <input id="season-year-input" type="number" min="1946" max="2100" value="${QUERY_PAGE_STATE.seasonYear}"
                        class="w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-white dark:bg-[#192233] h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div class="flex-1">
                    <label class="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1">Context Query</label>
                    <div class="flex w-full items-stretch gap-2">
                        <div class="flex flex-1 items-stretch rounded-lg h-11 bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-primary transition-all shadow-sm">
                            <div class="text-slate-400 flex items-center justify-center px-4">
                                <span class="material-symbols-outlined text-lg">search</span>
                            </div>
                            <input id="query-input" class="flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-500 text-sm"
                                placeholder="Example: Show 2023 box scores with top assist games" />
                            <button id="clear-query-btn" class="px-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <span class="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                        <button id="run-query-btn" class="bg-primary hover:brightness-110 text-white text-[11px] font-bold px-6 h-11 rounded-lg transition-all uppercase tracking-wider shadow-lg shadow-primary/20">Analyze</button>
                    </div>
                </div>
            </section>

            <div id="query-results" class="flex-1 flex flex-col gap-6"></div>
        </div>
    `;

    const queryInput = document.getElementById('query-input');
    if (queryInput && activeQuery && activeQuery.queryText) {
        queryInput.value = activeQuery.queryText;
    }

    if (queryInput && window.AppState && typeof AppState.updateActiveQueryText === 'function') {
        queryInput.addEventListener('input', (event) => {
            AppState.updateActiveQueryText(event.target.value);
        });
    }

    const seasonInput = document.getElementById('season-year-input');
    if (seasonInput) {
        seasonInput.addEventListener('change', () => {
            const nextYear = Number(seasonInput.value);
            if (Number.isFinite(nextYear) && nextYear >= 1946 && nextYear <= 2100) {
                QUERY_PAGE_STATE.seasonYear = nextYear;
            }
        });
    }

    const runButton = document.getElementById('run-query-btn');
    if (runButton) {
        runButton.addEventListener('click', () => {
            executeQuery(false);
        });
    }

    const clearBtn = document.getElementById('clear-query-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const input = document.getElementById('query-input');
            if (input) {
                input.value = '';
            }
            QUERY_PAGE_STATE.rows = [];
            QUERY_PAGE_STATE.continueCursor = null;
            QUERY_PAGE_STATE.isDone = true;
            QUERY_PAGE_STATE.error = null;
            updateResultsMarkup();
        });
    }

    updateResultsMarkup();
}

async function executeQuery(append) {
    const leagueSelect = document.getElementById('league-select');
    const league = leagueSelect ? leagueSelect.value : 'nba';
    const queryText = getQueryInputValue();

    if (league !== 'nba') {
        QUERY_PAGE_STATE.error = 'Convex data is currently wired for NBA only. Switch Sport to NBA.';
        QUERY_PAGE_STATE.isLoading = false;
        updateResultsMarkup();
        return;
    }

    const seasonInput = document.getElementById('season-year-input');
    const selectedYear = seasonInput ? Number(seasonInput.value) : QUERY_PAGE_STATE.seasonYear;
    if (!Number.isFinite(selectedYear) || selectedYear < 1946 || selectedYear > 2100) {
        QUERY_PAGE_STATE.error = 'Enter a valid season year between 1946 and 2100.';
        updateResultsMarkup();
        return;
    }
    QUERY_PAGE_STATE.seasonYear = selectedYear;

    if (!append) {
        QUERY_PAGE_STATE.rows = [];
        QUERY_PAGE_STATE.continueCursor = null;
        QUERY_PAGE_STATE.isDone = false;
    }

    QUERY_PAGE_STATE.isLoading = true;
    QUERY_PAGE_STATE.error = null;
    updateResultsMarkup();

    try {
        const result = await runConvexQuery('nba:listBoxScoresBySeason', {
            seasonYear: QUERY_PAGE_STATE.seasonYear,
            paginationOpts: {
                numItems: QUERY_PAGE_STATE.pageSize,
                cursor: append ? QUERY_PAGE_STATE.continueCursor : null,
            },
        });

        QUERY_PAGE_STATE.rows = append
            ? QUERY_PAGE_STATE.rows.concat(result.page || [])
            : (result.page || []);
        QUERY_PAGE_STATE.continueCursor = result.continueCursor || null;
        QUERY_PAGE_STATE.isDone = Boolean(result.isDone);

        if (window.AppState && typeof AppState.markActiveQueryAnalyzed === 'function') {
            AppState.markActiveQueryAnalyzed(queryText || `NBA box scores ${QUERY_PAGE_STATE.seasonYear}`, 'nba');
        }
    } catch (error) {
        QUERY_PAGE_STATE.error = error instanceof Error ? error.message : 'Error fetching Convex data.';
        console.error(error);
    } finally {
        QUERY_PAGE_STATE.isLoading = false;
        updateResultsMarkup();
    }
}

function attachResultActions() {
    const loadMoreButton = document.getElementById('load-more-boxscores-btn');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            executeQuery(true);
        });
    }

    const retryButton = document.getElementById('retry-query-btn');
    if (retryButton) {
        retryButton.addEventListener('click', () => {
            executeQuery(false);
        });
    }
}

function getQueryLoadingMarkup() {
    return `
        <div class="flex-1 flex flex-col items-center justify-center gap-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/30 dark:bg-white/5 p-8">
            <div class="spinner"></div>
            <p class="text-slate-500 text-sm">Loading box score data from Convex...</p>
        </div>
    `;
}

function getQueryErrorMarkup(message) {
    return `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 border border-rose-300/40 dark:border-rose-500/30 rounded-xl bg-rose-50/60 dark:bg-rose-950/20">
            <span class="material-symbols-outlined text-3xl text-rose-500 mb-3">error</span>
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Could not load Convex data</h3>
            <p class="text-rose-700 dark:text-rose-200 text-sm max-w-lg mb-4">${message}</p>
            <button id="retry-query-btn" class="bg-primary hover:brightness-110 text-white text-[11px] font-bold px-5 h-10 rounded-lg transition-all uppercase tracking-wider">Retry</button>
        </div>
    `;
}

function getQueryEmptyStateMarkup() {
    return `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-white/5">
            <div class="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span class="material-symbols-outlined text-3xl text-primary">database</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to Query Convex</h3>
            <p class="text-slate-500 max-w-sm text-sm">Select an NBA season and click Analyze to fetch paginated box score data from Convex.</p>
        </div>
    `;
}

function getAverage(rows, key) {
    if (!rows.length) return '0.0';
    let total = 0;
    for (const row of rows) {
        total += Number(row[key] || 0);
    }
    return (total / rows.length).toFixed(1);
}

function getQueryResultsMarkup(state) {
    const uniquePlayers = new Set(state.rows.map((row) => row.personId)).size;
    const uniqueGames = new Set(state.rows.map((row) => row.gameId)).size;
    const avgPoints = getAverage(state.rows, 'points');
    const avgAssists = getAverage(state.rows, 'assists');
    const avgRebounds = getAverage(state.rows, 'reboundsTotal');

    const tableRowsMarkup = state.rows.map((row) => {
        const plusMinus = Number(row.plusMinusPoints || 0);
        const plusMinusClass = plusMinus >= 0 ? 'text-emerald-500' : 'text-rose-500';
        return `
            <tr class="hover:bg-primary/5 transition-colors border-b border-slate-100 dark:border-white/5">
                <td class="px-3 py-2 text-slate-500 dark:text-slate-300">${row.gameDateTimeEst || '--'}</td>
                <td class="px-3 py-2 font-semibold text-slate-900 dark:text-white">${row.firstName || ''} ${row.lastName || ''}</td>
                <td class="px-3 py-2 text-slate-500 dark:text-slate-300">${row.playerTeamName || '--'}</td>
                <td class="px-3 py-2 text-slate-500 dark:text-slate-300">${row.opponentTeamName || '--'}</td>
                <td class="px-3 py-2 text-slate-900 dark:text-white font-semibold">${row.points ?? '--'}</td>
                <td class="px-3 py-2 text-slate-900 dark:text-white font-semibold">${row.assists ?? '--'}</td>
                <td class="px-3 py-2 text-slate-900 dark:text-white font-semibold">${row.reboundsTotal ?? '--'}</td>
                <td class="px-3 py-2 font-semibold ${plusMinusClass}">${plusMinus >= 0 ? '+' : ''}${plusMinus}</td>
            </tr>
        `;
    }).join('');

    return `
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Convex Box Score Query</h2>
                <p class="text-slate-500 text-xs mt-1">Season ${state.seasonYear} · ${state.rows.length} rows loaded</p>
            </div>
            <span class="bg-primary/15 border border-primary/30 text-primary text-[10px] px-2 py-1 rounded font-mono">${state.isDone ? 'Complete' : 'Paginated'}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rows</p>
                <p class="text-slate-900 dark:text-white text-2xl font-extrabold mt-1">${state.rows.length}</p>
            </div>
            <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Players</p>
                <p class="text-slate-900 dark:text-white text-2xl font-extrabold mt-1">${uniquePlayers}</p>
            </div>
            <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Games</p>
                <p class="text-slate-900 dark:text-white text-2xl font-extrabold mt-1">${uniqueGames}</p>
            </div>
            <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Avg PTS</p>
                <p class="text-slate-900 dark:text-white text-2xl font-extrabold mt-1">${avgPoints}</p>
            </div>
            <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Avg AST / REB</p>
                <p class="text-slate-900 dark:text-white text-2xl font-extrabold mt-1">${avgAssists} / ${avgRebounds}</p>
            </div>
        </div>

        <div class="bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                <h3 class="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">NBA Player Box Scores</h3>
                <span class="text-slate-500 text-[10px]">Source: Convex</span>
            </div>
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left text-[11px] border-collapse">
                    <thead>
                        <tr class="text-slate-500 bg-slate-50 dark:bg-background-dark/50 uppercase text-[9px] tracking-wider">
                            <th class="px-3 py-2">Date</th>
                            <th class="px-3 py-2">Player</th>
                            <th class="px-3 py-2">Team</th>
                            <th class="px-3 py-2">Opp</th>
                            <th class="px-3 py-2">PTS</th>
                            <th class="px-3 py-2">AST</th>
                            <th class="px-3 py-2">REB</th>
                            <th class="px-3 py-2">+/-</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsMarkup}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <p class="text-xs text-slate-500">Endpoint: ${getConvexUrl()}</p>
            <button id="load-more-boxscores-btn" ${state.isDone ? 'disabled' : ''}
                class="bg-primary hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-bold px-5 h-10 rounded-lg transition-all uppercase tracking-wider">
                ${state.isDone ? 'No More Rows' : 'Load More'}
            </button>
        </div>
    `;
}

window.renderQueryPage = renderQueryPage;
