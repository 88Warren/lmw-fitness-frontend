import React, { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  // const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleRecaptchaChange = (token) => {
  //   setRecaptchaToken(token);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    // if (!recaptchaToken) {
    //   setStatus("❌ Please complete the reCAPTCHA verification.");
    //   return;
    // }
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ ...form, token: recaptchaToken }),
      });
      
      const data = await res.json();
      if (data.status === "success") {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        setRecaptchaToken("");
      } else {
        setStatus("❌ Submission failed. Please try again.");
      }
    } catch (error) {
      setStatus("❌ Error: " + error.message);
    }
  };

  return (
    <section id="Contact" className="py-16 px-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-4xl font-higherJump text-center mb-6 text-black">
        Get In Touch
      </h2>
      <p className="text-lg text-center text-customGray mb-8">
        Have questions or want to start your fitness journey? Send us a message!
      </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-black font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input 
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-black font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-black font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-limeGreen"
              rows="5"
              required
            ></textarea>
          </div>

          {/* Google reCAPTCHA */}
          {/* <ReCAPTCHA
            sitekey="your-recaptcha-site-key"
            onChange={handleRecaptchaChange}
          /> */}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary"
          >
            Send Message
          </button>
        </form>
        {status && <p className="mt-6 text-center text-lg font-bold">{status}</p>}
      </div>
    </section>
  );
};

export default ContactForm;