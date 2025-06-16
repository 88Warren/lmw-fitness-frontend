import { useEffect } from 'react';

const NewsletterSignup = () => {
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

  return (
    <div className="bg-customGray backdrop-blur-sm rounded-xl p-6 border border-logoGray">
      <h3 className="text-lg font-higherJump text-customWhite mb-6 text-center leading-loose tracking-wide">
        Stay Updated
      </h3>
      
      {/* Error and Success Message Panels */}
      <div id="error-message" className="sib-form-message-panel hidden" style={{ fontSize:'14px', textAlign:'center', fontFamily:'Helvetica, sans-serif', color:'#661d1d', backgroundColor:'#ffeded', borderRadius:'5px', padding:'8px', marginBottom:'12px' }}>
        <span className="sib-form-message-panel__inner-text">
          Your subscription could not be saved. Please try again.
        </span>
      </div>
      
      <div id="success-message" className="sib-form-message-panel hidden" style={{ fontSize:'14px', textAlign:'center', fontFamily:'Helvetica, sans-serif', color:'#085229', backgroundColor:'#e7faf0', borderRadius:'5px', padding:'8px', marginBottom:'12px' }}>
        <span className="sib-form-message-panel__inner-text">
          Your subscription has been successful.
        </span>
      </div>

      <p className="text-sm text-customWhite font-titillium text-center mb-6 leading-tight">
        Get the latest fitness tips and exclusive content delivered to your inbox.
      </p>

      <form id="sib-form" method="POST" action="https://f9f46221.sibforms.com/serve/MUIFAIWCsK6dmKethzit7GFp1Rs7KwlwKPdCqE96r68cyjuwMBK0MxnRoTHKJTZG1sI_cGZWhfn1R1n7X9vZ3-Ex1p6CR4CRiI_7PT1sgi-8cOQE2cY6n9RRFG9e-3uUdbuvdU78aMKDpt5EPWzMS5lLnWJmXRigoewuyg1fAemOmx9JN08cUGgJT4aQXhCUswmwlsyB5Jq-JHRf" data-type="subscription">
        <div className="mb-6 flex justify-center">
          <input
            className="w-full p-3 rounded-lg border border-logoGray bg-white text-customGray font-titillium text-center placeholder:text-center"
            type="text"
            id="EMAIL"
            name="EMAIL"
            autoComplete="off"
            placeholder="Your email address"
            data-required="true"
            required
          />
        </div>
        <label className="entry__error entry__error--primary text-red-600 text-sm mt-1 block text-center"></label>
        
        <div className="flex justify-center">
          <button
            className="btn-subscribe w-full flex justify-center items-center"
            form="sib-form"
            type="submit"
          >
            SUBSCRIBE
          </button>
        </div>
        
        <input type="text" name="email_address_check" value="" className="hidden" />
        <input type="hidden" name="locale" value="en" />
      </form>
    </div>
  );
};

export default NewsletterSignup;
