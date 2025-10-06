import { useEffect } from 'react';
import useAnalytics from '../../../hooks/useAnalytics';

const NewsletterSignup = () => {
  const { trackNewsletterSignup } = useAnalytics();
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

    // Listen for successful newsletter signup
    const handleFormSubmit = (e) => {
      if (e.target && e.target.id === 'sib-form') {
        // Track newsletter signup when form is submitted
        trackNewsletterSignup();
      }
    };

    // Add event listener for form submissions
    document.addEventListener('submit', handleFormSubmit);

    return () => {
      const scriptToRemove = document.getElementById(brevoScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, [trackNewsletterSignup]); 

  return (
    <div className="bg-customGray backdrop-blur-sm rounded-xl py-6 border border-logoGray">
      {/* Title for the newsletter section */}
      <h3 className="text-lg font-higherJump text-customWhite mb-2 text-center leading-loose tracking-wide">
        Stay Updated
      </h3>

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

          <div id="sib-container" className="sib-container--medium sib-container--vertical" style={{ textAlign:'center', backgroundColor:'rgba(42,50,65,1)', borderRadius:'7px', borderWidth:'0px', borderStyle:'none', direction:'ltr', marginBottom:'0px' }}>
            {/* Introductory paragraph for the form */}
            <p className="text-sm text-customWhite font-titillium text-center mb-4 leading-tight">
              Get the latest fitness tips and exclusive content delivered to your inbox.
            </p>

            {/* The actual HTML form */}
            <form id="sib-form" method="POST" action="https://f9f46221.sibforms.com/serve/MUIFAIWCsK6dmKethzit7GFp1Rs7KwlwKPdCqE96r68cyjuwMBK0MxnRoTHKJTZG1sI_cGZWhfn1R1n7X9vZ3-Ex1p6CR4CRiI_7PT1sgi-8cOQE2cY6n9RRFG9e-3uUdbuvdU78aMKDpt5EPWzMS5lLnWJmXRigoewuyg1fAemOmx9JN08cUGgJT4aQXhCUswmwlsyB5Jq-JHRf" data-type="subscription">
              <div className="flex justify-center mb-6 mx-2 md:mx-0">
                {/* Email input field */}
                <input
                  className="w-full p-3 rounded-lg border border-logoGray bg-white text-customGray font-titillium input" 
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
              
              <div className="flex justify-center mx-2 md:mx-0">
                {/* Submit button */}
                <button
                  className="btn-subscribe w-full flex justify-center items-center"
                  form="sib-form"
                  type="submit"
                >
                  <svg className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512">
                    <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                  </svg>
                  SUBSCRIBE
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
  );
};

export default NewsletterSignup;