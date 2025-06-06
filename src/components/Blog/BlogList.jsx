import useAuth from "../../hooks/useAuth";
import BlogHero from "./Sections/BlogHero";
import FeaturedPostsCarousel from "./Sections/FeaturedPostsCarousel";
import AllArticlesGrid from "./Sections/AllArticlesGrid";
import BlogSidebar from "./Sections/BlogSidebar";
import NoPostsMessage from "./Errors/NoPostsMessage";
import { useNavigate } from "react-router-dom";

const BlogList = ({
  actualBlogPosts,
  handleEditClick,
  handleDelete,
  handleCreateNewBlogClick,
}) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Add the missing handleReadMore function
  const handleReadMore = (post) => {
    navigate(`/blog/${post.ID}`);
  };

  const featuredPosts = actualBlogPosts
    .filter((post) => post.isFeatured)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const allSortedPosts = [...actualBlogPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const gridBlogPosts = allSortedPosts;

  return (
    <> 
      {/* Hero Section */}
      <BlogHero isAdmin={isAdmin} handleCreateNewBlogClick={handleCreateNewBlogClick} />

      {actualBlogPosts.length === 0 && (
        <NoPostsMessage isAdmin={isAdmin} handleCreateNewBlogClick={handleCreateNewBlogClick} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Posts Carousel */}
            {featuredPosts.length > 0 && (
              <FeaturedPostsCarousel
                featuredPosts={featuredPosts}
                handleReadMore={handleReadMore}
              />
            )}

            {/* All Articles Grid */}
            <AllArticlesGrid
              gridBlogPosts={gridBlogPosts}
              handleEditClick={handleEditClick}
              handleDelete={handleDelete}
              isAdmin={isAdmin}
            />
          </div>

          {/* Sidebar */}
          <BlogSidebar />
        </div>
      </div>
    </>
  );
};

export default BlogList;