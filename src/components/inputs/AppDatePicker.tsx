import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AppDatePickerProps {
	label?: string;
	value: Date | null;
	onChange: (date: Date | null) => void;
	placeholder?: string;
}

const AppDatePicker: React.FC<AppDatePickerProps> = ({ label, value, onChange, placeholder }) => {
	return (
		<div className="flex flex-col gap-1 w-full">
			{label && <label className="text-xs font-medium">{label.toUpperCase()}</label>}
			<DatePicker
				selected={value}
				onChange={onChange}
				placeholderText={placeholder}
				className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-shadow"
				dateFormat="dd-MM-yyyy"
				showYearDropdown
				showMonthDropdown
				dropdownMode="select"
			/>
		</div>
	);
};

export default AppDatePicker;
