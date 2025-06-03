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
    <AuthProvider data-oid="z78zrym">
      <RouterProvider router={router} data-oid="0qpmx:l">
        <ScrollToTop data-oid=":3.7c4c" />
      </RouterProvider>
    </AuthProvider>
  );
};

export default App;
