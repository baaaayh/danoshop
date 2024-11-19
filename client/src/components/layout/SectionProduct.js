import { useState, useEffect } from "react";
import ProductList from "./ProductList";

function SectionProduct({ title, menu, type, productList }) {
    const [menuList, setMenuList] = useState({ menu: [] });

    useEffect(() => {
        setMenuList(menu);
    }, [menu]);

    return (
        <section className="section section--product">
            <div className="section__inner">
                <h2 className="section__title">{title}</h2>
                <ProductList
                    menu={menuList}
                    type={type}
                    productList={productList}
                />
            </div>
        </section>
    );
}

export default SectionProduct;
