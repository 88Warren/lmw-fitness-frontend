import { Link } from 'react-router-dom'
import BlogForm from '../../components/Blog/BlogForm';
import useBlogForm from "../../hooks/useBlogForm";

const CreateBlog = () => {
    const handleClick = () => {
        window.scrollTo(0, 0);
    }; 
    
    const initialState = {
        title: "",
        content: "",
        author: "",
        tags: "",
        cover_image: "",
    };

    const onSubmit = async (data) => {
        console.log("Submitting data:", data);
    
        // Create a new FormData object for files (like image_url) if necessary
        const formData = new FormData();
        console.log("Submitting form with:", formData);
        if (data.image_url) {
            console.log("Image data:", data.image_url);
            formData.append('image_url', data.image_url);
        }
    
        // Prepare JSON payload
        const blogData = {
            title: data.title,
            content: data.content,
            author: data.author,
            image_url: data.image_url ? data.image_url.name : null,  // Send image file name, you can process the image uploading separately
            is_published: data.is_published,
        };
    
        try {
            const response = await fetch('/api/blogs/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Indicating it's JSON data
                },
                body: JSON.stringify(blogData),  // Send JSON payload
            });

            console.log("Response status:", response.status);
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Failed to create blog post");
            }

            if (response.status !== 201) {
                throw new Error(result.error || "Failed to create blog post");
            }
    
            console.log("Submission Result:", result);
    
            if (result.ID) {
                alert("Blog created successfully! Redirecting...");
                // window.location.href = `/blogs/${result.ID}`; 
                window.location.href = '/blogs/';
            } else {
                alert("Blog creation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    };

    const { formData, handleChange } = useBlogForm(initialState, onSubmit);

    return (
        <>
            <BlogForm
                title="Create Blog"
                formData={formData}
                onSubmit={onSubmit}
                onChange={handleChange}
                buttonText="Create"
                footer={
                    <>
                        <Link to="/" onClick={handleClick} className="link">Cancel</Link>
                    </>
                }
            />
            <div id="alertContainer"></div>
        </>
    )
}

export default CreateBlog;
