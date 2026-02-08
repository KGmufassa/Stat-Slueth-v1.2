// ============================================
// SPORTS STATISTICAL LLM - MAIN APP
// ============================================

// State Management
const AppState = {
    currentPage: 'query',
    presets: JSON.parse(localStorage.getItem('statsleuths_presets') || '[]'),
    presetViewMode: localStorage.getItem('statsleuths_preset_view') || 'card',

    savePresets() {
        localStorage.setItem('statsleuths_presets', JSON.stringify(this.presets));
    },

    setViewMode(mode) {
        this.presetViewMode = mode;
        localStorage.setItem('statsleuths_preset_view', mode);
    },

    addPreset(preset) {
        preset.id = Date.now().toString();
        preset.createdAt = new Date().toISOString();
        preset.lastRun = null;
        preset.lastRunStatus = preset.lastRunStatus || 'success';
        preset.tags = preset.tags || [];
        preset.pinned = preset.pinned || false;
        this.presets.push(preset);
        this.savePresets();
    },

    updatePreset(id, updates) {
        const index = this.presets.findIndex(p => p.id === id);
        if (index !== -1) {
            this.presets[index] = { ...this.presets[index], ...updates };
            this.savePresets();
        }
    },

    deletePreset(id) {
        this.presets = this.presets.filter(p => p.id !== id);
        this.savePresets();
    },

    getPreset(id) {
        return this.presets.find(p => p.id === id);
    },

    togglePin(id) {
        const preset = this.getPreset(id);
        if (!preset) return false;

        // Check pin limit
        const pinnedCount = this.presets.filter(p => p.pinned).length;
        if (!preset.pinned && pinnedCount >= 5) {
            return false; // Max 5 pinned
        }

        this.updatePreset(id, { pinned: !preset.pinned });
        return true;
    },

    getPinnedPresets() {
        return this.presets.filter(p => p.pinned);
    },

    getUnpinnedPresets() {
        return this.presets.filter(p => !p.pinned);
    }
};

// Preset Templates
const PresetTemplates = {
    'win-percentage': {
        name: 'Win % vs Conference',
        type: 'Single Query',
        league: 'NBA',
        metric: 'Win Percentage',
        icon: '📊',
        description: 'Track team win percentage against conference opponents',
        defaultQuery: 'Show team win percentage vs conference in last 20 games'
    },
    'streak-tracker': {
        name: 'Streak Tracker',
        type: 'Single Query',
        league: 'NBA',
        metric: 'Scoring Streak',
        icon: '🔥',
        description: 'Monitor players with consecutive games above threshold',
        defaultQuery: 'Show players with 25+ points streak'
    },
    'breakout-cooldown': {
        name: 'Breakout or Cooldown',
        type: 'Breakout Analysis',
        league: 'NBA',
        metric: 'Streak Ceiling',
        icon: '📈',
        description: 'Identify players near historical streak maximums',
        defaultQuery: 'Find players at 85%+ of historical max streak'
    },
    'head-to-head': {
        name: 'Head-to-Head Comparison',
        type: 'Comparison',
        league: 'NBA',
        metric: 'Multi-stat Comparison',
        icon: '⚔️',
        description: 'Compare two players or teams side-by-side',
        defaultQuery: 'Compare two players across scoring metrics'
    }
};

// Utility Functions
const Utils = {
    // Show/hide loading overlay  
    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    },

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    },

    // Simulate async operation
    async simulateDelay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Export data to CSV
    exportToCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => {
                const value = row[h];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Format numbers
    formatNumber(num, decimals = 1) {
        if (num === null || num === undefined) return 'N/A';
        return Number(num).toFixed(decimals);
    },

    // Format percentage
    formatPercent(num, decimals = 1) {
        if (num === null || num === undefined) return 'N/A';
        return `${Number(num).toFixed(decimals)}%`;
    },

    // Format date
    formatDate(dateString) {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },

    // Format time ago
    timeAgo(dateString) {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return this.formatDate(dateString);
    }
};

// Mock Data Generators
const MockData = {
    // Generate player stats
    generatePlayerStats(count = 10) {
        const names = ['LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
            'Luka Doncic', 'Nikola Jokic', 'Joel Embiid', 'Jayson Tatum',
            'Damian Lillard', 'Anthony Davis', 'Kawhi Leonard', 'Jimmy Butler'];
        const teams = ['LAL', 'GSW', 'PHX', 'MIL', 'DAL', 'DEN', 'PHI', 'BOS', 'MIA', 'LAC'];

        return Array.from({ length: count }, (_, i) => ({
            player: names[i] || `Player ${i + 1}`,
            team: teams[Math.floor(Math.random() * teams.length)],
            gamesPlayed: 15 + Math.floor(Math.random() * 25),
            points: (20 + Math.random() * 15).toFixed(1),
            rebounds: (5 + Math.random() * 7).toFixed(1),
            assists: (4 + Math.random() * 6).toFixed(1),
            steals: (0.5 + Math.random() * 1.5).toFixed(1),
            blocks: (0.3 + Math.random() * 1.7).toFixed(1),
            fieldGoalPct: (42 + Math.random() * 13).toFixed(1),
            threePtPct: (32 + Math.random() * 10).toFixed(1),
            freeThrowPct: (75 + Math.random() * 15).toFixed(1)
        }));
    },

    // Generate team stats
    generateTeamStats(count = 10) {
        const teams = ['Lakers', 'Warriors', 'Celtics', 'Heat', 'Bucks', 'Nuggets',
            '76ers', 'Mavericks', 'Suns', 'Clippers'];

        return Array.from({ length: count }, (_, i) => ({
            team: teams[i] || `Team ${i + 1}`,
            wins: Math.floor(Math.random() * 30) + 10,
            losses: Math.floor(Math.random() * 25) + 5,
            winPct: ((0.4 + Math.random() * 0.4) * 100).toFixed(1),
            pointsPerGame: (105 + Math.random() * 15).toFixed(1),
            pointsAllowed: (105 + Math.random() * 15).toFixed(1),
            reboundsPerGame: (42 + Math.random() * 8).toFixed(1),
            assistsPerGame: (23 + Math.random() * 7).toFixed(1)
        }));
    },

    // Generate streak data
    generateStreakData(count = 15) {
        const names = ['LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
            'Luka Doncic', 'Nikola Jokic', 'Joel Embiid', 'Jayson Tatum',
            'Damian Lillard', 'Anthony Davis', 'Kawhi Leonard', 'Jimmy Butler',
            'Devin Booker', 'Trae Young', 'Donovan Mitchell'];

        return Array.from({ length: count }, (_, i) => ({
            player: names[i] || `Player ${i + 1}`,
            currentStreak: Math.floor(Math.random() * 15) + 3,
            historicalMax: Math.floor(Math.random() * 10) + 18,
            percentOfMax: ((0.6 + Math.random() * 0.35) * 100).toFixed(1),
            stat: '25+ points'
        }));
    }
};

// Router
const Router = {
    routes: {
        'query': 'renderQueryPage',
        'compare': 'renderComparePage',
        'head-to-head': 'renderHeadToHeadPage',
        'presets': 'renderPresetsPage',
        'advanced-analytics': 'renderAdvancedAnalyticsPage',
        'breakout': 'renderBreakoutPage',
        'data-health': 'renderDataHealthPage',
        'player': 'renderPlayerPage',
        'scanner': 'renderScannerPage',
        'scouting-report': 'renderScannerPage',
        'injuries': 'renderInjuriesPage'
    },

    navigate(page) {
        const renderFnName = this.routes[page];
        if (renderFnName && window[renderFnName]) {
            AppState.currentPage = page;
            if (window.Sidebar) {
                Sidebar.render(page);
            }
            this.updateActiveNav(page);
            window[renderFnName]();
        }
    },

    updateActiveNav(page) {
        const parentMap = {
            'head-to-head': 'player',
            'scouting-report': 'player',
            'advanced-analytics': 'player',
            'injuries': 'player',
            'breakout': 'player',
            'compare': 'player'
        };
        const topPage = parentMap[page] || page;

        document.querySelectorAll('.top-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === topPage) {
                link.classList.add('active');
            }
        });

        const sidebar = document.getElementById('app-sidebar');
        if (sidebar) {
            sidebar.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.page === page) {
                    link.classList.add('active');
                }
            });
        }
    },

    init() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                window.location.hash = page;
            });
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.slice(1) || 'query';
            this.navigate(page);
        });

        // Initial navigation
        const initialPage = window.location.hash.slice(1) || 'query';
        this.navigate(initialPage);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});

// Global exports for use in page modules
window.AppState = AppState;
window.Utils = Utils;
window.MockData = MockData;
window.Router = Router;
window.PresetTemplates = PresetTemplates;
