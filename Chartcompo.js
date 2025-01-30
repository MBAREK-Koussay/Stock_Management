import { renderStockChart1 } from "./StockChart2.js";

class Chartcompo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        renderStockChart(this.shadowRoot.getElementById("stock-chart-container"));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
                .dashboard { padding: 1rem; }
                .card { background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); margin-bottom: 1rem; }
                .card-header { font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; }
                #stock-chart-container { width: 100%; height: 300px; }
            </style>
            <div class="dashboard">
                <div class="card">
                    <div class="card-header">📊 Niveaux de Stock</div>
                    <div id="stock-chart-container"></div>
                </div>
            </div>
        `;
    }
}

customElements.define("compo-2", Chartcompo);
