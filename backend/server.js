const express = require("express");
const cors = require("cors");
const productsData = require("./products.json");

const app = express();
app.use(cors());

// Mock gold price (örnek: 60 USD/gram)
const goldPrice = 60;

// API endpoint
app.get("/api/products", (req, res) => {
    const productsWithPrice = productsData.map((product) => {
        const price = (product.popularityScore + 1) * product.weight * goldPrice;

        return {
            ...product,
            price: price.toFixed(2) // 2 ondalık
        };
    });

    res.json(productsWithPrice);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
