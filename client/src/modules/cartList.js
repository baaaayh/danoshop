import { createSlice } from '@reduxjs/toolkit';

const cartListData = createSlice({
    name: 'cart',
    initialState: {
        cartList: [],
    },
    reducers: {
        addCartItem: (state, action) => {
            const existingProductIndex = state.cartList.findIndex((item) => item.id === action.payload.id);

            if (existingProductIndex !== -1) {
                const existingProduct = state.cartList[existingProductIndex];

                // 객체를 배열로 변환
                const optionsArray = Object.values(action.payload.options);

                optionsArray.forEach((newOption) => {
                    const existingOptionIndex = existingProduct.options.findIndex((option) => option.key === newOption.key);

                    if (existingOptionIndex !== -1) {
                        existingProduct.options.forEach((option) => {
                            if (option.key === newOption.key) {
                                option.value.quantity += newOption.quantity;
                            }
                        });
                    } else {
                        existingProduct.options.push({
                            key: newOption.key,
                            value: {
                                ...newOption.value,
                                quantity: newOption.quantity,
                            },
                        });
                    }
                });
            } else {
                const optionsArray = Object.values(action.payload.options); // 객체를 배열로 변환

                state.cartList.push({
                    ...action.payload,
                    options: optionsArray.map((option) => ({
                        key: option.key,
                        value: {
                            quantity: option.quantity,
                            ...option.value,
                        },
                    })),
                });
            }
        },
        removeCartItem: (state, action) => {
            state.cartList = state.cartList.filter((item) => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.cartList = [];
        },
        updateCartItem: (state, action) => {
            const { itemId, optionKey, quantity } = action.payload;
            const existingProductIndex = state.cartList.findIndex((item) => item.id === itemId);

            if (existingProductIndex !== -1) {
                const existingProduct = state.cartList[existingProductIndex];
                const existingOptionIndex = existingProduct.options.findIndex((option) => option.key === optionKey);

                if (existingOptionIndex !== -1) {
                    // 수량 업데이트
                    existingProduct.options[existingOptionIndex].value.quantity = quantity;
                }
            }
        },
    },
});

export const { addCartItem, removeCartItem, clearCart, updateCartItem } = cartListData.actions;
export default cartListData.reducer;
