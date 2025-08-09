import { Route, createRoutesFromElements } from "react-router-dom";
import Boilerplate from "../layouts/Boilerplate";

import Home from "../pages/Home";
import About from "../components/home/About";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import Contact from "../components/home/ContactForm";

import NewsletterConfirmed from "../pages/User/NewsletterConfirmed";
import NewsletterInboxCheck from "../pages/User/NewsletterInboxCheck";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Payment/PaymentCancelled";
import Cart from "../pages/Payment/Cart"; 

import BlogPage from "../components/Blog/BlogPage";

import BeginnerWorkoutPage from "../pages/Workouts/Beginner";
import AdvancedWorkoutPage from "../pages/Workouts/Advanced";

import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import ForgotPassword from "../pages/User/ForgotPassword";
import ResetPassword from "../pages/User/ResetPassword";
import ChangePasswordFirstLoginPage from "../pages/User/ChangePasswordFirstLogin";

import Profile from "../pages/User/Profile";

import NotFoundPage from "../pages/errors/NotFoundPage";

const routes = createRoutesFromElements(
  <Route path="/" element={<Boilerplate />}>
    {/* Home page */}
    <Route index element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/testimonials" element={<Testimonials />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/contact" element={<Contact />} />

    {/* Brevo */}
    {/* Newsletter */}
    <Route path="/newsletter/confirm" element={<NewsletterConfirmed />} />
    <Route path="/newsletter/check-inbox" element={<NewsletterInboxCheck />} />
    {/* Pricing and payments */}
    <Route path="/payment-success" element={<PaymentSuccess />} />
    <Route path="/payment-cancelled" element={<PaymentCancelled />} />
    <Route path="/cart" element={<Cart />} /> 

    {/* Blog */}
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/blog/:postId" element={<BlogPage />} />
    <Route path="/blog/create" element={<BlogPage />} /> 
    <Route path="/blog/edit" element={<BlogPage />} /> 

    <Route path="/workouts/beginner-program" element={<BeginnerWorkoutPage />} />
    <Route path="/workouts/beginner-program/day/:dayNumber" element={<BeginnerWorkoutPage />} />
    <Route path="/workouts/advanced-program" element={<AdvancedWorkoutPage />} />
    <Route path="/workouts/advanced-program/day/:dayNumber" element={<AdvancedWorkoutPage />} />

    {/* Authentication */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />      
    <Route path="/reset-password/:token" element={<ResetPassword />} /> 
    <Route path="/change-password-first-login" element={<ChangePasswordFirstLoginPage />} />

    {/* Profile */}
    <Route path="/profile" element={<Profile />} />

    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>,
);

export default routes;
