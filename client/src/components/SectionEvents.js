import React from "react";
import { Link } from "react-router-dom";
import "./Events.scss";

function SectionEvents() {
    return (
        <section className="section section--events">
            <div className="section__inner">
                <h2></h2>
                <div className="events">
                    <ul>
                        <li className="events__item">
                            <div className="events__inner">
                                <div className="events__figure">
                                    <img src="" alt="" />
                                </div>
                                <h3 className="events__title"></h3>
                                <div className="events__viewmore">
                                    <Link to="" className="btn-moreview">
                                        바로가기
                                    </Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default SectionEvents;
