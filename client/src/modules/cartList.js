import { createSlice } from "@reduxjs/toolkit";

const cartListData = createSlice({
    name: "cart",
    initialState: {
        cartList: [],
    },
    reducers: {
        addCartItem: (state, action) => {
            const existingProductIndex = state.cartList.findIndex(
                (item) => item.id === action.payload.id
            );

            if (existingProductIndex !== -1) {
                const existingProduct = state.cartList[existingProductIndex];

                action.payload.options.forEach((newOption) => {
                    const existingOptionIndex =
                        existingProduct.options.findIndex(
                            (option) => option.key === newOption.key
                        );

                    if (existingOptionIndex !== -1) {
                        existingProduct.options[
                            existingOptionIndex
                        ].value.quantity += newOption.value.quantity;
                    } else {
                        existingProduct.options.push({
                            key: newOption.key,
                            value: {
                                ...newOption.value,
                                quantity: newOption.value.quantity,
                            },
                        });
                    }
                });
            } else {
                state.cartList.push({
                    ...action.payload,
                    options: action.payload.options,
                });
            }
        },
        removeCartOption: (state, action) => {
            state.cartList = state.cartList
                .map((item) => {
                    const updatedOptions = item.options.filter(
                        (option) => option.key !== action.payload
                    );

                    // 옵션이 없으면 아이템을 삭제
                    if (updatedOptions.length === 0) {
                        return null; // 이곳에서 null을 반환
                    }

                    return {
                        ...item,
                        options: updatedOptions,
                    };
                })
                .filter((item) => item !== null); // null인 아이템 제거
        },
        clearCart: (state) => {
            state.cartList = [];
        },
        updateCartItem: (state, action) => {
            const { itemId, optionKey, quantity } = action.payload;
            const existingProductIndex = state.cartList.findIndex(
                (item) => item.id === itemId
            );

            if (existingProductIndex !== -1) {
                const existingProduct = state.cartList[existingProductIndex];
                const existingOptionIndex = existingProduct.options.findIndex(
                    (option) => option.key === optionKey
                );

                if (existingOptionIndex !== -1) {
                    existingProduct.options[
                        existingOptionIndex
                    ].value.quantity += quantity;

                    // 옵션의 수량이 0 이하가 되면 해당 옵션 삭제
                    if (
                        existingProduct.options[existingOptionIndex].value
                            .quantity < 1
                    ) {
                        state.cartList[existingProductIndex].options.splice(
                            existingOptionIndex,
                            1
                        );
                    }
                }

                // 옵션이 없으면 아이템 삭제
                if (state.cartList[existingProductIndex].options.length === 0) {
                    state.cartList.splice(existingProductIndex, 1);
                }
            }
        },
    },
});

export const { addCartItem, removeCartOption, clearCart, updateCartItem } =
    cartListData.actions;
export default cartListData.reducer;
