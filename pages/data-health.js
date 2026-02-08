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
        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-2">
                <h2 class="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Data Health</h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm">System status, ingestion latency, and coverage metrics</p>
            </div>
            
            <!-- League Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                ${healthData.map(league => createHealthCard(league)).join('')}
            </div>
            
            <!-- System Status -->
             <div class="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-[#1e293b] shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 dark:border-[#1e293b] bg-slate-50/50 dark:bg-white/[0.01]">
                    <h3 class="font-bold text-slate-900 dark:text-white">System Components</h3>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-[#1e293b]">
                    ${createStatusRow('Data Ingestion Pipeline', 'ok', 'All leagues processing normally')}
                    ${createStatusRow('API Endpoints', 'ok', 'All endpoints responding < 50ms')}
                    ${createStatusRow('Cache Layer', 'ok', 'Redis cluster operational (99.8% hit rate)')}
                    ${createStatusRow('Database', 'ok', 'PostgreSQL healthy, replication lag < 1s')}
                </div>
            </div>
        </div>
    `;
}

function createHealthCard(league) {
    const statusConfig = {
        ok: {
            bg: 'bg-emerald-500',
            text: 'text-emerald-500',
            badgeBg: 'bg-emerald-50 dark:bg-emerald-500/10',
            label: 'Operational'
        },
        stale: {
            bg: 'bg-orange-500',
            text: 'text-orange-500',
            badgeBg: 'bg-orange-50 dark:bg-orange-500/10',
            label: 'Degraded'
        },
        error: {
            bg: 'bg-red-500',
            text: 'text-red-500',
            badgeBg: 'bg-red-50 dark:bg-red-500/10',
            label: 'Outage'
        }
    };

    const config = statusConfig[league.status];

    return `
        <div class="bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-[#1e293b] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-1 h-full ${config.bg}"></div>
            
            <div class="flex justify-between items-start mb-6">
                <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${league.league}</h3>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.badgeBg} ${config.text} text-[10px] font-bold uppercase tracking-wider border border-transparent">
                    <span class="size-1.5 rounded-full ${config.bg}"></span>
                    ${config.label}
                </span>
            </div>
            
            <div class="space-y-4">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Ingestion</p>
                    <div class="flex items-baseline gap-2">
                        <span class="text-slate-900 dark:text-white font-bold text-sm">${Utils.timeAgo(league.lastIngestion)}</span>
                        <span class="text-slate-400 text-xs">${new Date(league.lastIngestion).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Coverage</p>
                    <p class="text-slate-900 dark:text-white font-semibold text-sm">${league.coverage}</p>
                </div>
                
                <div class="pt-4 border-t border-slate-100 dark:border-[#1e293b] flex items-center justify-between">
                     <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Games</p>
                     <p class="text-lg font-black text-slate-900 dark:text-white font-mono">${league.gamesCount.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
}

function createStatusRow(component, status, message) {
    const statusConfig = {
        ok: {
            icon: 'check_circle',
            color: 'text-emerald-500'
        },
        warning: {
            icon: 'warning',
            color: 'text-orange-500'
        },
        error: {
            icon: 'error',
            color: 'text-red-500'
        }
    };

    const config = statusConfig[status];

    return `
        <div class="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
            <div class="flex items-center gap-4">
                <span class="material-symbols-outlined ${config.color}">${config.icon}</span>
                <div>
                    <p class="text-sm font-bold text-slate-900 dark:text-white">${component}</p>
                     <p class="text-xs text-slate-500">${message}</p>
                </div>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                 <button class="text-slate-400 hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-lg">more_horiz</span>
                </button>
            </div>
        </div>
    `;
}

// Export for router
window.renderDataHealthPage = renderDataHealthPage;
