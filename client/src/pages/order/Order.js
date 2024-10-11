import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Order() {
    const navigate = useNavigate();

    return (
        <div className="order">
            <div className="order__inner">
                <div className="order__header">
                    <button type="button" onClick={() => navigate(-1)}>
                        뒤로가기
                    </button>
                    <h2>
                        <Link to="/">다노샵</Link>
                    </h2>
                    <div className="user-area">
                        <ul>
                            <li className="user-cart">
                                <Link to="/order/cart">장바구니</Link>
                            </li>
                            <li className="user-mypage">
                                <Link to="/"></Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="order__body">
                    <h3>주문/결제</h3>
                    <div className="order__box">
                        <h4>
                            <button type="button">배송지</button>
                        </h4>
                        <div className="order__info">
                            <div className="order__form">
                                <div className="form">
                                    <div className="form__row">
                                        <div className="form__tit">
                                            받는사람<span className="star">*</span>
                                        </div>
                                        <div className="form__content">
                                            <input type="text" />
                                        </div>
                                    </div>

                                    <div className="form__row">
                                        <div className="form__tit">
                                            주소<span className="star">*</span>
                                        </div>
                                        <div className="form__content">
                                            <ul>
                                                <li>
                                                    <div className="zip-code">
                                                        <input type="text" />
                                                        <button type="button">주소검색</button>
                                                    </div>
                                                </li>
                                                <li>
                                                    <input type="text" placeholder="기본주소" />
                                                </li>
                                                <li>
                                                    <input type="text" placeholder="나머지 주소(필수)" />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="form__row">
                                        <div className="form__tit">
                                            휴대전화<span className="star">*</span>
                                        </div>
                                        <div className="form__content form__content--cols">
                                            <input type="number" />
                                            -
                                            <input type="number" />
                                            -
                                            <input type="number" />
                                        </div>
                                    </div>
                                    <div className="form__row">
                                        <div className="form__tit">이메일</div>
                                        <div className="form__content form__content--cols">
                                            <input type="text" />@
                                            <div className="email-form">
                                                <div>
                                                    <input type="text" placeholder="직접입력" />
                                                    <select name="" id="">
                                                        <option value="" selected>
                                                            -이메일 선택-
                                                        </option>
                                                        <option value="">@naver.com</option>
                                                        <option value="">@daum.net</option>
                                                        <option value="">@nate.com</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order__msg">
                            <select id="" name="">
                                <option value="" selected="selected">
                                    -- 메시지 선택 (선택사항) --
                                </option>
                                <option value="">배송 전에 미리 연락바랍니다.</option>
                                <option value="">부재 시 경비실에 맡겨주세요.</option>
                                <option value="">부재 시 문 앞에 놓아주세요.</option>
                                <option value="">빠른 배송 부탁드립니다.</option>
                                <option value="">택배함에 보관해 주세요.</option>
                                <option value="">직접 입력</option>
                            </select>
                        </div>
                        <div className="order__form order__form--gray">
                            <h5>비회원 주문조회 비밀번호</h5>
                            <div className="form">
                                <div className="form__row">
                                    <div className="form__tit">비밀번호</div>
                                    <div className="form__content">
                                        <input type="password" />
                                    </div>
                                </div>
                                <div className="form__row">
                                    <div className="form__tit">비밀번호 확인</div>
                                    <div className="form__content">
                                        <input type="password" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order__box">
                        <h4>
                            <button type="button">주문상품</button>
                        </h4>
                        <div className="order__list">
                            <ul>
                                <li>
                                    <div className="order__item">
                                        <div className="order__figure">
                                            <Link to="">
                                                <img src="" alt="" />
                                            </Link>
                                        </div>
                                        <div className="order__desc">
                                            <div className="order__proudct"></div>
                                            <div className="order__option">[옵션: ]</div>
                                            <div className="order__quantity">수량: 개</div>
                                            <div className="order__price">원</div>
                                        </div>
                                        <button type="button">삭제</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="order__charge">
                            <span>배송비</span>
                            <b>원</b>
                        </div>
                    </div>
                    <div className="order__box">
                        <h4>
                            <button type="button">결제정보</button>
                        </h4>
                        <div className="order__bill">
                            <ul>
                                <li>
                                    <span>주문상품</span>
                                    <b></b>
                                </li>
                                <li>
                                    <span>배송비</span>
                                    <b>원</b>
                                </li>
                                <li>
                                    <span>할인/부가결제</span>
                                    <b>원</b>
                                </li>
                            </ul>
                        </div>
                        <div className="order__total">
                            <span>최종 결제 금액</span>
                            <strong>원</strong>
                        </div>
                    </div>
                    <div className="order__box">
                        <h4>
                            <button type="button">결제수단</button>
                        </h4>
                        <div className="order__payment">
                            <p>결제수단 선택</p>
                            <ul>
                                <li>
                                    <input type="radio" name="payment" id="payment1" />
                                    <label htmlFor="payment1">신용카드</label>
                                </li>
                                <li>
                                    <input type="radio" name="payment" id="payment2" />
                                    <label htmlFor="payment2">가상계좌</label>
                                </li>
                                <li>
                                    <input type="radio" name="payment" id="payment3" />
                                    <label htmlFor="payment3">휴대폰</label>
                                </li>
                                <li>
                                    <input type="radio" name="payment" id="payment4" />
                                    <label htmlFor="payment4">카카오페이</label>
                                </li>
                                <li>
                                    <input type="radio" name="payment" id="payment5" />
                                    <label htmlFor="payment5">네이버페이</label>
                                </li>
                                <li>
                                    <input type="radio" name="payment" id="payment6" />
                                    <label htmlFor="payment6">페이코</label>
                                </li>
                                <li>
                                    <input type="radio" name="payment" id="payment7" />
                                    <label htmlFor="payment7">토스</label>
                                </li>
                            </ul>
                            <div className="order__caution"></div>
                        </div>
                    </div>
                    <div className="order__box">
                        <div className="order__terms">
                            <ul>
                                <li>
                                    <label htmlFor="agreeAll">
                                        <input type="checkbox" id="agreeAll" />
                                        모든 약관 동의
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="mallAgree">
                                        <input type="checkbox" id="mallAgree" />
                                        [필수] 쇼핑몰 이용약관 동의
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="personalAgree">
                                        <input type="checkbox" id="personalAgree" />
                                        [필수] 개인정보 수집 및 이용 동의
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link to="" className="order__submit">
                        원 결제하기
                    </Link>
                </div>
                <div className="order__footer">
                    <div className="order__help">
                        <ul>
                            <li>무이자할부가 적용되지 않은 상품과 무이자할부가 가능한 상품을 동시에 구매할 경우 전체 주문 상품 금액에 대해 무이자할부가 적용되지 않습니다. 무이자할부를 원하시는 경우 장바구니에서 무이자할부 상품만 선택하여 주문하여 주시기 바랍니다.</li>
                            <li>최소 결제 가능 금액은 결제금액에서 배송비를 제외한 금액입니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
