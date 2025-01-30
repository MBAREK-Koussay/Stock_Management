import { renderStockChart } from './StockChart.js';
class StockTracker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-family: 'Arial', sans-serif;
                }
                .dashboard {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 1rem;
                    padding: 1rem;
                    background-color: var(--background-color);
                }
                .card {
                    background-color: var(--card-background);
                    border-radius: 12px;
                    box-shadow:  2px 6px rgba(30, 223, 88, 0.1);
                    padding: 1.5rem;
                    transition: transform 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid var(--background-color);
                    padding-bottom: 0.5rem;
                }
                .card-header h2 {
                    color: var(--text-color);
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .card-header i {
                    color: var(--primary-color);
                }
                .filters {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .filters input, .filters select {
                    flex-grow: 1;
                    padding: 0.5rem;
                    border: 1px solid #E5E7EB;
                    border-radius: 6px;
                }
                .product-list table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .product-list th {
                    background-color: var(--background-color);
                    color: var(--text-color);
                    font-weight: 600;
                    text-align: left;
                    padding: 0.75rem;
                }
                .product-list td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #E5E7EB;               
                }
                .product-list tr:hover {
                    background-color: #F9FAFB;
                }
                .perishables-list {
                    list-style-type: none;
                }
                .perishables-list li {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem;
                    background-color: #FEE2E2;
                    margin-bottom: 0.5rem;
                    border-radius: 6px;
                    color: #7F1D1D; 
                }
                .warehouse-sections {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.5rem;
                }
                .warehouse-section {
                    background-color: var(--background-color);
                    padding: 0.75rem;
                    border-radius: 6px;
                    text-align: center;
                }
            </style>
            <div>
                <div class="dashboard">
                        <div id="stock-chart-container"></div>
                    </div>
                    
                    <div class="card perishables">
                        <div class="card-header">
                            <h2>Produits Périssables</h2>
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <ul id="perishables-list" class="perishables-list"></ul>
                    </div>
                    
                    <div class="card warehouse-map">
                        <div class="card-header">
                            <h2>Plan de l'Entrepôt</h2>
                            <i class="fas fa-warehouse"></i>
                        </div>
                        <div id="warehouse-sections" class="warehouse-sections"></div>
                    </div>
                    
                    <div class="card product-list" style="grid-column: 1 / -1;">
                        <div class="card-header">
                            <h2>Liste des Produits</h2>
                            <i class="fas fa-list"></i>
                        </div>
                        <div class="filters">
                            <input type="text" id="search-input" placeholder="Rechercher un produit">
                            <select id="category-filter">
                                <option value="">Toutes catégories</option>
                            </select>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Catégorie</th>
                                    <th>Quantité</th>
                                    <th>Emplacement</th>
                                    <th>Date Expiration</th>
                                </tr>
                            </thead>
                            <tbody id="products-body"></tbody>
                        </table>
                    </div>
                </div>
                <slot></slot>
            </div>
        `;

        this.initializeData();
        this.setupEventListeners();
    }

    initializeData() {
        const stockData = [
            { 
                category: 'Alimentaire', 
                products: [
                    { name: 'Lait', quantity: 100, location: 'A1-02', expirationDate: '2024-03-15' },
                    { name: 'Yaourt', quantity: 250, location: 'A1-03', expirationDate: '2024-04-20' }
                ]
            },
            { 
                category: 'Électronique', 
                products: [
                    { name: 'Smartphone', quantity: 50, location: 'B2-01', },
                    { name: 'Écouteurs', quantity: 150, location: 'B2-02'},
                    { name: "Airpods", quantity: 100 , location: 'B2-03'}
                ]
            }
        ];

        const warehouseSections = [
            { section: 'A1', description: 'Produits alimentaires' },
            { section: 'B2', description: 'Électronique' }
        ];

        // Populate category filter
        const categoryFilter = this.shadowRoot.getElementById('category-filter');
        const categories = [...new Set(stockData.map(cat => cat.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Populate products table
        const productsBody = this.shadowRoot.getElementById('products-body');
        stockData.forEach(category => {
            category.products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${category.category}</td>
                    <td>${product.quantity}</td>
                    <td>${product.location}</td>
                    <td>${product.expirationDate || ''}</td>
                `;
                productsBody.appendChild(row);
            });
        });

        // Populate perishables list
        const perishablesList = this.shadowRoot.getElementById('perishables-list');
        const perishableProducts = stockData
            .flatMap(category => category.products)
            .filter(product => product.expirationDate && new Date(product.expirationDate) < new Date());
        
        perishableProducts.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${product.name}</span>
                <span>Expire le ${product.expirationDate}</span>
            `;
            perishablesList.appendChild(li);
        });

        // Populate warehouse sections
        const warehouseSectionsContainer = this.shadowRoot.getElementById('warehouse-sections');
        warehouseSections.forEach(section => {
            const div = document.createElement('div');
            div.className = 'warehouse-section';
            div.innerHTML = `
                <strong>${section.section}</strong>
                <p>${section.description}</p>
            `;
            warehouseSectionsContainer.appendChild(div);
        });
    }

    setupEventListeners() {
        const searchInput = this.shadowRoot.getElementById('search-input');
        const categoryFilter = this.shadowRoot.getElementById('category-filter');
        const productsBody = this.shadowRoot.getElementById('products-body');

        const filterProducts = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;

            Array.from(productsBody.children).forEach(row => {
                const productName = row.children[0].textContent.toLowerCase();
                const categoryName = row.children[1].textContent;

                const matchesSearch = productName.includes(searchTerm);
                const matchesCategory = !selectedCategory || categoryName === selectedCategory;

                row.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
            });
        };

        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    }
}

customElements.define('stock-tracker', StockTracker);
