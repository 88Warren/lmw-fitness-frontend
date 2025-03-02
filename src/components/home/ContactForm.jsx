import React, { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.status === "success") {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
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
          Get In Touch <span className="w">w</span>ith <span className="m">m</span>e
        </h2>
        <p className="text-lg text-center text-customGray mb-8">
          Have a question or need more info? Drop me a message here:
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-black font-bold mb-2" htmlFor="name">
              Name:
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
              Email:
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
              Message:
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink hover:from-hotPink hover:via-brightYellow hover:to-limeGreen transition-all"
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