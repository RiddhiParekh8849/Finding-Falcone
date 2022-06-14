import React from "react";
import { Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard";
import Success from "./Success";

const routes = (
    <Routes>
        <Route path="/" element={<Dashboard />}  />
        <Route path="/success" element={<Success />} />
    </Routes>
);

export default routes;