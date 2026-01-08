import React from "react";
import { Outlet } from "react-router";

const dashboardLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default dashboardLayout;
