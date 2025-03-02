import React from 'react'
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <>
        {/* Pricing Section */}
        <section id="Pricing" className="py-16 px-6 bg-gray-100">
            <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-higherJump text-black mb-10">Choose Your P<span className="l">l</span>an</h2>
            <p className="text-lg text-customGray mb-10">
            Whether you're looking for a fitness package or a tailored coaching programme
            < br />I have the perfect solution to support your fitness journey.
            </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                

                    {/* Basic Training Programs */}
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Basic 30-day programme</h3>
                        <p className="text-lg font-semibold text-limeGreen mb-4">£50 (One-off fee)</p>
                        <ul className="text-customGray text-left mb-6 space-y-2">
                            <li>✔ Starting fitness test</li>
                            <li>✔ Measurement guide</li>
                            <li>✔ 30-day fitness journal</li>
                            <li>✔ 30 x daily advice & support emails</li>
                            <li>✔ 30 x daily videos</li>
                            <li>✔ Finishing fitness test</li>
                        </ul>
                        <button className="btn-primary w-full">Sign up</button>
                    </div>

                    {/* Advanced Training Programs */}
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Advanced 30-day programme</h3>
                        <p className="text-lg font-semibold text-limeGreen mb-4">£65 (One-off fee)</p>
                        <ul className="text-customGray text-left mb-6 space-y-2">
                            <li>✔ Starting fitness test</li>
                            <li>✔ Measurement guide</li>
                            <li>✔ 30-day fitness journal</li>
                            <li>✔ 30 x advanced level daily advice & support emails</li>
                            <li>✔ 30 x advanced level daily videos</li>
                            <li>✔ Finishing fitness test</li>
                        </ul>
                        <button className="btn-primary w-full">Sign up</button>
                    </div>

                    {/* Basic Coaching Plan */}
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Tailored <br />Coaching</h3>
                        <p className="text-lg font-semibold text-limeGreen mb-4">£250 per month</p>
                        <ul className="text-customGray text-left mb-6 space-y-2">
                            <li>✔ Weekly Check-ins</li>
                            <li>✔ Tailored workout plan (updated monthly)</li>
                            <li>✔ Habit & mindset coaching</li>
                            <li>✔ Weekly habit challenges</li>
                            <li>✔ Daily motivational checklist</li>
                            <li>✔ Message Support & Progress Adjustments</li>
                           
                        </ul>
                        <button className="btn-primary w-full">Sign Up</button>
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
                <div className="mt-16 p-12 bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white rounded-lg shadow-lg">
                    <h3 className="text-4xl font-bold text-center mb-10">Bonus Resources</h3>

                    {/* Flex container for cards */}
                    <div className="flex flex-col md:flex-row justify-center gap-10">

                        {/* Blog Section */}
                        <div className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md">
                            <h4 className="text-xl font-semibold text-customGray mb-6">
                                Fortnightly fitness & nutrition blog (Free)
                            </h4>
                            <p className="text-lg text-customGray mb-4">
                            Get expert tips straight to your inbox:
                            </p>
                            <ul className="text-lg space-y-2 mb-4">
                                <li>✔ <strong>Fitness & nutrition advice</strong></li>
                                <li>✔ <strong>Expert insights & tips</strong></li>
                                <li>✔ <strong>Exclusive content for subscribers</strong></li>
                                <li>✔ <strong>Weekly motivation</strong> to stay on track</li>
                                <li>✔ <strong>Goal setting techniques</strong> for success</li>
                            </ul>
                            <div className="flex justify-center">
                                <Link to="/blog" className="btn-primary mb-2">Subscribe Now</Link>
                            </div>
                        </div>

                        {/* Standalone Package */}
                        <div className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md">
                            <h4 className="text-xl font-semibold text-customGray mb-6">
                            Ultimate habit & mindset package (£25)
                            </h4>
                            <p className="text-lg text-customGray mb-4">Get instant access to:</p>
                                <ul className="text-lg space-y-2 mb-4">
                                    <li>✔ <strong>Habit building worksheet</strong></li>
                                    <li>✔ <strong>Mindset coaching guide</strong></li>
                                    <li>✔ <strong>7 Day habit challenge</strong></li>
                                    <li>✔ <strong>Daily motivation & productivity checklist</strong></li>
                                    <li>✔ <span className="font-bold">£20 off</span> any package purchased within 30 days</li>
                                </ul>
                            <div className="flex justify-center">
                                <Link to="/purchase-bonus-package" className="btn-primary">Buy Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Pricing