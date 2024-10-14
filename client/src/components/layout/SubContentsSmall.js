import React from "react";
import styles from "./SubContentsSmall.module.scss";

function SubContentsSmall({ children }) {
    return <div className={styles.contents}>{children}</div>;
}

export default SubContentsSmall;
