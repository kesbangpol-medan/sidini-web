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
			className="cursor-pointer text-xs bg-muted text-foreground p-1 rounded flex gap-1 items-center hover:bg-muted/80 transition-colors"
		>
			{icon}
			{label ? <h5 className="font-semibold text-xs">{label}</h5> : null}
		</div>
	);
};

export default DashboardButton;
