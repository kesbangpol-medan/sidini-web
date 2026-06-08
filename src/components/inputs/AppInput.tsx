import React, { ReactNode } from "react";

interface AppInputProps {
	label?: string;
	type?: "text" | "number" | "email" | "password" | "search" | "date" | "textarea";
	value?: string;
	placeHolder?: string;
	icon?: ReactNode;
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	search?: boolean;
	maxLength?: number;
}

const AppInput: React.FC<AppInputProps> = (props) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = e.target.value;

		if (props.type === "number") {
			const numericOnly = value.replace(/[^0-9]/g, "");
			props.onChange?.({ ...e, target: { ...e.target, value: numericOnly } });
		} else {
			props.onChange?.(e);
		}
	};

	return (
		<div>
			{props.label && <label className="text-xs font-semibold text-foreground">{props.label.toUpperCase()}</label>}
			<div className="relative w-full">
				{props.type === "search" && (
					<button type="button" className="absolute inset-y-0 left-0 flex items-center pl-3">
						{props.icon}
					</button>
				)}
				{props.type === "textarea" ? (
					<textarea
						value={props.value}
						onChange={props.onChange}
						maxLength={props.maxLength}
						className="border border-border appearance-none rounded-lg w-full py-2 px-3 h-28 text-foreground leading-tight focus:outline-none focus:border-[var(--accent-purple)] focus:shadow-[0_0_0_3px_var(--accent-purple-glow)] bg-input-bg placeholder:text-[var(--text-muted)] transition-all duration-200"
						placeholder={props.placeHolder}
					/>
				) : (
					<input
						type={props.type === "number" ? "text" : props.type || "text"}
						inputMode={props.type === "number" ? "numeric" : undefined}
						pattern={props.type === "number" ? "[0-9]*" : undefined}
						value={props.value}
						onChange={handleChange}
						maxLength={props.maxLength}
						className={`w-full ${
							props.type === "search" ? "pl-8" : "pl-2"
						} pr-2 py-2 border rounded-lg bg-input-bg text-foreground border-border focus:outline-none focus:border-[var(--accent-purple)] focus:shadow-[0_0_0_3px_var(--accent-purple-glow)] transition-all duration-200 placeholder:text-[var(--text-muted)]`}
						placeholder={props.placeHolder}
					/>
				)}
				{/* {props.icon && props.type !== "textarea" && props.type !== "search" && (
					<button type="button" className="text-xs absolute inset-y-0 right-3 flex items-center text-gray-600">
						{props.icon}
					</button>
				)} */}
				{props.icon && props.type !== "textarea" && props.type !== "search" && (
					<div className="text-xs absolute inset-y-0 right-3 flex items-center text-muted-foreground">{props.icon}</div>
				)}
			</div>
		</div>
	);
};

export default AppInput;
