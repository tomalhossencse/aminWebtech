import { RouterProvider } from "react-router";
import { router } from "./Router/Router.jsx";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
