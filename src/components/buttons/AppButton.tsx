import React, { ReactNode } from "react";
import "./style/appbutton.style.css";

export interface AppButtonsProps {
	label?: string;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	className?: string;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "success" | "danger" | "info" | "warning" | "black" | "disable";
	isOutline?: boolean;
	icon?: ReactNode;
	fontSize?: "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl";
}

const variantColors: Record<string, string> = {
	primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
	secondary: "bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)]",
	success: "bg-[var(--success)] text-white hover:bg-[var(--success-hover)]",
	danger: "bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)]",
	warning: "bg-[var(--warning)] text-black hover:bg-[var(--warning-hover)]",
	info: "bg-[var(--info)] text-white hover:bg-[var(--info-hover)]",
	black: "bg-[var(--black)] text-white hover:bg-[var(--black-hover)]",
	disable: "bg-[var(--disable)] text-gray-600 cursor-not-allowed",
};

const outlineColors: Record<string, string> = {
	primary: "border border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary-hover)] hover:text-white",
	secondary: "border border-[var(--secondary)] text-[var(--secondary)] bg-transparent hover:bg-[var(--secondary-hover)] hover:text-white",
	success: "border border-[var(--success)] text-[var(--success)] bg-transparent hover:bg-[var(--success-hover)] hover:text-white",
	danger: "border border-[var(--danger)] text-[var(--danger)] bg-transparent hover:bg-[var(--danger-hover)] hover:text-white",
	warning: "border border-[var(--warning)] text-[var(--warning)] bg-transparent hover:bg-[var(--warning-hover)] hover:text-black",
	info: "border border-[var(--info)] text-[var(--info)] bg-transparent hover:bg-[var(--info-hover)] hover:text-white",
	black: "border border-[var(--black)] text-[var(--black)] bg-transparent hover:bg-[var(--black-hover)] hover:text-white",
	disable: "border border-[var(--disable)] text-[var(--disable)] bg-transparent cursor-not-allowed",
};

const AppButton: React.FC<AppButtonsProps> = ({
	label,
	onClick,
	type = "button",
	className = "",
	disabled = false,
	variant = "primary",
	isOutline = false,
	icon,
	fontSize = "text-base",
}) => {
	const styleClasses = isOutline ? outlineColors[variant] : variantColors[variant];

	return (
		<button
			type={type}
			onClick={onClick}
			className={`px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${styleClasses} ${fontSize} ${className}`}
			disabled={disabled}
		>
			{icon}
			{label}
		</button>
	);
};

export default AppButton;
