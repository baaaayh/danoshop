import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SubContentsSmall from '../../components/layout/SubContentsSmall';
import BreadCrumb from '../../components/layout/BreadCrumb';
import SubTitle from '../../components/layout/SubTitle';
import LoginForm from '../../components/member/LoginForm';

function Login() {
    const params = useParams();
    const location = useLocation();

    return (
        <SubContentsSmall>
            <BreadCrumb title={location.state.title} path={params} />
            <SubTitle title={location.state.title} />
            <LoginForm />
        </SubContentsSmall>
    );
}

export default Login;
