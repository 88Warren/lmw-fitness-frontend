import React from 'react'

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
                <div className="mt-16 p-6 bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink text-white rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4">🎁 Bonus Resource Package</h3>
                    <p className="text-lg mb-4">Sign up for any plan and get exclusive access to:</p>
                    <ul className="text-lg text-white text-left space-y-2">
                        <li>✔ Weekly Fitness & Nutrition Newsletter</li>
                        <li>✔ Habit-Building Worksheets</li>
                        <li>✔ Mindset Coaching for Long-Term Success</li>
                    </ul>
                </div>
            </div>
        </section>
    </>
  )
}

export default Pricing