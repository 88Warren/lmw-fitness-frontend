import { Route, createRoutesFromElements } from "react-router-dom";
import Boilerplate from "../layouts/Boilerplate";
import Home from "../pages/Home";
import Pricing from "../components/home/Pricing";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentCancelled from "../pages/payment/PaymentCancelled";
import Cart from "../pages/payment/Cart"; 
import Contact from "../components/home/ContactForm";
import BlogPage from "../components/Blog/BlogPage";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import ForgotPassword from "../pages/User/ForgotPassword";
import ResetPassword from "../pages/User/ResetPassword";
import NewsletterConfirmed from "../pages/User/NewsletterConfirmed";
import NewsletterInboxCheck from "../pages/User/NewsletterInboxCheck";
import Profile from "../pages/User/Profile";
import NotFoundPage from "../pages/errors/NotFoundPage";

const routes = createRoutesFromElements(
  <Route path="/" element={<Boilerplate />}>
    {/* Home page */}
    <Route index element={<Home />} />

    {/* Pricing and payments */}
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />
    <Route path="/payment-cancelled" element={<PaymentCancelled />} />
    <Route path="/cart" element={<Cart />} /> 

    {/* Contact */}
    <Route path="/contact" element={<Contact />} />

    {/* Blog */}
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/blog/:postId" element={<BlogPage />} />
    <Route path="/blog/create" element={<BlogPage />} /> 
    <Route path="/blog/edit" element={<BlogPage />} /> 

    {/* Authentication */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />      
    <Route path="/reset-password/:token" element={<ResetPassword />} /> 

    {/* Newsletter */}
    <Route path="/newsletter/confirm" element={<NewsletterConfirmed />} />
    <Route path="/newsletter/check-inbox" element={<NewsletterInboxCheck />} />

    {/* Profile */}
    <Route path="/profile" element={<Profile />} />

    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>,
);

export default routes;
