export async function renderStockChart(container) {
    container.innerHTML = '<canvas id="stock-chart"></canvas>';
    const ctx = container.querySelector("#stock-chart");

    try {
        // Charger les données depuis le fichier JSON
        const response = await fetch("./data.json");
        const stockData = await response.json();

        // Extraire les labels et les valeurs
        const labels = stockData.map(item => item.produit);
        const dataValues = stockData.map(item => item.quantite);

        // Création du graphique
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Stock Niveau",
                    data: dataValues,
                    backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
                    borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 206, 86)", "rgb(75, 192, 192)"],
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}
