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

                action.payload.options.forEach((newOption) => {
                    const existingOptionIndex = existingProduct.options.findIndex((option) => option.key === newOption.key);

                    if (existingOptionIndex !== -1) {
                        existingProduct.options[existingOptionIndex].value.quantity += newOption.quantity;
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
                state.cartList.push({
                    ...action.payload,
                    options: action.payload.options.map((option) => ({
                        key: option.key,
                        value: {
                            ...option.value,
                            quantity: option.quantity,
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
