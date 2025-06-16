import { useEffect } from 'react';

const NewsletterSignup = () => {
  useEffect(() => {
    // Load Brevo form styles
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: block;
        font-family: Roboto;
        src: url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/7529907e9eaf8ebb5220c5f9850e3811.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/25c678feafdc175a70922a116c9be3e7.woff) format("woff")
      }
      @font-face {
        font-display: fallback;
        font-family: Roboto;
        font-weight: 600;
        src: url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/6e9caeeafb1f3491be3e32744bc30440.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/71501f0d8d5aa95960f6475d5487d4c2.woff) format("woff")
      }
      @font-face {
        font-display: fallback;
        font-family: Roboto;
        font-weight: 700;
        src: url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/3ef7cf158f310cf752d5ad08cd0e7e60.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/ece3a1d82f18b60bcce0211725c476aa.woff) format("woff")
      }
      #sib-container input:-ms-input-placeholder {
        text-align: left;
        font-family: Helvetica, sans-serif;
        color: #c0ccda;
      }
      #sib-container input::placeholder {
        text-align: left;
        font-family: Helvetica, sans-serif;
        color: #c0ccda;
      }
      #sib-container textarea::placeholder {
        text-align: left;
        font-family: Helvetica, sans-serif;
        color: #c0ccda;
      }
      #sib-container a {
        text-decoration: underline;
        color: #2BB2FC;
      }
    `;
    document.head.appendChild(style);

    // Load Brevo form script
    const script = document.createElement('script');
    script.src = 'https://sibforms.com/forms/end-form/build/main.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-customGray backdrop-blur-sm rounded-xl p-6 border border-logoGray">
      <div className="sib-form" style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
        <div id="sib-form-container" className="sib-form-container">
          <div id="error-message" className="sib-form-message-panel" style={{ display: 'none', fontSize: '16px', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', color: '#661d1d', backgroundColor: '#ffeded', borderRadius: '3px', borderColor: '#ff4949', maxWidth: '540px' }}>
            <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
              <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
              </svg>
              <span className="sib-form-message-panel__inner-text">
                Your subscription could not be saved. Please try again.
              </span>
            </div>
          </div>
          <div id="success-message" className="sib-form-message-panel" style={{ display: 'none', fontSize: '16px', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', color: '#085229', backgroundColor: '#e7faf0', borderRadius: '3px', borderColor: '#13ce66', maxWidth: '540px' }}>
            <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
              <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
              </svg>
              <span className="sib-form-message-panel__inner-text">
                Your subscription has been successful.
              </span>
            </div>
          </div>
          <div id="sib-container" className="sib-container--large sib-container--vertical" style={{ textAlign: 'center', backgroundColor: 'transparent', maxWidth: '540px', borderRadius: '3px', borderWidth: '0px' }}>
            <form id="sib-form" method="POST" action="https://f9f46221.sibforms.com/serve/MUIFAHSy0wIMSASQbj14cTg63rvIzDADIyTxUbVBFHc7BRPhcrxSrdWef5nBS4ZfbqCuFPbrkmI23jq7hipJMbT3CoAZ70-ZOQr55d43fcZ7Nr-WdD-OzKU3T5nOyRx2AaOqG5ts4Hb5jUgwgz3o8hpt-shTrNLrbhd_ILfcCqDUurW0CtGD4imq2ohCJdnEbZPu1IBl1yNPEtSH" data-type="subscription">
              <div style={{ padding: '8px 0' }}>
                <div className="sib-form-block" style={{ fontSize: '24px', textAlign: 'center', fontFamily: 'higherJump, sans-serif', color: '#ffffff', backgroundColor: 'transparent' }}>
                  <p>Stay Updated</p>
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <div className="sib-form-block" style={{ fontSize: '14px', textAlign: 'center', fontFamily: 'titillium, sans-serif', color: '#ffffff', backgroundColor: 'transparent' }}>
                  <div className="sib-text-form-block">
                    <p>Get the latest fitness tips and exclusive content delivered to your inbox.</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <div className="sib-input sib-form-block">
                  <div className="form__entry entry_block">
                    <div className="form__label-row">
                      <div className="entry__field">
                        <input 
                          className="input" 
                          type="text" 
                          id="EMAIL" 
                          name="EMAIL" 
                          autoComplete="off" 
                          placeholder="Your email address" 
                          data-required="true" 
                          required 
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #4a5568',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontFamily: 'titillium, sans-serif'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <div className="sib-form-block" style={{ textAlign: 'center' }}>
                  <button 
                    className="btn-subscribe w-full" 
                    form="sib-form" 
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#ffcf00',
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'titillium, sans-serif',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
              <input type="text" name="email_address_check" value="" className="input--hidden" />
              <input type="hidden" name="locale" value="en" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;