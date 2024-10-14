import React from "react";
import styles from "./MainContents.module.scss";

function MainContents({ children }) {
    return <div className={styles["main-contents"]}>{children}</div>;
}

export default MainContents;
