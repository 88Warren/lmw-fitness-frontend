import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
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
    <AuthProvider data-oid="jv3pc16">
      <RouterProvider router={router} data-oid="ob:fe3u">
        <ScrollToTop data-oid="syg9-0q" />
      </RouterProvider>
    </AuthProvider>
  );
};

export default App;
