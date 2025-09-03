import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
  };

  const handleCustomise = () => {
    setShowDetails(!showDetails);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-customGray/95 backdrop-blur-sm border-t border-gray-600 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Cookie Info */}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">
                🍪 We use cookies
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, provide
                personalised content and analyse our traffic. By clicking
                "Accept All&quot;, you consent to our use of cookies.{" "}
                <a
                  href="/docs/LMW_fitness_Website_Policies.docx"
                  className="text-brightYellow hover:text-limeGreen underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </p>

              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-3 text-sm"
                >
                  <div className="bg-customGray/50 p-3 rounded-lg">
                    <h4 className="text-limeGreen font-medium mb-1">
                      Necessary Cookies
                    </h4>
                    <p className="text-gray-400">
                      Essential for the website to function properly. These
                      cannot be disabled.
                    </p>
                  </div>
                  <div className="bg-customGray/50 p-3 rounded-lg">
                    <h4 className="text-brightYellow font-medium mb-1">
                      Analytics Cookies
                    </h4>
                    <p className="text-gray-400">
                      Help us understand how visitors interact with our website
                      by collecting anonymous information.
                    </p>
                  </div>
                  <div className="bg-customGray/50 p-3 rounded-lg">
                    <h4 className="text-hotPink font-medium mb-1">
                      Marketing Cookies
                    </h4>
                    <p className="text-gray-400">
                      Used to track visitors across websites to display relevant
                      advertisements.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
              <button
                onClick={handleCustomise}
                className="px-4 py-2 text-brightYellow hover:text-white border border-brightYellow hover:bg-brightYellow/20 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                {showDetails ? "Hide Details" : "Customise"}
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Necessary Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 bg-limeGreen hover:bg-limeGreen/80 text-customGray rounded-lg transition-all duration-200 text-sm font-bold"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
