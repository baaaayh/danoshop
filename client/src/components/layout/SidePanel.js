import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useRef,
} from "react";
import { useSelector } from "react-redux";
import { SidePanelContext } from "../../App";
import axios from "axios";

function SidePanel({ productId, index }) {
    const userInfo = useSelector((state) => state.user);
    const sidePanel = useContext(SidePanelContext);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [productInfo, setProductInfo] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const callSideOrder = (itemId) => {
        if (sidePanel && sidePanel.current) {
            sidePanel.current.reset();
            sidePanel.current.open(itemId);
        } else {
            console.error("sidePanel ref가 설정되지 않았습니다.");
        }
    };

    const getProductDetail = useCallback(async () => {
        try {
            const response = await axios.post(
                "http://localhost:4000/api/product",
                { id: productId }
            );
            setProductInfo(response.data.productView[0]);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }, [productId]);

    const addWishListItem = useCallback(async () => {
        if (userInfo.token) {
            try {
                let wishList;
                if (selectedOptions.length > 0) {
                    wishList = selectedOptions.map((option) => {
                        const product = {
                            id: productInfo.id,
                            options: selectedOptions,
                            price: String(totalPrice),
                            wishOption: option,
                            data: { ...productInfo },
                        };
                        return product;
                    });
                } else {
                    wishList = [
                        {
                            id: productInfo.id,
                            options: selectedOptions,
                            price: String(totalPrice),
                            data: { ...productInfo },
                        },
                    ];
                }

                await axios.post("http://localhost:4000/api/addWishList", {
                    userId: userInfo.userId,
                    wishList: wishList,
                });

                alert("관심상품으로 등록되었습니다.");
            } catch (error) {
                console.error("Error updating wish list:", error);
            }
        } else {
            alert("로그인 후 이용해 주세요.");
        }
    }, [
        userInfo.token,
        productInfo,
        selectedOptions,
        totalPrice,
        userInfo.userId,
    ]);

    const fetchOptionList = useCallback(() => {}, []);

    useEffect(() => {
        fetchOptionList();
    }, [fetchOptionList]);

    useEffect(() => {
        getProductDetail();
    }, []);

    const activeOptionButton = useRef([]);
    const optionList = useRef([]);
    const closeOptionList = useRef([]);

    useEffect(() => {
        activeOptionButton.current.forEach((button, index) => {
            if (button) {
                const activeOptionList = () => {
                    const list = optionList.current[index];
                    if (list && button) {
                        button.classList.add("active");
                        list.classList.add("active");
                    }
                };

                button.addEventListener("click", activeOptionList);

                return () => {
                    button.removeEventListener("click", activeOptionList);
                };
            }
        });
    }, []);

    useEffect(() => {
        closeOptionList.current.forEach((button, index) => {
            if (button) {
                const closeList = () => {
                    const list = optionList.current[index];
                    if (list && button) {
                        list.classList.remove("active");
                    }
                };
                button.addEventListener("click", closeList);
            }
        });
    }, []);

    return (
        <div className="side-panel">
            <ul>
                <li>
                    <button
                        type="button"
                        className="btn btn-orange"
                        onClick={addWishListItem}
                    >
                        <span>WISH</span>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className="btn btn-orange"
                        onClick={() => callSideOrder(productId)}
                    >
                        <span>ADD</span>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className="btn btn-orange"
                        ref={(el) => (activeOptionButton.current[index] = el)}
                    >
                        <span>OPTION</span>
                    </button>
                    <div
                        className="side-panel__option"
                        ref={(el) => (optionList.current[index] = el)}
                    >
                        <button
                            type="button"
                            ref={(el) => (closeOptionList.current[index] = el)}
                        >
                            닫기
                        </button>
                        <div className="side-panel__inner">
                            <ul>
                                {Object.keys(productInfo).length > 0 &&
                                    productInfo.options.map((option) => {
                                        const key = Object.keys(option)[0];
                                        if (!option[key].data) {
                                            return null;
                                        }
                                        return option[key].data.map((o) => (
                                            <li>{o.label}</li>
                                        ));
                                    })}
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default SidePanel;
