import React, { ReactNode } from "react";

export interface DashboardButtonProps {
	onClick?: () => void;
	icon?: ReactNode;
	label?: string;
	id?: string;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({ onClick, icon, label, id }) => {
	return (
		<div
			id={id}
			onClick={onClick}
			className="cursor-pointer text-xs bg-card text-foreground p-1 rounded-lg flex gap-1 items-center border border-border hover:border-[var(--border-accent)] hover:bg-white/5 transition-all duration-200"
		>
			{icon}
			{label ? <h5 className="font-semibold text-xs">{label}</h5> : null}
		</div>
	);
};

export default DashboardButton;
