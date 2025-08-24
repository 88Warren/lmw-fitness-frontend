import CategoriesSidebar from './CategoriesSideBar'; 
import NewsletterSignup from './NewsletterSignup';

const BlogSidebar = () => {
  return (
    <div className="lg:col-span-1 space-y-8">
      <CategoriesSidebar />
      <NewsletterSignup />
    </div>
  );
};

export default BlogSidebar;