const NewsletterSignup = () => {
  return (
    <div className="bg-customGray backdrop-blur-sm rounded-xl p-6 border border-logoGray">
      <div className="sib-form" style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
        <div id="sib-form-container" className="sib-form-container">
          <div id="sib-container" className="sib-container--large sib-container--vertical" style={{ textAlign: 'center', backgroundColor: 'transparent', maxWidth: '540px', borderRadius: '3px', borderWidth: '0px' }}>
            <iframe
              src="https://f9f46221.sibforms.com/serve/MUIFAHSy0wIMSASQbj14cTg63rvIzDADIyTxUbVBFHc7BRPhcrxSrdWef5nBS4ZfbqCuFPbrkmI23jq7hipJMbT3CoAZ70-ZOQr55d43fcZ7Nr-WdD-OzKU3T5nOyRx2AaOqG5ts4Hb5jUgwgz3o8hpt-shTrNLrbhd_ILfcCqDUurW0CtGD4imq2ohCJdnEbZPu1IBl1yNPEtSH"
              style={{
                width: '100%',
                height: '400px',
                border: 'none',
                backgroundColor: 'transparent'
              }}
              title="Newsletter Signup"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;