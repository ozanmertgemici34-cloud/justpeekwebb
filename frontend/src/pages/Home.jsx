import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Security from '../components/Security';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import EmailCapture from '../components/EmailCapture';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      <Security />
      <Testimonials language={language} />
      <Pricing />
      <EmailCapture />
      <Footer />
    </div>
  );
};

export default Home;
