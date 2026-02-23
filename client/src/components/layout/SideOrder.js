import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../../modules/cartList";
import LayerPopup from "../../components/layout/LayerPopup";
import axios from "axios";
import { saveOrder, clearOrder } from "../../modules/orderList";

const SideOrder = forwardRef((props, ref) => {
  const sidePanel = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state.user);
  const cartList = useSelector((state) => state.cart.cartList);
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [, setUpdatedLocalCart] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [productInfo, setProductInfo] = useState({ price: 0 });
  const [totalPrice, setTotalPrice] = useState(0);

  const [isAdding, setIsAdding] = useState(false);

  const getProductInfo = useCallback(async (itemId) => {
    try {
      const response = await axios.post(
        "http://baaaayh.sytes.net/api/product",
        { id: itemId },
      );
      setProductInfo(response.data.productView[0]);
    } catch (error) {
      console.error("Failed to update cart on server:", error);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    open: (itemId) => {
      getProductInfo(itemId);
      sidePanel.current.classList.add("active");
    },
    reset: () => {
      setSelectedOptions([]);
    },
  }));

  const closePanel = useCallback(() => {
    sidePanel.current.classList.remove("active");
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const newTotalPrice = selectedOptions.reduce((total, option) => {
      const optionPrice = option.value.price || 0;
      return (
        total +
        (Number(productInfo.price) + optionPrice) * option.value.quantity
      );
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [selectedOptions, productInfo.price]);

  const handleOptionSelect = (selectedOptionValue, key) => {
    setSelectedOptions((prev) => {
      const existingOptionIndex = prev.findIndex(
        (option) => option.key === key,
      );
      if (existingOptionIndex === -1) {
        return [
          ...prev,
          {
            key: key,
            value: {
              ...selectedOptionValue,
              quantity: 1,
            },
          },
        ];
      }
      return prev;
    });
  };

  const handleDeleteOption = (key) => {
    setSelectedOptions((prev) => prev.filter((option) => option.key !== key));
  };

  const handleQuantityChange = (key, change) => {
    setSelectedOptions((prev) =>
      prev.map((option) => {
        if (option.key === key) {
          const currentQuantity = option.value?.quantity ?? 0;
          const newQuantity = currentQuantity + change;

          if (newQuantity < 1) {
            alert("최소 주문 수량은 1개입니다.");
            return option;
          }

          return {
            ...option,
            value: {
              ...option.value,
              quantity: newQuantity,
            },
          };
        } else {
          return option;
        }
      }),
    );
  };

  const handleAddToCart = async (viewPopup) => {
    if (isAdding) return;
    if (selectedOptions.length <= 0) {
      alert("옵션을 선택해 주세요.");
      return;
    }

    setIsAdding(true);

    const product = {
      id: productInfo.id,
      options: selectedOptions,
      price: productInfo.price,
      data: { ...productInfo },
    };

    try {
      const existingCartItems = cartList || [];
      let isDuplicate = false;

      existingCartItems.forEach((item) => {
        const selectedOptionKeys = selectedOptions.map((option) => option.key);
        const existingOptionKeys = item.options.map((option) => option.key);

        if (
          existingOptionKeys.some((key) => selectedOptionKeys.includes(key))
        ) {
          isDuplicate = true;
        }
      });

      if (isDuplicate && viewPopup) {
        const isConfirmed = window.confirm(
          "동일한 상품이 장바구니에 있습니다. 추가하시겠습니까?",
        );
        if (!isConfirmed) {
          return;
        }
      }

      dispatch(addCartItem(product));
      setUpdatedLocalCart((prev) => [...prev, product]);
      closePanel();
      setSelectedOptions([]);
      if (viewPopup) openLayerPopup();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const { title, price, thumb } = productInfo;

  const options = productInfo.options || [];

  const layerPopupRef = useRef();

  function openLayerPopup() {
    setIsPopupActive(true);
  }

  function closeLayerPopup() {
    setIsPopupActive(false);
  }

  const goToPayment = () => {
    dispatch(clearOrder());
    dispatch(saveOrder(selectedOptions));
    if (selectedOptions.length <= 0) {
      alert("주문하실 상품을 선택해 주세요.");
      return;
    }
    if (userInfo.token) {
      navigate("/order/order", {
        state: {
          orderList: selectedOptions,
        },
      });
    } else {
      navigate("/member/login", {
        state: { title: ["로그인"], prevPage: location.pathname },
      });
    }
  };

  return (
    <>
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
                  <div className="side-order__thumb">
                    <img src={`/uploads/product/${thumb}`} alt="" />
                  </div>
                  <div className="side-order__info">
                    <strong>{title}</strong>
                  </div>
                </div>
                {options &&
                  options.map((option, index) => {
                    const key = Object.keys(option)[0];

                    if (!option[key].data) {
                      return null;
                    }

                    return (
                      <div className="side-order__option" key={`${key}`}>
                        <span>옵션{index + 1}</span>
                        <div className="side-order__select">
                          <select
                            name={key}
                            onChange={(e) => {
                              const value = JSON.parse(e.target.value);
                              const selectedOptionValueId = JSON.parse(
                                e.target.value,
                              ).id;
                              handleOptionSelect(value, selectedOptionValueId);
                              e.target.value = "";
                            }}
                          >
                            <option value="">
                              - [필수] 옵션을 선택해 주세요 -
                            </option>
                            {option[key].data.map((o) => (
                              <option value={JSON.stringify(o)} key={o.id}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {selectedOptions.length > 0 && (
                <div className="side-order__list">
                  <ul>
                    {selectedOptions.length > 0 &&
                      selectedOptions.map((option) => {
                        const displayPrice =
                          (Number(price) + (Number(option.value.price) || 0)) *
                          Number(option.value.quantity);
                        return (
                          <li key={option.value.label}>
                            <div className="side-order__box">
                              <div>
                                <div>{title}</div>
                                <div>- {option.value.label}</div>
                              </div>
                              <div>
                                <div className="quantity-control">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(option.key, -1)
                                    }
                                  >
                                    -
                                  </button>
                                  <div className="quantity-control__view">
                                    {option.value.quantity}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(option.key, 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOption(option.key)}
                                >
                                  삭제
                                </button>
                              </div>
                              <div>{displayPrice.toLocaleString()} 원</div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}

              <div className="side-order__total">
                <div className="side-order__price">
                  <b>
                    TOTAL <span>(QUANTITY)</span>
                  </b>
                  <div>
                    <strong>{totalPrice.toLocaleString()}</strong>(
                    {selectedOptions.reduce(
                      (sum, option) => sum + option.value.quantity,
                      0,
                    )}
                    개)
                  </div>
                </div>
                <div className="side-order__row">배송정보</div>
                <div className="side-order__row">개별배송</div>
                <div className="side-order__row">지금 주문하면 내일 출고</div>
              </div>
            </div>
          </div>
          <div className="side-order__footer">
            <ul>
              <li>
                <button
                  type="button"
                  className="btn btn-square btn-square--white"
                  onClick={() => {
                    handleAddToCart(true);
                  }}
                >
                  <span className="btn btn-square__text">장바구니 담기</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="btn btn-square btn-square--black"
                  onClick={() => {
                    handleAddToCart(false);
                    goToPayment();
                  }}
                >
                  <span className="btn btn-square__text">바로구매</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <LayerPopup
        ref={layerPopupRef}
        closeLayerPopup={closeLayerPopup}
        isActive={isPopupActive}
      />
    </>
  );
});

export default SideOrder;
