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
    
    // Render each food
    filteredFoods.forEach((food, index) => {
        const element = createFoodElement(food);
        container.appendChild(element);
    });
    
    // Add a single banner after 6 items or at the end if fewer than 6
    if (filteredFoods.length >= 6) {
        // Insert banner after the 6th item
        const sixthItem = container.children[5];
        if (sixthItem) {
            const banner = createProductBanner();
            sixthItem.insertAdjacentElement('afterend', banner);
        }
    } else if (filteredFoods.length > 0) {
        // If less than 6 items, add banner at the end
        const banner = createProductBanner();
        container.appendChild(banner);
    }
    
    // Update icons
    lucide.createIcons();
}

// Create product banner
function createProductBanner() {
    const banner = document.createElement('a');
    banner.href = 'https://corhealth.com/#product';
    banner.className = 'product-banner';
    banner.style.gridColumn = '1 / -1'; // Span full width in grid
    banner.innerHTML = `
        <div class="product-banner-content">
            <div class="product-banner-text">
                Get the COR One™ and get clear, actionable data about your inflammation
            </div>
            <div class="product-banner-arrow">
                <i data-lucide="arrow-right"></i>
            </div>
        </div>
    `;
    return banner;
}

// Create food element
function createFoodElement(food) {
    const template = appState.currentView === 'grid' 
        ? document.getElementById('food-card-template')
        : document.getElementById('food-list-item-template');
    
    const clone = template.content.cloneNode(true);
    const element = clone.querySelector('.food-card, .food-list-item');
    
    element.dataset.foodId = food.id;
    element.querySelector('.food-name').textContent = food.name;
    element.querySelector('.food-description').textContent = food.description;
    element.querySelector('.food-category').textContent = food.category;
    element.querySelector('.food-dose').textContent = food.servingSize || food.recommendedDose || '';
    // Handle both old and new scoring systems
    // Old system uses 0-100 scale, new system uses 0-10 scale
    let evidenceScore = typeof food.evidence.score === 'number' 
        ? food.evidence.score 
        : (food.evidence.score || 0);
    
    // Convert to 0-10 scale if needed
    if (evidenceScore > 10) {
        evidenceScore = evidenceScore / 10;
    }
    
    let antiInflamScore = food.antiInflammatoryScore || food.antiInflammatoryPotential || 0;
    
    // Convert to 0-10 scale if needed
    if (antiInflamScore > 10) {
        antiInflamScore = antiInflamScore / 10;
    }
    
    element.querySelector('.evidence-badge').textContent = `Evidence: ${evidenceScore.toFixed(1)}/10`;
    element.querySelector('.safety-badge').textContent = `Anti-Inflammatory: ${antiInflamScore.toFixed(1)}/10`;
    
    // Check if already in stack
    const inStack = appState.myStack.some(item => item.food.id === food.id);
    const addBtn = element.querySelector('.add-to-stack-btn');
    
    if (inStack) {
        addBtn.innerHTML = '<i data-lucide="check"></i> In Diet';
        addBtn.classList.add('in-stack');
    }
    
    // Add event listeners - handle both grid and list views
    const detailsBtn = element.querySelector('.view-details-btn');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => showFoodDetails(food));
    }
    
    // Add click handler for add to stack button
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add to stack clicked for:', food.name);
            if (inStack) {
                removeFromStack(food.id);
            } else {
                addToStack(food);
            }
        });
    }
    
    return element;
}

// Show food details modal
function showFoodDetails(food) {
    const modal = document.getElementById('food-modal');
    const modalBody = modal.querySelector('.modal-body');
    const inStack = appState.myStack.some(item => item.food.id === food.id);
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${food.name}</h2>
            <div class="modal-badges">
                <span class="evidence-badge">Evidence: ${((food.evidence.score > 10 ? food.evidence.score / 10 : food.evidence.score) || 0).toFixed(1)}/10 (${food.evidence.studies || 0} studies)</span>
                <span class="safety-badge">Anti-Inflammatory: ${(((food.antiInflammatoryScore || food.antiInflammatoryPotential || 0) > 10 ? (food.antiInflammatoryScore || food.antiInflammatoryPotential) / 10 : (food.antiInflammatoryScore || food.antiInflammatoryPotential)) || 0).toFixed(1)}/10</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>Description</h3>
            <p>${food.description}</p>
        </div>
        
        <div class="modal-section">
            <h3>Serving Information</h3>
            <p><strong>Serving Size:</strong> ${food.servingSize || 'N/A'}</p>
            <p><strong>Frequency:</strong> ${food.frequency || 'Daily'}</p>
            ${food.cost ? `<p><strong>Typical Cost:</strong> ${food.cost}</p>` : ''}
            ${food.preparation ? `<p><strong>Preparation:</strong> ${food.preparation}</p>` : ''}
        </div>
        
        ${food.keyCompounds && food.keyCompounds.length > 0 ? `
            <div class="modal-section">
                <h3>Key Anti-Inflammatory Compounds</h3>
                <ul>
                    ${food.keyCompounds.map(compound => `<li>${compound}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${food.mechanisms && food.mechanisms.length > 0 ? `
            <div class="modal-section">
                <h3>Mechanisms of Action</h3>
                <ul>
                    ${food.mechanisms.map(mechanism => `<li>${mechanism}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${food.sideEffects && food.sideEffects !== '' ? `
            <div class="modal-section">
                <h3>Notes & Considerations</h3>
                <p>${Array.isArray(food.sideEffects) ? food.sideEffects.join(', ') : food.sideEffects}</p>
            </div>
        ` : ''}
        
        ${food.interactions && food.interactions.length > 0 ? `
            <div class="modal-section">
                <h3>Food Interactions</h3>
                <ul>
                    ${food.interactions.map(interaction => `<li>${interaction}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${food.evidenceBreakdown ? `
            <div class="modal-section">
                <h3>Evidence Breakdown</h3>
                <div class="evidence-breakdown">
                    <p><strong>Study Portfolio:</strong><br>
                    ${food.evidenceBreakdown.studyCount} total studies<br>
                    ${food.evidenceBreakdown.studyTypes.map(type => `• ${type}`).join('<br>')}</p>
                    
                    <p><strong>Effect Size:</strong><br>
                    ${food.evidenceBreakdown.effectSize}</p>
                    
                    <p><strong>Mechanism:</strong><br>
                    ${food.evidenceBreakdown.mechanism}</p>
                    
                    <p><strong>Safety:</strong><br>
                    ${food.evidenceBreakdown.safety}</p>
                    
                    <p><strong>Key Study:</strong><br>
                    ${food.evidenceBreakdown.bestStudy}</p>
                </div>
            </div>
        ` : ''}
        
        <div class="modal-section">
            <button class="btn-primary ${inStack ? 'in-stack' : ''}" onclick="toggleStackItem(foods.find(s => s.id === '${food.id}'))">
                <i data-lucide="${inStack ? 'check' : 'plus'}"></i>
                ${inStack ? 'In Diet' : 'Add to Diet'}
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
    lucide.createIcons();
}

// Close modal
function closeModal() {
    document.getElementById('food-modal').classList.add('hidden');
}

// Toggle stack item
function toggleStackItem(food) {
    const inStack = appState.myStack.some(item => item.food.id === food.id);
    
    if (inStack) {
        removeFromStack(food.id);
    } else {
        addToStack(food);
    }
}

// Add to stack
function addToStack(food) {
    // Check if already in stack
    if (appState.myStack.some(item => item.food.id === food.id)) {
        return;
    }
    
    // Add to stack
    appState.myStack.push({
        food: food,
        multiplier: 1
    });
    
    // Update UI
    updateStackCount();
    updateStackUI();
    renderFoods(); // Re-render to update button states
    saveState();
    
    // Close modal if open
    closeModal();
    
    // Show success message
    showNotification(`${food.name} added to your diet!`);
}

// Remove from stack
function removeFromStack(foodId) {
    const food = appState.myStack.find(item => item.food.id === foodId)?.food;
    appState.myStack = appState.myStack.filter(item => item.food.id !== foodId);
    updateStackCount();
    updateStackUI();
    renderFoods(); // Re-render to update button states
    saveState();
    
    if (food) {
        showNotification(`${food.name} removed from your diet`);
    }
}

// Update stack count
function updateStackCount() {
    const countElement = document.querySelector('.stack-count');
    if (countElement) {
        countElement.textContent = `(${appState.myStack.length})`;
    }
}

// Update stack UI
function updateStackUI() {
    const container = document.getElementById('stack-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (appState.myStack.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="package"></i>
                <p>Your diet is empty. Add foods to get started!</p>
            </div>
        `;
    } else {
        appState.myStack.forEach(item => {
            const element = createStackItemElement(item);
            container.appendChild(element);
        });
    }
    
    // Update synergies
    updateSynergies();
    
    // Update summary
    updateStackSummary();
    
    // Add banner at the bottom of My Stack page
    const stackContainer = document.querySelector('.stack-container');
    if (stackContainer) {
        // Remove any existing banner first
        const existingBanner = stackContainer.querySelector('.product-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        // Add new banner
        const banner = createProductBanner();
        banner.style.marginTop = '3rem';
        stackContainer.appendChild(banner);
    }
    
    // Update icons
    lucide.createIcons();
}

// Create stack item element
function createStackItemElement(item) {
    const template = document.getElementById('stack-item-template');
    const clone = template.content.cloneNode(true);
    const element = clone.querySelector('.stack-item');
    
    element.dataset.foodId = item.food.id;
    element.querySelector('.stack-item-name').textContent = item.food.name;
    element.querySelector('.stack-item-dose').textContent = item.food.servingSize || item.food.recommendedDose || '';
    
    const multiplierInput = element.querySelector('.dose-multiplier');
    multiplierInput.value = item.multiplier;
    multiplierInput.addEventListener('change', (e) => {
        const newMultiplier = parseFloat(e.target.value);
        if (newMultiplier >= 0.5 && newMultiplier <= 5) {
            item.multiplier = newMultiplier;
            updateStackSummary();
            saveState();
        }
    });
    
    element.querySelector('.remove-from-stack-btn').addEventListener('click', () => {
        removeFromStack(item.food.id);
    });
    
    return element;
}

// Update synergies
function updateSynergies() {
    const panel = document.getElementById('synergies-panel');
    const list = document.getElementById('synergies-list');
    if (!panel || !list) return;
    
    list.innerHTML = '';
    
    // Check if synergies is defined
    if (typeof synergies === 'undefined' || !Array.isArray(synergies)) {
        panel.classList.add('hidden');
        return;
    }
    
    const stackIds = appState.myStack.map(item => item.food.id);
    const relevantSynergies = synergies.filter(interaction => {
        const [supp1, supp2] = interaction.foods || [];
        return stackIds.includes(supp1) && stackIds.includes(supp2);
    });
    
    if (relevantSynergies.length === 0) {
        panel.classList.add('hidden');
    } else {
        panel.classList.remove('hidden');
        
        relevantSynergies.forEach(interaction => {
            const item = document.createElement('div');
            item.className = 'interaction-item';
            
            const [supp1Id, supp2Id] = interaction.foods;
            const supp1 = foods.find(s => s.id === supp1Id);
            const supp2 = foods.find(s => s.id === supp2Id);
            
            item.innerHTML = `
                <span class="interaction-severity ${interaction.severity}">${interaction.severity.toUpperCase()}</span>
                <strong>${supp1.name} + ${supp2.name}:</strong> ${interaction.description}
            `;
            
            list.appendChild(item);
        });
    }
}

// Update stack summary
function updateStackSummary() {
    // No longer displaying cost/servings summary for foods
    // Kept for compatibility but does nothing
}

// Clear stack
function clearStack() {
    if (confirm('Are you sure you want to clear your entire diet?')) {
        appState.myStack = [];
        updateStackCount();
        updateStackUI();
        renderFoods();
        saveState();
        showNotification('Diet cleared!');
    }
}

// Export stack
function exportStack() {
    if (appState.myStack.length === 0) {
        alert('Your diet is empty!');
        return;
    }
    
    let exportText = 'MY ANTI-INFLAMMATORY DIET\n';
    exportText += '=====================================\n\n';
    
    appState.myStack.forEach(item => {
        exportText += `${item.food.name}\n`;
        exportText += `Serving: ${item.food.servingSize || item.food.recommendedDose || 'N/A'}`;
        if (item.multiplier !== 1) {
            exportText += ` (${item.multiplier}x)`;
        }
        exportText += `\nFrequency: ${item.food.frequency || item.food.timing || 'Daily'}\n`;
        exportText += `Cost: ${item.food.costPerDay ? `$${(item.food.costPerDay * item.multiplier).toFixed(2)}/day` : 'Varies'}\n\n`;
    });
    
    const totalCost = appState.myStack.reduce((sum, item) => {
        return sum + ((item.food.costPerDay || 0) * item.multiplier);
    }, 0);
    
    exportText += totalCost > 0 ? `\nTOTAL ESTIMATED DAILY COST: $${totalCost.toFixed(2)}\n` : '\nTOTAL COST: Varies by location\n';
    
    // Check for synergies (if synergies data is available)
    if (typeof synergies !== 'undefined' && Array.isArray(synergies)) {
        const stackIds = appState.myStack.map(item => item.food.id);
        const relevantSynergies = synergies.filter(interaction => {
            const [supp1, supp2] = interaction.foods || [];
            return stackIds.includes(supp1) && stackIds.includes(supp2);
        });
    
        if (relevantSynergies.length > 0) {
            exportText += '\nPOTENTIAL INTERACTIONS:\n';
            relevantSynergies.forEach(interaction => {
                const [supp1Id, supp2Id] = interaction.foods;
                const supp1 = foods.find(s => s.id === supp1Id);
                const supp2 = foods.find(s => s.id === supp2Id);
                if (supp1 && supp2) {
                    exportText += `- ${supp1.name} + ${supp2.name}: ${interaction.description}\n`;
                }
            });
        }
    }
    
    // Create download
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-anti-inflammatory-diet.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Diet exported successfully!');
}

// Render templates
function renderTemplates() {
    const container = document.querySelector('.templates-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    dietTemplates.forEach(template => {
        const element = createTemplateElement(template);
        container.appendChild(element);
    });
    
    // Add banner at the end
    const banner = createProductBanner();
    banner.style.marginTop = '3rem';
    container.appendChild(banner);
    
    lucide.createIcons();
}

// Create template element
function createTemplateElement(template) {
    const div = document.createElement('div');
    div.className = 'template-card';
    
    div.innerHTML = `
        <div class="template-icon">
            <i data-lucide="${template.icon}"></i>
        </div>
        <h3 class="template-name">${template.name}</h3>
        <p class="template-description">${template.description}</p>
        <p class="template-count">${template.foods.length} foods</p>
    `;
    
    div.addEventListener('click', () => applyTemplate(template));
    
    return div;
}

// Apply template
function applyTemplate(template) {
    if (appState.myStack.length > 0) {
        if (!confirm('This will replace your current diet. Continue?')) {
            return;
        }
    }
    
    appState.myStack = [];
    
    template.foods.forEach(foodId => {
        const food = foods.find(s => s.id === foodId);
        if (food) {
            appState.myStack.push({
                food: food,
                multiplier: 1
            });
        }
    });
    
    updateStackCount();
    updateStackUI();
    renderFoods();
    saveState();
    
    // Switch to My Stack tab
    switchTab('mystack');
    
    showNotification(`Applied "${template.name}" template!`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        notification.style.animationFillMode = 'forwards';
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}