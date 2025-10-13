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
import WorkoutAuthPage from "../pages/Workouts/WorkoutAuthPage";

import ProtectedRoute from "../components/Shared/ProtectedRoute";
import AdminRoute from "../components/Admin/AdminRoute";

import WorkoutPage from "../pages/Workouts/WorkoutPage";
import ProgramDayListPage from "../pages/Workouts/ProgramDayListPage";
import RoutinePage from "../pages/Workouts/Routine";
import ChangePasswordFirstLoginPage from "../pages/User/ChangePasswordFirstLogin";
import Profile from "../pages/User/Profile";

import CalorieCalculator from "../pages/calculator/CalorieCalculator";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import ExerciseManagement from "../pages/Admin/ExerciseManagement";
import ProgramManagement from "../pages/Admin/ProgramManagement";
import WorkoutDayManagement from "../pages/Admin/WorkoutDayManagement";
import WorkoutDayList from "../pages/Admin/WorkoutDayList";
import BlogManagement from "../pages/Admin/BlogManagement";
import BlogForm from "../pages/Admin/BlogForm";
import UserManagement from "../pages/Admin/UserManagement";

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
      <Route path="/calorie-calculator" element={<CalorieCalculator />} />
      <Route path="/workouts/:programName/list" element={<ProgramDayListPage />} />
      <Route path="/workouts/:programName/routines/:routineType" element={<RoutinePage />} />
      <Route path="/workouts/:programName/:dayNumber" element={<WorkoutPage />} />
      <Route path="/blog/create" element={<BlogPage />} />
      <Route path="/blog/edit" element={<BlogPage />} />
    </Route>

    {/* Admin Routes */}
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/exercises" element={<ExerciseManagement />} />
      <Route path="/admin/programs" element={<ProgramManagement />} />
      <Route path="/admin/workout-days" element={<WorkoutDayList />} />
      <Route path="/admin/workout-days/:programId" element={<WorkoutDayManagement />} />
      <Route path="/admin/blogs" element={<BlogManagement />} />
      <Route path="/admin/blogs/create" element={<BlogForm />} />
      <Route path="/admin/blogs/edit/:id" element={<BlogForm />} />
      <Route path="/admin/users" element={<UserManagement />} />
    </Route>

    {/* Error */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default routes;