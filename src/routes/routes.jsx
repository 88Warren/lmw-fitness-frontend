import { Route, createRoutesFromElements } from 'react-router-dom';
import Boilerplate from '../layouts/Boilerplate';
import Home from '../pages/Home';
import NotFoundPage from '../pages/errors/NotFoundPage';

const routes = createRoutesFromElements(
  <Route path="/" element={<Boilerplate />}>

    {/* Home page */}
    <Route index element={<Home />} />

    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default routes;