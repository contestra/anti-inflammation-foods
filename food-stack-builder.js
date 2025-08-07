// Application State
const appState = {
    currentTab: 'browse',
    currentView: 'grid',
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'antiInflammatory',
    myStack: [],
    expandedFood: null
};

// Load state from localStorage
function loadState() {
    const savedStack = localStorage.getItem('foodStack');
    if (savedStack) {
        appState.myStack = JSON.parse(savedStack);
        updateStackCount();
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('foodStack', JSON.stringify(appState.myStack));
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeEventListeners();
    renderFoods();
    renderTemplates();
    updateStackUI();
    
    // Ensure icons are created after initial render
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
});

// Event Listeners
function initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tab = button.dataset.tab;
            switchTab(tab);
            // Force immediate repaint
            window.requestAnimationFrame(() => {
                void button.offsetHeight;
            });
        });
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase();
        renderFoods();
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        appState.sortBy = e.target.value;
        renderFoods();
    });

    // View toggle
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            switchView(view);
        });
    });

    // Category filters
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            selectCategory(category);
        });
    });

    // Clear stack button
    document.querySelector('.clear-stack-btn')?.addEventListener('click', clearStack);

    // Export stack button
    document.querySelector('.export-stack-btn')?.addEventListener('click', exportStack);

    // Modal close
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.getElementById('food-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'food-modal') {
            closeModal();
        }
    });
}

// Tab switching
function switchTab(tab) {
    appState.currentTab = tab;
    
    // Force immediate repaint by reading offsetHeight
    document.querySelectorAll('.tab-button').forEach(button => {
        if (button.dataset.tab === tab) {
            button.classList.remove('active');
            void button.offsetHeight; // Force reflow
            button.classList.add('active');
            button.style.borderBottom = '3px solid rgb(4, 61, 85)';
        } else {
            button.classList.remove('active');
            button.style.borderBottom = '';
        }
    });
    
    // Update tab panels immediately
    document.querySelectorAll('.tab-panel').forEach(panel => {
        if (panel.id === `${tab}-tab`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
    
    // Render content synchronously to avoid delays
    if (tab === 'browse') {
        renderFoods();
    } else if (tab === 'templates') {
        renderTemplates();
    } else if (tab === 'mystack') {
        updateStackUI();
    }
}

// View switching
function switchView(view) {
    appState.currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-button').forEach(button => {
        button.classList.toggle('active', button.dataset.view === view);
    });
    
    // Re-render foods with new view
    renderFoods();
}

// Category selection
function selectCategory(category) {
    appState.selectedCategory = category;
    
    // Update category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === category);
    });
    
    // Re-render foods
    renderFoods();
}

// Render foods
function renderFoods() {
    const container = document.getElementById('foods-container');
    if (!container) {
        console.error('Foods container not found');
        return;
    }
    container.innerHTML = '';
    
    // Check if foods is defined
    if (typeof foods === 'undefined' || !Array.isArray(foods)) {
        console.error('Foods data not loaded');
        container.innerHTML = '<p>Loading foods...</p>';
        return;
    }
    
    // Filter foods
    let filteredFoods = foods.filter(food => {
        const matchesCategory = appState.selectedCategory === 'all' || food.category === appState.selectedCategory;
        const matchesSearch = food.name.toLowerCase().includes(appState.searchQuery) ||
                            food.description.toLowerCase().includes(appState.searchQuery);
        return matchesCategory && matchesSearch;
    });
    
    // Sort foods
    filteredFoods.sort((a, b) => {
        switch (appState.sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'antiInflammatory':
            default:
                const bScore = b.antiInflammatoryScore || b.antiInflammatoryPotential || 0;
                const aScore = a.antiInflammatoryScore || a.antiInflammatoryPotential || 0;
                return bScore - aScore;
        }
    });
    
    // Update container class based on view
    container.className = appState.currentView === 'grid' ? 'foods-grid' : 'foods-list';
    
    // Create cards
    filteredFoods.forEach(food => {
        const card = createFoodCard(food);
        container.appendChild(card);
    });
    
    // Create icons after adding to DOM
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

// Create food card
function createFoodCard(food) {
    const card = document.createElement('div');
    const inStack = appState.myStack.some(s => s.id === food.id);
    card.className = `food-card ${inStack ? 'in-stack' : ''}`;
    
    // Get the evidence score, handling both formats
    let evidenceScore = typeof food.evidence === 'object' ? food.evidence.score : food.evidenceScore;
    let antiInflammatoryScore = food.antiInflammatoryScore || food.antiInflammatoryPotential || 0;
    
    // Convert to 0-10 scale if needed (for any legacy data)
    if (evidenceScore > 10) {
        evidenceScore = evidenceScore / 10;
    }
    if (antiInflammatoryScore > 10) {
        antiInflammatoryScore = antiInflammatoryScore / 10;
    }
    
    // Format scores to 1 decimal place
    evidenceScore = evidenceScore.toFixed(1);
    antiInflammatoryScore = antiInflammatoryScore.toFixed(1);
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${food.name}</h3>
            <span class="category-badge">${food.category.replace(/_/g, ' ')}</span>
        </div>
        <div class="card-content">
            <p class="description">${food.description}</p>
            <div class="scores">
                <span class="score">Evidence: ${evidenceScore}/10</span>
                <span class="score">Anti-Inflammatory: ${antiInflammatoryScore}/10</span>
            </div>
            <div class="serving-info">
                <p><strong>Serving:</strong> ${food.servingSize}</p>
                <p><strong>Frequency:</strong> ${food.frequency}</p>
                <p><strong>Cost:</strong> ${food.cost}</p>
            </div>
            <div class="key-compounds">
                ${food.keyCompounds.slice(0, 3).map(compound => 
                    `<span class="compound-tag">${compound}</span>`
                ).join('')}
            </div>
        </div>
        <div class="card-actions">
            <button class="btn btn-secondary view-details-btn" onclick="showFoodDetails('${food.id}')">
                <i data-lucide="info"></i>
                Details
            </button>
            <button class="btn ${inStack ? 'btn-success' : 'btn-primary'} add-to-stack-btn">
                <i data-lucide="${inStack ? 'check' : 'plus'}"></i>
                ${inStack ? 'In Stack' : 'Add to Stack'}
            </button>
        </div>
    `;
    
    // Add event listener to the add button
    const addBtn = card.querySelector('.add-to-stack-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inStack) {
                removeFromStack(food.id);
            } else {
                addToStack(food);
            }
        });
    }
    
    return card;
}

// Show food details modal
function showFoodDetails(foodId) {
    const food = foods.find(f => f.id === foodId);
    if (!food) return;
    
    const modal = document.getElementById('food-modal');
    const modalContent = document.getElementById('modal-content');
    
    // Get scores in correct format
    let evidenceScore = typeof food.evidence === 'object' ? food.evidence.score : food.evidenceScore;
    let antiInflammatoryScore = food.antiInflammatoryScore || food.antiInflammatoryPotential || 0;
    let studyCount = typeof food.evidence === 'object' ? food.evidence.studies : 0;
    
    modalContent.innerHTML = `
        <h2>${food.name}</h2>
        <div class="modal-section">
            <h3>Overview</h3>
            <p>${food.description}</p>
            <p><strong>Category:</strong> ${food.category.replace(/_/g, ' ')}</p>
        </div>
        
        <div class="modal-section">
            <h3>Evidence & Scores</h3>
            <div class="modal-scores">
                <div class="score-item">
                    <span class="score-label">Evidence Score:</span>
                    <span class="score-value">${evidenceScore.toFixed(1)}/10</span>
                    ${studyCount ? `<small>(${studyCount} studies)</small>` : ''}
                </div>
                <div class="score-item">
                    <span class="score-label">Anti-Inflammatory Score:</span>
                    <span class="score-value">${antiInflammatoryScore.toFixed(1)}/10</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>Serving Information</h3>
            <p><strong>Serving Size:</strong> ${food.servingSize}</p>
            <p><strong>Recommended Frequency:</strong> ${food.frequency}</p>
            <p><strong>Typical Cost:</strong> ${food.cost}</p>
            <p><strong>Preparation:</strong> ${food.preparation}</p>
        </div>
        
        <div class="modal-section">
            <h3>Key Compounds</h3>
            <div class="compounds-list">
                ${food.keyCompounds.map(compound => 
                    `<span class="compound-tag">${compound}</span>`
                ).join('')}
            </div>
        </div>
        
        <div class="modal-section">
            <h3>Mechanisms of Action</h3>
            <ul>
                ${food.mechanisms.map(mechanism => `<li>${mechanism}</li>`).join('')}
            </ul>
        </div>
        
        ${food.sideEffects ? `
        <div class="modal-section">
            <h3>Important Notes</h3>
            <p>${food.sideEffects}</p>
        </div>
        ` : ''}
        
        ${food.interactions && food.interactions.length > 0 ? `
        <div class="modal-section">
            <h3>Food Combinations</h3>
            <ul>
                ${food.interactions.map(interaction => `<li>${interaction}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <div class="modal-actions">
            <button class="btn btn-primary" onclick="addToStackFromModal('${food.id}')">
                <i data-lucide="plus"></i>
                Add to Stack
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('food-modal');
    modal.style.display = 'none';
}

// Add to stack from modal
function addToStackFromModal(foodId) {
    const food = foods.find(f => f.id === foodId);
    if (food) {
        addToStack(food);
        closeModal();
    }
}

// Add food to stack
function addToStack(food) {
    if (!appState.myStack.some(f => f.id === food.id)) {
        appState.myStack.push(food);
        saveState();
        updateStackCount();
        if (appState.currentTab === 'browse') {
            renderFoods();
        } else if (appState.currentTab === 'mystack') {
            updateStackUI();
        }
        checkSynergies();
    }
}

// Remove food from stack
function removeFromStack(foodId) {
    appState.myStack = appState.myStack.filter(f => f.id !== foodId);
    saveState();
    updateStackCount();
    if (appState.currentTab === 'browse') {
        renderFoods();
    } else if (appState.currentTab === 'mystack') {
        updateStackUI();
    }
    checkSynergies();
}

// Update stack count in UI
function updateStackCount() {
    const countElement = document.querySelector('.stack-count');
    if (countElement) {
        countElement.textContent = appState.myStack.length;
    }
}

// Clear entire stack
function clearStack() {
    if (confirm('Are you sure you want to clear your entire food stack?')) {
        appState.myStack = [];
        saveState();
        updateStackCount();
        updateStackUI();
        if (appState.currentTab === 'browse') {
            renderFoods();
        }
    }
}

// Check for food synergies
function checkSynergies() {
    const synergiesList = [];
    const stackIds = appState.myStack.map(f => f.id);
    
    if (typeof synergies !== 'undefined' && Array.isArray(synergies)) {
        synergies.forEach(synergy => {
            if (stackIds.includes(synergy.food1) && stackIds.includes(synergy.food2)) {
                synergiesList.push(synergy);
            }
        });
    }
    
    updateSynergiesDisplay(synergiesList);
}

// Update synergies display
function updateSynergiesDisplay(synergiesList) {
    const container = document.getElementById('synergies-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (synergiesList.length === 0) {
        container.innerHTML = '<p class="no-synergies">No synergies detected. Try combining turmeric with black pepper or olive oil!</p>';
        return;
    }
    
    synergiesList.forEach(synergy => {
        const food1 = foods.find(f => f.id === synergy.food1);
        const food2 = foods.find(f => f.id === synergy.food2);
        
        const synergyCard = document.createElement('div');
        synergyCard.className = 'synergy-card positive';
        synergyCard.innerHTML = `
            <div class="synergy-header">
                <i data-lucide="zap"></i>
                <strong>Synergy Found!</strong>
            </div>
            <p><strong>${food1.name} + ${food2.name}</strong></p>
            <p>${synergy.description}</p>
            <p class="recommendation">${synergy.recommendation}</p>
        `;
        container.appendChild(synergyCard);
    });
    
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

// Update stack UI
function updateStackUI() {
    const stackContainer = document.getElementById('stack-container');
    const summaryContainer = document.getElementById('stack-summary');
    
    if (!stackContainer || !summaryContainer) return;
    
    // Clear containers
    stackContainer.innerHTML = '';
    
    if (appState.myStack.length === 0) {
        stackContainer.innerHTML = '<p class="empty-stack">Your food stack is empty. Browse foods to add them to your stack.</p>';
        summaryContainer.innerHTML = '<p>Add foods to see stack summary</p>';
        return;
    }
    
    // Render stack items
    appState.myStack.forEach(food => {
        const stackItem = createStackItem(food);
        stackContainer.appendChild(stackItem);
    });
    
    // Calculate and display summary
    const avgAntiInflammatory = appState.myStack.reduce((sum, f) => sum + (f.antiInflammatoryScore || 0), 0) / appState.myStack.length;
    const avgEvidence = appState.myStack.reduce((sum, f) => {
        const score = typeof f.evidence === 'object' ? f.evidence.score : f.evidenceScore;
        return sum + (score || 0);
    }, 0) / appState.myStack.length;
    
    // Get category distribution
    const categories = {};
    appState.myStack.forEach(food => {
        categories[food.category] = (categories[food.category] || 0) + 1;
    });
    
    const topCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat.replace(/_/g, ' '));
    
    summaryContainer.innerHTML = `
        <div class="summary-stats">
            <div class="stat">
                <span class="stat-label">Foods in Stack:</span>
                <span class="stat-value">${appState.myStack.length}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Avg Anti-Inflammatory Score:</span>
                <span class="stat-value">${avgAntiInflammatory.toFixed(1)}/10</span>
            </div>
            <div class="stat">
                <span class="stat-label">Avg Evidence Score:</span>
                <span class="stat-value">${avgEvidence.toFixed(1)}/10</span>
            </div>
            <div class="stat">
                <span class="stat-label">Top Categories:</span>
                <span class="stat-value">${topCategories.join(', ')}</span>
            </div>
        </div>
    `;
    
    // Check synergies
    checkSynergies();
    
    // Create icons
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

// Create stack item
function createStackItem(food) {
    const item = document.createElement('div');
    item.className = 'stack-item';
    
    let evidenceScore = typeof food.evidence === 'object' ? food.evidence.score : food.evidenceScore;
    let antiInflammatoryScore = food.antiInflammatoryScore || 0;
    
    item.innerHTML = `
        <div class="stack-item-header">
            <h4>${food.name}</h4>
            <button class="btn-icon" onclick="removeFromStack('${food.id}')">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
        <div class="stack-item-content">
            <p class="serving"><strong>Serving:</strong> ${food.servingSize}</p>
            <p class="frequency"><strong>Frequency:</strong> ${food.frequency}</p>
            <div class="scores">
                <span>Evidence: ${evidenceScore.toFixed(1)}/10</span>
                <span>Anti-Inflammatory: ${antiInflammatoryScore.toFixed(1)}/10</span>
            </div>
        </div>
    `;
    
    return item;
}

// Export stack to text file
function exportStack() {
    if (appState.myStack.length === 0) {
        alert('Your food stack is empty');
        return;
    }
    
    let exportText = 'MY ANTI-INFLAMMATORY FOOD STACK\n';
    exportText += '=' .repeat(40) + '\n\n';
    exportText += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    // Stack summary
    const avgAntiInflammatory = appState.myStack.reduce((sum, f) => sum + (f.antiInflammatoryScore || 0), 0) / appState.myStack.length;
    const avgEvidence = appState.myStack.reduce((sum, f) => {
        const score = typeof f.evidence === 'object' ? f.evidence.score : f.evidenceScore;
        return sum + (score || 0);
    }, 0) / appState.myStack.length;
    
    exportText += 'STACK SUMMARY\n';
    exportText += '-'.repeat(20) + '\n';
    exportText += `Total Foods: ${appState.myStack.length}\n`;
    exportText += `Average Anti-Inflammatory Score: ${avgAntiInflammatory.toFixed(1)}/10\n`;
    exportText += `Average Evidence Score: ${avgEvidence.toFixed(1)}/10\n\n`;
    
    // Foods list
    exportText += 'FOODS IN YOUR STACK\n';
    exportText += '-'.repeat(20) + '\n\n';
    
    appState.myStack.forEach((food, index) => {
        exportText += `${index + 1}. ${food.name}\n`;
        exportText += `   Category: ${food.category.replace(/_/g, ' ')}\n`;
        exportText += `   Serving: ${food.servingSize}\n`;
        exportText += `   Frequency: ${food.frequency}\n`;
        exportText += `   Preparation: ${food.preparation}\n`;
        exportText += `   Cost: ${food.cost}\n`;
        exportText += `   Anti-Inflammatory Score: ${food.antiInflammatoryScore}/10\n`;
        exportText += '\n';
    });
    
    // Synergies
    const synergiesList = [];
    const stackIds = appState.myStack.map(f => f.id);
    
    if (typeof synergies !== 'undefined' && Array.isArray(synergies)) {
        synergies.forEach(synergy => {
            if (stackIds.includes(synergy.food1) && stackIds.includes(synergy.food2)) {
                synergiesList.push(synergy);
            }
        });
    }
    
    if (synergiesList.length > 0) {
        exportText += 'FOOD SYNERGIES\n';
        exportText += '-'.repeat(20) + '\n\n';
        
        synergiesList.forEach(synergy => {
            const food1 = foods.find(f => f.id === synergy.food1);
            const food2 = foods.find(f => f.id === synergy.food2);
            exportText += `✓ ${food1.name} + ${food2.name}\n`;
            exportText += `  ${synergy.description}\n`;
            exportText += `  Recommendation: ${synergy.recommendation}\n\n`;
        });
    }
    
    // Shopping list
    exportText += 'SHOPPING LIST\n';
    exportText += '-'.repeat(20) + '\n';
    
    const categories = {};
    appState.myStack.forEach(food => {
        if (!categories[food.category]) {
            categories[food.category] = [];
        }
        categories[food.category].push(food.name);
    });
    
    Object.entries(categories).forEach(([category, items]) => {
        exportText += `\n${category.replace(/_/g, ' ').toUpperCase()}:\n`;
        items.forEach(item => {
            exportText += `  □ ${item}\n`;
        });
    });
    
    exportText += '\n' + '='.repeat(40) + '\n';
    exportText += 'Note: Consult with a healthcare provider before making significant dietary changes.\n';
    
    // Download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-stack-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Render diet templates
function renderTemplates() {
    const container = document.getElementById('templates-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (typeof dietTemplates === 'undefined' || !Array.isArray(dietTemplates)) {
        container.innerHTML = '<p>Loading templates...</p>';
        return;
    }
    
    dietTemplates.forEach(template => {
        const templateCard = createTemplateCard(template);
        container.appendChild(templateCard);
    });
    
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

// Create template card
function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card';
    
    // Calculate template score
    const templateFoods = foods.filter(f => template.foods.includes(f.id));
    const avgScore = templateFoods.reduce((sum, f) => sum + (f.antiInflammatoryScore || 0), 0) / templateFoods.length;
    
    card.innerHTML = `
        <div class="template-header">
            <h3>${template.name}</h3>
            <span class="popularity">${template.popularity}% Popular</span>
        </div>
        <p class="template-description">${template.description}</p>
        <div class="template-stats">
            <span>Foods: ${template.foods.length}</span>
            <span>Avg Score: ${avgScore.toFixed(1)}/10</span>
        </div>
        <div class="template-foods">
            ${templateFoods.slice(0, 3).map(f => 
                `<span class="food-tag">${f.name}</span>`
            ).join('')}
            ${template.foods.length > 3 ? `<span class="more">+${template.foods.length - 3} more</span>` : ''}
        </div>
        <button class="btn btn-primary apply-template-btn" onclick="applyTemplate('${template.id}')">
            <i data-lucide="download"></i>
            Apply Template
        </button>
    `;
    
    return card;
}

// Apply diet template
function applyTemplate(templateId) {
    const template = dietTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    if (appState.myStack.length > 0) {
        if (!confirm('This will replace your current stack. Continue?')) {
            return;
        }
    }
    
    appState.myStack = [];
    
    template.foods.forEach(foodId => {
        const food = foods.find(f => f.id === foodId);
        if (food) {
            appState.myStack.push(food);
        }
    });
    
    saveState();
    updateStackCount();
    switchTab('mystack');
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i data-lucide="check-circle"></i>
        Template "${template.name}" applied successfully!
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        lucide.createIcons();
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}