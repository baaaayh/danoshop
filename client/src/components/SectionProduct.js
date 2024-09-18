import ProductList from "./ProductList";
import styles from "./SectionProduct.module.scss";

function SectionProduct({ title, productList, type }) {
    return (
        <section className="section section--product">
            <div className={styles.section__inner}>
                <h2 className={styles.section__title}>{title}</h2>
                <ProductList productList={productList} type={type} />
            </div>
        </section>
    );
}

export default SectionProduct;
