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
    element={<Boilerplate data-oid="7l2idgp" />}
    data-oid="o8o0rl6"
  >
    {/* Home page */}
    <Route index element={<Home data-oid="zp6yl96" />} data-oid="6bvff6n" />

    {/* Contact */}
    <Route
      path="/contact"
      element={<Contact data-oid="unhzi3r" />}
      data-oid="2405lbu"
    />

    {/* Blog */}
    <Route
      path="/blog"
      element={<BlogHomePage data-oid="wxnmv9:" />}
      data-oid="0ykpnvk"
    />

    {/* Authentication */}
    <Route
      path="/login"
      element={<Login data-oid="8ecy8io" />}
      data-oid="vkqzyb2"
    />

    <Route
      path="/register"
      element={<Register data-oid="afv0w6d" />}
      data-oid="yyp4i:h"
    />

    {/* Profile */}
    <Route
      path="/profile"
      element={<Profile data-oid="-k.ye9_" />}
      data-oid="v1grcha"
    />

    {/* Test */}
    <Route
      path="/test"
      element={<Test data-oid="te3tbrg" />}
      data-oid="ci8qiae"
    />

    {/* Error */}
    <Route
      path="*"
      element={<NotFoundPage data-oid="vzrj-vg" />}
      data-oid="2y859wu"
    />
  </Route>,
);

export default routes;
