import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import SubContentsSmall from '../../components/layout/SubContentsSmall';
import BreadCrumb from '../../components/layout/BreadCrumb';
import SubTitle from '../../components/layout/SubTitle';
import MyPageLayout from '../../components/mypage/MyPageLayout';
import Dashboard from '../../components/mypage/Dashboard';
import OrderHistory from '../../components/mypage/OrderHistory';
import Mileage from '../../components/mypage/Mileage';

function MyPage() {
    const location = useLocation();
    const params = useParams();

    return (
        <SubContentsSmall>
            <BreadCrumb title={location.state.title} path={params} />
            <MyPageLayout>
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orderHistory" element={<OrderHistory />} />
                    <Route path="mileage" element={<Mileage />} />
                </Routes>
            </MyPageLayout>
        </SubContentsSmall>
    );
}

export default MyPage;
