import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import routes from "./routes/routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from './context/CartContext'; 

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
    <AuthProvider>
      <CartProvider> 
        <RouterProvider router={router}>
          <ScrollToTop />
        </RouterProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
