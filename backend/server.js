const express = require("express");
const cors = require("cors");
const productsData = require("./products.json");

const app = express();
app.use(cors());

//şimdilik sabit altın fiyatı
const goldPrice = 60;

// API endpoint
app.get("/api/products", (req, res) => {
    const productsWithPrice = productsData.map((product) => {
        const price = (product.popularityScore + 1) * product.weight * goldPrice;

        return {
            ...product,
            price: price.toFixed(2)
        };
    });

    res.json(productsWithPrice);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend çalışıyor http://localhost:${PORT}`);
});
