import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { getEnvVar } from "../../utils/config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputField, TextAreaField } from "../../controllers/forms/formFields"; 
import { showToast } from "../../utils/toastUtil"; 

const RECAPTCHA_KEY = getEnvVar("VITE_RECAPTCHA_SITE_KEY");
const BACKEND_URL = getEnvVar("VITE_BACKEND_URL");

const ContactForm = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaError = () => {
    setCaptchaError(true);
    showToast("warn", "⚠️ reCAPTCHA failed to load. Please try refreshing the page.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const maxRetries = 3;
    let retryCount = 0;

    if (!formData.name || !formData.email || !formData.message) {
      showToast("warn", "⚠️ Please fill out all fields!");
      setIsLoading(false);
      return;
    }

    if (!captchaValue && !captchaError) {
      showToast("warn", "❌ Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    if (!navigator.onLine) {
      showToast("error", "❌ No internet connection. Please check your connection and try again.");
      setIsLoading(false);
      return;
    }

    const submitWithRetry = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/contact`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ ...formData, token: captchaValue }), 
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res;
      } catch (error) {
        if (!navigator.onLine) {
          throw new Error("No internet connection");
        }
        
        if (retryCount < maxRetries) {
          retryCount++;
          // console.log(`Retrying... Attempt ${retryCount} of ${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return submitWithRetry();
        }
        throw error;
      }
    };

    try {
      const res = await submitWithRetry();
      
      if (res.ok) {
        showToast("success", "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setCaptchaValue(null);
        recaptchaRef.current.reset();
      } else {
        showToast("error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.message === "No internet connection") {
        showToast("error", "❌ No internet connection. Please check your connection and try again.");
      } else {
        showToast("error", "❌ An error occurred. Please try again later.");
      }
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-higherJump text-center mb-4 text-black leading-relaxed md:leading-loose">
          Get In Touch <span className="w">w</span>ith <span className="m">m</span>e
        </h2>
        <p className="text-lg text-center text-customGray mb-6 md:mb-8">
          Have a question or need more info? Drop me a message here:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <InputField label="Name:" type="text" name="name" value={formData.name} onChange={handleChange} />
          <InputField label="Email:" type="email" name="email" value={formData.email} onChange={handleChange} />
          <TextAreaField label="Message:" name="message" value={formData.message} onChange={handleChange} />

          <div className="flex justify-center mb-4">
            {!captchaError ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_KEY}
                onChange={handleCaptchaChange}
                onError={handleCaptchaError}
                size="normal"
              />
            ) : (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-red-500 mb-2">reCAPTCHA is currently unavailable</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className='w-full py-2 md:py-3 text-white font-bold rounded-lg bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink hover:from-hotPink hover:via-brightYellow hover:to-limeGreen transition-all duration-300'>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
};

export default ContactForm;