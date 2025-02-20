import { PrimeReactProvider } from "primereact/api";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<PrimeReactProvider>
				<App />
			</PrimeReactProvider>
		</BrowserRouter>
	</StrictMode>
);
