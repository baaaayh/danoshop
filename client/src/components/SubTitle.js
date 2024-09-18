import React from "react";
import styles from "./SubTitle.module.scss";

function SubTitle({ title }) {
    return <h2 className={styles.title}>{title[title.length - 1]}</h2>;
}

export default SubTitle;
