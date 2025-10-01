require('dotenv').config();
const express = require("express");
const cors = require("cors");
const productsData = require("./products.json");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const app = express();
app.use(cors());

const GOLD_API_URL = "https://www.goldapi.io/api/XAU/USD";
const GOLD_API_TOKEN = process.env.GOLD_API_KEY;

app.get("/api/products", async (req, res) => {
    try {
        const response = await fetch(GOLD_API_URL, {
            method: "GET",
            headers: {
                "x-access-token": GOLD_API_TOKEN,
                "Content-Type": "application/json",
            },
        });
        const goldData = await response.json();
        const goldPrice = goldData.price;

        const productsWithPrice = productsData.map((product) => {
            const price = (product.popularityScore + 1) * product.weight * goldPrice;
            return { ...product, price: price.toFixed(2) };
        });

        res.json(productsWithPrice);
    } catch (error) {
        console.error("GoldAPI hatası:", error);
        const fallbackPrice = 60;
        const productsWithPrice = productsData.map((product) => {
            const price = (product.popularityScore + 1) * product.weight * fallbackPrice;
            return { ...product, price: price.toFixed(2) };
        });
        res.json(productsWithPrice);
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend aktif http://localhost:${PORT}`);
});
