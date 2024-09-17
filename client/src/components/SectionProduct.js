import ProductList from "./ProductList";
import "./SectionProduct.scss";

function SectionProduct({ title, productList, type }) {
    return (
        <section className="section section--product">
            <div className="section__inner">
                <h2 className="section--product__title">{title}</h2>
                <ProductList productList={productList} type={type} />
            </div>
        </section>
    );
}

export default SectionProduct;
