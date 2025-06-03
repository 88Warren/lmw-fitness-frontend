import { HashLink } from "react-router-hash-link";
import { BACKEND_URL } from "../../utils/config";

const HeroSection = () => {
  return (
    <>
      {/* hero section */}
      <section
        id="Home"
        className="h-screen flex items-center"
        style={{
          backgroundImage: `url(${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
        data-oid="3993l24"
      >
        <div className="max-w-7xl mx-auto px-0 md:px-8" data-oid="6i8.l7d">
          <div
            className="text-white text-center bg-black/2 md:bg-black/40 p-8 rounded-xl shadow-lg"
            data-oid="hd0sd4t"
          >
            <h1
              className="font-higherJump text-4xl md:text-5xl font-bold leading-loose md:leading-loose"
              data-oid="czu.k0k"
            >
              Get{" "}
              <span className="m" data-oid="qnvi-wb">
                Fit
              </span>{" "}
              on Your <br className="hidden md:block" data-oid="yn1ul4g"></br>{" "}
              Schedu
              <span className="l" data-oid="fe1ko6b">
                l
              </span>
              e
            </h1>
            <p
              className="font-titillium text-xl md:text-2xl mt-4 tracking-wide leading-loose"
              data-oid="5r19ebi"
            >
              Online personal training tailored just for you.{" "}
              <br className="hidden md:block" data-oid="ulwjc_:" />
            </p>
            <HashLink
              to="/#Contact"
              className="btn-primary mt-4 block text-center"
              data-oid=":n6u6mw"
            >
              Get Started Today
            </HashLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
