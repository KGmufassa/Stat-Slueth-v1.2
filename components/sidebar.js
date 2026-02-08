// ============================================
// DYNAMIC SIDEBAR MANAGER
// ============================================

const Sidebar = {
    render(page) {
        const sidebar = document.getElementById('app-sidebar');
        if (!sidebar) return;

        let content = '';

        switch (page) {
            case 'query':
                content = this.renderQuerySidebar();
                break;
            case 'player':
            case 'breakout': // Fallback for team stats
            case 'head-to-head':
            case 'scouting-report':
            case 'advanced-analytics':
            case 'injuries':
                content = this.renderPlayerSidebar(page);
                break;
            case 'scanner':
                content = this.renderScannerSidebar();
                break;
            case 'presets':
                content = this.renderPresetsSidebar();
                break;
            case 'compare':
                content = this.renderPlayerSidebar(page);
                break;
            case 'data-health':
                content = this.renderDataHealthSidebar();
                break;
            default:
                content = this.renderDefaultSidebar();
        }

        sidebar.innerHTML = content;
    },

    // 1. SLEUTH HOUND (Recent Queries)
    renderQuerySidebar() {
        return `
            <div class="flex flex-col h-full">
                <div class="px-6 mb-4 flex items-center justify-between">
                     <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Queries</h3>
                     <span class="material-symbols-outlined text-slate-500 text-sm cursor-pointer hover:text-white transition-colors">history</span>
                </div>
                <div class="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
                    ${this.renderQueryItem('LeBron vs Durant 23-24', true)}
                    ${this.renderQueryItem('Curry 3P% last 10 games')}
                    ${this.renderQueryItem('Nuggets Bench Efficiency')}
                    ${this.renderQueryItem('Wemby Blocks vs HOU')}
                    ${this.renderQueryItem('Top 10 TS% Min 20 PPG')}
                    ${this.renderQueryItem('LAL Defensive Rating March')}
                </div>
                <div class="p-4 mt-auto border-t border-slate-200 dark:border-[#1E293B]">
                    <button class="w-full flex items-center justify-center gap-2 bg-[#1E293B] text-white h-10 rounded-lg text-sm font-bold hover:bg-[#2d3748] transition-all shadow-sm">
                        <span class="material-symbols-outlined text-lg">add</span>
                        New Query
                    </button>
                </div>
            </div>
        `;
    },

    renderQueryItem(text, active = false) {
        const activeClass = active ? 'bg-[#1E293B] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5';
        const iconColor = active ? 'text-primary' : 'text-slate-500';

        return `
            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group text-left ${activeClass}">
                <span class="material-symbols-outlined text-[16px] ${iconColor} group-hover:text-primary transition-colors">search</span>
                <span class="truncate">${text}</span>
            </button>
        `;
    },

    // 2. PLAYER / DEFAULT (Analysis Toolset)
    renderPlayerSidebar(activePage = 'player') {
        return `
            <!-- Analysis Toolset Section -->
            <div class="mb-8">
                <h3 class="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Analysis Toolset</h3>
                <nav class="flex flex-col space-y-0.5 px-3">
                    ${this.renderNavLink('player', 'bar_chart', 'Player Stats', activePage === 'player')}
                    ${this.renderNavLink('compare', 'groups', 'Team Stats', activePage === 'compare')}
                    ${this.renderNavLink('head-to-head', 'compare_arrows', 'Head-to-Head', activePage === 'head-to-head')}
                    ${this.renderNavLink('advanced-analytics', 'auto_graph', 'Advanced Analytics', activePage === 'advanced-analytics')}
                    ${this.renderNavLink('injuries', 'medical_services', 'Injuries', activePage === 'injuries')}
                </nav>
            </div>
        `;
    },

    // 3. SCANNER (Scanner Tools)
    renderScannerSidebar() {
        return `
            <div class="mb-8">
                <h3 class="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Scanner Tools</h3>
                <nav class="flex flex-col space-y-0.5 px-3">
                    <button class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-white shadow-glow-sm transition-all mb-2">
                        <span class="material-symbols-outlined text-[20px]">bolt</span>
                        <span>New Scan</span>
                    </button>
                     <div class="pl-3 mt-2 space-y-1">
                        <div class="flex items-center justify-between text-slate-400 text-xs px-3 py-2 font-bold uppercase tracking-wider cursor-pointer hover:text-white">
                            <span>Archive</span>
                            <span class="material-symbols-outlined text-sm">expand_more</span>
                        </div>
                        <a href="#" class="block px-3 py-1.5 text-xs text-slate-500 hover:text-primary transition-colors pl-6">Player Props</a>
                        <a href="#" class="block px-3 py-1.5 text-xs text-slate-500 hover:text-primary transition-colors pl-6">Team Trends</a>
                        <a href="#" class="block px-3 py-1.5 text-xs text-slate-500 hover:text-primary transition-colors pl-6">Saved Alerts</a>
                    </div>
                </nav>
            </div>
             <div class="p-4 border-t border-slate-800 mx-4">
                <div class="bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 rounded-xl p-4 text-center">
                    <span class="material-symbols-outlined text-primary text-2xl mb-2">diamond</span>
                    <h4 class="text-white font-bold text-xs mb-1">Go Pro</h4>
                    <p class="text-slate-400 text-[10px] mb-3">Unlock unlimited scans & real-time alerts.</p>
                    <button class="w-full bg-white text-slate-900 text-[10px] font-bold py-1.5 rounded hover:bg-slate-200 transition-colors">Upgrade</button>
                </div>
            </div>
        `;
    },

    // 4. PRESETS (Control Center)
    renderPresetsSidebar() {
        return `
            <div class="mb-8">
                <h3 class="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Preset Library</h3>
                <nav class="flex flex-col space-y-0.5 px-3">
                    ${this.renderNavLink('presets', 'dashboard', 'All Presets', true)}
                    ${this.renderNavLink('#', 'star', 'Favorites')}
                    ${this.renderNavLink('#', 'schedule', 'Recent')}
                </nav>
            </div>
             <div class="mb-8">
                <h3 class="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Leagues</h3>
                <nav class="flex flex-col space-y-0.5 px-3">
                     ${this.renderNavLink('#', 'sports_basketball', 'NBA', false, true)}
                     ${this.renderNavLink('#', 'sports_football', 'NFL')}
                     ${this.renderNavLink('#', 'sports_soccer', 'Soccer')}
                </nav>
            </div>
        `;
    },

    // 5. TEAMS (Compare)
    renderCompareSidebar() {
        return '';
    },

    renderDataHealthSidebar() {
        return `
             <div class="mb-8">
                <h3 class="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">System Status</h3>
                <nav class="flex flex-col space-y-0.5 px-3">
                    ${this.renderNavLink('data-health', 'monitor_heart', 'Data Health', true)}
                    ${this.renderNavLink('#', 'dns', 'API Status')}
                    ${this.renderNavLink('#', 'schedule', 'Job Queue')}
                </nav>
            </div>
        `;
    },

    renderDefaultSidebar() {
        return this.renderPlayerSidebar();
    },

    renderNavLink(page, icon, text, active = false, badge = false) {
        const activeClass = active
            ? 'bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-white'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5';

        const iconClass = active ? 'text-primary' : 'group-hover:text-white transition-colors';

        return `
            <a href="#" class="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${activeClass}" 
               onclick="Router.navigate('${page}'); return false;" data-page="${page}">
               <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-[20px] ${iconClass}">${icon}</span>
                    <span class="${active ? '' : 'group-hover:text-white transition-colors'}">${text}</span>
               </div>
               ${badge ? '<span class="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>' : ''}
            </a>
        `;
    }
};

window.Sidebar = Sidebar;
