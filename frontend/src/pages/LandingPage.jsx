import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedContent from '../components/FeaturedContent';
import VideoSection from '../components/VideoSection';
import ReviewSection from '../components/ReviewSection';
import Footer from '../components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      <Header />
      <main>
        <Hero />
        <FeaturedContent />
        <VideoSection />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
