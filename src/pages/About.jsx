import React from 'react';

const About = () => {
  return (
    <section className="pt-6 md:pt-10 pb-12 md:pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-black mb-4">Our Story</h1>
          <div className="w-16 md:w-24 h-1 bg-red-500 mx-auto"></div>
        </div>
        <div className="prose prose-sm md:prose-lg mx-auto text-gray-600 font-light leading-relaxed">
          <p className="mb-4 md:mb-6 text-lg md:text-xl">
            Moda Wrld was born from a simple yet powerful idea: luxury should not be quiet. 
            It should be loud, proud, and unapologetically swag.
          </p>
          <p className="mb-4 md:mb-6">
            Founded in 2024, we set out to bridge the gap between high-end fashion and street culture.
            Our collections are designed for those who dare to stand out.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;