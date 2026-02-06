// ============================================
// DATA TABLE COMPONENT
// ============================================

function createDataTable({ columns, data, sortable = true, onSort = null }) {
    if (!data || data.length === 0) {
        return '<div class="table-container"><p class="text-center text-muted" style="padding: 2rem;">No data available</p></div>';
    }

    const tableId = 'table-' + Date.now();

    // Create table HTML
    const html = `
        <div class="table-container">
            <table class="data-table" id="${tableId}">
                <thead>
                    <tr>
                        ${columns.map(col => `
                            <th class="${sortable ? 'sortable' : ''}" data-key="${col.key}">
                                ${col.label}
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${columns.map(col => {
        const value = row[col.key];
        const isNumeric = col.numeric || typeof value === 'number';
        const className = isNumeric ? 'table-numeric' : '';
        return `<td class="${className}">${value !== undefined && value !== null ? value : 'N/A'}</td>`;
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

            // Update header classes
            headers.forEach(h => {
                h.classList.remove('sorted-asc', 'sorted-desc');
            });
            header.classList.add(`sorted-${currentSort.direction}`);

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
                <tr>
                    ${columns.map(col => {
                const value = row[col.key];
                const isNumeric = col.numeric || typeof value === 'number';
                const className = isNumeric ? 'table-numeric' : '';
                return `<td class="${className}">${value !== undefined && value !== null ? value : 'N/A'}</td>`;
            }).join('')}
                </tr>
            `).join('');
        });
    });
}

// Export for use in other modules
window.createDataTable = createDataTable;
