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

        const userInfo = { userId: user.userId, cart: user.cart };

        res.json({ success: true, msg: '로그인 되었습니다.', token, user: userInfo });
    } catch (error) {
        console.error('Error fetching Login Data', error);
    }
});

app.post('/api/userCart', async (req, res) => {
    try {
        const { loginData, localCart } = req.body;

        // 로그인 데이터 유효성 검사
        if (!loginData || !loginData.id) {
            return res.status(400).send('Invalid login data');
        }

        const user = await User.findOne({ userId: loginData.id });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // 장바구니 초기화
        if (!user.cart) {
            user.cart = [];
        }

        if (localCart && Array.isArray(localCart) && localCart.length > 0) {
            for (const [index, localItem] of localCart.entries()) {
                if (typeof localItem !== 'object' || localItem === null) {
                    return res.status(400).send(`Invalid item format at index ${index}`);
                }
                if (!localItem.id) {
                    return res.status(400).send(`Item id is missing in localCart at index ${index}`);
                }
                if (!Array.isArray(localItem.options)) {
                    return res.status(400).send(`Item options must be an array at index ${index}`);
                }
                if (typeof localItem.price !== 'string') {
                    return res.status(400).send(`Item price must be a string at index ${index}`);
                }
                if (typeof localItem.data !== 'object' || localItem.data === null) {
                    return res.status(400).send(`Invalid data format in localCart at index ${index}`);
                }

                // 기존 장바구니에 추가
                const existingDBItem = user.cart.find((item) => item.id === localItem.id);
                console.log(`Existing DB Item:`, existingDBItem);

                if (!existingDBItem) {
                    user.cart.push({ ...localItem });
                } else {
                    let optionUpdated = false; // 옵션 업데이트 여부 플래그

                    localItem.options.forEach((matchedItemOption) => {
                        const existingOption = existingDBItem.options.find((option) => option.key === matchedItemOption.key);
                        console.log(`Matched Item Option:`, matchedItemOption, `Existing Option:`, existingOption);

                        if (existingOption) {
                            // 상품 ID가 일치할 때만 수량을 업데이트
                            existingOption.value.quantity += matchedItemOption.value.quantity;
                            optionUpdated = true; // 옵션이 업데이트된 경우 플래그 설정
                        }
                    });

                    // 업데이트되지 않은 옵션을 추가
                    if (!optionUpdated) {
                        existingDBItem.options.push(...localItem.options);
                    }
                }
            }

            user.markModified('cart');
            await user.save();
            return res.json({ success: true, cart: user.cart }); // 성공적으로 업데이트된 장바구니 반환
        } else {
            user.markModified('cart');
            await user.save();
            return res.status(200).send('로그인만 완료되었습니다.');
        }
    } catch (error) {
        console.error('Error fetching Cart Data', error);
        if (!res.headersSent) {
            return res.status(500).send('Error saving cart data');
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
