import React from 'react';
import { Link } from 'react-router-dom';

function MyPageLayout({ children }) {
    return (
        <div className="mypage">
            <div className="mypage__left">
                <nav>
                    <ul>
                        <li>
                            <strong>나의 쇼핑 정보</strong>
                            <ul>
                                <li>
                                    <Link to="/mypage/orderHistory" state={{ title: ['마이쇼핑', '주문내역 조회'] }}>
                                        주문내역 조회
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mypage/mileage" state={{ title: ['마이쇼핑', '적립금'] }}>
                                        적립금 내역
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mypage/deposits" state={{ title: ['마이쇼핑', '예치금'] }}>
                                        예치금 내역
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mypage/coupon" state={{ title: ['마이쇼핑', '쿠폰내역'] }}>
                                        쿠폰 내역
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mypage/address" state={{ title: ['마이쇼핑', '배송 주소록 관리'] }}>
                                        배송 주소록 관리
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        {/* <li>
                            <strong>활동 정보</strong>
                            <ul>
                                <li>
                                    <Link to="">최근 본 상품</Link>
                                </li>
                                <li>
                                    <Link to="">나의 관심 상품</Link>
                                </li>
                                <li>
                                    <Link to="">좋아요</Link>
                                </li>
                                <li>
                                    <Link to="">나의 게시글</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>나의 정보</strong>
                            <ul>
                                <li>
                                    <Link to="">회원정보 수정</Link>
                                </li>
                                <li>
                                    <button type="button">로그아웃</button>
                                </li>
                            </ul>
                        </li> */}
                    </ul>
                </nav>
            </div>
            <div className="mypage__view">{children}</div>
        </div>
    );
}

export default MyPageLayout;
