import React from "react";
import styles from "./SubContentsXsmall.module.scss";

function SubContentsXsmall({ children }) {
    return <div className={styles.contents}>{children}</div>;
}

export default SubContentsXsmall;
