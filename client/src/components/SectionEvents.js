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
                                <div className={styles.events__figure}>
                                    <img src="" alt="" />
                                </div>
                                <h3 className={styles.events__title}></h3>
                                <div className={styles.events__viewmore}>
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
