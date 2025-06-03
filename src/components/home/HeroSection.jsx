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
        data-oid="hsmvh5c"
      >
        <div className="max-w-7xl mx-auto px-0 md:px-8" data-oid="eg7s1vx">
          <div
            className="text-white text-center bg-black/2 md:bg-black/40 p-8 rounded-xl shadow-lg"
            data-oid="j-4g.4i"
          >
            <h1
              className="font-higherJump text-4xl md:text-5xl font-bold leading-loose md:leading-loose"
              data-oid="ly:i2m:"
            >
              Get{" "}
              <span className="m" data-oid="l2vum6o">
                Fit
              </span>{" "}
              on Your <br className="hidden md:block" data-oid="-zw2882"></br>{" "}
              Schedu
              <span className="l" data-oid="e101uwp">
                l
              </span>
              e
            </h1>
            <p
              className="font-titillium text-xl md:text-2xl mt-4 tracking-wide leading-loose"
              data-oid="ffhcp11"
            >
              Online personal training tailored just for you.{" "}
              <br className="hidden md:block" data-oid="0ypxigi" />
            </p>
            <HashLink
              to="/#Contact"
              className="btn-primary mt-4 block text-center"
              data-oid="xtuts:s"
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
