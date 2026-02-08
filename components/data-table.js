// ============================================
// DATA TABLE COMPONENT - Tailwind
// ============================================

function createDataTable({ columns, data, sortable = true, onSort = null }) {
    if (!data || data.length === 0) {
        return `
            <div class="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5">
                <p class="text-slate-500 dark:text-slate-400">No data available</p>
            </div>
        `;
    }

    const tableId = 'table-' + Date.now();

    // Create table HTML
    const html = `
        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 shadow-sm relative custom-scrollbar">
            <table class="w-full text-left text-sm border-collapse" id="${tableId}">
                <thead>
                    <tr class="bg-slate-50 dark:bg-[#0a0e17] border-b border-slate-200 dark:border-white/10">
                        ${columns.map(col => `
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap ${sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors select-none sortable' : ''}" data-key="${col.key}">
                                <div class="flex items-center gap-1">
                                    ${col.label}
                                    ${sortable ? `<span class="material-symbols-outlined text-[14px] text-slate-300 opacity-0 group-hover:opacity-100 sort-icon">unfold_more</span>` : ''}
                                </div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-[#1e293b] bg-white dark:bg-[#0f172a]">
                    ${data.map(row => `
                        <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            ${columns.map(col => {
        const value = row[col.key];
        const isNumeric = col.numeric || typeof value === 'number';
        const alignClass = isNumeric ? 'text-right font-mono' : 'text-left';
        return `<td class="px-6 py-4 text-slate-700 dark:text-slate-300 ${alignClass}">${value !== undefined && value !== null ? value : 'N/A'}</td>`;
    }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Set up sorting after DOM update
    if (sortable) {
        setTimeout(() => {
            const table = document.getElementById(tableId);
            if (table) {
                setupTableSorting(table, data, columns);
            }
        }, 0);
    }

    return html;
}

function setupTableSorting(table, data, columns) {
    const headers = table.querySelectorAll('th.sortable');
    let currentSort = { key: null, direction: 'asc' };

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const key = header.dataset.key;

            // Toggle direction if same column
            if (currentSort.key === key) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.key = key;
                currentSort.direction = 'asc';
            }

            // Update header styling
            headers.forEach(h => {
                const icon = h.querySelector('.sort-icon');
                if (icon) {
                    icon.style.opacity = '0';
                    icon.textContent = 'unfold_more';
                    icon.classList.remove('text-primary');
                }
            });

            const activeIcon = header.querySelector('.sort-icon');
            if (activeIcon) {
                activeIcon.style.opacity = '1';
                activeIcon.textContent = currentSort.direction === 'asc' ? 'expand_less' : 'expand_more';
                activeIcon.classList.add('text-primary');
            }

            // Sort data
            const sortedData = [...data].sort((a, b) => {
                const aVal = a[key];
                const bVal = b[key];

                // Handle numeric values
                const aNum = parseFloat(aVal);
                const bNum = parseFloat(bVal);
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return currentSort.direction === 'asc' ? aNum - bNum : bNum - aNum;
                }

                // Handle string values
                const aStr = String(aVal).toLowerCase();
                const bStr = String(bVal).toLowerCase();
                if (currentSort.direction === 'asc') {
                    return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
                } else {
                    return bStr < aStr ? -1 : bStr > aStr ? 1 : 0;
                }
            });

            // Update tbody
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = sortedData.map(row => `
                <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    ${columns.map(col => {
                const value = row[col.key];
                const isNumeric = col.numeric || typeof value === 'number';
                const alignClass = isNumeric ? 'text-right font-mono' : 'text-left';
                return `<td class="px-6 py-4 text-slate-700 dark:text-slate-300 ${alignClass}">${value !== undefined && value !== null ? value : 'N/A'}</td>`;
            }).join('')}
                </tr>
            `).join('');
        });
    });
}

// Export for use in other modules
window.createDataTable = createDataTable;

