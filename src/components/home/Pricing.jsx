import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <>
      {/* Pricing Section */}
      <section
        id="Pricing"
        className="py-16 px-6 bg-gray-100"
        data-oid="k5a71fi"
      >
        <div className="max-w-5xl mx-auto text-center" data-oid="ln-amhh">
          <h2
            className="text-3xl md:text-4xl font-higherJump text-black mb-8"
            data-oid=".:76stm"
          >
            Choose Your P
            <span className="l" data-oid="rf6r8:5">
              l
            </span>
            an
          </h2>
          <p className="text-lg text-customGray mb-10" data-oid="ut8wo1u">
            Whether you're looking for a fitness package or a tailored coaching
            programme
            <br data-oid="7ouwrne" />I have the perfect solution to support your
            fitness journey.
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            data-oid="67wtvoa"
          >
            {/* Basic Training Programs */}
            <div
              className="p-6 bg-white border rounded-lg shadow-lg"
              data-oid="lrzn:7t"
            >
              <h3
                className="text-xl md:text-2xl font-bold text-black mb-4"
                data-oid="iof7y_m"
              >
                Basic 30-day programme
              </h3>
              <p
                className="text-lg font-semibold text-limeGreen mb-4"
                data-oid=":xm9-wa"
              >
                £50 (One-off fee)
              </p>
              <ul
                className="text-customGray text-left mb-6 space-y-2"
                data-oid="k9z6zhl"
              >
                <li data-oid="ku_2fp0">✔ Starting fitness test</li>
                <li data-oid=":zo-ygp">✔ Measurement guide</li>
                <li data-oid="7:s3inp">✔ 30-day fitness journal</li>
                <li data-oid="jznd7nx">
                  ✔ 30 x daily advice & support emails
                </li>
                <li data-oid="s:ufnuu">✔ 30 x daily videos</li>
                <li data-oid="nct13vk">✔ Finishing fitness test</li>
              </ul>
              <button className="btn-primary w-full" data-oid="3dsy7vz">
                Sign up
              </button>
            </div>

            {/* Advanced Training Programs */}
            <div
              className="p-6 bg-white border rounded-lg shadow-lg"
              data-oid="4xsk7ym"
            >
              <h3
                className="text-lg md:text-2xl font-bold text-black mb-4"
                data-oid="-p5z8pu"
              >
                Advanced 30-day programme
              </h3>
              <p
                className="text-lg font-semibold text-limeGreen mb-4"
                data-oid="ywofgnz"
              >
                £65 (One-off fee)
              </p>
              <ul
                className="text-customGray text-left mb-6 space-y-2"
                data-oid="8-jyasr"
              >
                <li data-oid="dntdds3">✔ Starting fitness test</li>
                <li data-oid="h4s2lwj">✔ Measurement guide</li>
                <li data-oid="k8cfgep">✔ 30-day fitness journal</li>
                <li data-oid="y:ag0-v">
                  ✔ 30 x advanced level daily advice & support emails
                </li>
                <li data-oid="ntdp.pr">✔ 30 x advanced level daily videos</li>
                <li data-oid="njxic_5">✔ Finishing fitness test</li>
              </ul>
              <button className="btn-primary w-full" data-oid="ob62jxy">
                Sign up
              </button>
            </div>

            {/* Basic Coaching Plan */}
            <div
              className="p-6 bg-white border rounded-lg shadow-lg"
              data-oid="s8zlzl5"
            >
              <h3
                className="text-lg md:text-2xl font-bold text-black mb-4"
                data-oid="whi0ja7"
              >
                Tailored <br data-oid="jwwkzx2" />
                Coaching
              </h3>
              <p
                className="text-lg font-semibold text-limeGreen mb-4"
                data-oid=":j0tkvk"
              >
                £250 per month
              </p>
              <ul
                className="text-customGray text-left mb-6 space-y-2"
                data-oid="lzulm:q"
              >
                <li data-oid="pjp5l8_">✔ Weekly Check-ins</li>
                <li data-oid="bvs2tg7">
                  ✔ Tailored workout plan (updated monthly)
                </li>
                <li data-oid="__jwkk3">✔ Habit & mindset coaching</li>
                <li data-oid="3p426ah">✔ Weekly habit challenges</li>
                <li data-oid=":mofrwi">✔ Daily motivational checklist</li>
                <li data-oid="og8dpuv">
                  ✔ Message Support & Progress Adjustments
                </li>
              </ul>
              <button className="btn-primary w-full" data-oid="iccsh_h">
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
            data-oid="t-4q18b"
          >
            <h3
              className="text-2xl md:text-4xl font-bold text-center mb-8"
              data-oid="itkqi-t"
            >
              Bonus Resources
            </h3>

            {/* Flex container for cards */}
            <div
              className="flex flex-col md:flex-row justify-center gap-10"
              data-oid="ps6bq:p"
            >
              {/* Blog Section */}
              <div
                className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md"
                data-oid="7wr.lgi"
              >
                <h4
                  className="text-lg font-semibold text-customGray mb-4"
                  data-oid="hqxy_5l"
                >
                  Fortnightly fitness & nutrition blog (Free)
                </h4>
                <p className="text-lg text-customGray mb-4" data-oid="95bigbp">
                  Get expert tips straight to your inbox:
                </p>
                <ul className="text-lg space-y-2 mb-4" data-oid="m.eixs:">
                  <li data-oid="9d3b3mb">
                    ✔{" "}
                    <strong data-oid="-we_6st">
                      Fitness & nutrition advice
                    </strong>
                  </li>
                  <li data-oid="90_f-5r">
                    ✔{" "}
                    <strong data-oid="p.gp0pp">Expert insights & tips</strong>
                  </li>
                  <li data-oid="4fe-nm-">
                    ✔{" "}
                    <strong data-oid="7efj61.">
                      Exclusive content for subscribers
                    </strong>
                  </li>
                  <li data-oid="bkntvue">
                    ✔ <strong data-oid="o17l:uw">Weekly motivation</strong> to
                    stay on track
                  </li>
                  <li data-oid="tmm0yo2">
                    ✔{" "}
                    <strong data-oid=".rovzzi">Goal setting techniques</strong>{" "}
                    for success
                  </li>
                </ul>
                <div className="flex justify-center" data-oid="4:btfsd">
                  <Link
                    to="/blog"
                    className="btn-primary mb-2"
                    data-oid="1qqgdxu"
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>

              {/* Standalone Package */}
              <div
                className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md"
                data-oid="5cqvsjr"
              >
                <h4
                  className="text-lg font-semibold text-customGray mb-4"
                  data-oid="txt6fn2"
                >
                  Ultimate habit & mindset package (£25)
                </h4>
                <p className="text-lg text-customGray mb-4" data-oid="xk-ab8x">
                  Get instant access to:
                </p>
                <ul className="text-lg space-y-2 mb-4" data-oid="6u39lad">
                  <li data-oid="kiqvyta">
                    ✔{" "}
                    <strong data-oid="9g7i8db">Habit building worksheet</strong>
                  </li>
                  <li data-oid="7d3o4pi">
                    ✔{" "}
                    <strong data-oid="10r8m5x">Mindset coaching guide</strong>
                  </li>
                  <li data-oid=".f8rmow">
                    ✔ <strong data-oid="gs2bnrf">7 Day habit challenge</strong>
                  </li>
                  <li data-oid="-w7paet">
                    ✔{" "}
                    <strong data-oid="aj2m1x8">
                      Daily motivation & productivity checklist
                    </strong>
                  </li>
                  <li data-oid="-aekz58">
                    ✔{" "}
                    <span className="font-bold" data-oid="o5u6vw1">
                      £20 off
                    </span>{" "}
                    any package purchased within 30 days
                  </li>
                </ul>
                <div className="flex justify-center" data-oid="fxd9rw:">
                  <Link
                    to="/purchase-bonus-package"
                    className="btn-primary"
                    data-oid="ujptz0p"
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
