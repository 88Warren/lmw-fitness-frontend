import { Link } from "react-router-dom";
  
const NewsletterInboxCheck = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center py-20 px-8 bg-customGray/30">
      <div className="max-w-lg bg-customGray p-8 md:p-12 rounded-2xl border-brightYellow border-2 shadow-lg text-center">
        <h1 className="font-higherJump text-4xl md:text-5xl font-bold mb-4 text-customWhite leading-loose">Thanks for signing up</h1>
        <p className="font-titillium text-xl mb-8 text-logoGray">Please check your inbox to confirm your subscription</p>
        <Link
          to="/"
          onClick={handleClick}
          className="btn-full-colour inline-block"
        >
          Back to home page
        </Link>
      </div>
    </section>
  );
};

export default NewsletterInboxCheck;