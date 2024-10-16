import { useLocation, useParams } from 'react-router-dom';
import SubContents from '../../components/layout/SubContents';
import BreadCrumb from '../../components/layout/BreadCrumb';
import SubTitle from '../../components/layout/SubTitle';
import ProductList from '../../components/layout/ProductList';

function Product() {
    const params = useParams();
    const location = useLocation();
    const title = location.state?.title || ['전상품'];

    return (
        <SubContents>
            <BreadCrumb title={title} path={params} />
            <SubTitle title={title} />
            <ProductList title={title} path={params} />
        </SubContents>
    );
}

export default Product;
