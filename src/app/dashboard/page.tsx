import AppDashboard from "@/components/dashboards/dashboard";
import React from "react";

export default function Dashboard() {
	return <AppDashboard isLoading={true} content={<div></div>} activeKey={"dashboard"} />;
}
