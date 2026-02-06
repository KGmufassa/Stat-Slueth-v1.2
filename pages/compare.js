// ============================================
// COMPARE PAGE
// ============================================

function renderComparePage() {
    const content = document.getElementById('app-content');

    content.innerHTML = `
        <div class="page-header" style="margin-bottom: var(--spacing-2xl);">
            <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--spacing-sm);">Compare</h2>
            <p class="text-muted">Side-by-side statistical comparison</p>
        </div>
        
        <div class="card mb-xl">
            <div class="form-group">
                <label class="form-label">Comparison Type</label>
                <div class="btn-group" id="compare-type-toggle">
                    <button class="btn btn-secondary active" data-type="player">Player</button>
                    <button class="btn btn-secondary" data-type="team">Team</button>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Select Entities (Max 2)</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                    <select id="entity-1" class="form-select">
                        <option value="">Select first player...</option>
                        <option value="lebron">LeBron James</option>
                        <option value="curry">Stephen Curry</option>
                        <option value="durant">Kevin Durant</option>
                        <option value="giannis">Giannis Antetokounmpo</option>
                        <option value="jokic">Nikola Jokic</option>
                    </select>
                    <select id="entity-2" class="form-select">
                        <option value="">Select second player...</option>
                        <option value="lebron">LeBron James</option>
                        <option value="curry">Stephen Curry</option>
                        <option value="durant">Kevin Durant</option>
                        <option value="giannis">Giannis Antetokounmpo</option>
                        <option value="jokic">Nikola Jokic</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Metric Bundle</label>
                <select id="metric-bundle" class="form-select">
                    <option value="scoring">Scoring / Production</option>
                    <option value="winloss">Win/Loss & Win %</option>
                    <option value="streaks">Streaks</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Filters</label>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-md);">
                    <select class="form-select">
                        <option>Last 10 games</option>
                        <option>Last 20 games</option>
                        <option>Season</option>
                    </select>
                    <select class="form-select">
                        <option>All games</option>
                        <option>Home only</option>
                        <option>Away only</option>
                    </select>
                    <select class="form-select">
                        <option>Regular season</option>
                        <option>Playoffs</option>
                    </select>
                </div>
            </div>
            
            <button id="run-compare-btn" class="btn btn-primary">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <path d="M14 14h7v7h-7z"></path>
                    <path d="M3 14h7v7H3z"></path>
                </svg>
                Compare
            </button>
        </div>
        
        <div id="compare-results"></div>
    `;

    // Event listeners
    const typeButtons = document.querySelectorAll('#compare-type-toggle button');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateEntitySelectors(btn.dataset.type);
        });
    });

    document.getElementById('run-compare-btn').addEventListener('click', executeComparison);
}

function updateEntitySelectors(type) {
    const entity1 = document.getElementById('entity-1');
    const entity2 = document.getElementById('entity-2');

    if (type === 'team') {
        entity1.innerHTML = `
            <option value="">Select first team...</option>
            <option value="lakers">Lakers</option>
            <option value="warriors">Warriors</option>
            <option value="celtics">Celtics</option>
            <option value="heat">Heat</option>
            <option value="bucks">Bucks</option>
        `;
        entity2.innerHTML = entity1.innerHTML;
    } else {
        entity1.innerHTML = `
            <option value="">Select first player...</option>
            <option value="lebron">LeBron James</option>
            <option value="curry">Stephen Curry</option>
            <option value="durant">Kevin Durant</option>
            <option value="giannis">Giannis Antetokounmpo</option>
            <option value="jokic">Nikola Jokic</option>
        `;
        entity2.innerHTML = entity1.innerHTML;
    }
}

async function executeComparison() {
    const entity1 = document.getElementById('entity-1').value;
    const entity2 = document.getElementById('entity-2').value;

    if (!entity1 || !entity2) {
        alert('Please select two entities to compare');
        return;
    }

    if (entity1 === entity2) {
        alert('Please select different entities');
        return;
    }

    const resultsDiv = document.getElementById('compare-results');
    resultsDiv.innerHTML = showLoadingState('Generating comparison...');

    await Utils.simulateDelay(1200);

    const entity1Name = document.getElementById('entity-1').selectedOptions[0].text;
    const entity2Name = document.getElementById('entity-2').selectedOptions[0].text;

    // Mock comparison data
    const stats1 = {
        points: (28.5).toFixed(1),
        rebounds: (7.3).toFixed(1),
        assists: (6.8).toFixed(1),
        fieldGoalPct: (52.3).toFixed(1),
        gamesPlayed: 18
    };

    const stats2 = {
        points: (31.2).toFixed(1),
        rebounds: (5.1).toFixed(1),
        assists: (5.4).toFixed(1),
        fieldGoalPct: (48.7).toFixed(1),
        gamesPlayed: 20
    };

    resultsDiv.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Comparison Results</h3>
                <p class="card-subtitle">${entity1Name} vs ${entity2Name} • Last 10 games • Regular season</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
                <div class="text-center">
                    <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-secondary);">
                        ${entity1Name}
                    </div>
                    <div class="text-muted" style="font-size: 0.875rem;">N=${stats1.gamesPlayed} games</div>
                </div>
                
                <div style="width: 2px; background: var(--color-border);"></div>
                
                <div class="text-center">
                    <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-primary-start);">
                        ${entity2Name}
                    </div>
                    <div class="text-muted" style="font-size: 0.875rem;">N=${stats2.gamesPlayed} games</div>
                </div>
            </div>
            
            ${createComparisonRow('Points Per Game', stats1.points, stats2.points)}
            ${createComparisonRow('Rebounds Per Game', stats1.rebounds, stats2.rebounds)}
            ${createComparisonRow('Assists Per Game', stats1.assists, stats2.assists)}
            ${createComparisonRow('Field Goal %', stats1.fieldGoalPct, stats2.fieldGoalPct, true)}
        </div>
    `;
}

function createComparisonRow(label, value1, value2, isPercentage = false) {
    const val1 = parseFloat(value1);
    const val2 = parseFloat(value2);
    const delta = Math.abs(val1 - val2).toFixed(1);
    const winner = val1 > val2 ? 'left' : 'right';
    const suffix = isPercentage ? '%' : '';

    return `
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: var(--spacing-lg); padding: var(--spacing-lg); border-bottom: 1px solid var(--color-border);">
            <div class="text-center">
                <div class="table-numeric" style="font-size: 1.75rem; font-weight: 700; ${winner === 'left' ? 'color: var(--color-success);' : ''}">
                    ${value1}${suffix}
                </div>
            </div>
            
            <div class="text-center" style="min-width: 150px;">
                <div class="text-muted" style="font-size: 0.875rem; margin-bottom: var(--spacing-xs);">${label}</div>
                <div class="badge badge-info">Δ ${delta}${suffix}</div>
            </div>
            
            <div class="text-center">
                <div class="table-numeric" style="font-size: 1.75rem; font-weight: 700; ${winner === 'right' ? 'color: var(--color-success);' : ''}">
                    ${value2}${suffix}
                </div>
            </div>
        </div>
    `;
}

// Export for router
window.renderComparePage = renderComparePage;
