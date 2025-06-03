import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <>
      {/* Pricing Section */}
      <section
        id="Pricing"
        className="py-16 px-6 bg-gray-100"
        data-oid="ffp4ejl"
      >
        <div className="max-w-5xl mx-auto text-center" data-oid="7cgf0az">
          <h2
            className="text-3xl md:text-4xl font-higherJump text-black mb-8"
            data-oid="7fze9nx"
          >
            Choose Your P
            <span className="l" data-oid="jii4_xl">
              l
            </span>
            an
          </h2>
          <p className="text-lg text-customGray mb-10" data-oid="tut__eb">
            Whether you're looking for a fitness package or a tailored coaching
            programme
            <br data-oid="em94mu7" />I have the perfect solution to support your
            fitness journey.
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            data-oid="8y0lp7m"
          >
            {/* Basic Training Programs */}
            <div
              className="p-6 bg-white border rounded-lg shadow-lg"
              data-oid="lsi7nkg"
            >
              <h3
                className="text-xl md:text-2xl font-bold text-black mb-4"
                data-oid="zwqknoi"
              >
                Basic 30-day programme
              </h3>
              <p
                className="text-lg font-semibold text-limeGreen mb-4"
                data-oid="e-qxcx2"
              >
                £50 (One-off fee)
              </p>
              <ul
                className="text-customGray text-left mb-6 space-y-2"
                data-oid="kog8rk8"
              >
                <li data-oid=":ugz3d1">✔ Starting fitness test</li>
                <li data-oid="f7d1xwl">✔ Measurement guide</li>
                <li data-oid="8m9o:yq">✔ 30-day fitness journal</li>
                <li data-oid="-0cf9jo">
                  ✔ 30 x daily advice & support emails
                </li>
                <li data-oid="mf_8rxi">✔ 30 x daily videos</li>
                <li data-oid="juso9n_">✔ Finishing fitness test</li>
              </ul>
              <button className="btn-primary w-full" data-oid=".bb91yd">
                Sign up
              </button>
            </div>

            {/* Advanced Training Programs */}
            <div
              className="p-6 bg-white border rounded-lg shadow-lg"
              data-oid="uwvwc1f"
            >
              <h3
                className="text-lg md:text-2xl font-bold text-black mb-4"
                data-oid="nv0r324"
              >
                Advanced 30-day programme
              </h3>
              <p
                className="text-lg font-semibold text-limeGreen mb-4"
                data-oid="cvp5cyf"
              >
                £65 (One-off fee)
              </p>
              <ul
                className="text-customGray text-left mb-6 space-y-2"
                data-oid="1e-7lvr"
              >
                <li data-oid="fo-tral">✔ Starting fitness test</li>
                <li data-oid="xwachye">✔ Measurement guide</li>
                <li data-oid="q9dmv0q">✔ 30-day fitness journal</li>
                <li data-oid="e1-eeh3">
                  ✔ 30 x advanced level daily advice & support emails
                </li>
                <li data-oid="7m_gs1e">✔ 30 x advanced level daily videos</li>
                <li data-oid="nruxirr">✔ Finishing fitness test</li>
              </ul>
              <button className="btn-primary w-full" data-oid=".8pxsvd">
                Sign up
              </button>
            </div>

            {/* Basic Coaching Plan */}
            <div
              className="p-6 bg-white border rounded-lg shadow-lg"
              data-oid="57o__w-"
            >
              <h3
                className="text-lg md:text-2xl font-bold text-black mb-4"
                data-oid="9g3l0p3"
              >
                Tailored <br data-oid="d_k7-32" />
                Coaching
              </h3>
              <p
                className="text-lg font-semibold text-limeGreen mb-4"
                data-oid=":t8ef2i"
              >
                £250 per month
              </p>
              <ul
                className="text-customGray text-left mb-6 space-y-2"
                data-oid="dlrwrxf"
              >
                <li data-oid="kdkq110">✔ Weekly Check-ins</li>
                <li data-oid="kec13_1">
                  ✔ Tailored workout plan (updated monthly)
                </li>
                <li data-oid="p7usptq">✔ Habit & mindset coaching</li>
                <li data-oid="7i.hvfi">✔ Weekly habit challenges</li>
                <li data-oid="eufayro">✔ Daily motivational checklist</li>
                <li data-oid="j566-jc">
                  ✔ Message Support & Progress Adjustments
                </li>
              </ul>
              <button className="btn-primary w-full" data-oid="xueoh4k">
                Sign Up
              </button>
            </div>

            {/* Premium Coaching Plan
                 <div className="p-6 bg-white border rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-black mb-4">Premium Coaching</h3>
                    <p className="text-lg font-semibold text-limeGreen mb-4">£350/month</p>
                    <ul className="text-customGray text-left mb-6 space-y-2">
                        <li>✔ 1 x Weekly Check-ins</li>
                        <li>✔ Personalized Training & Nutrition Guide</li>
                        <li>✔ Message Support & Progress Adjustments</li>
                    </ul>
                    <button className="btn-primary w-full">Sign Up</button>
                 </div> */}
          </div>

          {/* Bonus Resources */}
          <div
            className="mt-16 p-8 md:p-12 bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white rounded-lg shadow-lg"
            data-oid="i3b8zr1"
          >
            <h3
              className="text-2xl md:text-4xl font-bold text-center mb-8"
              data-oid="zq3um0j"
            >
              Bonus Resources
            </h3>

            {/* Flex container for cards */}
            <div
              className="flex flex-col md:flex-row justify-center gap-10"
              data-oid=".regk_c"
            >
              {/* Blog Section */}
              <div
                className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md"
                data-oid="ovhe_jo"
              >
                <h4
                  className="text-lg font-semibold text-customGray mb-4"
                  data-oid="5tnrw6i"
                >
                  Fortnightly fitness & nutrition blog (Free)
                </h4>
                <p className="text-lg text-customGray mb-4" data-oid="6v:s2zt">
                  Get expert tips straight to your inbox:
                </p>
                <ul className="text-lg space-y-2 mb-4" data-oid="zxsno4a">
                  <li data-oid="e.qfb0n">
                    ✔{" "}
                    <strong data-oid="c9t1_ms">
                      Fitness & nutrition advice
                    </strong>
                  </li>
                  <li data-oid="q2hkcmc">
                    ✔{" "}
                    <strong data-oid="c6tngzt">Expert insights & tips</strong>
                  </li>
                  <li data-oid="xu0x79h">
                    ✔{" "}
                    <strong data-oid="p..jd20">
                      Exclusive content for subscribers
                    </strong>
                  </li>
                  <li data-oid="7-rb728">
                    ✔ <strong data-oid="55ukw:o">Weekly motivation</strong> to
                    stay on track
                  </li>
                  <li data-oid="zm.2s88">
                    ✔{" "}
                    <strong data-oid="a6yeu0e">Goal setting techniques</strong>{" "}
                    for success
                  </li>
                </ul>
                <div className="flex justify-center" data-oid="53b44kx">
                  <Link
                    to="/blog"
                    className="btn-primary mb-2"
                    data-oid="xz9od:o"
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>

              {/* Standalone Package */}
              <div
                className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md"
                data-oid="a7chcjm"
              >
                <h4
                  className="text-lg font-semibold text-customGray mb-4"
                  data-oid=".fciv1j"
                >
                  Ultimate habit & mindset package (£25)
                </h4>
                <p className="text-lg text-customGray mb-4" data-oid="e77s-4k">
                  Get instant access to:
                </p>
                <ul className="text-lg space-y-2 mb-4" data-oid="pbrzq:9">
                  <li data-oid="tohlcxc">
                    ✔{" "}
                    <strong data-oid="nh2tdo3">Habit building worksheet</strong>
                  </li>
                  <li data-oid="_t67-rj">
                    ✔{" "}
                    <strong data-oid="avhyy18">Mindset coaching guide</strong>
                  </li>
                  <li data-oid="_-lcphn">
                    ✔ <strong data-oid="546t3fj">7 Day habit challenge</strong>
                  </li>
                  <li data-oid="dn-01y3">
                    ✔{" "}
                    <strong data-oid="1j._ypi">
                      Daily motivation & productivity checklist
                    </strong>
                  </li>
                  <li data-oid="40qn54e">
                    ✔{" "}
                    <span className="font-bold" data-oid="c-t12pl">
                      £20 off
                    </span>{" "}
                    any package purchased within 30 days
                  </li>
                </ul>
                <div className="flex justify-center" data-oid="hwgep_4">
                  <Link
                    to="/purchase-bonus-package"
                    className="btn-primary"
                    data-oid="nv895qb"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
