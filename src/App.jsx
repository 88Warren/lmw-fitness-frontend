import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import routes from './routes/routes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

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
      <RouterProvider router={router}>
        <ScrollToTop />
      </RouterProvider>
    </AuthProvider>
  );
};

export default App;