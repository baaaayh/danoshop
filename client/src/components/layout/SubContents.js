import React from "react";
import styles from "./SubContents.module.scss";

function SubContents({ children }) {
    return <div className={styles.contents}>{children}</div>;
}

export default SubContents;
