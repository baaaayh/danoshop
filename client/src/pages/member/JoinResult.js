import React from 'react';
import { useParams } from 'react-router-dom';
import SubContentsXsmall from '../../components/SubContentsXsmall';
import BreadCrumb from '../../components/BreadCrumb';
import SubTitle from '../../components/SubTitle';
import ResultForm from '../../components/ResultForm';

function JoinResult() {
    const params = useParams();

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
