import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyJustPeek from '../components/WhyJustPeek';
import TrustGuarantee from '../components/TrustGuarantee';
import Security from '../components/Security';
import AimbotSection from '../components/AimbotSection';
import EspSection from '../components/EspSection';
import PremiumExperience from '../components/PremiumExperience';
import ComingSoon from '../components/ComingSoon';
import Pricing from '../components/Pricing';
import EmailCapture from '../components/EmailCapture';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <WhyJustPeek />
      <TrustGuarantee />
      <Security />
      <AimbotSection />
      <EspSection />
      <PremiumExperience />
      <ComingSoon />
      <Pricing />
      <EmailCapture />
      <Footer />
    </div>
  );
};

export default Home;
