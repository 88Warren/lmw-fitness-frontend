import { useEffect } from 'react';
import useBlogForm from '../../hooks/useBlogForm.jsx';
import PropTypes from 'prop-types';

const BlogForm = ({ formData: initialData, onSubmit, title, buttonText, footer }) => {
  const initialFormData = {
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    author: initialData?.author || '',
    image_url: initialData?.image_url || '',
    published_at: initialData?.published_at || '',
    is_published: initialData?.is_published || false,
  };

  BlogForm.propTypes = {
    formData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    footer: PropTypes.string.isRequired,
  };

  const { formData, setFormData, handleChange, handleSubmit, handleImageChange, imagePreview, setImagePreview } = 
    useBlogForm(initialFormData, onSubmit);

  useEffect(() => {
    if (initialData?.image_url) {
      setImagePreview(initialData.image_url);
    }
  }, [initialData]);

  return (
    <section className="bg-white py-16">
      <div className="flex flex-col items-center justify-center mx-auto w-full max-w-3xl">
        <div className="p-8 space-y-6 bg-gray-100 rounded-lg shadow-lg w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800">{title}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700" htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-lime-500"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700" htmlFor="slug">Slug</label>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-lime-500"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700" htmlFor="content">Content</label>
                <textarea
                  name="content"
                  id="content"
                  rows="6"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-lime-500"
                  value={formData.content}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700" htmlFor="author">Author</label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-lime-500"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700" htmlFor="image_url">Image</label>
                <input
                  type="file"
                  name="image_url"
                  id="image_url"
                  accept="image/*"
                  className="w-full p-3 border rounded-lg"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Blog Preview"
                    className="mt-4 h-40 object-cover rounded-lg border"
                  />
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  id="is_published"
                  className="w-5 h-5"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <label className="ml-2 text-gray-700" htmlFor="is_published">Publish Now</label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-3 text-white bg-lime-500 rounded-lg hover:bg-lime-600 focus:ring focus:ring-lime-400"
            >
              {buttonText}
            </button>

            {footer && <div className="text-center text-gray-600">{footer}</div>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default BlogForm;
