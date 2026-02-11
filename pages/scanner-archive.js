// ============================================
// SCANNER ARCHIVE PAGE
// ============================================

function renderScannerArchivePage() {
    const content = document.getElementById('app-content');
    if (!content) return;

    const folder = AppState.getScannerFolder(AppState.currentScannerFolderId);

    if (!folder) {
        content.innerHTML = `
            <div class="flex flex-col gap-6 fade-in">
                <div class="bg-surface-dark border border-slate-800 rounded-xl p-8 shadow-card text-center">
                    <h1 class="text-white text-2xl font-black tracking-tight">Archive Folder Not Found</h1>
                    <p class="text-slate-400 text-sm mt-2">Create a folder from the Scanner sidebar Archive section.</p>
                    <button class="mt-6 bg-primary text-white px-5 h-10 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-primary-hover transition-colors"
                        onclick="Router.navigate('scanner')">
                        Back To Scanner
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const scans = AppState.getScannerScansByFolder(folder.id);

    const rowsMarkup = scans.length
        ? scans.map((scan, index) => `
            <tr class="border-b border-slate-800/70 hover:bg-primary/5 transition-colors">
                <td class="px-6 py-4 text-slate-500 text-xs font-bold">${index + 1}</td>
                <td class="px-6 py-4">
                    <p class="text-white text-sm font-bold">${escapeScannerArchiveHtml(scan.name || 'Saved Scan')}</p>
                    <p class="text-slate-500 text-[11px] mt-1">${escapeScannerArchiveHtml(scan.statType || 'Trend Scan')}</p>
                </td>
                <td class="px-6 py-4 text-slate-300 text-xs font-semibold">${escapeScannerArchiveHtml(scan.league || '--')}</td>
                <td class="px-6 py-4 text-slate-300 text-xs font-semibold">${escapeScannerArchiveHtml(scan.team || '--')}</td>
                <td class="px-6 py-4 text-slate-300 text-xs font-semibold">${escapeScannerArchiveHtml(scan.player || '--')}</td>
                <td class="px-6 py-4 text-slate-400 text-xs">${new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td class="px-6 py-4 text-right">
                    <div class="inline-flex items-center gap-2">
                        <button class="text-xs font-bold text-primary hover:text-white transition-colors" onclick="runArchivedScannerScan('${scan.id}')">Run</button>
                        <button class="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors" onclick="deleteArchivedScannerScan('${scan.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('')
        : `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <p class="text-white text-sm font-bold">No scans saved in this folder yet.</p>
                    <p class="text-slate-500 text-xs mt-1">Use Save Scanner from New Scan to add items here.</p>
                </td>
            </tr>
        `;

    content.innerHTML = `
        <div class="flex flex-col gap-8 fade-in">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p class="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Scanner Archive</p>
                    <h1 class="text-white text-3xl font-black leading-tight tracking-tight">${escapeScannerArchiveHtml(folder.name)}</h1>
                    <p class="text-slate-400 text-sm mt-1">Custom list of saved scans in this folder.</p>
                </div>
                <button class="bg-primary/10 text-primary border border-primary/20 px-5 h-10 rounded-lg font-bold text-xs hover:bg-primary/20 transition-all"
                    onclick="Router.navigate('scanner')">
                    Back To New Scan
                </button>
            </div>

            <div class="bg-surface-dark border border-slate-800 rounded-xl overflow-hidden shadow-card">
                <div class="px-5 py-3 border-b border-slate-800 bg-white/[0.02] flex items-center justify-between">
                    <h3 class="text-white font-bold text-[10px] uppercase tracking-wider">Saved Scans</h3>
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">${scans.length} total</span>
                </div>
                <div class="overflow-x-auto custom-scrollbar">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="bg-[#050911] text-slate-500 font-bold uppercase text-[9px] tracking-widest border-b border-slate-800">
                                <th class="px-6 py-4">#</th>
                                <th class="px-6 py-4">Scan</th>
                                <th class="px-6 py-4">League</th>
                                <th class="px-6 py-4">Team</th>
                                <th class="px-6 py-4">Player</th>
                                <th class="px-6 py-4">Saved</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsMarkup}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function runArchivedScannerScan(scanId) {
    const scan = AppState.getScannerScan(scanId);
    if (!scan) {
        window.alert('Saved scan not found.');
        return;
    }

    window.alert(`Opening scan for ${scan.player || 'selected player'} in New Scan.`);
    Router.navigate('scanner');
}

function deleteArchivedScannerScan(scanId) {
    AppState.deleteScannerScan(scanId);
    renderScannerArchivePage();
    if (window.Sidebar) {
        Sidebar.render('scanner-archive');
    }
}

function escapeScannerArchiveHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

window.renderScannerArchivePage = renderScannerArchivePage;
window.runArchivedScannerScan = runArchivedScannerScan;
window.deleteArchivedScannerScan = deleteArchivedScannerScan;
