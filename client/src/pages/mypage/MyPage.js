import { Routes, Route, useLocation, useParams } from "react-router-dom";
import SubContentsSmall from "../../components/layout/SubContentsSmall";
import BreadCrumb from "../../components/layout/BreadCrumb";
import MyPageLayout from "../../components/mypage/MyPageLayout";
import Dashboard from "../../components/mypage/Dashboard";
import OrderHistory from "../../components/mypage/OrderHistory";
import RecentView from "../../components/mypage/RecentView";
import WishList from "../../components/mypage/WishList";
import OrderDetail from "../../components/mypage/OrderDetail";

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
                    <Route path="recentView" element={<RecentView />} />
                    <Route path="wishList" element={<WishList />} />
                    <Route
                        path="orderDetail/:orderId"
                        element={<OrderDetail />}
                    />
                </Routes>
            </MyPageLayout>
        </SubContentsSmall>
    );
}

export default MyPage;
