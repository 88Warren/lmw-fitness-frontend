import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import routes from './routes/routes.jsx';
const API_URL = import.meta.env.VITE_API_URL;

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
    <RouterProvider router={router}>
      <ScrollToTop />
    </RouterProvider>
  );
};

export default App;