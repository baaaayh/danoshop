import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Order() {
    const location = useLocation();

    console.log(location.state);
    return <div>Order</div>;
}

export default Order;
