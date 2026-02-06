// ============================================
// BREAKOUT / COOLDOWN PAGE
// ============================================

function renderBreakoutPage() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <div class="page-header" style="margin-bottom: var(--spacing-2xl);">
            <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--spacing-sm);">Breakout / Cooldown</h2>
            <p class="text-muted">Surface players near historical streak ceilings</p>
        </div>
        
        <div class="card mb-xl">
            <div class="form-group">
                <label class="form-label">League</label>
                <select id="bo-league" class="form-select">
                    <option value="nba">NBA</option>
                    <option value="nfl">NFL</option>
                    <option value="nhl">NHL</option>
                </select>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Stat Type</label>
                    <select id="bo-stat-type" class="form-select">
                        <option value="points">Points</option>
                        <option value="rebounds">Rebounds</option>
                        <option value="assists">Assists</option>
                        <option value="steals">Steals</option>
                        <option value="blocks">Blocks</option>
                    </select>
                </div>
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Threshold</label>
                    <input type="number" id="bo-threshold" class="form-input" value="25" placeholder="25">
                </div>
                
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Streak Window</label>
                    <select id="bo-window" class="form-select">
                        <option value="5">Last 5 games</option>
                        <option value="10">Last 10 games</option>
                        <option value="20">Last 20 games</option>
                    </select>
                </div>
            </div>
            
            <button id="run-breakout-btn" class="btn btn-primary">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Find Patterns
            </button>
        </div>
        
        <div id="breakout-results"></div>
    `;

    document.getElementById('run-breakout-btn').addEventListener('click', executeBreakoutAnalysis);
}

async function executeBreakoutAnalysis() {
    const resultsDiv = document.getElementById('breakout-results');
    resultsDiv.innerHTML = showLoadingState('Analyzing streak patterns...');

    await Utils.simulateDelay(1500);

    const streakData = MockData.generateStreakData(15);

    // Sort by percent of max (descending)
    streakData.sort((a, b) => parseFloat(b.percentOfMax) - parseFloat(a.percentOfMax));

    const league = document.getElementById('bo-league').value.toUpperCase();
    const statType = document.getElementById('bo-stat-type').selectedOptions[0].text;
    const threshold = document.getElementById('bo-threshold').value;

    resultsDiv.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="flex-between" style="margin-bottom: var(--spacing-lg);">
                    <div>
                        <h3 class="card-title">Breakout Candidates</h3>
                        <p class="card-subtitle">${league} • ${statType} • Threshold: ${threshold}+</p>
                    </div>
                    <button id="save-breakout-preset-btn" class="btn btn-secondary">
                        <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        </svg>
                        Save as Preset
                    </button>
                </div>
            </div>
            
            <div style="margin-bottom: var(--spacing-lg);">
                <div class="badge badge-warning">
                    ⚡ ${streakData.filter(s => parseFloat(s.percentOfMax) > 85).length} players at risk of cooldown
                </div>
                <div class="badge badge-success" style="margin-left: var(--spacing-sm);">
                    🔥 ${streakData.filter(s => parseFloat(s.percentOfMax) > 90).length} near historical max
                </div>
            </div>
            
            ${createDataTable({
        columns: [
            { key: 'player', label: 'Player' },
            { key: 'currentStreak', label: 'Current Streak', numeric: true },
            { key: 'historicalMax', label: 'Historical Max', numeric: true },
            { key: 'percentOfMax', label: '% of Max', numeric: true },
            { key: 'status', label: 'Status' }
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
        return '<span class="badge badge-error">🔥 Critical</span>';
    } else if (percentOfMax >= 85) {
        return '<span class="badge badge-warning">⚠️ High</span>';
    } else if (percentOfMax >= 70) {
        return '<span class="badge badge-info">📈 Elevated</span>';
    } else {
        return '<span class="badge badge-success">✓ Normal</span>';
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
