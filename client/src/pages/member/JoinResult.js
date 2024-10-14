import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SubContentsXsmall from '../../components/layout/SubContentsXsmall';
import BreadCrumb from '../../components/layout/BreadCrumb';
import SubTitle from '../../components/layout/SubTitle';
import ResultForm from '../../components/member/ResultForm';

function JoinResult() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    if (!location.state || location.state.prevState !== '/member/join') {
        navigate(-1);
    }

    return (
        <SubContentsXsmall>
            <BreadCrumb title={['회원 가입 완료']} path={params} />
            <SubTitle title={['회원 가입 완료']} />
            <>
                <div className="step">
                    <ol>
                        <li>1. 약관동의</li>
                        <li>2. 정보입력</li>
                        <li>
                            <b>3. 가입완료</b>
                        </li>
                    </ol>
                </div>
                <ResultForm />
            </>
        </SubContentsXsmall>
    );
}

export default JoinResult;
