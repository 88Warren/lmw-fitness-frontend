import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import routes from './routes/routes.jsx';

const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

// Router setup
const router = createBrowserRouter(routes);

const App = () => {
  return (
    <RouterProvider router={router}>
      <ScrollToTop />
    </RouterProvider>
  );
};

export default App;