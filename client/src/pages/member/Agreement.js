import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import SubContentsXsmall from "../../components/SubContentsXsmall";
import BreadCrumb from "../../components/BreadCrumb";
import SubTitle from "../../components/SubTitle";
import AgreementForm from "../../components/AgreementForm";

function Agreement() {
    const params = useParams();
    const location = useLocation();
    return (
        <SubContentsXsmall>
            <BreadCrumb title={["약관 동의"]} path={params} />
            <SubTitle title={["약관 동의"]} />
            <AgreementForm />
        </SubContentsXsmall>
    );
}

export default Agreement;
