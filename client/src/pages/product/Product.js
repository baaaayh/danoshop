import { useLocation, useParams } from 'react-router-dom';
import SubContents from '../../components/SubContents';
import BreadCrumb from '../../components/BreadCrumb';
import SubTitle from '../../components/SubTitle';
import ProductList from '../../components/ProductList';

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
