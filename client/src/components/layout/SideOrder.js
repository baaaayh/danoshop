import React, {
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SideOrder = forwardRef((props, ref) => {
    const sidePanel = useRef();
    const sideOrderItem = useSelector((state) => state.sideOrder.sideOrderItem);

    const getProductInfo = async (itemId) => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/product",
                { params: { id: itemId } }
            );

            console.log(response.data);
        } catch (error) {
            console.error("Failed to update cart on server:", error);
        }
    };

    useImperativeHandle(ref, () => ({
        open: (itemId) => {
            getProductInfo(itemId);
            sidePanel.current.classList.add("active");
        },
    }));

    const closePanel = useCallback(() => {
        sidePanel.current.classList.remove("active");
    }, []);

    return (
        <div className="side-order" ref={sidePanel}>
            <div className="side-order__container">
                <div className="side-order__top">
                    <div className="side-order__head">
                        <button type="button" onClick={closePanel}>
                            닫기
                        </button>
                    </div>
                    <div className="side-order__body">
                        <div className="side-order__view">
                            <h2>옵션 선택</h2>
                            <div className="side-order__product">
                                <div className="side-order__thumb"></div>
                                <div className="side-order__info">
                                    <strong></strong>
                                </div>
                            </div>
                            <div className="side-order__option">
                                <span>옵션</span>
                                <div className="side-order__select">
                                    {/* <select name="" id="">
                                        <option value="" selected>
                                            {" "}
                                            - [필수] 옵션을 선택해 주세요 -{" "}
                                        </option>
                                        <option value=""></option>
                                    </select> */}
                                </div>
                            </div>
                        </div>
                        <div className="side-order__total">
                            <div className="side-order__price">
                                <b>
                                    TOTAL <span>(QUANTITY)</span>
                                </b>
                                <div>
                                    <strong>0</strong>(0개)
                                </div>
                            </div>
                            <div className="side-order__row">배송정보</div>
                            <div className="side-order__row">개별배송</div>
                            <div className="side-order__row">
                                지금 주문하면 내일 출고
                            </div>
                        </div>
                    </div>
                </div>
                <div className="side-order__footer">
                    <ul>
                        <li>
                            <Link
                                to=""
                                className="btn btn-square btn-square--white"
                            >
                                <span className="btn btn-square__text">
                                    장바구니 담기
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to=""
                                className="btn btn-square btn-square--black"
                            >
                                <span className="btn btn-square__text">
                                    바로구매
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

export default SideOrder;
