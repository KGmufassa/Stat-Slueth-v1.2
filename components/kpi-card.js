// ============================================
// KPI CARD COMPONENT - Tailwind
// ============================================

function createKPICard({ label, value, change = null, sampleSize = null, trend = null }) {
    const isPositive = change && parseFloat(change) > 0;
    const changeColor = isPositive ? 'text-emerald-500' : 'text-red-500';
    const changeIcon = isPositive ? 'north_east' : 'south_east';

    return `
        <div class="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-[#1e293b] shadow-sm hover:shadow-md transition-all">
            <h4 class="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">${label}</h4>
            <div class="flex items-end justify-between">
                <span class="text-2xl font-black text-slate-900 dark:text-white leading-none">${value}</span>
                <div class="flex flex-col items-end">
                    ${change ? `
                        <span class="${changeColor} text-[10px] font-bold flex items-center gap-0.5 bg-slate-50 dark:bg-white/5 px-1.5 py-0.5 rounded">
                            <span class="material-symbols-outlined text-[10px]">${changeIcon}</span>
                            ${change}%
                        </span>
                    ` : ''}
                </div>
            </div>
             <div class="mt-2 text-[9px] text-slate-400 font-medium flex justify-between items-center border-t border-slate-100 dark:border-[#1e293b] pt-2">
                ${sampleSize ? `<span>N=${sampleSize}</span>` : '<span></span>'}
                ${trend ? `<span class="uppercase">${trend}</span>` : ''}
            </div>
        </div>
    `;
}

// Export for use in other modules
window.createKPICard = createKPICard;

