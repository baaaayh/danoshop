import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__inner">
                    <div className="footer__top">
                        <div className="footer__logo">
                            <img src="images/common/logo.png" alt="" />
                        </div>
                        <nav className="footer__nav">
                            <ul>
                                <li>
                                    <Link to="">회사소개</Link>
                                </li>
                                <li>
                                    <Link to="">이용약관</Link>
                                </li>
                                <li>
                                    <Link to="">개인정보처리방침</Link>
                                </li>
                                <li>
                                    <Link to="">이용안내</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="footer__bottom">
                        <div className="footer__info footer__info--left">
                            <div className="footer__box">
                                <h2>고객센터 정보</h2>
                                <ul>
                                    <li className="row-box">
                                        <span>상담/주문전화</span>
                                        <div>02-2135-1885</div>
                                    </li>
                                    <li>
                                        <span>상담/주문 이메일</span>
                                        <div>support@danoshop.net</div>
                                    </li>
                                    <li>
                                        <span>CS운영시간</span>
                                        <div>
                                            9시 ~ 16시 (점심 시간 12시 30분 ~
                                            13시 30분)
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer__box">
                                <h2>결제 정보</h2>
                                <ul>
                                    <li>
                                        <span>무통장 계좌정보</span>
                                        <div>
                                            우리은행 1005502842082 (주)다노
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer__box">
                                <h2>입점/제휴 문의</h2>
                                <ul>
                                    <li>
                                        <p>입점문의: danoshop.md@gmail.com</p>
                                        <p>제휴문의: danoshop.mkt@gmail.com</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="footer__info footer__info--right">
                            <div className="footer__box">
                                <h2>쇼핑몰 기본정보</h2>
                                <ul>
                                    <li className="row-box">
                                        <div className="row-box">
                                            <span>상호명</span>
                                            <div>(주)다노</div>
                                        </div>
                                        <div className="row-box">
                                            <span>대표자명</span>
                                            <div>정범윤</div>
                                        </div>
                                    </li>
                                    <li className="row-box">
                                        <span>사업장 주소</span>
                                        <div>
                                            04038 서울특별시 마포구 월드컵북로
                                            98, 2층 202
                                        </div>
                                    </li>
                                    <li className="row-box">
                                        <div className="row-box">
                                            <span>대표 전화</span>
                                            <div>02-2135-1885</div>
                                        </div>
                                        <div className="row-box">
                                            <span>사업자 등록번호</span>
                                            <div>106-87-00202</div>
                                        </div>
                                    </li>
                                    <li className="row-box">
                                        <span>통신판매업 신고번호</span>
                                        <div>
                                            제2017-서울마포-0722
                                            [사업자정보확인]
                                        </div>
                                    </li>
                                    <li className="row-box">
                                        <span>개인정보보호책임자</span>
                                        <div>이지수</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer__sns">
                        <h2>SNS</h2>
                        <ul>
                            <li>
                                <Link to="" className="instagram">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="33"
                                        height="33"
                                        fill="none"
                                        viewBox="0 0 33 33"
                                        role="img"
                                    >
                                        <g>
                                            <circle
                                                cx="16.5"
                                                cy="16.5"
                                                r="16"
                                            ></circle>
                                            <path
                                                d="M16.5,1C25,1,32,8,32,16.5S25,32,16.5,32S1,25,1,16.5S8,1,16.5,1 M16.5,0C7.4,0,0,7.4,0,16.5S7.4,33,16.5,33
		S33,25.6,33,16.5S25.6,0,16.5,0L16.5,0z"
                                            ></path>
                                        </g>
                                        <path
                                            d="M17,12.1c1.6,0,1.8,0,2.4,0c1.6,0.1,2.4,0.8,2.5,2.5c0,0.6,0,0.8,0,2.4c0,1.6,0,1.8,0,2.4
	c-0.1,1.6-0.8,2.4-2.5,2.5c-0.6,0-0.8,0-2.4,0c-1.6,0-1.8,0-2.4,0c-1.6-0.1-2.4-0.8-2.5-2.5c0-0.6,0-0.8,0-2.4c0-1.6,0-1.8,0-2.4
	c0.1-1.6,0.8-2.4,2.5-2.5C15.2,12.1,15.4,12.1,17,12.1z M17,11c-1.6,0-1.8,0-2.5,0c-2.2,0.1-3.4,1.3-3.5,3.5c0,0.6,0,0.8,0,2.5
	s0,1.8,0,2.5c0.1,2.2,1.3,3.4,3.5,3.5c0.6,0,0.8,0,2.5,0s1.8,0,2.5,0c2.2-0.1,3.4-1.3,3.5-3.5c0-0.6,0-0.8,0-2.5s0-1.8,0-2.5
	c-0.1-2.2-1.3-3.4-3.5-3.5C18.8,11,18.6,11,17,11z M17,13.9c-1.7,0-3.1,1.4-3.1,3.1s1.4,3.1,3.1,3.1s3.1-1.4,3.1-3.1
	C20.1,15.3,18.7,13.9,17,13.9z M17,19c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2s2,0.9,2,2C19,18.1,18.1,19,17,19z M20.2,13.1
	c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7c0.4,0,0.7-0.3,0.7-0.7S20.6,13.1,20.2,13.1z"
                                        ></path>
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <Link to="" className="youtube">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="33"
                                        height="33"
                                        fill="none"
                                        viewBox="0 0 33 33"
                                        role="img"
                                    >
                                        <g>
                                            <circle
                                                cx="16.5"
                                                cy="16.5"
                                                r="16"
                                            ></circle>
                                            <path
                                                d="M16.5,1C25,1,32,8,32,16.5S25,32,16.5,32S1,25,1,16.5S8,1,16.5,1 M16.5,0C7.4,0,0,7.4,0,16.5S7.4,33,16.5,33
		S33,25.6,33,16.5S25.6,0,16.5,0L16.5,0z"
                                            ></path>
                                        </g>
                                        <path
                                            d="M20.7,12c-2-0.1-6.4-0.1-8.4,0c-2.1,0.1-2.4,1.4-2.4,4.9c0,3.4,0.3,4.7,2.4,4.9c2,0.1,6.4,0.1,8.4,0
	c2.1-0.1,2.4-1.4,2.4-4.9C23.1,13.5,22.8,12.2,20.7,12z M14.8,19.1v-4.4l4.4,2.2L14.8,19.1z"
                                        ></path>
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <Link to="" className="facebook">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="33"
                                        height="33"
                                        fill="none"
                                        viewBox="0 0 33 33"
                                        role="img"
                                    >
                                        <g>
                                            <circle
                                                cx="16.5"
                                                cy="16.5"
                                                r="16"
                                            ></circle>
                                            <path
                                                d="M16.5,1C25,1,32,8,32,16.5S25,32,16.5,32S1,25,1,16.5S8,1,16.5,1 M16.5,0C7.4,0,0,7.4,0,16.5S7.4,33,16.5,33
		S33,25.6,33,16.5S25.6,0,16.5,0L16.5,0z"
                                            ></path>
                                        </g>
                                        <path
                                            d="M14.8,14.3h-1.8v2.2h1.8V23h2.9v-6.5h2.1l0.2-2.2h-2.3v-0.9c0-0.5,0.1-0.7,0.7-0.7h1.7V10h-2.2
	c-2.1,0-3,0.9-3,2.5V14.3z"
                                        ></path>
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <Link to="" className="blog">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="33"
                                        height="33"
                                        fill="none"
                                        viewBox="0 0 33 33"
                                        role="img"
                                    >
                                        <g>
                                            <circle
                                                cx="16.5"
                                                cy="16.5"
                                                r="16"
                                            ></circle>
                                            <path
                                                d="M16.5,1C25,1,32,8,32,16.5S25,32,16.5,32S1,25,1,16.5S8,1,16.5,1 M16.5,0C7.4,0,0,7.4,0,16.5S7.4,33,16.5,33
		S33,25.6,33,16.5S25.6,0,16.5,0L16.5,0z"
                                            ></path>
                                        </g>
                                        <path
                                            d="M17,14.6c0,0-1,0-1.9,0.9V12h-2.2v9.2h2.2v-0.7c0,0,0.5,0.9,1.8,0.9c0,0,3.1-0.1,3.1-3.4
	C20.1,18,20,14.6,17,14.6z M16.5,19.5c-0.8,0-1.4-0.6-1.4-1.4c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4
	C17.9,18.8,17.3,19.5,16.5,19.5z"
                                        ></path>
                                    </svg>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__copyright">
                        Copyright © 다노샵. All Rights Reserved. Hosting by
                        Cafe24 Corp.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
