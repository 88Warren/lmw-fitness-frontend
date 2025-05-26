import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { getEnvVar } from "../../utils/config";

const RECAPTCHA_KEY = getEnvVar("VITE_RECAPTCHA_SITE_KEY");
const BACKEND_URL = getEnvVar("VITE_BACKEND_URL");

const Blog = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/contact`);
        if (!response.ok) throw new Error("Failed to fetch blogs");

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="Blog p-20">
      <h1 className="text-3xl font-bold text-center mb-6">Latest Blogs</h1>

      <Link to='/blogs/new' onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6">Add New Blog</Link>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white shadow-md p-4 rounded-lg">
            <img
              src={blog.image_url || "https://via.placeholder.com/300"}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-700">{blog.author}</p>
            <p className="text-sm text-gray-500">{new Date(blog.publishedAt).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-600">{blog.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;