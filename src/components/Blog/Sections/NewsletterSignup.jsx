import { useState } from 'react';
import { InputField } from "../../../controllers/forms/formFields";
import { BACKEND_URL } from "../../../utils/config";
import { showToast } from "../../../utils/toastUtil";

const NewsletterSignup = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newsletterEmail) {
      showToast("warn", "Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok || response.status === 200) {
        showToast("success", data.message || "Thank you for subscribing! Please check your inbox to confirm.");
        setNewsletterEmail("");
      } else {
        showToast("error", data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      showToast("error", "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-customGray backdrop-blur-sm rounded-xl p-6 border border-logoGray">
        <h3 className="text-lg font-higherJump text-customWhite mb-6 text-center leading-loose tracking-wide">
          Stay Updated
        </h3>
        <p className="text-sm text-customWhite font-titillium mb-4 text-center">
          Get the latest fitness tips and exclusive content delivered to
          your inbox.
        </p>

      <form onSubmit={handleNewsletterSubmit} className="space-y-4">
        <div className="relative">
          <InputField
              type="email"
              name="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={isLoading}
            />
        </div>

        <button
          type="submit"
          className="btn-subscribe w-full"
          disabled={isLoading}
        >
          {isLoading ? "Subscribing..." : "Subscribe Now"}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;