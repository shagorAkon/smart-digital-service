import React from 'react';

const reviews = [
  {
    name: 'Sarah Mitchell',
    role: 'Travel Blogger',
    rating: 5,
    text: 'The best experience I have had with a digital service. The CV builder landed me a remote job effortlessly!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
  {
    name: 'James Anderson',
    role: 'Software Engineer',
    rating: 5,
    text: 'Absolutely stunning UI and flawless functionality. Booking travels and updating my resume securely in one place.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop',
  }
];

export default function ReviewSection() {
  return (
    <section className="py-24 bg-slate-900/50 relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Form Side */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">We Value Your <span className="text-emerald-400">Feedback</span></h2>
            <p className="text-slate-400 mb-10 text-lg">Leave us a message, request a callback, or simply tell us about your experience.</p>
            
            <form className="glass p-8 rounded-3xl shadow-xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-500" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-500" 
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea 
                  rows="4" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-500 resize-none" 
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button 
                type="button" 
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Testimonials Side */}
          <div className="w-full lg:w-1/2 space-y-8">
            <h3 className="text-2xl font-bold text-white mb-8">What Our Users Say</h3>
            
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl relative">
                <div className="absolute top-6 right-6 text-emerald-400">
                  <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                <p className="text-slate-300 text-lg italic mb-6">"{review.text}"</p>
                
                <div className="flex items-center gap-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover" />
                  <div>
                    <h4 className="text-white ring-1 ring-transparent font-bold">{review.name}</h4>
                    <p className="text-emerald-400 text-sm">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
