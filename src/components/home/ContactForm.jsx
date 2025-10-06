import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { BACKEND_URL, RECAPTCHA_SITE_KEY } from "../../utils/config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputField, TextAreaField } from "../../controllers/forms/formFields";
import { showToast } from "../../utils/toastUtil";
import { motion } from "framer-motion";
import DynamicHeading from "../Shared/DynamicHeading";
import useAnalytics from "../../hooks/useAnalytics";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Website Enquiry",
    message: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef();
  const { trackContactForm } = useAnalytics();  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaError = () => {
    setCaptchaError(true);
    showToast(
      "warn",
      "reCAPTCHA failed to load. Please try refreshing the page.",
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const maxRetries = 3;
    let retryCount = 0;

    if (!formData.name || !formData.email || !formData.message) {
      showToast("warn", "Please fill out all fields!");
      setIsLoading(false);
      return;
    }

    if (!captchaValue && !captchaError) {
      showToast("warn", "Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    if (!navigator.onLine) {
      showToast(
        "error",
        "No internet connection. Please check your connection and try again.",
      );
      setIsLoading(false);
      return;
    }

    const submitWithRetry = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ...formData, token: captchaValue }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res;
      } catch (error) {
        if (!navigator.onLine) {
          throw new Error("No internet connection");
        }

        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount),
          );
          return submitWithRetry();
        }
        throw error;
      }
    };

    try {
      const res = await submitWithRetry();

      if (res.ok) {
        // Track successful contact form submission
        trackContactForm();
        showToast("success", "Message sent successfully!");
        setFormData({ name: "", email: "", subject: "Website Enquiry", message: "" });
        setCaptchaValue(null);
        recaptchaRef.current.reset();
      } else {
        showToast("error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      if (error.message === "No internet connection") {
        showToast(
          "error",
          "No internet connection. Please check your connection and try again.",
        );
      } else {
        showToast("error", "An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <section id="Contact" className="min-h-screen py-20 bg-logoGray">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <DynamicHeading
            text="Get in touch with me"
            className="text-4xl md:text-5xl font-bold mb-6 font-higherJump leading-loose tracking-widest text-white"
          />
          <p className="text-lg max-w-2xl mx-auto text-white">
            Have a question or need more info? Drop me a message
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-customGray p-8 md:p-12 rounded-2xl border-brightYellow border-2 shadow-lg max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />

            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              required
            />

            <TextAreaField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              rows={6}
              required
            />

            <div className="flex justify-center m-6">
              {!captchaError && RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  onError={handleCaptchaError}
                  size="normal"
                  theme="dark"
                />
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <p className="text-red-500 mb-3">
                    {!RECAPTCHA_SITE_KEY ? 'reCAPTCHA configuration missing' : 'reCAPTCHA is currently unavailable'}
                  </p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="text-limeGreen hover:text-hotPink transition-colors duration-300 underline"
                  >
                    Refresh Page
                  </button>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-full-colour w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </motion.button>
          </form>
        </motion.div>
        
        <ToastContainer />
      </div>
    </section>
  );
};

export default ContactForm;
