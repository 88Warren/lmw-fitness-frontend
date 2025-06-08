import { useState } from 'react';
import { InputField } from "../../../controllers/forms/formFields";

const NewsletterSignup = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // console.log("Newsletter Signup Email:", newsletterEmail);
    alert("Thank you for subscribing!"); 
    setNewsletterEmail("");
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
            />
        </div>

        <button
          type="submit"
          className="btn-subscribe w-full"
        >
          Subscribe Now
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;