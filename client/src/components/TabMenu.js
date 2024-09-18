import React from "react";
import { NavLink } from "react-router-dom";
import "./TabMenu.scss";

function TabMenu({ pageType, category, depth1, menu, productList }) {
    return (
        <div className="tab-menu">
            <ul>
                {menu.map((dep2) => (
                    <li key={dep2.type}>
                        <NavLink
                            to={`/${pageType}/${category}/${dep2.type}`}
                            state={{ title: [depth1, dep2.name] }}
                        >
                            {dep2.name}(
                            {
                                productList.filter((item) => {
                                    return item.type === dep2.type;
                                }).length
                            }
                            )
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TabMenu;
