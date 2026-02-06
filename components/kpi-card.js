// ============================================
// KPI CARD COMPONENT
// ============================================

function createKPICard({ label, value, change = null, sampleSize = null, trend = null }) {
    const changeClass = change && parseFloat(change) > 0 ? 'positive' : 'negative';
    const changeIcon = change && parseFloat(change) > 0 ? '↑' : '↓';

    return `
        <div class="kpi-card">
            <div class="kpi-label">${label}</div>
            <div class="kpi-value">${value}</div>
            <div class="kpi-meta">
                ${change ? `<span class="kpi-change ${changeClass}">${changeIcon} ${change}</span>` : ''}
                ${sampleSize ? `<span>N=${sampleSize}</span>` : ''}
                ${trend ? `<span>${trend}</span>` : ''}
            </div>
        </div>
    `;
}

// Export for use in other modules
window.createKPICard = createKPICard;
