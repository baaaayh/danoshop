const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const dbConnection = require('./db');
dbConnection();
const PORT = 4000;

const app = express();
const bodyParser = require('body-parser');

// schema
const MENU = require('../models/menu');
const KV = require('../models/kv');
const Product = require('../models/product');
const User = require('../models/user');

// CORS
app.use(cors());

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET KV
app.get('/api/menu', async (req, res) => {
    try {
        const menuItem = await MENU.find();
        res.json(menuItem[0]);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).send('Error fetching menu item');
    }
});

app.get('/api/kv', async (req, res) => {
    try {
        const kvItems = await KV.find();
        res.json(kvItems);
    } catch (error) {
        console.error('Error fetching KV items:', error);
        res.status(500).send('Error fetching KV items');
    }
});

app.get('/api/product', async (req, res) => {
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
        console.error('Error fetching main product items:', error);
        res.status(500).send('Error fetching product Items');
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { id, password } = req.body;
        const user = await User.findOne({ userId: id });

        if (!user) {
            return res.json('아이디 혹은 비밀번호가 일치하지 않습니다.');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json('아이디 혹은 비밀번호가 일치하지 않습니다.');
        }

        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.json({ user, msg: '로그인 되었습니다.', token });
    } catch (error) {
        console.error('Error fetching Login Data', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
