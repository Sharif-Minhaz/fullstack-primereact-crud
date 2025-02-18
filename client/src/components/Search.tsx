import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export default function Search({ onSearch }: { onSearch: (value: string) => void }) {
	return (
		<IconField className="w-full z-5" iconPosition="left">
			<InputIcon className="pi pi-search"> </InputIcon>
			<InputText
				onChange={(e) => onSearch(e.target.value)}
				className="w-full"
				placeholder="Search"
			/>
		</IconField>
	);
}
