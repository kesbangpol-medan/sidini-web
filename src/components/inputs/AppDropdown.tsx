import React from "react";
import { FaPlus } from "react-icons/fa";

interface AppDropdownProps {
	label?: string;
	options: { value: string; label: string }[];
	value?: string;
	placeholder?: string;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	canCreate?: boolean;
	onCreate?: () => void;
}

const AppDropdown: React.FC<AppDropdownProps> = ({ label, options, value, placeholder, onChange, canCreate, onCreate }) => {
	return (
		<div>
			{label && <label className="text-xs font-semibold text-foreground">{label.toUpperCase()}</label>}
			<div className="flex gap-1 items-center">
				<div className="relative w-full">
					<select
						value={value}
						onChange={onChange}
						className="border border-border rounded-lg w-full py-2 px-3 h-10 text-foreground bg-input-bg leading-tight focus:outline-none focus:border-[var(--accent-purple)] focus:shadow-[0_0_0_3px_var(--accent-purple-glow)] transition-all duration-200"
					>
						{placeholder && (
							<option value="" disabled>
								{placeholder}
							</option>
						)}
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
				{canCreate && (
					<div className="cursor-pointer p-2 bg-secondary border rounded-lg border-border text-white hover:opacity-90 transition-all duration-200" onClick={onCreate}>
						<FaPlus className="text-xs" />
					</div>
				)}
			</div>
		</div>
	);
};

export default AppDropdown;
