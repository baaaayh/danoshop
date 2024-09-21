const express = require("express");
const cors = require("cors");
const dbConnection = require("./db");
dbConnection();
const PORT = 4000;

const app = express();
const bodyParser = require("body-parser");

const MENU = require("../models/menu");
const KV = require("../models/kv");
const Product = require("../models/product");

// CORS
app.use(cors());

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET KV
app.get("/api/menu", async (req, res) => {
    try {
        const menuItem = await MENU.find();
        res.json(menuItem[0]);
    } catch (error) {
        console.error("Error fetching menu item:", error); // Log detailed error
        res.status(500).send("Error fetching menu item");
    }
});

app.get("/api/kv", async (req, res) => {
    try {
        const kvItems = await KV.find();
        res.json(kvItems);
    } catch (error) {
        console.error("Error fetching KV items:", error); // Log detailed error
        res.status(500).send("Error fetching KV items");
    }
});

app.get("/api/product", async (req, res) => {
    try {
        const { id } = req.query;
        let productItems;
        if (id) {
            productItems = await Product.find({ id });
        } else {
            productItems = await Product.find();
        }
        res.json(productItems);
    } catch (error) {
        console.error("Error fetching main product items:", error); // Log detailed error
        res.status(500).send("Error fetching product Items");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
