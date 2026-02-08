// ============================================
// PRESETS PAGE - Enhanced Control Center
// ============================================

function renderPresetsPage() {
    const content = document.getElementById('app-content');

    // Header Section
    content.innerHTML = `
        <div class="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <!-- Sticky Header for Presets -->
            <div class="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-0 py-6 mb-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Preset Control Center</h2>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and launch your saved query configurations</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary/10 text-primary dark:text-white text-sm font-bold hover:bg-primary/20 transition-all" onclick="runAllPinned()">
                            <span class="material-symbols-outlined text-sm">play_circle</span>
                            <span class="hidden sm:inline">Run All Pinned</span>
                        </button>
                        <button id="new-preset-btn" class="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                             <span class="material-symbols-outlined text-sm">add</span>
                             <span class="hidden sm:inline">New Preset</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="w-full">
                <!-- Filter Pills -->
                <div class="flex flex-wrap gap-2 mb-8">
                     <button class="filter-pill active flex h-9 items-center gap-x-2 rounded-full bg-primary text-white px-5 text-sm font-semibold transition-all">
                        <span>All</span>
                    </button>
                    <button class="filter-pill flex h-9 items-center gap-x-2 rounded-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <span>NBA</span>
                        <span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                    <button class="filter-pill flex h-9 items-center gap-x-2 rounded-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <span>NFL</span>
                        <span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                    <button class="filter-pill flex h-9 items-center gap-x-2 rounded-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <span>Betting</span>
                        <span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                </div>

                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-slate-900 dark:text-white text-lg font-bold">Saved Analytics Presets <span class="text-slate-500 font-normal text-sm ml-2">(${AppState.presets.length})</span></h3>
                </div>

                <!-- Presets Grid -->
                <div id="presets-grid" class="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                    <!-- Dynamic Content -->
                </div>
            </div>
        </div>
        
        <!-- Create Preset Modal -->
        <div id="preset-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center">
            <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onclick="closePresetModal()"></div>
            <div class="relative z-10 bg-white dark:bg-[#192233] rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Modal Content Injection -->
            </div>
        </div>
    `;

    renderPresetsList();

    // Event Listeners
    document.getElementById('new-preset-btn').addEventListener('click', openCreatePresetModal);

    // Filter Pills Logic (Simple visual toggle for now)
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-pill').forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-white', 'dark:bg-[#192233]', 'text-slate-700', 'dark:text-white', 'border', 'border-slate-200', 'dark:border-white/10');
            });
            const target = e.currentTarget;
            target.classList.remove('bg-white', 'dark:bg-[#192233]', 'text-slate-700', 'dark:text-white', 'border', 'border-slate-200', 'dark:border-white/10');
            target.classList.add('bg-primary', 'text-white', 'border-transparent');

            // In a real app, this would filter the list
            const filterText = target.innerText.trim();
            renderPresetsList(filterText === 'All' ? null : filterText);
        });
    });
}

function renderPresetsList(filterType = null) {
    const grid = document.getElementById('presets-grid');
    if (!grid) return;

    let presets = AppState.presets;

    if (filterType) {
        if (filterType === 'NBA' || filterType === 'NFL') {
            presets = presets.filter(p => p.league === filterType);
        }
        // Add more logic for other filters if needed
    }

    // Sort pinned to top
    presets.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    let html = presets.map(preset => createPresetCard(preset)).join('');

    // Add "New Preset" Placeholder Card at the end
    html += `
        <div onclick="openCreatePresetModal()" class="group flex flex-col sm:flex-row bg-slate-50 dark:bg-white/5 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 items-center justify-center p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-slate-100 dark:hover:bg-white/10 transition-all min-h-[220px]">
            <div class="flex flex-col items-center gap-3">
                <div class="size-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                    <span class="material-symbols-outlined text-3xl">add_chart</span>
                </div>
                <div>
                    <h4 class="text-slate-900 dark:text-white font-bold">New Analytics Preset</h4>
                    <p class="text-slate-500 text-sm mt-1">Combine multiple data blocks into a single layout.</p>
                </div>
            </div>
        </div>
    `;

    grid.innerHTML = html;
}

function createPresetCard(preset) {
    // Generate a consistent random image based on ID or name for visual flair
    const images = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Mlfh2iBiAXUq50fQPdqQDQ6TriJEjG63LeYT1g4304_3GsQ6yVNa5ZS3fEc2nKy4oIQQZXCiF2wNoKVvYeGOPcanMP8qz7Hev80yhjYs5WQlU21W5np0wAVdbkKWhAYbrpBUlbOHFW5qHCg9NPU2z5p9ZSNb4esmYe8a4fk8DtZa_J1vcpbsNRLo7yYVcHj6nbpP7YDoZzvxrEFh7bcRZQxFWXhR7N0zviENQDZQeeAiQjMg8dYjR0Uci7Ev3QeZRs7eppbfDUc",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4Yw70q6LvGsFPdYJA4k0Mi2-6YPrQffI5rL7FkicNG3BqewHfUYwiOwYZMSjRtdYGq-HfAPq6TOj41sfosnRvBIcFkPpmkAed2EhvZOCpH28ONJOAqwT7mVh_jPeeiE9E2PFNF_YotG2is7kpiTlsG0A1EVuqtCvTzDaUbPzNedhlIYdRKtIxwbAdv_oQromkvjmsZK2yvY8XHGJxYO_4BpcHjxwh9VnzzVPlsKI8_j2C9iTojyodWM6CQHdS0XTjcsTNCThAxlY",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB9nnIjwOxehgxItucL7rj81tks0ChhhyHsIZ8yEsCws_KKAoKKz0fRJY376VJEcaTyJiI8iIYZ9aNykoYF5p69-jqENK5tpc3qZ9PucsgwsFDLNP62GEkkw221wgF7CWtJEGgwut7RHrQfVIZbHOZkOHtZi9Da94LbDH-gA8DJB5vGjW5jiz23c8hjttGO9kXWVimYvBxP8s8Ghft62U6V6LVBK5rkqjG6SGqVlvBAPvtFcvx1Snp-ikkZgh9Zfbu0GABUhQjEqnY"
    ];
    const image = images[preset.id % images.length] || images[0];

    return `
        <div class="group flex flex-col sm:flex-row bg-white dark:bg-[#192233] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl">
            <div class="sm:w-2/5 relative">
                <div class="h-full w-full bg-center bg-no-repeat bg-cover min-h-[160px]" style='background-image: url("${image}");'>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute top-3 left-3 flex gap-1">
                        ${preset.pinned ? '<span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Pinned</span>' : ''}
                        <span class="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Live</span>
                    </div>
                </div>
            </div>
            <div class="sm:w-3/5 p-5 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-primary text-[10px] font-bold tracking-widest uppercase">${preset.league || 'General'}</p>
                        <button onclick="togglePresetPin(${preset.id})" class="text-slate-400 hover:text-primary transition-colors">
                            <span class="material-symbols-outlined text-lg fill-1">${preset.pinned ? 'keep' : 'keep_off'}</span>
                        </button>
                    </div>
                    <h4 class="text-slate-900 dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">${preset.name}</h4>
                    <div class="mt-4 flex flex-wrap items-center gap-3">
                        <div class="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                            <span class="material-symbols-outlined text-sm">table_rows</span>
                            <span class="text-xs font-medium">${preset.type}</span>
                        </div>
                    </div>
                </div>
                <div class="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                    <div class="flex flex-col">
                        <p class="text-slate-400 text-[11px] uppercase tracking-wide">Last Run</p>
                        <p class="text-slate-700 dark:text-slate-300 text-xs font-semibold">${Utils.timeAgo(preset.lastRun)}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="editPreset(${preset.id})" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <span class="material-symbols-outlined text-xl">edit</span>
                        </button>
                         <button onclick="deletePresetConfirm(${preset.id})" class="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                            <span class="material-symbols-outlined text-xl">delete</span>
                        </button>
                        <button onclick="runPreset(${preset.id})" class="px-5 h-9 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                            Run Query
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Preserve existing modal logic but update styles
function openCreatePresetModal() {
    const modal = document.getElementById('preset-modal');
    const modalContent = modal.querySelector('div.relative');

    modal.classList.remove('hidden');
    modalContent.innerHTML = `
        <div class="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Create New Preset</h3>
            <button class="text-slate-400 hover:text-white transition-colors" onclick="closePresetModal()">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <div class="p-6 overflow-y-auto">
             <form id="preset-from-scratch-form" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Preset Name</label>
                    <input type="text" id="scratch-name" class="form-input" placeholder="My Custom Preset" required>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">League</label>
                        <select id="scratch-league" class="form-select" required>
                            <option value="NBA">NBA</option>
                            <option value="NFL">NFL</option>
                            <option value="NHL">NHL</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type</label>
                        <select id="scratch-type" class="form-select" required>
                            <option value="Single Query">Single Query</option>
                            <option value="Comparison">Comparison</option>
                            <option value="Breakout Analysis">Breakout Analysis</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Metric</label>
                    <input type="text" id="scratch-metric" class="form-input" placeholder="e.g., Points Per Game" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Query Description</label>
                    <textarea id="scratch-query" class="form-textarea h-24" placeholder="Describe what you want to analyze..." required></textarea>
                </div>
                
                <div class="pt-4 flex justify-end gap-3">
                     <button type="button" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" onclick="closePresetModal()">Cancel</button>
                     <button type="submit" class="px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:brightness-110 transition-colors shadow-lg shadow-primary/20">Create Preset</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('preset-from-scratch-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createPresetFromScratch();
    });
}

function closePresetModal() {
    document.getElementById('preset-modal').classList.add('hidden');
}

// Global Exports
window.renderPresetsPage = renderPresetsPage;
window.runPreset = runPreset; // Assumes existing generic runPreset from app or previous code
window.togglePresetPin = togglePresetPin;
window.deletePresetConfirm = deletePresetConfirm;
window.editPreset = editPreset;
window.openCreatePresetModal = openCreatePresetModal;
window.closePresetModal = closePresetModal;
window.runAllPinned = () => alert("Running all pinned presets..."); // Placeholder
