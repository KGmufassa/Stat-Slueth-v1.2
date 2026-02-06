// ============================================
// PRESETS PAGE - ENHANCED
// ============================================

function renderPresetsPage() {
    const content = document.getElementById('app-content');
    const viewMode = AppState.presetViewMode;

    content.innerHTML = `
        <div class="presets-page">
            <!-- Header with Actions -->
            <div class="page-header presets-header">
                <div>
                    <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--spacing-sm);">Presets</h2>
                    <p class="text-muted">Your library of reusable analytical tools</p>
                </div>
                <button id="new-preset-btn" class="btn btn-primary">
                    <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New Preset
                </button>
            </div>
            
            <!-- Search and Filters Bar -->
            <div class="presets-controls card mb-xl">
                <div class="presets-controls-grid">
                    <div class="search-box">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input type="text" id="preset-search" class="search-input" placeholder="Search presets...">
                    </div>
                    
                    <select id="filter-league" class="form-select">
                        <option value="">All Leagues</option>
                        <option value="NBA">NBA</option>
                        <option value="NFL">NFL</option>
                        <option value="NHL">NHL</option>
                    </select>
                    
                    <select id="filter-type" class="form-select">
                        <option value="">All Types</option>
                        <option value="Single Query">Single Query</option>
                        <option value="Comparison">Comparison</option>
                        <option value="Breakout Analysis">Breakout Analysis</option>
                    </select>
                    
                    <div class="view-toggle btn-group">
                        <button class="btn btn-secondary ${viewMode === 'card' ? 'active' : ''}" data-view="card">
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                            Cards
                        </button>
                        <button class="btn btn-secondary ${viewMode === 'table' ? 'active' : ''}" data-view="table">
                            <svg style="width: 1rem; height: 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                            Table
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Presets Display Area -->
            <div id="presets-display"></div>
        </div>
        
        <!-- Create Preset Modal (hidden by default) -->
        <div id="preset-modal" class="modal hidden"></div>
    `;

    // Initialize event listeners
    document.getElementById('new-preset-btn').addEventListener('click', openCreatePresetModal);
    document.getElementById('preset-search').addEventListener('input', filterPresets);
    document.getElementById('filter-league').addEventListener('change', filterPresets);
    document.getElementById('filter-type').addEventListener('change', filterPresets);

    // View toggle
    document.querySelectorAll('.view-toggle button').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            AppState.setViewMode(view);
            renderPresetsPage();
        });
    });

    // Initial render
    renderPresetsList();
}

function renderPresetsList() {
    const searchTerm = document.getElementById('preset-search')?.value.toLowerCase() || '';
    const leagueFilter = document.getElementById('filter-league')?.value || '';
    const typeFilter = document.getElementById('filter-type')?.value || '';

    // Filter presets
    let filteredPresets = AppState.presets.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) ||
            p.metric?.toLowerCase().includes(searchTerm);
        const matchesLeague = !leagueFilter || p.league === leagueFilter;
        const matchesType = !typeFilter || p.type === typeFilter;
        return matchesSearch && matchesLeague && matchesType;
    });

    const pinnedPresets = filteredPresets.filter(p => p.pinned);
    const unpinnedPresets = filteredPresets.filter(p => !p.pinned);

    const displayArea = document.getElementById('presets-display');

    if (filteredPresets.length === 0) {
        displayArea.innerHTML = showEmptyState('No presets found', '📋');
        return;
    }

    const viewMode = AppState.presetViewMode;

    let html = '';

    // Pinned Section
    if (pinnedPresets.length > 0) {
        html += `
            <div class="pinned-section mb-xl">
                <h3 class="section-title">
                    <svg style="width: 1.25rem; height: 1.25rem; color: var(--color-warning);" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Pinned Presets
                    <span class="badge badge-info" style="margin-left: var(--spacing-sm);">${pinnedPresets.length}/5</span>
                </h3>
                ${viewMode === 'card' ? renderCardView(pinnedPresets) : renderTableView(pinnedPresets)}
            </div>
        `;
    }

    // All Presets Section
    if (unpinnedPresets.length > 0) {
        html += `
            <div class="all-presets-section">
                <h3 class="section-title">All Presets</h3>
                ${viewMode === 'card' ? renderCardView(unpinnedPresets) : renderTableView(unpinnedPresets)}
            </div>
        `;
    }

    displayArea.innerHTML = html;

    // Add event delegation for all preset card actions
    attachPresetEventListeners();
}

function attachPresetEventListeners() {
    const displayArea = document.getElementById('presets-display');
    if (!displayArea) return;

    // Event delegation for all action buttons
    displayArea.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        // Find the preset card or table row
        const presetCard = target.closest('[data-preset-id]');
        if (!presetCard) return;

        const presetId = presetCard.dataset.presetId;

        // Determine which action was clicked
        if (target.classList.contains('btn-run') || target.title === 'Run preset' || target.title === 'Run') {
            runPreset(presetId);
        } else if (target.classList.contains('pin-btn') || target.title?.includes('Pin') || target.title?.includes('Unpin')) {
            togglePresetPin(presetId);
        } else if (target.title === 'Edit preset') {
            editPreset(presetId);
        } else if (target.title === 'Duplicate preset' || target.title === 'Duplicate') {
            duplicatePreset(presetId);
        } else if (target.classList.contains('btn-delete') || target.title === 'Delete preset' || target.title === 'Delete') {
            deletePresetConfirm(presetId);
        }
    });

    // Event delegation for tag chips
    displayArea.addEventListener('click', (e) => {
        const tagChip = e.target.closest('.tag-chip');
        if (tagChip) {
            const tag = tagChip.textContent.trim();
            filterByTag(tag);
        }
    });
}

function renderCardView(presets) {
    return `
        <div class="preset-cards-grid">
            ${presets.map(preset => createPresetCard(preset)).join('')}
        </div>
    `;
}

function createPresetCard(preset) {
    const statusConfig = getStatusConfig(preset.lastRunStatus || 'success');
    const typeIcon = getTypeIcon(preset.type);

    return `
        <div class="preset-card" data-preset-id="${preset.id}">
            <div class="preset-card-header">
                <div class="preset-card-title-row">
                    <span class="preset-type-icon">${typeIcon}</span>
                    <h4 class="preset-card-title">${preset.name}</h4>
                </div>
                <button class="pin-btn ${preset.pinned ? 'pinned' : ''}" title="${preset.pinned ? 'Unpin' : 'Pin'} preset">
                    <svg viewBox="0 0 24 24" fill="${preset.pinned ? 'currentColor' : 'none'}" stroke="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
            </div>
            
            <div class="preset-card-meta">
                <span class="badge badge-info">${preset.league}</span>
                <span class="badge badge-secondary">${preset.type}</span>
            </div>
            
            ${preset.tags && preset.tags.length > 0 ? `
                <div class="preset-tags">
                    ${preset.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="preset-card-metric">
                <span class="text-muted">Metric:</span> ${preset.metric || 'N/A'}
            </div>
            
            <div class="preset-card-footer">
                <div class="preset-last-run">
                    <span class="status-indicator ${statusConfig.class}">${statusConfig.icon}</span>
                    <span class="text-muted">Last run: ${Utils.timeAgo(preset.lastRun)}</span>
                </div>
            </div>
            
            <div class="preset-card-actions">
                <button class="btn-icon btn-run" title="Run preset">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
                <button class="btn-icon" title="Edit preset">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-icon" title="Duplicate preset">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
                <button class="btn-icon btn-delete" title="Delete preset">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Hover Preview -->
            <div class="preset-preview">
                <div class="preview-content">
                    <div><strong>Preview</strong></div>
                    <div class="text-muted" style="font-size: 0.75rem; margin-top: var(--spacing-xs);">
                        ${preset.query ? preset.query.substring(0, 100) + '...' : 'No query details'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTableView(presets) {
    return createDataTable({
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'league', label: 'League' },
            { key: 'type', label: 'Type' },
            { key: 'metric', label: 'Metric' },
            { key: 'lastRunFormatted', label: 'Last Run' },
            { key: 'actions', label: 'Actions' }
        ],
        data: presets.map(p => ({
            ...p,
            lastRunFormatted: Utils.timeAgo(p.lastRun),
            actions: `
                <div class="table-actions" data-preset-id="${p.id}">
                    <button class="btn-table-action" title="Run">▶</button>
                    <button class="btn-table-action pin-btn ${p.pinned ? 'pinned' : ''}" title="${p.pinned ? 'Unpin' : 'Pin'}">${p.pinned ? '★' : '☆'}</button>
                    <button class="btn-table-action" title="Duplicate">⎘</button>
                    <button class="btn-table-action btn-delete" title="Delete">✕</button>
                </div>
            `
        }))
    });
}

function getTypeIcon(type) {
    const icons = {
        'Single Query': '🔍',
        'Comparison': '⚔️',
        'Breakout Analysis': '📈'
    };
    return icons[type] || '📊';
}

function getStatusConfig(status) {
    const configs = {
        'success': { icon: '✅', class: 'status-success' },
        'stale': { icon: '⚠️', class: 'status-warning' },
        'failed': { icon: '❌', class: 'status-error' }
    };
    return configs[status] || configs['success'];
}

function filterPresets() {
    renderPresetsList();
}

function filterByTag(tag) {
    const searchInput = document.getElementById('preset-search');
    searchInput.value = tag;
    filterPresets();
}

function togglePresetPin(id) {
    const success = AppState.togglePin(id);
    if (!success) {
        alert('You can only pin up to 5 presets. Please unpin another preset first.');
        return;
    }
    renderPresetsList();
}

function editPreset(id) {
    const preset = AppState.getPreset(id);
    if (!preset) return;

    const newName = prompt('Edit preset name:', preset.name);
    if (newName && newName !== preset.name) {
        AppState.updatePreset(id, { name: newName });
        renderPresetsList();
    }
}

function openCreatePresetModal() {
    const modal = document.getElementById('preset-modal');
    modal.classList.remove('hidden');
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closePresetModal()"></div>
        <div class="modal-content preset-modal-content">
            <div class="modal-header">
                <h3>Create New Preset</h3>
                <button class="modal-close" onclick="closePresetModal()">✕</button>
            </div>
            
            <div class="modal-tabs">
                <button class="modal-tab active" data-tab="templates">Templates</button>
                <button class="modal-tab" data-tab="scratch">From Scratch</button>
            </div>
            
            <div class="modal-body">
                <div id="tab-templates" class="tab-content active">
                    <p class="text-muted mb-lg">Start with a pre-configured template</p>
                    <div class="template-grid">
                        ${Object.entries(PresetTemplates).map(([key, template]) => `
                            <div class="template-card" onclick="selectTemplate('${key}')">
                                <div class="template-icon">${template.icon}</div>
                                <h4 class="template-name">${template.name}</h4>
                                <p class="template-description">${template.description}</p>
                                <div class="template-meta">
                                    <span class="badge badge-info">${template.league}</span>
                                    <span class="badge badge-secondary">${template.type}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="tab-scratch" class="tab-content">
                    <p class="text-muted mb-lg">Configure your preset step-by-step</p>
                    <form id="preset-from-scratch-form">
                        <div class="form-group">
                            <label class="form-label">Preset Name</label>
                            <input type="text" id="scratch-name" class="form-input" placeholder="My Custom Preset" required>
                        </div>
                        
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
                        
                        <div class="form-group">
                            <label class="form-label">Metric</label>
                            <input type="text" id="scratch-metric" class="form-input" placeholder="e.g., Points Per Game" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Query</label>
                            <textarea id="scratch-query" class="form-textarea" placeholder="Describe what you want to analyze..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tags (comma-separated)</label>
                            <input type="text" id="scratch-tags" class="form-input" placeholder="scoring, playoffs, defense">
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Create Preset</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Tab switching
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // Form submission
    document.getElementById('preset-from-scratch-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createPresetFromScratch();
    });
}

function closePresetModal() {
    document.getElementById('preset-modal').classList.add('hidden');
}

function selectTemplate(templateKey) {
    const template = PresetTemplates[templateKey];
    const presetName = prompt('Name your preset:', template.name);

    if (presetName) {
        AppState.addPreset({
            name: presetName,
            type: template.type,
            league: template.league,
            metric: template.metric,
            query: template.defaultQuery,
            tags: [template.metric.toLowerCase()],
            lastRunStatus: 'success'
        });

        closePresetModal();
        renderPresetsList();
        alert(`Preset "${presetName}" created successfully!`);
    }
}

function createPresetFromScratch() {
    const name = document.getElementById('scratch-name').value;
    const league = document.getElementById('scratch-league').value;
    const type = document.getElementById('scratch-type').value;
    const metric = document.getElementById('scratch-metric').value;
    const query = document.getElementById('scratch-query').value;
    const tagsInput = document.getElementById('scratch-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

    AppState.addPreset({
        name,
        league,
        type,
        metric,
        query,
        tags,
        lastRunStatus: 'success'
    });

    closePresetModal();
    renderPresetsList();
    alert(`Preset "${name}" created successfully!`);
}

// Keep existing functions from original file
function runPreset(id) {
    const preset = AppState.getPreset(id);
    if (!preset) return;

    // Update last run time and status
    AppState.updatePreset(id, {
        lastRun: new Date().toISOString(),
        lastRunStatus: Math.random() > 0.1 ? 'success' : 'stale' // Simulate occasional stale data
    });

    // Show loading
    Utils.showLoading();

    setTimeout(() => {
        Utils.hideLoading();
        alert(`Running preset: ${preset.name}\n\nThis would execute: ${preset.query || 'the saved configuration'}`);
        renderPresetsList(); // Refresh to show updated last run time
    }, 800);
}

function duplicatePreset(id) {
    const preset = AppState.getPreset(id);
    if (!preset) return;

    const newPreset = {
        ...preset,
        name: `${preset.name} (Copy)`,
        id: undefined,
        createdAt: undefined,
        lastRun: null,
        pinned: false // Don't duplicate pin status
    };

    AppState.addPreset(newPreset);
    renderPresetsList();
}

function deletePresetConfirm(id) {
    const preset = AppState.getPreset(id);
    if (!preset) return;

    // Create custom confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal show'; // Add 'show' immediately for instant display
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-header">
                <h3>Delete Preset?</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete <strong>"${preset.name}"</strong>?</p>
                <p class="text-muted" style="margin-top: var(--spacing-sm); font-size: 0.875rem;">This action cannot be undone.</p>
            </div>
            <div class="modal-footer" style="display: flex; gap: var(--spacing-md); justify-content: flex-end; margin-top: var(--spacing-lg);">
                <button class="btn btn-secondary" id="cancel-delete-btn">Cancel</button>
                <button class="btn btn-danger" id="confirm-delete-btn">Delete</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const cancelBtn = modal.querySelector('#cancel-delete-btn');
    const confirmBtn = modal.querySelector('#confirm-delete-btn');
    const overlay = modal.querySelector('.modal-overlay');

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 250); // Remove after fade-out animation
    };

    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    confirmBtn.addEventListener('click', () => {
        // Delete immediately without waiting for animation
        AppState.deletePreset(id);
        modal.remove(); // Remove modal instantly
        renderPresetsList(); // Refresh the list
    });
}

// Export for router
window.renderPresetsPage = renderPresetsPage;
window.runPreset = runPreset;
window.duplicatePreset = duplicatePreset;
window.deletePresetConfirm = deletePresetConfirm;
window.togglePresetPin = togglePresetPin;
window.editPreset = editPreset;
window.filterByTag = filterByTag;
window.selectTemplate = selectTemplate;
window.closePresetModal = closePresetModal;
