export function renderStockChart(container) {
    if (!container) return;

    // Insérer une balise canvas dans le conteneur
    container.innerHTML = '<canvas id="stock-chart"></canvas>';
    
    // Récupérer le canvas
    const ctx = container.querySelector("#stock-chart");

    // Données du graphique
    const data = {
        labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
        datasets: [{
            label: "Stock Niveau",
            data: [100, 150, 120, 170, 140, 180], 
            backgroundColor: "rgba(41, 14, 97, 0.2)",
            borderColor: "rgb(64, 20, 161)",
            borderWidth: 2
        }]
    };

    // Configuration du graphique
    new Chart(ctx, {
        type: "line",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
