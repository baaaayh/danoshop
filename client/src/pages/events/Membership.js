import React from "react";
import SubContentsSmall from "../../components/layout/SubContentsSmall";
import BreadCrumb from "../../components/layout/BreadCrumb";
import SubTitle from "../../components/layout/SubTitle";
import styles from "./Membership.module.scss";

function Membership() {
    return (
        <SubContentsSmall>
            <BreadCrumb title={["멤버십 혜택"]} path={[""]} />
            <SubTitle title={["멤버십 혜택"]} />
            <div className={styles.membership}>
                <img src="/images/sub/event_banner.png" alt="" />
            </div>
        </SubContentsSmall>
    );
}

export default Membership;
