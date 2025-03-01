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
            Whether you're looking for ongoing coaching or a structured program, we have the perfect plan for your fitness journey.
            </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Coaching Plan */}
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Basic Coaching</h3>
                        <p className="text-lg font-semibold text-limeGreen mb-4">£150/month</p>
                        <ul className="text-customGray text-left mb-6 space-y-2">
                            <li>✔ 2 x Monthly Check-ins</li>
                            <li>✔ Tailored Workout Plan (Updated Monthly)</li>
                            <li>✔ Habit Coaching & Email Support</li>
                        </ul>
                        <button className="btn-primary w-full">Sign Up</button>
                    </div>

                    {/* Premium Coaching Plan */}
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Premium Coaching</h3>
                        <p className="text-lg font-semibold text-limeGreen mb-4">£350/month</p>
                        <ul className="text-customGray text-left mb-6 space-y-2">
                            <li>✔ 1 x Weekly Check-ins</li>
                            <li>✔ Personalized Training & Nutrition Guide</li>
                            <li>✔ Message Support & Progress Adjustments</li>
                        </ul>
                        <button className="btn-primary w-full">Sign Up</button>
                    </div>

                    {/* Training Programs */}
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Training Program</h3>
                        <p className="text-lg font-semibold text-limeGreen mb-4">£50/£150 (One-time fee)</p>
                        <ul className="text-customGray text-left mb-6 space-y-2">
                        <li><strong>Basic:</strong> 8-Week Workout Plan, Video Demos, PDF Guide</li>
                        <li><strong>Premium:</strong> Basic + Nutrition Support, Monthly Check-ins, Progress Tracking</li>
                        </ul>
                        <button className="btn-primary w-full">Learn More</button>
                    </div>
                </div>

                {/* Bonus Resources */}
                <div className="mt-16 p-12 bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white rounded-lg shadow-lg">
                    <h3 className="text-4xl font-bold text-center mb-10">Bonus Resources</h3>

                    {/* Flex container for cards */}
                    <div className="flex flex-col md:flex-row justify-center gap-10">

                        {/* Blog Section */}
                        <div className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md">
                            <h4 className="text-xl font-semibold text-customGray mb-6">
                                Weekly Fitness & Nutrition Blog (Free)
                            </h4>
                            <p className="text-lg text-customGray mb-4">
                            Get expert tips straight to your inbox:
                            </p>
                            <ul className="text-lg space-y-2 mb-4">
                                <li>✔ <strong>Fitness & Nutrition Advice</strong></li>
                                <li>✔ <strong>Expert Insights & Tips</strong></li>
                                <li>✔ <strong>Exclusive Content for Subscribers</strong></li>
                                <li>✔ <strong>Weekly Motivation</strong> to stay on track</li>
                                <li>✔ <strong>Goal Setting Techniques</strong> for success</li>
                            </ul>
                            <div className="flex justify-center">
                                <Link to="/blog" className="btn-primary mb-2">Subscribe Now</Link>
                            </div>
                        </div>

                        {/* Standalone Package */}
                        <div className="bg-white md:w-1/2 p-6 rounded-lg text-customGray shadow-md">
                            <h4 className="text-xl font-semibold text-customGray mb-6">
                            Ultimate Habit & Mindset Package (£20)
                            </h4>
                            <p className="text-lg text-customGray mb-4">Get instant access to:</p>
                                <ul className="text-lg space-y-2 mb-4">
                                    <li>✔ <strong>Habit Building Worksheet</strong></li>
                                    <li>✔ <strong>Mindset Coaching Guide</strong></li>
                                    <li>✔ <strong>7 Day Habit Challenge</strong></li>
                                    <li>✔ <strong>Daily Motivation & Productivity Checklist</strong></li>
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