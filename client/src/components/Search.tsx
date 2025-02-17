import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export default function Search() {
	return (
		<IconField className="w-full z-10" iconPosition="left">
			<InputIcon className="pi pi-search"> </InputIcon>
			<InputText className="w-full" placeholder="Search" />
		</IconField>
	);
}
