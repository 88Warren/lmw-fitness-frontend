import { Link } from "react-router-dom";
  
const NewsletterInboxCheck = () => {

const handleClick = () => {
    window.scrollTo(0, 0);
};

  return (
    <section className="text-center flex flex-col justify-center items-center h-lvh">
        <h1 className="font-titillium text-6xl font-bold mb-4">Thanks for signing up!</h1>
        <p className="font-titillium text-xl mb-5">Please check your inbox to confirm your subscription</p>
    <Link
        to="/"
        onClick={handleClick}
        className="btn-full-colour"
      >
        Back to home page
      </Link>
    </section>
  )
}

export default NewsletterInboxCheck