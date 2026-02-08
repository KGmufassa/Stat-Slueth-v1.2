// ============================================
// FILTER CHIPS COMPONENT - Tailwind
// ============================================

function createFilterChips(filters) {
    if (!filters || filters.length === 0) {
        return '';
    }

    return `
        <div class="flex flex-wrap items-center gap-2 mb-4">
            ${filters.map(filter => `
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span class="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">${filter.label}:</span>
                    <span>${filter.value}</span>
                    ${filter.removable !== false ? `
                        <button class="ml-1 text-slate-400 hover:text-primary transition-colors" data-filter="${filter.key}" aria-label="Remove filter">
                            <span class="material-symbols-outlined text-[14px]">close</span>
                        </button>
                    ` : ''}
                </div>
            `).join('')}
            ${filters.some(f => f.removable !== false) ? `
                <button id="clear-all-filters" class="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest px-2 transition-colors">
                    Clear All
                </button>
            ` : ''}
        </div>
    `;
}

// Export for use in other modules
window.createFilterChips = createFilterChips;

