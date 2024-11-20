import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SubContentsXsmall from "../../components/layout/SubContentsXsmall";
import BreadCrumb from "../../components/layout/BreadCrumb";
import SubTitle from "../../components/layout/SubTitle";
import ResultForm from "../../components/member/ResultForm";
import JoinForm from "../../components/member/JoinForm";
import axios from "axios";

function Modify() {
    const params = useParams();
    const location = useLocation();
    const userId = useSelector((state) => state.user.userId);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const userDataFetch = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:4000/api/userInfo",
                    {
                        userId: userId,
                    }
                );
                setUserInfo(response.data.user);
            } catch (error) {
                console.error("User data fetch error:", error);
            }
        };
        userDataFetch();
    }, [userId]);

    return (
        <SubContentsXsmall>
            <BreadCrumb title={location.state.title} path={params} />
            <SubTitle title={location.state.title} />
            <>
                <ResultForm userInfo={userInfo} />
                <JoinForm userInfo={userInfo} />
            </>
        </SubContentsXsmall>
    );
}

export default Modify;
