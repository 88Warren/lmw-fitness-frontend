import { Route, createRoutesFromElements } from 'react-router-dom';
import Boilerplate from '../layouts/Boilerplate';
import Home from '../pages/Home';
import Contact from '../components/home/ContactForm';
import Blog from '../pages/Blog/BlogHome';
import Test from '../pages/Test';
import NotFoundPage from '../pages/errors/NotFoundPage';

const routes = createRoutesFromElements(
  <Route path="/" element={<Boilerplate />}>

    {/* Home page */}
    <Route index element={<Home />} />

    {/* Contact */}
    <Route path="/contact" element={<Contact />} />

    {/* Blog */}
    <Route path="/blog" element={<Blog />} />

    {/* Test */}
    <Route path="/test" element={<Test />} />

    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default routes;