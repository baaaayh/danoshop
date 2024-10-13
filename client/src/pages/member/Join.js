import React from "react";
import { useParams } from "react-router-dom";
import SubContentsXsmall from "../../components/SubContentsXsmall";
import BreadCrumb from "../../components/BreadCrumb";
import SubTitle from "../../components/SubTitle";
import JoinForm from "../../components/JoinForm";

function Join() {
    const params = useParams();
    return (
        <SubContentsXsmall>
            <BreadCrumb title={["회원가입"]} path={params} />
            <SubTitle title={["회원가입"]} />
            <JoinForm />
        </SubContentsXsmall>
    );
}

export default Join;
