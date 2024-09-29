import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SubContentsSmall from '../../components/SubContentsSmall';
import BreadCrumb from '../../components/BreadCrumb';
import SubTitle from '../../components/SubTitle';
import LoginForm from '../../components/LoginForm';

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
