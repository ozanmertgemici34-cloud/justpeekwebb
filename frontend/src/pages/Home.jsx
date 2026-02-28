import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Security from '../components/Security';
import EmailCapture from '../components/EmailCapture';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      <Security />
      <EmailCapture />
      <Footer />
    </div>
  );
};

export default Home;
