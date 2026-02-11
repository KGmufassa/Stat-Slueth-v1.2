// ============================================
// SCANNER PAGE - TREND SCANNER
// ============================================

function renderScannerPage() {
    const content = document.getElementById('app-content');
    if (!content) return;

    const scannerDirectory = {
        NBA: {
            LAL: ['LeBron James', 'Anthony Davis'],
            GSW: ['Stephen Curry', 'Klay Thompson'],
            BOS: ['Jayson Tatum', 'Jaylen Brown'],
            DEN: ['Nikola Jokic', 'Jamal Murray']
        },
        NFL: {
            KC: ['Patrick Mahomes', 'Travis Kelce'],
            BUF: ['Josh Allen', 'Stefon Diggs'],
            DAL: ['Dak Prescott', 'CeeDee Lamb'],
            SF: ['Brock Purdy', 'Christian McCaffrey']
        }
    };

    const allScanRows = [
        { league: 'NBA', team: 'LAL', player: 'LeBron James', currentAvg: 31.2, seasonAvg: 25.7, velocity: 85, trendPercent: 21.4 },
        { league: 'NBA', team: 'LAL', player: 'Anthony Davis', currentAvg: 28.4, seasonAvg: 24.0, velocity: 76, trendPercent: 18.3 },
        { league: 'NBA', team: 'GSW', player: 'Stephen Curry', currentAvg: 30.1, seasonAvg: 27.5, velocity: 70, trendPercent: 9.5 },
        { league: 'NBA', team: 'BOS', player: 'Jayson Tatum', currentAvg: 29.4, seasonAvg: 27.0, velocity: 63, trendPercent: 8.9 },
        { league: 'NBA', team: 'DEN', player: 'Nikola Jokic', currentAvg: 27.8, seasonAvg: 26.1, velocity: 58, trendPercent: 6.5 },
        { league: 'NFL', team: 'KC', player: 'Patrick Mahomes', currentAvg: 309.0, seasonAvg: 282.0, velocity: 82, trendPercent: 9.6 },
        { league: 'NFL', team: 'BUF', player: 'Josh Allen', currentAvg: 295.0, seasonAvg: 274.0, velocity: 68, trendPercent: 7.7 },
        { league: 'NFL', team: 'DAL', player: 'Dak Prescott', currentAvg: 281.0, seasonAvg: 262.0, velocity: 61, trendPercent: 7.3 },
        { league: 'NFL', team: 'SF', player: 'Christian McCaffrey', currentAvg: 129.0, seasonAvg: 116.0, velocity: 57, trendPercent: 11.2 },
        { league: 'NFL', team: 'KC', player: 'Travis Kelce', currentAvg: 84.0, seasonAvg: 76.0, velocity: 52, trendPercent: 10.5 }
    ];

    const scannerState = {
        trendType: 'breakout',
        league: 'NBA',
        team: 'LAL',
        player: 'LeBron James',
        statType: 'Points Per Game (PPG)',
        threshold: 8,
        streak: 5
    };

    const leagueOptions = Object.keys(scannerDirectory);

    const escapeHtml = (value) => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const getTeamsForLeague = () => Object.keys(scannerDirectory[scannerState.league] || {});

    const getPlayersForTeam = () => {
        const leagueTeams = scannerDirectory[scannerState.league] || {};
        return leagueTeams[scannerState.team] || [];
    };

    const createOptions = (items, selectedValue) => items.map((item) => {
        const selected = item === selectedValue ? 'selected' : '';
        return `<option value="${escapeHtml(item)}" ${selected}>${escapeHtml(item)}</option>`;
    }).join('');

    const buildResults = () => {
        const threshold = Number(scannerState.threshold) || 0;
        const trendDirection = scannerState.trendType === 'breakout' ? 1 : -1;

        const rows = allScanRows.filter((row) => {
            if (row.league !== scannerState.league) return false;
            if (row.team !== scannerState.team) return false;
            if (row.player !== scannerState.player) return false;
            return scannerState.trendType === 'breakout'
                ? row.trendPercent >= threshold
                : row.trendPercent <= -threshold;
        }).map((row) => ({
            ...row,
            signedTrend: Number((row.trendPercent * trendDirection).toFixed(1))
        }));

        if (rows.length > 0) {
            return rows;
        }

        return allScanRows
            .filter((row) => row.league === scannerState.league)
            .map((row) => ({
                ...row,
                signedTrend: Number((row.trendPercent * trendDirection).toFixed(1))
            }))
            .sort((a, b) => b.velocity - a.velocity)
            .slice(0, 8);
    };

    content.innerHTML = `
        <div class="flex flex-col gap-8 fade-in">
            <div>
                <h1 class="text-white text-3xl font-black leading-tight tracking-tight">Trend Scanner</h1>
                <p class="text-slate-400 text-sm mt-1">Identify breakout and cooldown patterns by league, team, and player.</p>
            </div>

            <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 bg-surface-dark border border-slate-800 p-5 rounded-xl shadow-card">
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">League</label>
                    <select id="scanner-league" class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary">
                        ${createOptions(leagueOptions, scannerState.league)}
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team</label>
                    <select id="scanner-team" class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary">
                        ${createOptions(getTeamsForLeague(), scannerState.team)}
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Player</label>
                    <select id="scanner-player" class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary">
                        ${createOptions(getPlayersForTeam(), scannerState.player)}
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stat Type</label>
                    <select id="scanner-stat" class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary">
                        <option selected>Points Per Game (PPG)</option>
                        <option>Assists (APG)</option>
                        <option>Rebounds (RPG)</option>
                        <option>Passing Yards</option>
                        <option>Touchdowns</option>
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Threshold</label>
                    <input id="scanner-threshold" class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary" type="number" min="0" step="0.1" value="${scannerState.threshold}" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Streak (Games)</label>
                    <input id="scanner-streak" class="w-full bg-[#050911] border border-slate-800 text-white text-xs font-bold rounded-lg h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary" type="number" min="1" step="1" value="${scannerState.streak}" />
                </div>

                <div class="md:col-span-2 lg:col-span-3 flex flex-col gap-3">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trend Type</label>
                    <div class="flex p-1 bg-[#050911] rounded-lg border border-slate-800">
                        <button id="trend-breakout" class="flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors bg-primary text-white shadow-lg">Breakout</button>
                        <button id="trend-cooldown" class="flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors text-slate-400 hover:text-white">Cooldown</button>
                    </div>
                    <div class="flex items-center gap-3">
                        <button id="run-scan-btn" class="bg-primary/10 text-primary border border-primary/20 px-4 h-9 rounded-lg font-bold text-xs hover:bg-primary/20 transition-all flex items-center gap-2 shadow-glow-sm">
                            <span class="material-symbols-outlined text-[18px]">bolt</span>
                            <span>Run New Scan</span>
                        </button>
                        <button id="save-scan-btn" class="bg-surface-dark border border-slate-700 text-white px-4 h-9 rounded-lg font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">save</span>
                            <span>Save Scanner</span>
                        </button>
                    </div>
                </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-8">
                    <div class="bg-surface-dark border border-slate-800 rounded-xl overflow-hidden shadow-card">
                        <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-white/[0.02]">
                            <h3 class="text-white font-bold text-[10px] uppercase tracking-wider">Ranked Scan Results</h3>
                            <span id="scan-results-meta" class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Initializing scan...</span>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-left text-xs">
                                <thead>
                                    <tr class="bg-[#050911] text-slate-500 font-bold uppercase text-[9px] tracking-widest border-b border-slate-800">
                                        <th class="px-6 py-4">Player</th>
                                        <th class="px-6 py-4">Team</th>
                                        <th class="px-6 py-4">Current Avg</th>
                                        <th class="px-6 py-4">Season Avg</th>
                                        <th class="px-6 py-4">Velocity</th>
                                        <th class="px-6 py-4 text-right">Trend</th>
                                    </tr>
                                </thead>
                                <tbody id="scanner-results-body" class="divide-y divide-slate-800"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4 flex flex-col gap-6">
                    <div class="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-glow-sm">
                        <h4 class="text-white font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary text-base">analytics</span>
                            Scan Summary
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-dark border border-slate-800 p-4 rounded-lg">
                                <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">League Pool</p>
                                <p id="summary-pool" class="text-white text-2xl font-black">0</p>
                            </div>
                            <div class="bg-surface-dark border border-slate-800 p-4 rounded-lg">
                                <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">Qualifiers</p>
                                <p id="summary-qualifiers" class="text-primary text-2xl font-black">0</p>
                            </div>
                        </div>
                        <div class="mt-4 p-4 bg-[#050911]/50 rounded-lg border border-slate-800/50">
                            <p id="summary-text" class="text-slate-400 text-[10px] italic leading-relaxed font-medium">Running scan...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const leagueSelect = document.getElementById('scanner-league');
    const teamSelect = document.getElementById('scanner-team');
    const playerSelect = document.getElementById('scanner-player');
    const statSelect = document.getElementById('scanner-stat');
    const thresholdInput = document.getElementById('scanner-threshold');
    const streakInput = document.getElementById('scanner-streak');
    const breakoutButton = document.getElementById('trend-breakout');
    const cooldownButton = document.getElementById('trend-cooldown');
    const runScanButton = document.getElementById('run-scan-btn');
    const saveScanButton = document.getElementById('save-scan-btn');
    const resultsBody = document.getElementById('scanner-results-body');
    const resultsMeta = document.getElementById('scan-results-meta');
    const summaryPool = document.getElementById('summary-pool');
    const summaryQualifiers = document.getElementById('summary-qualifiers');
    const summaryText = document.getElementById('summary-text');

    const renderTrendToggle = () => {
        const breakoutActive = scannerState.trendType === 'breakout';
        breakoutButton.className = `flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors ${breakoutActive ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`;
        cooldownButton.className = `flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors ${breakoutActive ? 'text-slate-400 hover:text-white' : 'bg-primary text-white shadow-lg'}`;
    };

    const renderResults = () => {
        const rows = buildResults();
        const trendIcon = scannerState.trendType === 'breakout' ? 'trending_up' : 'trending_down';
        const trendColor = scannerState.trendType === 'breakout' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        const leaguePoolCount = allScanRows.filter((row) => row.league === scannerState.league).length;

        resultsBody.innerHTML = rows.map((row) => `
            <tr class="hover:bg-primary/5 transition-colors">
                <td class="px-6 py-4"><span class="font-bold text-white">${escapeHtml(row.player)}</span></td>
                <td class="px-6 py-4 text-slate-400 font-bold text-[10px]">${escapeHtml(row.team)}</td>
                <td class="px-6 py-4 font-black text-white">${row.currentAvg}</td>
                <td class="px-6 py-4 text-slate-400 font-medium">${row.seasonAvg}</td>
                <td class="px-6 py-4">
                    <div class="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-primary" style="width: ${row.velocity}%;"></div>
                    </div>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border ${trendColor}">
                        <span class="material-symbols-outlined text-[12px]">${trendIcon}</span>
                        ${row.signedTrend >= 0 ? '+' : ''}${row.signedTrend}%
                    </div>
                </td>
            </tr>
        `).join('');

        resultsMeta.textContent = `${scannerState.trendType} | ${rows.length} result${rows.length === 1 ? '' : 's'}`;
        summaryPool.textContent = String(leaguePoolCount);
        summaryQualifiers.textContent = String(rows.length);
        summaryText.textContent = scannerState.trendType === 'breakout'
            ? `Breakout scan ready for ${scannerState.player} with threshold ${scannerState.threshold}.`
            : `Cooldown scan ready for ${scannerState.player} with threshold ${scannerState.threshold}.`;
    };

    const refreshTeamAndPlayerControls = () => {
        const teams = getTeamsForLeague();
        if (!teams.includes(scannerState.team)) {
            scannerState.team = teams[0] || '';
        }
        teamSelect.innerHTML = createOptions(teams, scannerState.team);

        const players = getPlayersForTeam();
        if (!players.includes(scannerState.player)) {
            scannerState.player = players[0] || '';
        }
        playerSelect.innerHTML = createOptions(players, scannerState.player);
    };

    const saveCurrentScan = () => {
        const folders = AppState.getScannerFolders();
        const defaultFolderName = folders[0] ? folders[0].name : 'General';
        const folderNameInput = window.prompt('Save scan to folder name', defaultFolderName);
        if (folderNameInput === null) return;

        const folderName = folderNameInput.trim();
        if (!folderName) {
            window.alert('Please provide a folder name.');
            return;
        }

        let folder = folders.find((item) => item.name.toLowerCase() === folderName.toLowerCase()) || null;
        if (!folder) {
            const createResult = AppState.createScannerFolder(folderName);
            if (!createResult.ok) {
                window.alert(createResult.error || 'Unable to create folder.');
                return;
            }
            folder = createResult.folder;
        }

        const saveResult = AppState.saveScannerScan({
            name: `${scannerState.trendType.toUpperCase()} | ${scannerState.player}`,
            league: scannerState.league,
            team: scannerState.team,
            player: scannerState.player,
            statType: scannerState.statType,
            threshold: scannerState.threshold,
            streak: scannerState.streak,
            trendType: scannerState.trendType
        }, folder.id);

        if (!saveResult.ok) {
            window.alert(saveResult.error || 'Unable to save scan.');
            return;
        }

        if (window.Sidebar) {
            Sidebar.render(AppState.currentPage);
        }
        window.alert(`Scanner saved to ${folder.name}.`);
    };

    leagueSelect.addEventListener('change', () => {
        scannerState.league = leagueSelect.value;
        refreshTeamAndPlayerControls();
        renderResults();
    });

    teamSelect.addEventListener('change', () => {
        scannerState.team = teamSelect.value;
        refreshTeamAndPlayerControls();
        renderResults();
    });

    playerSelect.addEventListener('change', () => {
        scannerState.player = playerSelect.value;
        renderResults();
    });

    statSelect.addEventListener('change', () => {
        scannerState.statType = statSelect.value;
    });

    thresholdInput.addEventListener('input', () => {
        scannerState.threshold = Number(thresholdInput.value) || 0;
        renderResults();
    });

    streakInput.addEventListener('input', () => {
        scannerState.streak = Number(streakInput.value) || 1;
    });

    breakoutButton.addEventListener('click', () => {
        scannerState.trendType = 'breakout';
        renderTrendToggle();
        renderResults();
    });

    cooldownButton.addEventListener('click', () => {
        scannerState.trendType = 'cooldown';
        renderTrendToggle();
        renderResults();
    });

    runScanButton.addEventListener('click', renderResults);
    saveScanButton.addEventListener('click', saveCurrentScan);

    refreshTeamAndPlayerControls();
    renderTrendToggle();
    renderResults();
}

// Export for router
window.renderScannerPage = renderScannerPage;
