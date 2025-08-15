import { useEffect } from 'react';
import { motion } from "framer-motion";
import { useCart } from '../../context/CartContext'; 
import { BEGINNER_PRICE_ID, ADVANCED_PRICE_ID, TAILORED_COACHING_PRICE_ID, ULTIMATE_MINDSET_PACKAGE_PRICE_ID } from '../../utils/config';
import { useNavigate } from 'react-router-dom'; 

const Pricing = () => {
  const { addItemToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const bonusVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.3 } },
  };

  useEffect(() => {
    const brevoScriptId = 'brevo-form-main-script';
    const existingBrevoScript = document.getElementById(brevoScriptId);

    if (existingBrevoScript) {
      existingBrevoScript.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://sibforms.com/forms/end-form/build/main.js';
    script.async = true;
    script.defer = true;
    script.id = brevoScriptId;
    document.body.appendChild(script);

    window.REQUIRED_CODE_ERROR_MESSAGE = window.REQUIRED_CODE_ERROR_MESSAGE || 'Please choose a country code';
    window.LOCALE = window.LOCALE || 'en';
    window.EMAIL_INVALID_MESSAGE = window.EMAIL_INVALID_MESSAGE || "The information provided is invalid. Please review the field format and try again.";
    window.SMS_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE || "The information provided is invalid. Please review the field format and try again.";
    window.REQUIRED_ERROR_MESSAGE = window.REQUIRED_ERROR_MESSAGE || "This field cannot be left blank. ";
    window.GENERIC_INVALID_MESSAGE = window.GENERIC_INVALID_MESSAGE || "The information provided is invalid. Please review the field format and try again.";
    window.translation = window.translation || {
      common: {
        selectedList: '{quantity} list selected',
        selectedLists: '{quantity} lists selected',
        selectedOption: '{quantity} selected',
        selectedOptions: '{quantity} selected',
      }
    };
    window.AUTOHIDE = typeof window.AUTOHIDE === 'boolean' ? window.AUTOHIDE : Boolean(0);

    return () => {
      const scriptToRemove = document.getElementById(brevoScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  const isItemInCart = (priceId) => {
    if (!cartItems) {
      return false;
    }
    return cartItems.some(item => item.priceId === priceId);
  };

  return (
    <>
      {/* Pricing Section */}
      <section
        id="Pricing"
        className="py-16 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-higherJump text-black/80 mb-10 leading-loose" 
          >
            Choose Your P<span className="l">l</span>an
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-customGray max-w-3xl mx-auto mb-12"
          >
            Whether you are looking for a focused fitness package or a tailored
            coaching program,
            <br className="hidden md:block" /> I have the perfect solution to
            support your fitness journey.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Beginner Training Programs */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="p-8 bg-white border border-brightYellow rounded-xl flex flex-col"
            >
              <h3 className="text-2xl font-bold text-black mb-4 min-h-[60px] flex items-center justify-center text-center">
                Beginner 30-day programme
              </h3>
              <p className="text-xl font-bold text-limeGreen mb-6">
                £50 <span className="text-base font-normal">One-off fee</span>
              </p>
              <ul className="text-customGray text-left mb-8 space-y-3 text-base flex-grow">
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Starting fitness test
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Measurement guide
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  30-day fitness journal
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  30 x daily advice & support emails
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  30 x daily videos
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Finishing fitness test
                </li>
              </ul>
              {isItemInCart(BEGINNER_PRICE_ID) ? (
                  <button 
                      className="bg-white w-full py-3 mt-auto font-bold border border-brightYellow hover:bg-brightYellow"
                      onClick={() => navigate('/cart')}
                  >
                      View Basket
                  </button>
              ) : (
                  <button 
                      className="btn-subscribe w-full py-3 mt-auto"
                      onClick={() => addItemToCart({ name: 'Beginner 30-day programme', priceId: `${BEGINNER_PRICE_ID}`, price: 50 })}
                  >
                      Add to Cart
                  </button>
              )}
            </motion.div>

            {/* Advanced Training Programs */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="p-8 bg-white border border-brightYellow rounded-xl relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 bg-hotPink text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 min-h-[60px] flex items-center justify-center text-center">
                Advanced 30-day programme
              </h3>
              <p className="text-xl font-bold text-limeGreen mb-6">
                £65 <span className="text-base font-normal">One-off fee</span>
              </p>
              <ul className="text-customGray text-left mb-8 space-y-3 text-base flex-grow">
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Starting fitness test
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Measurement guide
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  30-day fitness journal
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  30 x advanced daily advice & support emails
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  30 x advanced daily videos
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Finishing fitness test
                </li>
              </ul>
              {isItemInCart(ADVANCED_PRICE_ID) ? (
              <button 
                className="bg-white w-full py-3 mt-auto font-bold border border-brightYellow hover:bg-brightYellow"
                onClick={() => navigate('/cart')}
            >
                View Basket
            </button>
            ) : (
              <button 
                  className="btn-subscribe w-full py-3 mt-auto"
                  onClick={() => addItemToCart({ name: 'Advanced 30-day programme', priceId: `${ADVANCED_PRICE_ID}`, price: 65 })}
              >
                  Add to Cart
              </button>
          )}
            </motion.div>

            {/* Tailored Coaching Plan */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="p-8 bg-white border border-brightYellow rounded-xl flex flex-col"
            >
              <h3 className="text-2xl font-bold text-black mb-4 min-h-[60px] flex items-center justify-center text-center">
                Tailored <br /> Coaching
              </h3>
              <p className="text-xl font-bold text-limeGreen mb-6">
                £250 <span className="text-base font-normal">per month</span>
              </p>
              <ul className="text-customGray text-left mb-8 space-y-3 text-base flex-grow">
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Weekly Check-ins
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Tailored workout plan (updated monthly)
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Habit & mindset coaching
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Weekly habit challenges
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Daily motivational checklist
                </li>
                <li>
                  <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                  Message Support & Progress Adjustments
                </li>
              </ul>
              {isItemInCart(TAILORED_COACHING_PRICE_ID) ? (
                <button 
                    className="bg-white w-full py-3 mt-auto font-bold border border-brightYellow hover:bg-brightYellow"
                    onClick={() => navigate('/cart')}
                >
                    View Basket
                </button>
                ) : (
                <button 
                  className="btn-subscribe w-full py-3 mt-auto"
                  onClick={() => addItemToCart({ name: 'Tailored Coaching Plan', priceId: `${TAILORED_COACHING_PRICE_ID}`, price: 250 })}
                  >
                     Add to Cart
                  </button>
                )}
            </motion.div>
          </div>

          {/* Bonus Resources */}
          <motion.div
            variants={bonusVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-20 p-8 md:p-14 bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white rounded-2xl shadow-2xl"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-10">
              Unlock More Resources
            </h3>

            {/* Flex container for cards */}
            <div className="flex flex-col md:flex-row justify-center gap-10">
              {/* Blog Section */}
              <div className="bg-white md:w-1/2 p-8 rounded-xl text-gray-700 shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-700 mb-4">
                    Fortnightly Fitness & Nutrition Blog (Free)
                  </h4>
                  <p className="text-lg text-gray-700 mb-6">
                    Get expert tips straight to your inbox:
                  </p>
                  <ul className="text-lg space-y-3 mb-8">
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Fitness & nutrition advice</strong>
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Expert insights & tips</strong>
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Exclusive content for subscribers</strong>
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Weekly motivation</strong> to stay on track
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Goal setting techniques</strong> for success
                    </li>
                  </ul>
                </div>

                {/* Newsletter Signup Form */}
                <div className="mt-auto">
                  {/* Main Brevo form container */}
                  <div className="sib-form" style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
                    
                    <div id="sib-form-container" className="sib-form-container">
                      {/* Error Message Panel */}
                      <div id="error-message" className="sib-form-message-panel hidden" style={{ fontSize:'14px', textAlign:'center', fontFamily:'Helvetica, sans-serif', color:'#661d1d', backgroundColor:'#ffeded', borderRadius:'5px', padding:'8px', marginBottom:'12px' }}>
                        <span className="sib-form-message-panel__inner-text">
                          Your subscription could not be saved. Please try again.
                        </span>
                      </div>
                      {/* Success Message Panel */}
                      <div id="success-message" className="sib-form-message-panel hidden" style={{ fontSize:'14px', textAlign:'center', fontFamily:'Helvetica, sans-serif', color:'#085229', backgroundColor:'#e7faf0', borderRadius:'5px', padding:'8px', marginBottom:'12px' }}>
                        <span className="sib-form-message-panel__inner-text">
                          Your subscription has been successful.
                        </span>
                      </div>


                      <div id="sib-container" className="sib-container--medium sib-container--vertical" style={{ textAlign:'center', backgroundColor:'transparent', borderRadius:'7px', borderWidth:'0px', borderStyle:'none', direction:'ltr', marginBottom:'0px' }}>

                        {/* The actual HTML form */}
                        <form id="sib-form" method="POST" action="https://f9f46221.sibforms.com/serve/MUIFAIWCsK6dmKethzit7GFp1Rs7KwlwKPdCqE96r68cyjuwMBK0MxnRoTHKJTZG1sI_cGZWhfn1R1n7X9vZ3-Ex1p6CR4CRiI_7PT1sgi-8cOQE2cY6n9RRFG9e-3uUdbuvdU78aMKDpt5EPWzMS5lLnWJmXRigoewuyg1fAemOmx9JN08cUGgJT4aQXhCUswmwlsyB5Jq-JHRf" data-type="subscription">

                        {/* Container for the email input */}
                          <div className="flex justify-center mb-4"> 
                            <input
                              className="flex-1 p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-limeGreen focus:border-transparent"
                              type="text"
                              id="EMAIL"
                              name="EMAIL"
                              autoComplete="off"
                              placeholder="Your email address"
                              data-required="true"
                              required
                            />
                          </div>
                          {/* Error label for input validation */}
                          <label className="entry__error entry__error--primary text-red-600 text-sm mt-1 block text-center"></label>
                          
                          {/* Container for the button */}
                          <div className="flex justify-center">
                            <button
                              className="btn-primary w-full py-3 flex justify-center items-center"
                              form="sib-form"
                              type="submit"
                            >
                              <svg className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512">
                                <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                              </svg>
                              Subscribe
                            </button>
                          </div>
                          {/* Hidden fields required by Brevo */}
                          <input type="text" name="email_address_check" value="" className="hidden" />
                          <input type="hidden" name="locale" value="en" />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standalone Package */}
              <div className="bg-white md:w-1/2 p-8 rounded-xl text-customGray shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-customGray mb-4">
                    Ultimate Habit & Mindset Package (£25)
                  </h4>
                  <p className="text-lg text-customGray mb-6">
                    Get instant access to:
                  </p>
                  <ul className="text-lg space-y-3 mb-8">
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Habit building worksheet</strong>
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Mindset coaching guide</strong>
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>7 Day habit challenge</strong>
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <strong>Daily motivation & productivity checklist</strong>
                    </li>
                    <li>
                      <span className="text-limeGreen font-bold mr-2">✔</span>{" "}
                      <span className="font-bold text-hotPink">£10 off</span>{" "}
                      any package, when purchased together
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center mt-auto">
                  {isItemInCart(ULTIMATE_MINDSET_PACKAGE_PRICE_ID) ? (
                      <button 
                        className="bg-white w-full py-3 mt-auto font-bold border border-brightYellow hover:bg-brightYellow"
                        onClick={() => navigate('/cart')}
                    >
                        View Basket
                    </button>
                ) : (
                    <button 
                      className="btn-subscribe w-full py-3 mt-auto"
                      onClick={() => addItemToCart({ name: 'Ultimate Habit & Mindset Package', priceId: `${ULTIMATE_MINDSET_PACKAGE_PRICE_ID}`, price: 25 })}
                      >
                        Add to Cart
                    </button>
                )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Pricing;