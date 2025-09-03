import React from "react";
import { InputField, TextAreaField } from "../../controllers/forms/formFields";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import PropTypes from 'prop-types';

const BlogForm = ({
  isEditMode,
  newBlogData,
  handleInputChange,
  handleFormSubmit,
  handleBackToList,
}) => {

const categories = [
  "Fitness Tips",
  "Nutrition",
  "Workouts",
  "Mindset",
  "Recovery",
  "Motivation",
  "Miscellaneous",
];

const handleSubmit = (e) => {
  e.preventDefault();
  const mode = isEditMode ? 'edit' : 'create';
  handleFormSubmit(e, mode);
};

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="bg-customGray rounded-2xl flex p-8">
        <div className="w-full mb-8 ">
          <h1 className="text-3xl md:text-5xl p-8 font-bold text-center text-customWhite mb-8 font-higherJump tracking-widest leading-loose">
            {isEditMode ? (
                <DynamicHeading
                  text={"Edit Article"}
                  className="font-higherJump text-2xl md:text-4xl font-bold text-customWhite leading-loose tracking-widest"
                />
            ) : (
                <DynamicHeading
                  text={"Create Article"}
                  className="font-higherJump text-2xl md:text-4xl font-bold text-customWhite leading-loose tracking-widest"
                />
            )}
          </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
            <InputField
              label="Article Title *"
              type="text"
              name="title"
              id="title"
              value={newBlogData.title}
              onChange={handleInputChange}
              placeholder="Enter an engaging title for your article"
              required={true}
            />

          {/* Category Dropdown */}
          <InputField
            label="Category *"
            type="select"
            name="category"
            value={newBlogData.category || ""}
            onChange={handleInputChange}
            required={true}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </InputField>

          {/* Featured Toggle Row */}
          <InputField
            label="Featured?"
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            checked={newBlogData.isFeatured || false}
            onChange={handleInputChange}
          />

          {/* Image URL */}
          <InputField
            label="Featured Image URL"
            type="url"
            name="image"
            id="image"
            value={newBlogData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/your-image.jpg"
            infoText="Add a compelling image to make your article stand out"
          />

          {/* Excerpt */}
          <TextAreaField
            label="Article Excerpt *"
            name="excerpt"
            value={newBlogData.excerpt}
            onChange={handleInputChange}
            rows={4}
            placeholder="Write a compelling summary that will entice readers to click and read more..."
            required={true}
            infoText="This will appear in the article preview cards (recommended: 150-200 characters)"
          />

          {/* Full Content */}
          <TextAreaField
          label="Article Content *"
          name="fullContent"
          id="fullContent"
          value={newBlogData.fullContent}
          onChange={handleInputChange}
          rows={15}
          placeholder="Write your full article content here. You can use HTML tags like <p>, <h2>, <h3>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, etc."
          required={true}
          infoText="HTML formatting is supported. Use headings, paragraphs, lists, and other HTML elements to structure your content."
          />

         {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end sm:justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2 border-t border-logoGray/60">
            <button
              type="button"
              onClick={handleBackToList}
              className="btn-cancel px-8 py-3 mt-6 inline-flex items-center justify-center w-full sm:w-auto"
            >
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="btn-full-colour inline-flex items-center justify-center space-x-2
                        px-8 py-3 w-full sm:w-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{isEditMode ? "Update Article" : "Publish Article"}</span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  newBlogData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    isFeatured: PropTypes.bool,
    image: PropTypes.string,
    excerpt: PropTypes.string,
    fullContent: PropTypes.string,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  handleBackToList: PropTypes.func.isRequired,
};