import React from "react";
import { Link } from "react-router-dom";
import styles from "./SectionEvents.module.scss";

function SectionEvents() {
    return (
        <section className="section section--events">
            <div className="section__inner">
                <h2></h2>
                <div className={styles.events}>
                    <ul>
                        <li className={styles.events__item}>
                            <div className={styles.events__inner}>
                                <Link
                                    to="/events/membership"
                                    className="btn-moreview"
                                >
                                    <div className={styles.events__figure}>
                                        <img
                                            src="/images/main/main_banner.png"
                                            alt=""
                                        />
                                    </div>
                                    <h3 className={styles.events__title}>
                                        다노샵 멤버십 혜택
                                    </h3>
                                    <div className={styles.events__viewmore}>
                                        <span>바로가기</span>
                                    </div>
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default SectionEvents;
