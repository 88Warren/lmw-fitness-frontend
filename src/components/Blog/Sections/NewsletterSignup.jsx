import { useState } from 'react';
import { InputField, TextAreaField } from "../../../controllers/forms/formFields";

const NewsletterSignup = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter Signup Email:", newsletterEmail);
    alert("Thank you for subscribing!"); // Replace with a more robust notification
    setNewsletterEmail("");
  };

  return (
    <div className="bg-customGray/30 backdrop-blur-sm rounded-xl p-6 border border-logoGray/20">
        <h3 className="text-lg font-higherJump text-neutral-200 mb-6 text-center leading-loose tracking-wide">
          Stay Updated
        </h3>
        <p className="text-sm text-neutral-200 font-titillium mb-4 text-center">
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
              placeholder="youremail@example.com"
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