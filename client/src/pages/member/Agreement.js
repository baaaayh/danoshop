import React from "react";
import { useParams } from "react-router-dom";
import SubContentsXsmall from "../../components/layout/SubContentsXsmall";
import BreadCrumb from "../../components/layout/BreadCrumb";
import SubTitle from "../../components/layout/SubTitle";
import AgreementForm from "../../components/member/AgreementForm";

function Agreement() {
    const params = useParams();

    return (
        <SubContentsXsmall>
            <BreadCrumb title={["약관 동의"]} path={params} />
            <SubTitle title={["약관 동의"]} />
            <AgreementForm />
        </SubContentsXsmall>
    );
}

export default Agreement;
