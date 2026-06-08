import React from "react";
import { FaPlus } from "react-icons/fa";

interface AppMultipleSelectProps {
	label?: string;
	options: { value: string; label: string }[];
	value?: string[];
	placeholder?: string;
	onChange?: (selectedValues: string[]) => void;
	canCreate?: boolean;
	onCreate?: () => void;
}

const AppMultipleSelect: React.FC<AppMultipleSelectProps> = ({ options, label, value = [], onChange, onCreate, canCreate }) => {
	const handleSelect = (selectedValue: string) => {
		let newValue;
		if (value.includes(selectedValue)) {
			newValue = value.filter((v) => v !== selectedValue);
		} else {
			newValue = [...value, selectedValue];
		}
		onChange?.(newValue);
	};

	return (
		<div>
			{label && <div className="col-span-4 text-xs font-semibold text-foreground mb-1">{label.toUpperCase()}</div>}
			<div className="w-full border-2 border-border border-dashed p-4 rounded">
				{canCreate && (
					<div className="flex justify-end mb-4">
						<div className="cursor-pointer p-2 bg-secondary border rounded border-border text-foreground" onClick={onCreate}>
							<FaPlus className="text-xs" />
						</div>
					</div>
				)}

				<div className="w-full grid grid-cols-8 gap-4 h-24 overflow-auto">
					{options.map((option) => (
						<div
							key={option.value}
							className={`border border-border p-2 rounded-full text-center text-xs font-semibold cursor-pointer max-h-8 flex items-center justify-center transition-colors ${
								value.includes(option.value) ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
							}`}
							onClick={() => handleSelect(option.value)}
						>
							{option.label}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AppMultipleSelect;
