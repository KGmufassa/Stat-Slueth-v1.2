// ============================================
// DATA HEALTH PAGE
// ============================================

function renderDataHealthPage() {
    const content = document.getElementById('app-content');

    // Mock data health information
    const healthData = [
        {
            league: 'NBA',
            lastIngestion: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
            coverage: '2023-24 Season • 1,230 games',
            gamesCount: 1230,
            status: 'ok'
        },
        {
            league: 'NFL',
            lastIngestion: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            coverage: '2023-24 Season • 272 games',
            gamesCount: 272,
            status: 'ok'
        },
        {
            league: 'NHL',
            lastIngestion: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
            coverage: '2023-24 Season • 1,312 games',
            gamesCount: 1312,
            status: 'stale'
        }
    ];

    content.innerHTML = `
        <div class="page-header" style="margin-bottom: var(--spacing-2xl);">
            <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--spacing-sm);">Data Health</h2>
            <p class="text-muted">Trust and debugging information</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
            ${healthData.map(league => createHealthCard(league)).join('')}
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">System Status</h3>
            </div>
            
            <div style="display: grid; gap: var(--spacing-md);">
                ${createStatusRow('Data Ingestion Pipeline', 'ok', 'All leagues processing normally')}
                ${createStatusRow('API Endpoints', 'ok', 'All endpoints responding')}
                ${createStatusRow('Cache Layer', 'ok', 'Redis cache operational')}
                ${createStatusRow('Database', 'ok', 'PostgreSQL healthy')}
            </div>
        </div>
    `;
}

function createHealthCard(league) {
    const statusConfig = {
        ok: {
            badge: 'badge-success',
            icon: '✓',
            label: 'OK',
            dotClass: 'success'
        },
        stale: {
            badge: 'badge-warning',
            icon: '⚠',
            label: 'Stale',
            dotClass: 'warning'
        },
        error: {
            badge: 'badge-error',
            icon: '✕',
            label: 'Error',
            dotClass: 'error'
        }
    };

    const config = statusConfig[league.status];

    return `
        <div class="card">
            <div class="flex-between" style="margin-bottom: var(--spacing-lg);">
                <h3 style="font-size: 1.5rem; font-weight: 700;">${league.league}</h3>
                <span class="badge ${config.badge}">
                    <span class="status-dot ${config.dotClass}"></span>
                    ${config.label}
                </span>
            </div>
            
            <div style="display: grid; gap: var(--spacing-md);">
                <div>
                    <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--spacing-xs);">
                        Last Ingestion
                    </div>
                    <div style="font-weight: 600; font-size: 0.875rem;">
                        ${Utils.timeAgo(league.lastIngestion)}
                    </div>
                    <div class="text-muted" style="font-size: 0.75rem;">
                        ${Utils.formatDate(league.lastIngestion)} ${new Date(league.lastIngestion).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                
                <div>
                    <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--spacing-xs);">
                        Coverage
                    </div>
                    <div style="font-weight: 600; font-size: 0.875rem;">
                        ${league.coverage}
                    </div>
                </div>
                
                <div>
                    <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--spacing-xs);">
                        Total Games
                    </div>
                    <div class="table-numeric" style="font-weight: 700; font-size: 1.25rem; color: var(--color-secondary);">
                        ${league.gamesCount.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createStatusRow(component, status, message) {
    const statusConfig = {
        ok: {
            badge: 'badge-success',
            icon: '✓',
            label: 'OK',
            dotClass: 'success'
        },
        warning: {
            badge: 'badge-warning',
            icon: '⚠',
            label: 'Warning',
            dotClass: 'warning'
        },
        error: {
            badge: 'badge-error',
            icon: '✕',
            label: 'Error',
            dotClass: 'error'
        }
    };

    const config = statusConfig[status];

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
            <div>
                <div style="font-weight: 600; margin-bottom: var(--spacing-xs);">${component}</div>
                <div class="text-muted" style="font-size: 0.875rem;">${message}</div>
            </div>
            <span class="badge ${config.badge}">
                <span class="status-dot ${config.dotClass}"></span>
                ${config.label}
            </span>
        </div>
    `;
}

// Export for router
window.renderDataHealthPage = renderDataHealthPage;
