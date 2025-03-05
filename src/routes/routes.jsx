import { Route, createRoutesFromElements } from 'react-router-dom';
import Boilerplate from '../layouts/Boilerplate';
import Home from '../pages/Home';
import Blog from '../pages/Blog/Blog';
import CreateBlog from '../pages/Blog/CreateBlog';
import NotFoundPage from '../pages/errors/NotFoundPage';

const routes = createRoutesFromElements(
  <Route path="/" element={<Boilerplate />}>

    {/* Home page */}
    <Route index element={<Home />} />

    {/* Blog */}
    <Route path="/blogs" element={<Blog />} />
    <Route path="/blogs/new" element={<CreateBlog />} />

    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default routes;