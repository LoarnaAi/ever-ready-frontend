'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  company?: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  autoplayInterval?: number;
}

const TestimonialSlider = ({ testimonials, autoplayInterval = 5000 }: TestimonialSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [testimonials.length, autoplayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <button 
          onClick={prevSlide}
          className="absolute left-0 z-10 p-4 text-4xl text-everready-primary hover:text-everready-secondary transition-colors"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-0 z-10 p-4 text-4xl text-everready-primary hover:text-everready-secondary transition-colors"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-none w-full px-4">
              <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                <p className="text-center text-white">
                  "{testimonial.quote}"
                </p>
                <footer className="mt-6">
                  <p className="text-lg text-center text-white">
                    {testimonial.company ? testimonial.author : `- ${testimonial.author}`}
                  </p>
                  {testimonial.company && (
                    <p className="text-base text-gray-400 text-center">{testimonial.company}</p>
                  )}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-everready-primary' : 'bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
