import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../utils/config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputField, TextAreaField } from "../../controllers/forms/formFields"; 
import { showToast } from "../../utils/toastUtil"; 

const ContactForm = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.message) {
      showToast("warn", "⚠️ Please fill out all fields!");
      setIsLoading(false);
      return;
    }

    if (!captchaValue) {
      showToast("warn", "❌ Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token: captchaValue }), 
      });

      // console.log("Sending data to backend:", JSON.stringify({ ...formData, token: captchaValue }));
      // console.log("Response from server:", res.status, res.statusText);
      // console.log("reCAPTCHA site key:", RECAPTCHA_SITE_KEY);

      if (res.ok) {
        // console.log("Toast should appear: ", res.ok ? "Success" : "Error");
        showToast("success", "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setCaptchaValue(null);
        recaptchaRef.current.reset(); 
      } else {
        showToast("error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showToast("error", "❌ An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

      const handleCaptchaChange = (value) => {
          setCaptchaValue(value);
          // console.log("Captcha value:", value);
      };


  return (
    <section id="Contact" className="py-16 px-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-higherJump text-center mb-6 text-black">
          Get In Touch <span className="w">w</span>ith <span className="m">m</span>e
        </h2>
        <p className="text-lg text-center text-customGray mb-8">
          Have a question or need more info? Drop me a message here:
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Name:" type="text" name="name" value={formData.name} onChange={handleChange} />
          <InputField label="Email:" type="email" name="email" value={formData.email} onChange={handleChange} />
          <TextAreaField label="Message:" name="message" value={formData.message} onChange={handleChange} />

          <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />

          <button
            type="submit"
            disabled={isLoading}
            className='w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink hover:from-hotPink hover:via-brightYellow hover:to-limeGreen transition-all duration-300'>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
};

export default ContactForm;