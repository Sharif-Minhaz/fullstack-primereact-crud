import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./components/Home";
import CreateForm from "./components/CreateForm";
import NotFound from "./components/NotFound";
import SingleTodo from "./components/SingleTodo";

function App() {
	return (
		<Routes>
			<Route index element={<Home />} />
			<Route path="create" element={<CreateForm />} />
			<Route path="todo/:id" element={<SingleTodo />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
