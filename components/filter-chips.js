// ============================================
// FILTER CHIPS COMPONENT
// ============================================

function createFilterChips(filters) {
    if (!filters || filters.length === 0) {
        return '';
    }

    return `
        <div class="filter-chips-container">
            ${filters.map(filter => `
                <div class="filter-chip">
                    <span class="filter-chip-label">${filter.label}:</span>
                    <span class="filter-chip-value">${filter.value}</span>
                    ${filter.removable !== false ? `
                        <button class="filter-chip-remove" data-filter="${filter.key}" aria-label="Remove filter">
                            ✕
                        </button>
                    ` : ''}
                </div>
            `).join('')}
            ${filters.some(f => f.removable !== false) ? `
                <button class="btn btn-secondary" id="clear-all-filters" style="padding: var(--spacing-xs) var(--spacing-md); font-size: 0.75rem;">
                    Clear All
                </button>
            ` : ''}
        </div>
    `;
}

// Export for use in other modules
window.createFilterChips = createFilterChips;
