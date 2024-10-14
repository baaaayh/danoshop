import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AgreementForm() {
    const [checkboxValue, setCheckboxValue] = useState({
        agreementAllCheck: false,
        agreement1: false,
        agreement2: false,
        agreement3: false,
        agreement4: false,
        agreement5: false,
    });

    const navigate = useNavigate();

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;

        if (name === "agreementAllCheck") {
            setCheckboxValue({
                agreementAllCheck: checked,
                agreement1: checked,
                agreement2: checked,
                agreement3: checked,
                agreement4: checked,
                agreement5: checked,
            });
        } else if (name === "agreement3") {
            setCheckboxValue((prevValue) => ({
                ...prevValue,
                agreement3: checked,
                agreement4: checked,
                agreement5: checked,
                agreementAllCheck: checked
                    ? prevValue.agreement1 && prevValue.agreement2
                    : false,
            }));
        } else if (name === "agreement4" || name === "agreement5") {
            setCheckboxValue((prevValue) => {
                const newAgreement4 =
                    name === "agreement4" ? checked : prevValue.agreement4;
                const newAgreement5 =
                    name === "agreement5" ? checked : prevValue.agreement5;

                const newAgreement3 = newAgreement4 && newAgreement5;

                return {
                    ...prevValue,
                    [name]: checked,
                    agreement3: newAgreement3,
                    agreementAllCheck:
                        newAgreement4 &&
                        newAgreement5 &&
                        prevValue.agreement1 &&
                        prevValue.agreement2,
                };
            });
        } else {
            setCheckboxValue((prevValue) => ({
                ...prevValue,
                [name]: checked,
                agreementAllCheck:
                    name !== "agreementAllCheck" &&
                    checked &&
                    prevValue.agreement1 &&
                    prevValue.agreement2 &&
                    prevValue.agreement3 &&
                    prevValue.agreement4 &&
                    prevValue.agreement5,
            }));
        }
    };

    const checkAgreement = (e) => {
        if (checkboxValue.agreement3 && checkboxValue.agreement4) {
            navigate("/member/join");
        } else {
            alert("필수 동의 항목에 동의하셔야 합니다.");
        }
    };

    return (
        <div className="agree">
            <div className="agree__row">
                <h3>전체 동의</h3>
                <div className="agree__box">
                    <div className="agree__check">
                        <div className="agree__line">
                            <input
                                type="checkbox"
                                id="agreementAllCheck"
                                name="agreementAllCheck"
                                checked={checkboxValue.agreementAllCheck}
                                onClick={handleCheckbox}
                            />
                            <label htmlFor="agreementAllCheck">
                                <strong>
                                    이용약관 및 개인정보수집 및 이용, 쇼핑정보
                                    수신(선택)에 모두 동의합니다.
                                </strong>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="agreementAllCheck">
                                <strong>
                                    이용약관 및 개인정보수집 및 이용에 모두
                                    동의합니다.
                                </strong>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="agree__row">
                <div className="agree__box">
                    <div className="agree__check">
                        <div className="agree__line">
                            <input
                                type="checkbox"
                                id="agreement1"
                                name="agreement1"
                                checked={checkboxValue.agreement1}
                                onClick={handleCheckbox}
                            />
                            <label htmlFor="agreement1">
                                이용약관 동의 (필수)
                            </label>
                        </div>
                    </div>
                    <div className="agree__contents">
                        <div className="agree__scroll">
                            <div className="agree__text">
                                <h4>제1조(목적)</h4>
                                <p>
                                    이 약관은 (주)다노(전자상거래 사업자)가
                                    운영하는 다노샵 (이하 “몰”이라 한다)에서
                                    제공하는 인터넷 관련 서비스(이하 “서비스”라
                                    한다)를 이용함에 있어 사이버 몰과 이용자의
                                    권리․의무 및 책임사항을 규정함을 목적으로
                                    합니다.
                                </p>
                                <p>
                                    ※「PC통신, 무선 등을 이용하는 전자상거래에
                                    대해서도 그 성질에 반하지 않는 한 이 약관을
                                    준용합니다.」
                                </p>
                                <h4>제2조(정의)</h4>
                                <p>
                                    ① “몰”이란 (주)다노가 재화 또는 용역(이하
                                    “재화 등”이라 함)을 이용자에게 제공하기
                                    위하여 컴퓨터 등 정보통신설비를 이용하여
                                    재화 등을 거래할 수 있도록 설정한 가상의
                                    영업장을 말하며, 아울러 사이버몰을 운영하는
                                    사업자의 의미로도 사용합니다.
                                </p>
                                <p>
                                    ② “이용자”란 “몰”에 접속하여 이 약관에 따라
                                    “몰”이 제공하는 서비스를 받는 회원 및
                                    비회원을 말합니다.
                                </p>
                                <p>
                                    ③ ‘회원’이라 함은 “몰”에 (삭제) 회원등록을
                                    한 자로서, 계속적으로 “몰”이 제공하는
                                    서비스를 이용할 수 있는 자를 말합니다.
                                </p>
                                <p>
                                    ④ ‘비회원’이라 함은 회원에 가입하지 않고
                                    “몰”이 제공하는 서비스를 이용하는 자를
                                    말합니다.
                                </p>
                                <h4>제3조 (약관 등의 명시와 설명 및 개정)</h4>
                                <p>
                                    ① “몰”은 이 약관의 내용과 상호 및 대표자
                                    성명, 영업소 소재지 주소(소비자의 불만을
                                    처리할 수 있는 곳의 주소를 포함),
                                    전화번호․모사전송번호․전자우편주소,
                                    사업자등록번호, 통신판매업 신고번호,
                                    개인정보관리책임자등을 이용자가 쉽게 알 수
                                    있도록 몰의 초기 서비스화면(전면)에
                                    게시합니다. 다만, 약관의 내용은 이용자가
                                    연결화면을 통하여 볼 수 있도록 할 수
                                    있습니다.
                                </p>
                                <p>
                                    ② “몰은 이용자가 약관에 동의하기에 앞서
                                    약관에 정하여져 있는 내용 중
                                    청약철회․배송책임․환불조건 등과 같은 중요한
                                    내용을 이용자가 이해할 수 있도록 별도의
                                    연결화면 또는 팝업화면 등을 제공하여
                                    이용자의 확인을 구하여야 합니다.
                                </p>
                                <p>
                                    ③ “몰”은 「전자상거래 등에서의 소비자보호에
                                    관한 법률」, 「약관의 규제에 관한 법률」,
                                    「전자문서 및 전자거래기본법」,
                                    「전자금융거래법」, 「전자서명법」,
                                    「정보통신망 이용촉진 및 정보보호 등에 관한
                                    법률」, 「방문판매 등에 관한 법률」,
                                    「소비자기본법」 등 관련 법을 위배하지 않는
                                    범위에서 이 약관을 개정할 수 있습니다.
                                </p>
                                <p>
                                    ④ “몰”이 약관을 개정할 경우에는 적용일자 및
                                    개정사유를 명시하여 현행약관과 함께 몰의
                                    초기화면에 그 적용일자 7일 이전부터 적용일자
                                    전일까지 공지하거나 이용자가 입력한 이메일
                                    주소로 이메일을 전송하는 방법으로 이용자에게
                                    고지합니다. 다만, 이용자에게 불리하게
                                    약관내용을 변경하는 경우에는 최소한 30일
                                    이상의 사전 유예기간을 두고 공지 또는
                                    고지합니다. 이 경우 "몰“은 개정 전 내용과
                                    개정 후 내용을 명확하게 비교하여 이용자가
                                    알기 쉽도록 표시합니다.
                                </p>
                                <p>
                                    ⑤ “몰”이 약관을 개정할 경우에는 그
                                    개정약관은 그 적용일자 이후에 체결되는
                                    계약에만 적용되고 그 이전에 이미 체결된
                                    계약에 대해서는 개정 전의 약관조항이 그대로
                                    적용됩니다. 다만 이미 계약을 체결한 이용자가
                                    개정약관 조항의 적용을 받기를 원하는 뜻을
                                    제3항에 의한 개정약관의 공지기간 내에 “몰”에
                                    송신하여 “몰”의 동의를 받은 경우에는
                                    개정약관 조항이 적용됩니다.
                                </p>
                                <p>
                                    ⑥ 이 약관에서 정하지 아니한 사항과 이 약관의
                                    해석에 관하여는 전자상거래 등에서의
                                    소비자보호에 관한 법률, 약관의 규제 등에
                                    관한 법률, 공정거래위원회가 정하는
                                    전자상거래 등에서의 소비자 보호지침 및
                                    관계법령 또는 상관례에 따릅니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="agree__row">
                <div className="agree__box">
                    <div className="agree__check">
                        <div className="agree__line">
                            <input
                                type="checkbox"
                                id="agreement2"
                                name="agreement2"
                                checked={checkboxValue.agreement2}
                                onClick={handleCheckbox}
                            />
                            <label htmlFor="agreement2">
                                개인정보 수집 및 이용 동의 (필수)
                            </label>
                        </div>
                    </div>
                    <div className="agree__contents">
                        <div className="agree__scroll">
                            <div className="agree__text">
                                <h4>제1조(목적)</h4>
                                <p>
                                    이 약관은 (주)다노(전자상거래 사업자)가
                                    운영하는 다노샵 (이하 “몰”이라 한다)에서
                                    제공하는 인터넷 관련 서비스(이하 “서비스”라
                                    한다)를 이용함에 있어 사이버 몰과 이용자의
                                    권리․의무 및 책임사항을 규정함을 목적으로
                                    합니다.
                                </p>
                                <p>
                                    ※「PC통신, 무선 등을 이용하는 전자상거래에
                                    대해서도 그 성질에 반하지 않는 한 이 약관을
                                    준용합니다.」
                                </p>
                                <h4>제2조(정의)</h4>
                                <p>
                                    ① “몰”이란 (주)다노가 재화 또는 용역(이하
                                    “재화 등”이라 함)을 이용자에게 제공하기
                                    위하여 컴퓨터 등 정보통신설비를 이용하여
                                    재화 등을 거래할 수 있도록 설정한 가상의
                                    영업장을 말하며, 아울러 사이버몰을 운영하는
                                    사업자의 의미로도 사용합니다.
                                </p>
                                <p>
                                    ② “이용자”란 “몰”에 접속하여 이 약관에 따라
                                    “몰”이 제공하는 서비스를 받는 회원 및
                                    비회원을 말합니다.
                                </p>
                                <p>
                                    ③ ‘회원’이라 함은 “몰”에 (삭제) 회원등록을
                                    한 자로서, 계속적으로 “몰”이 제공하는
                                    서비스를 이용할 수 있는 자를 말합니다.
                                </p>
                                <p>
                                    ④ ‘비회원’이라 함은 회원에 가입하지 않고
                                    “몰”이 제공하는 서비스를 이용하는 자를
                                    말합니다.
                                </p>
                                <h4>제3조 (약관 등의 명시와 설명 및 개정)</h4>
                                <p>
                                    ① “몰”은 이 약관의 내용과 상호 및 대표자
                                    성명, 영업소 소재지 주소(소비자의 불만을
                                    처리할 수 있는 곳의 주소를 포함),
                                    전화번호․모사전송번호․전자우편주소,
                                    사업자등록번호, 통신판매업 신고번호,
                                    개인정보관리책임자등을 이용자가 쉽게 알 수
                                    있도록 몰의 초기 서비스화면(전면)에
                                    게시합니다. 다만, 약관의 내용은 이용자가
                                    연결화면을 통하여 볼 수 있도록 할 수
                                    있습니다.
                                </p>
                                <p>
                                    ② “몰은 이용자가 약관에 동의하기에 앞서
                                    약관에 정하여져 있는 내용 중
                                    청약철회․배송책임․환불조건 등과 같은 중요한
                                    내용을 이용자가 이해할 수 있도록 별도의
                                    연결화면 또는 팝업화면 등을 제공하여
                                    이용자의 확인을 구하여야 합니다.
                                </p>
                                <p>
                                    ③ “몰”은 「전자상거래 등에서의 소비자보호에
                                    관한 법률」, 「약관의 규제에 관한 법률」,
                                    「전자문서 및 전자거래기본법」,
                                    「전자금융거래법」, 「전자서명법」,
                                    「정보통신망 이용촉진 및 정보보호 등에 관한
                                    법률」, 「방문판매 등에 관한 법률」,
                                    「소비자기본법」 등 관련 법을 위배하지 않는
                                    범위에서 이 약관을 개정할 수 있습니다.
                                </p>
                                <p>
                                    ④ “몰”이 약관을 개정할 경우에는 적용일자 및
                                    개정사유를 명시하여 현행약관과 함께 몰의
                                    초기화면에 그 적용일자 7일 이전부터 적용일자
                                    전일까지 공지하거나 이용자가 입력한 이메일
                                    주소로 이메일을 전송하는 방법으로 이용자에게
                                    고지합니다. 다만, 이용자에게 불리하게
                                    약관내용을 변경하는 경우에는 최소한 30일
                                    이상의 사전 유예기간을 두고 공지 또는
                                    고지합니다. 이 경우 "몰“은 개정 전 내용과
                                    개정 후 내용을 명확하게 비교하여 이용자가
                                    알기 쉽도록 표시합니다.
                                </p>
                                <p>
                                    ⑤ “몰”이 약관을 개정할 경우에는 그
                                    개정약관은 그 적용일자 이후에 체결되는
                                    계약에만 적용되고 그 이전에 이미 체결된
                                    계약에 대해서는 개정 전의 약관조항이 그대로
                                    적용됩니다. 다만 이미 계약을 체결한 이용자가
                                    개정약관 조항의 적용을 받기를 원하는 뜻을
                                    제3항에 의한 개정약관의 공지기간 내에 “몰”에
                                    송신하여 “몰”의 동의를 받은 경우에는
                                    개정약관 조항이 적용됩니다.
                                </p>
                                <p>
                                    ⑥ 이 약관에서 정하지 아니한 사항과 이 약관의
                                    해석에 관하여는 전자상거래 등에서의
                                    소비자보호에 관한 법률, 약관의 규제 등에
                                    관한 법률, 공정거래위원회가 정하는
                                    전자상거래 등에서의 소비자 보호지침 및
                                    관계법령 또는 상관례에 따릅니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="agree__row">
                <div className="agree__box">
                    <div className="agree__check">
                        <div className="agree__line">
                            <input
                                type="checkbox"
                                id="agreement3"
                                name="agreement3"
                                checked={checkboxValue.agreement3}
                                onClick={handleCheckbox}
                            />
                            <label htmlFor="agreement3">
                                쇼핑정보 수신 동의 (선택)
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="agree__row">
                <div className="agree__box">
                    <div className="agree__check">
                        <ul>
                            <li>
                                <div className="agree__line">
                                    <input
                                        type="checkbox"
                                        id="agreement4"
                                        name="agreement4"
                                        checked={checkboxValue.agreement4}
                                        onClick={handleCheckbox}
                                    />
                                    <label htmlFor="agreement4">
                                        SMS 수신 동의 (선택)
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div className="agree__line">
                                    <input
                                        type="checkbox"
                                        id="agreement5"
                                        name="agreement5"
                                        checked={checkboxValue.agreement5}
                                        onClick={handleCheckbox}
                                    />
                                    <label htmlFor="agreement5">
                                        이메일 수신 동의 (선택)
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="agree__contents">
                        <div className="agree__scroll">
                            <div className="agree__text">
                                <p>
                                    할인쿠폰 및 혜택, 이벤트, 신상품 소식 등
                                    쇼핑몰에서 제공하는 유익한 쇼핑정보를 SMS나
                                    이메일로 받아보실 수 있습니다. 단, 주문/거래
                                    정보 및 주요 정책과 관련된 내용은 수신동의
                                    여부와 관계없이 발송됩니다.
                                </p>
                                <p>
                                    선택 약관에 동의하지 않으셔도 회원가입은
                                    가능하며, 회원가입 후 회원정보수정
                                    페이지에서 언제든지 수신여부를 변경하실 수
                                    있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="agree__button">
                <ul>
                    <li>
                        <Link
                            to=""
                            className="btn btn-square btn-square--white"
                        >
                            <span className="btn btn-square__text ">취소</span>
                        </Link>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="btn btn-square btn-square--black"
                            onClick={checkAgreement}
                        >
                            <span className="btn-square__text">다음</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AgreementForm;
