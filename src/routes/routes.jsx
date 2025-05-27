import { Route, createRoutesFromElements } from 'react-router-dom';
import Boilerplate from '../layouts/Boilerplate';
import Home from '../pages/Home';
import Contact from '../components/home/ContactForm';
import BlogHomePage from '../pages/Blog/BlogHome';
import Login from '../pages/User/Login';
import Register from '../pages/User/Register';
import Profile from '../pages/User/Profile';
import Test from '../pages/Test';
import NotFoundPage from '../pages/errors/NotFoundPage';

const routes = createRoutesFromElements(
  <Route path="/" element={<Boilerplate />}>

    {/* Home page */}
    <Route index element={<Home />} />

    {/* Contact */}
    <Route path="/contact" element={<Contact />} />

    {/* Blog */}
    <Route path="/blog" element={<BlogHomePage />} />

    {/* Authentication */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Profile */} 
    <Route path="/profile" element={<Profile />} />

    {/* Test */}
    <Route path="/test" element={<Test />} />

    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default routes;
    