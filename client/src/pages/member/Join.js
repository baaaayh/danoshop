import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SubContentsSmall from '../../components/SubContentsSmall';
import BreadCrumb from '../../components/BreadCrumb';
import SubTitle from '../../components/SubTitle';

function Join() {
    const params = useParams();
    const location = useLocation();
    return (
        <SubContentsSmall>
            <BreadCrumb title={title} path={params} />
            <SubTitle title={title} />
        </SubContentsSmall>
    );
}

export default Join;
