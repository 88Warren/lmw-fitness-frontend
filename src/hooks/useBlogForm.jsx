import { useState, useEffect } from "react";

const useBlogForm = (initialState, onSubmit) => {
    const [formData, setFormData] = useState(initialState || {});
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const { files } = e.target;
        const file = files?.[0];
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
    
        if (file) {
            if (!validTypes.includes(file.type)) {
                alert("Invalid file type. Please select an image.");
                return;
            }
    
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            setFormData((prevState) => ({
                ...prevState,
                image: file,
            }));
        } else {
            alert("No file selected!");
        }
    };

    const handleSubmit = async (e) => {
        if (e.preventDefault) e.preventDefault();

        const data = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            if (value instanceof File) {
                data.append(key, value);
            } else {
                data.append(key, value);
            }
        }

        onSubmit(formData);
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    return { formData, handleChange, handleSubmit, setFormData, handleImageChange, imagePreview, setImagePreview };
};

export default useBlogForm;
