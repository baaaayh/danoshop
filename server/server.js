const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const dbConnection = require("./db");
dbConnection();
const PORT = 4000;

const app = express();
const bodyParser = require("body-parser");

// schema
const MENU = require("../models/menu");
const KV = require("../models/kv");
const Product = require("../models/product");
const User = require("../models/user");

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
        console.error("Error fetching menu item:", error);
        res.status(500).send("Error fetching menu item");
    }
});

app.get("/api/kv", async (req, res) => {
    try {
        const kvItems = await KV.find();
        res.json(kvItems);
    } catch (error) {
        console.error("Error fetching KV items:", error);
        res.status(500).send("Error fetching KV items");
    }
});

app.get("/api/product", async (req, res) => {
    try {
        const { id } = req.query;
        const productItems = id
            ? await Product.find({ id })
            : await Product.find();
        res.json(productItems);
    } catch (error) {
        console.error("Error fetching main product items:", error);
        res.status(500).send("Error fetching product items");
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { id, password } = req.body;
        const user = await User.findOne({ userId: id });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({
                success: false,
                msg: "아이디 혹은 비밀번호가 일치하지 않습니다.",
            });
        }

        const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        const userInfo = { userId: user.userId, cart: user.cart };

        res.json({
            success: true,
            msg: "로그인 되었습니다.",
            token,
            user: userInfo,
        });
    } catch (error) {
        console.error("Error fetching login data", error);
        res.status(500).send("Login error");
    }
});

app.post("/api/userInfo", async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findOne({ userId: userId });
        res.json({ success: true, user: user });
    } catch (error) {
        console.error(error);
    }
});

app.post("/api/userCart", async (req, res) => {
    try {
        const { loginData, localCart, type } = req.body;
        const user = await User.findOne({ userId: loginData.id });

        if (user.state === "guest") {
            return res.send({ user: "GUEST" });
        }

        // 로컬 장바구니가 비어있지 않은 경우
        if (localCart.length > 0) {
            localCart.forEach((localItem) => {
                const existingDBItem = user.cart.find(
                    (item) => item.id === localItem.id
                );

                if (existingDBItem) {
                    localItem.options.forEach((localOption) => {
                        const existingOption = existingDBItem.options.find(
                            (option) => option.key === localOption.key
                        );
                        if (existingOption) {
                            if (type === "update") {
                                existingOption.value.quantity +=
                                    localOption.value.quantity;
                            } else if (type === "overwrite") {
                                existingOption.value.quantity =
                                    localOption.value.quantity;
                            }
                        } else {
                            existingDBItem.options.push(localOption); // 신규 옵션 추가
                        }
                    });
                } else {
                    user.cart.push(localItem); // 신규 상품 추가
                }
            });
        }

        user.markModified("cart");
        await user.save();

        res.json({ success: true, cart: user.cart });
    } catch (error) {
        console.error("Error saving cart data", error);
        res.status(500).send("Error saving cart data");
    }
});

app.post("/api/removeCartOption", async (req, res) => {
    const { loginData, optionKey } = req.body;

    try {
        const user = await User.findOne({ userId: loginData.id });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // 장바구니에서 해당 optionKey 삭제
        user.cart = user.cart
            .map((item) => {
                const updatedOptions = item.options.filter(
                    (option) => option.key !== optionKey
                );

                // 옵션이 없으면 아이템을 삭제
                if (updatedOptions.length === 0) {
                    return null; // null 반환
                }

                return {
                    ...item,
                    options: updatedOptions,
                };
            })
            .filter((item) => item !== null); // null인 아이템 제거

        user.markModified("cart");
        await user.save(); // 변경사항 저장

        res.json({ success: true, msg: "Item removed successfully" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).send("Error removing item");
    }
});

app.post("/api/checkId", async (req, res) => {
    try {
        const { userId } = req.body;
        const duplication = await User.findOne({ userId: userId });

        res.json({
            success: true,
            checkId: !duplication ? false : true,
        });
    } catch (error) {
        console.error(error);
    }
});

app.post("/api/join", async (req, res) => {
    try {
        const { userForm, isModifyMode } = req.body;
        const {
            joinType,
            userId,
            password,
            userName,
            phone,
            phone1,
            phone2,
            phone3,
            email,
            birth,
            birthYear,
            birthMonth,
            birthDay,
            recommand,
        } = userForm;

        if (isModifyMode) {
            console.log(isModifyMode);
            if (!userId || !userName) {
                return res.status(400).json({
                    success: false,
                    msg: "필수 입력 값을 확인해주세요.",
                });
            }

            let user = await User.findOne({ userId });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: "사용자를 찾을 수 없습니다.",
                });
            }

            user.phone = phone;
            user.phone1 = phone1;
            user.phone2 = phone2;
            user.phone3 = phone3;
            user.email = email;
            user.birth = birth;
            user.birthYear = birthYear;
            user.birthMonth = birthMonth;
            user.birthDay = birthDay;

            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }

            await user.save();

            res.status(201).json({
                success: true,
                msg: "회원 정보 수정이 성공적으로 완료됐습니다.",
            });
        } else {
            if (!userId || !password || !userName || !email) {
                return res.status(400).json({
                    success: false,
                    msg: "필수 입력 값을 확인해주세요.",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                joinType,
                userId,
                password: hashedPassword,
                userName,
                phone,
                phone1,
                phone2,
                phone3,
                email,
                birth,
                birthYear,
                birthMonth,
                birthDay,
                recommand,
            });
            await newUser.save();
            res.status(201).json({
                success: true,
                msg: "회원 가입이 성공적으로 완료됐습니다.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "서버 오류가 발생했습니다. 다시 시도해주세요.",
        });
    }
});

app.post("/api/validateUser", async (req, res) => {
    const { userId, password } = req.body;

    let user = await User.findOne({ userId });
    let validation = await bcrypt.compare(password, user.password);

    if (validation) {
        console.log("here");
        res.status(201).json({
            success: true,
            msg: "비밀번호 확인이 완료됐습니다.",
        });
    } else {
        res.json({
            success: false,
            msg: "아이디 혹은 비밀번호가 일치하지 않습니다.",
        });
    }
});

app.post("/api/getOrderHistory", async (req, res) => {
    const { userId } = req.body;
    let user = await User.findOne({ userId });

    console.log(user.orderHistory);

    // res.json({
    //     success: true,
    // });
});

app.post("/api/addWishList", async (req, res) => {
    try {
        const { userId, wishList } = req.body;
        let user = await User.findOne({ userId });

        wishList.forEach((newItem) => {
            if (newItem.wishOption) {
                const existingItemIndex = user.wishList.findIndex(
                    (existingItem) =>
                        existingItem.wishOption?.key === newItem.wishOption.key
                );

                if (existingItemIndex !== -1) {
                    user.wishList[existingItemIndex] = newItem;
                } else {
                    user.wishList.push(newItem);
                }
            } else {
                user.wishList.push(newItem);
            }
        });

        await user.save();
        res.json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
});

app.post("/api/getWishList", async (req, res) => {
    try {
        const { userId } = req.body;
        let user = await User.findOne({ userId });

        res.json({
            success: true,
            wishList: user.wishList,
        });
    } catch (error) {
        console.error(error);
    }
});

app.post("/api/clearWishList", async (req, res) => {
    try {
        const { userId } = req.body;
        let user = await User.findOne({ userId });

        user.wishList = [];
        await user.save();
        res.json({
            success: true,
        });
    } catch (error) {
        console.error(error);
    }
});

app.post("/api/removeWishListItem", async (req, res) => {
    try {
        const { userId, optionId } = req.body;
        let user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "사용자를 찾을 수 없습니다.",
            });
        }

        if (typeof optionId === "string") {
            const noWishOptionsItemIndex = user.wishList.findIndex(
                (item) => item.id === optionId && !item.wishOption
            );

            if (noWishOptionsItemIndex !== -1) {
                user.wishList = user.wishList.filter(
                    (item) => item.id !== optionId || item.wishOption
                );
            } else {
                const wishOptionItemIndex = user.wishList.findIndex(
                    (item) =>
                        item.wishOption && item.wishOption.key === optionId
                );

                if (wishOptionItemIndex !== -1) {
                    user.wishList = user.wishList.filter(
                        (item) =>
                            !(
                                item.wishOption &&
                                item.wishOption.key === optionId
                            )
                    );
                }
            }
        } else if (Array.isArray(optionId)) {
            user.wishList = user.wishList.filter((item) => {
                return !optionId.includes(
                    item.wishOption ? item.wishOption.key : item.id
                );
            });
        }

        await user.save();

        res.json({
            success: true,
            wishList: user.wishList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
});

app.post("/api/getRecentView", async (req, res) => {
    try {
        const { userId } = req.body;
        let user = await User.findOne({ userId });

        res.json({
            success: true,
            recentView: user.recentView,
        });
    } catch (error) {
        console.error(error);
    }
});

app.post("/api/updateRecentView", async (req, res) => {
    try {
        const { recentViewItem, userId } = req.body;
        let user = await User.findOne({ userId });

        user.recentView.push(recentViewItem);

        await user.save();
        res.json({
            success: true,
        });
    } catch (error) {
        console.error(error);
    }
});

app.post("/api/removeRecentViewItem", async (req, res) => {
    try {
        const { recentViewItem, userId } = req.body;
        let user = await User.findOne({ userId });

        user.recentView.push(recentViewItem);

        await user.save();
        res.json({
            success: true,
        });
    } catch (error) {
        console.error(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
