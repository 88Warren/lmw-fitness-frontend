import { useState, useEffect, useCallback } from "react";
import { BACKEND_URL } from "../utils/config";
import useAuth from "../hooks/useAuth";

const useBlogData = () => {
  const { token, isAdmin } = useAuth();
  const [viewMode, setViewMode] = useState("list"); // 'list', 'detail', 'create', 'edit'
  const [selectedPost, setSelectedPost] = useState(null); // For detail view
  const [editingPost, setEditingPost] = useState(null); // For edit view
  const [actualBlogPosts, setActualBlogPosts] = useState([]);
  const [newBlogData, setNewBlogData] = useState({
    // Used for both create and edit forms
    title: "",
    date: "",
    image: "",
    excerpt: "",
    fullContent: "",
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Function to fetch blog posts
  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/blog`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActualBlogPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(
        "Failed to load blog posts. Please ensure the backend server is running and accessible, and check your network connection.",
      );
      console.error("Error fetching blog posts:", e);
    } finally {
      setLoading(false);
    }
  };

  // Effect to trigger fetching based on viewMode
  useEffect(() => {
    if (
      viewMode === "list" ||
      viewMode === "deleteSuccess" ||
      viewMode === "updateSuccess" ||
      viewMode === "createSuccess"
    ) {
      fetchBlogPosts();
      // Reset viewMode after successful action to ensure re-fetch from list
      if (
        viewMode === "deleteSuccess" ||
        viewMode === "updateSuccess" ||
        viewMode === "createSuccess"
      ) {
        setViewMode("list");
      }
    }
  }, [viewMode]); // Re-fetch when viewMode changes to list or success states

  // Handlers for navigation and state changes
  const handleReadMore = (post) => {
    setSelectedPost(post);
    setViewMode("detail");
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setEditingPost(null);
    setViewMode("list");
    window.scrollTo(0, 0);
  };

  const handleCreateNewBlogClick = useCallback(() => {
    if (!isAdmin) {
      alert(
        "You must be logged in as an administrator to create a new blog post.",
      );
      return;
    }

    setNewBlogData({
      // Clear form for new entry
      title: "",
      date: "",
      image: "",
      excerpt: "",
      fullContent: "",
      isFeatured: false,
    });
    setViewMode("create");
    window.scrollTo(0, 0);
  }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBlogData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!token) {
        throw new Error(
          "Authorisation token not found. Please log in as an administrator.",
        );
      }

      const method = editingPost ? "PUT" : "POST";
      const url = editingPost
        ? `${BACKEND_URL}/api/blog/${editingPost.ID}`
        : `${BACKEND_URL}/api/blog`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBlogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const resultPost = await response.json();
      if (editingPost) {
        setMessage("Blog post updated successfully!");
        console.log("Blog post updated:", resultPost);
        setViewMode("updateSuccess"); // Trigger re-fetch for list
      } else {
        setMessage("Blog post created successfully!");
        console.log("New blog post created:", resultPost);
        setViewMode("createSuccess"); // Trigger re-fetch for list
      }
      setEditingPost(null); // Clear editing state
      setNewBlogData({
        // Clear form data
        title: "",
        date: "",
        image: "",
        excerpt: "",
        fullContent: "",
        isFeatured: false,
      });
    } catch (e) {
      setError(
        `Failed to save blog post: ${e.message}. Please check backend server and your network connection.`,
      );
      console.error("Error saving blog post:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = useCallback(
    (post) => {
      if (!isAdmin) {
        alert("You must be logged in as an administrator to edit a blog post.");
        return;
      }

      setEditingPost(post);
      setNewBlogData({
        // Pre-populate form with existing data
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        fullContent: post.fullContent,
        isFeatured: post.isFeatured || false,
      });
      setViewMode("edit");
      window.scrollTo(0, 0);
    },
    [isAdmin],
  );

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert("You must be logged in as an administrator to delete a blog post.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!token) {
        throw new Error(
          "Authorisation token not found. Please log in as an administrator.",
        );
      }

      const response = await fetch(`${BACKEND_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          // <--- ADD HEADERS FOR DELETE TOO
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      setMessage("Blog post deleted successfully!");
      console.log(`Blog post with ID ${id} deleted.`);
      setViewMode("deleteSuccess"); // Trigger re-fetch for list
      setSelectedPost(null); // Clear selected post if it was deleted from detail view
    } catch (e) {
      setError(`Failed to delete blog post: ${e.message}.`);
      console.error("Error deleting blog post:", e);
    } finally {
      setLoading(false);
    }
  };

  return {
    viewMode,
    setViewMode,
    selectedPost,
    setSelectedPost,
    editingPost,
    setEditingPost,
    actualBlogPosts,
    setActualBlogPosts,
    newBlogData,
    setNewBlogData,
    loading,
    setLoading,
    error,
    setError,
    message,
    setMessage,
    fetchBlogPosts,
    handleReadMore,
    handleBackToList,
    handleCreateNewBlogClick,
    handleInputChange,
    handleFormSubmit,
    handleEditClick,
    handleDelete,
  };
};

export default useBlogData;
