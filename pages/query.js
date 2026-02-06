// ============================================
// QUERY PAGE
// ============================================

function renderQueryPage() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <div class="page-header" style="margin-bottom: var(--spacing-2xl);">
            <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--spacing-sm);">Query</h2>
            <p class="text-muted">Ask complex sports-stat questions in natural language</p>
        </div>
        
        <div class="card mb-xl">
            <div class="form-group">
                <label class="form-label">League</label>
                <select id="league-select" class="form-select">
                    <option value="auto">Auto-detect</option>
                    <option value="nba">NBA</option>
                    <option value="nfl">NFL</option>
                    <option value="nhl">NHL</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Query</label>
                <textarea id="query-input" class="form-textarea" 
                    placeholder="e.g., Show me players averaging 25+ points in the last 10 games"></textarea>
            </div>
            
            <div class="btn-group">
                <button id="run-query-btn" class="btn btn-primary">
                    <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    Run Query
                </button>
                <button id="example-query-btn" class="btn btn-secondary">Load Example</button>
            </div>
        </div>
        
        <div id="query-results"></div>
    `;

    // Event listeners
    document.getElementById('run-query-btn').addEventListener('click', executeQuery);
    document.getElementById('example-query-btn').addEventListener('click', loadExampleQuery);
}

async function executeQuery() {
    const query = document.getElementById('query-input').value.trim();
    const league = document.getElementById('league-select').value;

    if (!query) {
        alert('Please enter a query');
        return;
    }

    const resultsDiv = document.getElementById('query-results');
    resultsDiv.innerHTML = showLoadingState('Processing query...');

    // Simulate processing
    await Utils.simulateDelay(1500);

    // Generate mock results
    const mockResults = MockData.generatePlayerStats(10);

    // Calculate summary stats
    const avgPoints = (mockResults.reduce((sum, p) => sum + parseFloat(p.points), 0) / mockResults.length).toFixed(1);
    const avgAssists = (mockResults.reduce((sum, p) => sum + parseFloat(p.assists), 0) / mockResults.length).toFixed(1);
    const avgRebounds = (mockResults.reduce((sum, p) => sum + parseFloat(p.rebounds), 0) / mockResults.length).toFixed(1);
    const totalGames = mockResults.reduce((sum, p) => sum + p.gamesPlayed, 0);

    const filters = [
        { key: 'league', label: 'League', value: league.toUpperCase() },
        { key: 'timeframe', label: 'Timeframe', value: 'Last 10 games' },
        { key: 'threshold', label: 'Threshold', value: '25+ points' }
    ];

    resultsDiv.innerHTML = `
        <div class="card mb-xl">
            <div class="card-header">
                <div class="flex-between">
                    <div>
                        <h3 class="card-title">Results</h3>
                        <p class="card-subtitle">Query: "${query}"</p>
                    </div>
                    <div class="btn-group">
                        <button id="save-preset-btn" class="btn btn-secondary">
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            </svg>
                            Save as Preset
                        </button>
                        <button id="export-csv-btn" class="btn btn-secondary">
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>
            
            ${createFilterChips(filters)}
            
            <div class="kpi-grid mb-lg">
                ${createKPICard({
        label: 'Average Points',
        value: avgPoints,
        sampleSize: mockResults.length,
        trend: 'per player'
    })}
                ${createKPICard({
        label: 'Average Assists',
        value: avgAssists,
        sampleSize: mockResults.length,
        trend: 'per player'
    })}
                ${createKPICard({
        label: 'Average Rebounds',
        value: avgRebounds,
        sampleSize: mockResults.length,
        trend: 'per player'
    })}
                ${createKPICard({
        label: 'Total Games',
        value: totalGames,
        trend: 'sample size'
    })}
            </div>
            
            ${createDataTable({
        columns: [
            { key: 'player', label: 'Player' },
            { key: 'team', label: 'Team' },
            { key: 'gamesPlayed', label: 'Games', numeric: true },
            { key: 'points', label: 'PTS', numeric: true },
            { key: 'rebounds', label: 'REB', numeric: true },
            { key: 'assists', label: 'AST', numeric: true },
            { key: 'fieldGoalPct', label: 'FG%', numeric: true }
        ],
        data: mockResults
    })}
        </div>
    `;

    // Add event listeners for actions
    document.getElementById('save-preset-btn').addEventListener('click', () => saveAsPreset(query, league, mockResults));
    document.getElementById('export-csv-btn').addEventListener('click', () => Utils.exportToCSV(mockResults, 'query-results.csv'));
}

function loadExampleQuery() {
    document.getElementById('query-input').value = 'Show me players averaging 25+ points in the last 10 games';
    document.getElementById('league-select').value = 'nba';
}

function saveAsPreset(query, league, results) {
    const presetName = prompt('Enter a name for this preset:', query.substring(0, 50));
    if (presetName) {
        AppState.addPreset({
            name: presetName,
            type: 'Single Query',
            league: league.toUpperCase(),
            query: query,
            metric: 'Points',
            results: results
        });
        alert('Preset saved successfully!');
    }
}

// Export for router
window.renderQueryPage = renderQueryPage;
