import React from "react";
function MyPageBox({ children, title }) {
    return (
        <div className="mypage-box">
            <div className="mypage-box__head">
                <h3>{title}</h3>
            </div>
            <div className="mypage-box__contents">{children}</div>
        </div>
    );
}

export default MyPageBox;
