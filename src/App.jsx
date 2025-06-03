import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import routes from "./routes/routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <AuthProvider data-oid="546g8cf">
      <RouterProvider router={router} data-oid="078a8p7">
        <ScrollToTop data-oid="2h1jxqu" />
      </RouterProvider>
    </AuthProvider>
  );
};

export default App;
