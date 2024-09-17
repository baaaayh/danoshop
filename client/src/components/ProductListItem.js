import { useState, useEffect } from "react";

function ProductListItem({ productList, type }) {
    const [list, setList] = useState(productList);

    useEffect(() => {
        if (type === "all") {
            setList(productList);
        } else {
            if (productList) {
                const filteredList = productList.filter((item) => {
                    return item.type === type;
                });
                const exposeList = filteredList.filter((item) => {
                    return item.mainExpose === "true";
                });
                setList(exposeList);
            }
        }
    }, [productList, type]);

    return (
        <>
            {list &&
                list.map((item) => {
                    return (
                        <li className="product__item" key={item.id}>
                            <div className="product__inner">
                                <div className="product__figure">
                                    <img
                                        src={`uploads/product/${item.thumb}`}
                                        alt=""
                                    />
                                </div>
                                <div className="product__desc">
                                    <h3 className="product__title">
                                        {item.title}
                                    </h3>
                                    <div className="product__config">
                                        <h4>구성 : </h4>
                                        <span className="product__num"></span>
                                        <span>개</span>
                                    </div>
                                </div>
                                <div className="product__desc">
                                    <h4 className="product__selling">판매가</h4>
                                    <strong>
                                        <span className="proudct__price"></span>
                                        <span>원</span>
                                    </strong>
                                </div>
                                <div className="product__icon">
                                    <span>품절</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
        </>
    );
}

export default ProductListItem;
