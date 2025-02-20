import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./components/Home";
import Form from "./components/Form";
import NotFound from "./components/NotFound";
import SingleTodo from "./components/SingleTodo";
import MainLayout from "./components/MainLayout";
import { UserProvider } from "./context/UserContext";

function App() {
	return (
		<UserProvider>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="manage" element={<Form />} />
					<Route path="todo/:id" element={<SingleTodo />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</UserProvider>
	);
}

export default App;
