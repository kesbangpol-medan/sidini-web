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
				icon={<FaSearch className="text-muted-foreground" />}
				value={value}
				onChange={handleChange}
				placeHolder="Search..."
			/>
		</div>
	);
};

export default SearchBar;
