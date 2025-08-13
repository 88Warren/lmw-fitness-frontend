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

import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import ForgotPassword from "../pages/User/ForgotPassword";
import ResetPassword from "../pages/User/ResetPassword";
import WorkoutAuthPage from '../pages/Workouts/WorkoutAuthPage';

import ProtectedRoute from "../components/Shared/ProtectedRoute";

import WorkoutPage from "../pages/Workouts/WorkoutPage";
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

    {/* Authentication Routes (unprotected) */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />      
    <Route path="/reset-password/:token" element={<ResetPassword />} /> 
    <Route path="/workout-auth" element={<WorkoutAuthPage />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/change-password-first-login" element={<ChangePasswordFirstLoginPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/workouts/:programName/:dayNumber" element={<WorkoutPage />} />
      <Route path="/blog/create" element={<BlogPage />} /> 
      <Route path="/blog/edit" element={<BlogPage />} /> 
    </Route>
    
    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>,
);

export default routes;
