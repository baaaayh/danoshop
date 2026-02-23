require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const dbConnection = require("./db");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");

// 모델 스키마 임포트
const MENU = require("../models/menu");
const KV = require("../models/kv");
const Product = require("../models/product");
const User = require("../models/user");

const app = express();

// DB 연결 실행
dbConnection();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/menu", async (req, res) => {
  try {
    const menuItem = await MENU.find();
    res.json(menuItem[0] || {});
  } catch (error) {
    res.status(500).json({});
  }
});

app.get("/api/kv", async (req, res) => {
  try {
    const kvItems = await KV.find();
    res.json(kvItems || []);
  } catch (error) {
    console.error("KV 에러:", error);
    res.status(500).json([]);
  }
});

app.post("/api/product", async (req, res) => {
  try {
    const { id, page, itemsPerPage } = req.body;
    const skip = page * itemsPerPage;
    const productItems = id ? await Product.find({ id }) : await Product.find();
    const pagingButtons = Math.ceil(productItems.length / itemsPerPage);
    const result =
      !page || !itemsPerPage
        ? productItems
        : productItems.reverse().slice(skip, skip + itemsPerPage);

    res.json({ success: true, productView: result, pagingButtons });
  } catch (error) {
    res.status(500).json({ success: false, productView: [] });
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

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

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
    if (!loginData?.id)
      return res.status(400).json({ success: false, msg: "로그인 필요" });

    const user = await User.findOne({ userId: loginData.id });
    if (!user)
      return res.status(404).json({ success: false, msg: "유저 없음" });

    if (user.state === "guest") return res.json({ user: "GUEST" });

    // 장바구니 병합 로직 (기존 유지)
    if (Array.isArray(localCart) && localCart.length > 0) {
      localCart.forEach((localItem) => {
        const existingDBItem = user.cart.find(
          (item) => item.id === localItem.id,
        );
        if (existingDBItem) {
          localItem.options.forEach((localOption) => {
            const existingOption = existingDBItem.options.find(
              (opt) => opt.key === localOption.key,
            );
            if (existingOption) {
              if (type === "update")
                existingOption.value.quantity += localOption.value.quantity;
              else if (type === "overwrite")
                existingOption.value.quantity = localOption.value.quantity;
            } else {
              existingDBItem.options.push(localOption);
            }
          });
        } else {
          user.cart.push(localItem);
        }
      });
    }

    user.markModified("cart");
    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    console.error("Cart error:", error);
    res.status(500).json({ success: false, msg: "서버 에러" });
  }
});

app.post("/api/removeCartOption", async (req, res) => {
  const { loginData, optionKey } = req.body;

  try {
    const user = await User.findOne({ userId: loginData.id });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.cart = user.cart
      .map((item) => {
        const filteredOptions = item.options.filter(
          (option) => option.key !== optionKey,
        );

        return filteredOptions.length > 0
          ? { ...item, options: filteredOptions }
          : null;
      })
      .filter(Boolean); // null 제거

    user.markModified("cart");
    await user.save();

    res.json({ success: true, msg: "Option removed successfully" });
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

app.post("/api/addWishList", async (req, res) => {
  try {
    const { userId, wishList } = req.body;
    let user = await User.findOne({ userId });

    wishList.forEach((newItem) => {
      if (newItem.wishOption) {
        const existingItemIndex = user.wishList.findIndex(
          (existingItem) =>
            existingItem.wishOption?.key === newItem.wishOption.key,
        );

        if (existingItemIndex !== -1) {
          user.wishList[existingItemIndex] = newItem;
        } else {
          user.wishList.push({ ...newItem, uniqueId: uuidv4() });
        }
      } else {
        user.wishList.push({ ...newItem, uniqueId: uuidv4() });
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
    const { userId, page, itemsPerPage } = req.body;
    const skip = page * itemsPerPage;
    let user = await User.findOne({ userId });
    let totalItem = user.wishList.length;
    let pagingButtons = Math.ceil(totalItem / itemsPerPage);

    const paginatedWishList = user.wishList
      .reverse()
      .slice(skip, skip + itemsPerPage);

    res.json({
      success: true,
      wishList: paginatedWishList,
      pagingButtons: pagingButtons,
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
      wishList: user.wishList,
      pagingButtons: 1,
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/removeWishListItem", async (req, res) => {
  try {
    const { itemUniqueId, userId, page, itemsPerPage } = req.body;
    const skip = page * itemsPerPage;
    let user = await User.findOne({ userId });
    if (user && user.wishList) {
      if (typeof itemUniqueId === "string") {
        user.wishList = user.wishList.filter(
          (item) => item.uniqueId !== itemUniqueId,
        );
      } else if (Array.isArray(itemUniqueId)) {
        user.wishList = user.wishList.filter(
          (item) => !itemUniqueId.includes(item.uniqueId),
        );
      }

      await user.save();

      const totalItem = user.wishList.length;
      const pagingButtons = Math.ceil(totalItem / itemsPerPage);

      const paginatedWishList = user.wishList
        .slice()
        .reverse()
        .slice(skip, skip + itemsPerPage);

      res.json({
        success: true,
        wishList: paginatedWishList,
        pagingButtons: pagingButtons,
      });
    } else {
      res.json({
        success: false,
        message: "User or wishlist not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

app.post("/api/getRecentView", async (req, res) => {
  try {
    const { userId, page, itemsPerPage } = req.body;
    const skip = page * itemsPerPage;
    let user = await User.findOne({ userId });
    if (user && user.recentView) {
      let totalItem = user.recentView.length;
      let pagingButtons = Math.ceil(totalItem / itemsPerPage);

      const paginatedRecentView = user.recentView
        .reverse()
        .slice(skip, skip + itemsPerPage);

      res.json({
        success: true,
        recentView: paginatedRecentView,
        pagingButtons: pagingButtons,
      });
    } else {
      res.json({
        success: false,
        message: "User or recent view not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "서버 에러 발생" });
  }
});

app.post("/api/updateRecentView", async (req, res) => {
  try {
    const { recentViewItem, userId } = req.body;
    let user = await User.findOne({ userId });
    user.recentView.push({ ...recentViewItem, uniqueId: uuidv4() });

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
    const { itemUniqueId, userId, page, itemsPerPage } = req.body;
    const skip = page * itemsPerPage;
    let user = await User.findOne({ userId });
    if (user && user.recentView) {
      user.recentView = user.recentView.filter(
        (item) => item.uniqueId !== itemUniqueId,
      );
      await user.save();

      let totalItem = user.recentView.length;
      let pagingButtons = Math.ceil(totalItem / itemsPerPage);

      const paginatedRecentView = user.recentView
        .reverse()
        .slice(skip, skip + itemsPerPage);

      res.json({
        success: true,
        recentView: paginatedRecentView,
        pagingButtons: pagingButtons,
      });
    } else {
      res.json({
        success: false,
        message: "User or recent view not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "서버 에러 발생" });
  }
});

app.post("/api/makeOrderHistory", async (req, res) => {
  try {
    const { userId, orderInfo } = req.body;
    let user = await User.findOne({ userId });
    user.orderHistory.push(orderInfo);
    user.save();

    res.json({
      success: true,
      msg: "주문이 완료되었습니다.",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/getOrderHistory", async (req, res) => {
  try {
    const { userId, orderId, page, itemsPerPage } = req.body;
    const skip = page * itemsPerPage;
    let totalItem;
    let pagingButtons;
    let paginatedOrderHistoryView;
    let user = await User.findOne({ userId });

    let orderObj;
    if (orderId) {
      orderObj = user.orderHistory.filter((order) => order.orderId === orderId);
      pagingButtons = false;
    } else {
      orderObj = user.orderHistory;
      totalItem = orderObj.length;
      pagingButtons = Math.ceil(totalItem / itemsPerPage);
      orderObj = orderObj.reverse().slice(skip, skip + itemsPerPage);
    }

    res.json({
      success: true,
      orderObj,
      pagingButtons: pagingButtons,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/searchItems", async (req, res) => {
  try {
    const { searchText, page, itemsPerPage } = req.body;
    const skip = page * itemsPerPage;
    const allItems = await Product.find();

    const result = allItems.filter((item) => item.title.includes(searchText));

    let pagingButtons = Math.ceil(result.length / itemsPerPage);
    let paginatedSearchView;
    if (searchText !== "") {
      paginatedSearchView = result.slice(skip, skip + itemsPerPage);
    } else {
      paginatedSearchView = [];
    }

    res.json({
      success: true,
      pagingButtons,
      searchResult: paginatedSearchView,
    });
  } catch (error) {
    console.log(error);
  }
});

// 리액트 빌드 파일 제공 (가장 마지막에 위치)
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
});

// 서버 실행 (Vercel 환경이 아닐 때만 listen)
if (process.env.NODE_ENV !== "production") {
  const PORT = 4000;
  app.listen(PORT, () => console.log(`서버 작동 중: http://localhost:${PORT}`));
}

module.exports = app;
