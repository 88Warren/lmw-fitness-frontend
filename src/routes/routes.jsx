import { Route, createRoutesFromElements } from "react-router-dom";
import Boilerplate from "../layouts/Boilerplate";
import Home from "../pages/Home";
import Contact from "../components/home/ContactForm";
import BlogHomePage from "../pages/Blog/BlogHome";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import Profile from "../pages/User/profile";
import Test from "../pages/Test";
import NotFoundPage from "../pages/errors/NotFoundPage";

const routes = createRoutesFromElements(
  <Route
    path="/"
    element={<Boilerplate data-oid="e7y4khj" />}
    data-oid="q6fb1d2"
  >
    {/* Home page */}
    <Route index element={<Home data-oid="tmet37a" />} data-oid="6azo-:p" />

    {/* Contact */}
    <Route
      path="/contact"
      element={<Contact data-oid="di.dcd1" />}
      data-oid="-wavz:z"
    />

    {/* Blog */}
    <Route
      path="/blog"
      element={<BlogHomePage data-oid="4gggvqh" />}
      data-oid="erl:zy5"
    />

    {/* Authentication */}
    <Route
      path="/login"
      element={<Login data-oid="opgpkgw" />}
      data-oid="z_-ffon"
    />
    <Route
      path="/register"
      element={<Register data-oid="ys09prk" />}
      data-oid="49nvtw4"
    />

    {/* Profile */}
    <Route
      path="/profile"
      element={<Profile data-oid="o1pg1ni" />}
      data-oid="ijkdmh."
    />

    {/* Test */}
    <Route
      path="/test"
      element={<Test data-oid="sluchnu" />}
      data-oid="l59hw3s"
    />

    {/* Error */}
    <Route
      path="*"
      element={<NotFoundPage data-oid="tc1o.q4" />}
      data-oid="e:wsfi_"
    />
  </Route>,
);

export default routes;
