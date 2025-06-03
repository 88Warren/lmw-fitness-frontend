import { HashLink } from "react-router-hash-link";

const Testimonials = () => {
  return (
    <>
      {/* What You Offer */}
      <section
        id="Testimonials"
        className="py-16 px-6 bg-customGray"
        data-oid="4nxvxmx"
      >
        <div className="max-w-4xl mx-auto text-center" data-oid="epd57el">
          <h2
            className="text-3xl md:text-4xl font-higherJump text-customWhite word-spacing-wide mb-12 md:mb-20"
            data-oid="tsd1tmg"
          >
            <span className="w" data-oid="ietme5g">
              W
            </span>
            hat{" "}
            <span className="text-brightYellow" data-oid="r:zlpay">
              M
            </span>
            y c
            <span className="l" data-oid="hlzpj:q">
              l
            </span>
            ients say...
          </h2>
          <p
            className="text-lg text-white leading-relaxed md:leading-loose"
            data-oid="k80utws"
          >
            <span
              className="l font-bold text-4xl md:text-5xl"
              data-oid="phbkj8."
            >
              "
            </span>
            I’ve tried all sorts of training plans over the years, but with
            Laura’s plan, I can see massive changes in my body shape and my
            mental state, feeling more positive and knowing that for once I’ve
            found a plan that is working.
            <br className="hidden md:block" data-oid="b.e0xg8" />
            Laura is energetic, fun & committed and has lots of experience with
            diets and exercise. I highly recommend her to anyone wanting to
            improve their Fitness & lose weight.
            <br className="hidden md:block" data-oid="n2nrwku" />
            Thank you Laura, for all your help. This is one plan I will be
            sticking to!
            <br className="hidden md:block" data-oid="-wvio5i" />
            <span
              className="l font-bold text-4xl md:text-5xl text-right mt-2"
              data-oid="-5fnkn0"
            >
              "
            </span>
          </p>
          <p
            className="text-lg text-white leading-relaxed text-right mt-2"
            data-oid="s_7fzcr"
          >
            <span className="m font-higherJump" data-oid="9jkp90q">
              M
            </span>
            ichelle
          </p>
          <button
            className="btn-primary mt-8 md:mt-10 w-full sm:w-auto"
            data-oid="..1whro"
          >
            <HashLink to="/#Contact" data-oid=".0sm6uv">
              Start Your Journey Today
            </HashLink>
          </button>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
