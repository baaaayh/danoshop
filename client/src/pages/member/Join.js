import React from 'react';
import { useParams } from 'react-router-dom';
import SubContentsXsmall from '../../components/layout/SubContentsXsmall';
import BreadCrumb from '../../components/layout/BreadCrumb';
import SubTitle from '../../components/layout/SubTitle';
import JoinForm from '../../components/member/JoinForm';

function Join() {
    const params = useParams();
    return (
        <SubContentsXsmall>
            <BreadCrumb title={['회원가입']} path={params} />
            <SubTitle title={['회원가입']} />
            <JoinForm />
        </SubContentsXsmall>
    );
}

export default Join;
