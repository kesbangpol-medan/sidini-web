import AppInput from "@/components/inputs/AppInput";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className="relative w-full max-w-sm">
			<AppInput
				type="search"
				icon={<FaSearch className="text-[var(--disable)]" />}
				value={value}
				onChange={handleChange}
				placeHolder="Search..."
				// inputClassName="pl-10 hover:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
			/>
		</div>
	);
};

export default SearchBar;
