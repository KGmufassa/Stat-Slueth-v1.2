// ============================================
// LOADING COMPONENT
// ============================================

function showLoadingState(message = 'Loading...') {
    return `
        <div class="loading-state" style="text-align: center; padding: 4rem 2rem;">
            <div class="spinner" style="margin: 0 auto 1.5rem;"></div>
            <p class="loading-text">${message}</p>
        </div>
    `;
}

function showEmptyState(message = 'No data available', icon = '📊') {
    return `
        <div class="empty-state" style="text-align: center; padding: 4rem 2rem; color: var(--color-text-muted);">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${icon}</div>
            <p>${message}</p>
        </div>
    `;
}

function showErrorState(message = 'An error occurred') {
    return `
        <div class="error-state" style="text-align: center; padding: 4rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem; color: var(--color-error);">⚠️</div>
            <p style="color: var(--color-error); font-weight: 600; margin-bottom: 0.5rem;">Error</p>
            <p style="color: var(--color-text-muted);">${message}</p>
        </div>
    `;
}

// Export for use in other modules
window.showLoadingState = showLoadingState;
window.showEmptyState = showEmptyState;
window.showErrorState = showErrorState;
