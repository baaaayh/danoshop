import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BreadCrumb.scss";

function BreadCrumb({ title, type }) {
    const location = useLocation();

    return (
        <div className="breadcrumb">
            <nav>
                <ul>
                    <li>
                        <Link to="/">홈</Link>
                    </li>
                    <li>
                        <Link
                            to={location.pathname}
                            state={{ productType: type }}
                        >
                            {title}
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default BreadCrumb;
