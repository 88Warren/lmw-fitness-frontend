import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../utils/config";

const ContactForm = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [status, setStatus] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all fields');
      return;
    }

    // if (!captchaValue) {
    //   setStatus("❌ Please complete the reCAPTCHA.");
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ ...form, token: captchaValue }), 
        body: JSON.stringify(formData),
      });

      console.log("Response from server:", res.status, res.statusText);

      if (res.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

      const handleCaptchaChange = (value) => {
          setCaptchaValue(value);
          console.log("Captcha value:", value);
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
          <div>
            <label className="block text-black font-bold mb-2" htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
              required
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2" htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
              required
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2" htmlFor="message">Message:</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
              rows="5"
              required
            ></textarea>
          </div>

          {/* <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          /> */}

          <button
            type="submit"
            disabled={isLoading}
            className='w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink hover:from-hotPink hover:via-brightYellow hover:to-limeGreen transition-all duration-300'>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
          {status && <div>{status}</div>}
        </form>

        {status && <p className="mt-6 text-center text-lg font-bold">{status}</p>}
      </div>
    </section>
  );
};

export default ContactForm;