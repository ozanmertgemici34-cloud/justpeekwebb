import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Alex M.",
    role: "Pro Player",
    rating: 5,
    text: "JustPeek tamamen oyun değiştirici! Stealth teknolojisi inanılmaz. 3 aydır kullanıyorum ve hiç sorun yaşamadım.",
    textEn: "JustPeek is a complete game-changer! The stealth technology is incredible. Been using it for 3 months without any issues."
  },
  {
    id: 2,
    name: "Marcus K.",
    role: "Content Creator",
    rating: 5,
    text: "Kullandığım en gelişmiş sistem. Arayüz çok sezgisel ve özellikler mükemmel optimize edilmiş.",
    textEn: "The most advanced system I've used. The interface is super intuitive and the features are perfectly optimized."
  },
  {
    id: 3,
    name: "Sarah L.",
    role: "Competitive Gamer",
    rating: 5,
    text: "Destek ekibi muhteşem, yazılım kusursuz çalışıyor. Premium kalite gerçekten hissediliyor.",
    textEn: "Support team is amazing, software works flawlessly. You can really feel the premium quality."
  }
];

const Testimonials = ({ language = 'tr' }) => {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'tr' ? 'Kullanıcılarımız' : 'What Our Users'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
              {language === 'tr' ? 'Ne Diyor' : 'Say'}
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            {language === 'tr' 
              ? 'Binlerce memnun kullanıcının güvendiği premium çözüm'
              : 'The premium solution trusted by thousands of satisfied users'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/20 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-red-600/20" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-red-500 text-red-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
                "{language === 'tr' ? testimonial.text : testimonial.textEn}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-800">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-red-500 mb-2">3,000+</div>
            <div className="text-gray-400">{language === 'tr' ? 'Aktif Kullanıcı' : 'Active Users'}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500 mb-2">99.9%</div>
            <div className="text-gray-400">{language === 'tr' ? 'Başarı Oranı' : 'Success Rate'}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
            <div className="text-gray-400">{language === 'tr' ? 'Destek' : 'Support'}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500 mb-2">4.6★</div>
            <div className="text-gray-400">{language === 'tr' ? 'Ortalama Puan' : 'Average Rating'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
