"use client"

import { useState, useEffect } from 'react';
import { Target, Eye, Trophy, ArrowRight, Sparkles } from 'lucide-react';

export default function MissionVisionGoal() {
  const [activeCard, setActiveCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cards = [
    {
      id: 'mission',
      icon: Target,
      title: 'Our Mission',
      subtitle: 'Empowering Students',
      description: 'To empower students by providing an easy-to-use AI-powered note-taking tool that saves time and enhances preparation efficiency.',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-400',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      id: 'vision',
      icon: Eye,
      title: 'Our Vision',
      subtitle: 'Digital Future',
      description: 'We envision a future where students save time and resources by embracing digital learning—using AI to take smarter MCQs, tests, and maintain organized digital notebooks that replace paper and traditional methods.',
      color: 'green',
      gradient: 'from-green-500 to-emerald-400',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      id: 'goal',
      icon: Trophy,
      title: 'Our Goal',
      subtitle: 'Accessible Learning',
      description: 'Our goal is to make quality learning accessible to all students, eliminating the need for expensive notes or books, and enabling them to understand and master subjects in a simple, affordable, and effective way.',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-400',
      bgGradient: 'from-purple-50 to-pink-50'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50/30 py-16 md:py-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-6">
            <Sparkles className="h-4 w-4" />
            Our Foundation
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight mb-6">
            Mission, Vision & Goals
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are dedicated to revolutionizing the learning process for students everywhere through innovative AI technology.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isActive = activeCard === card.id;
            
            return (
              <div
                key={card.id}
                className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setActiveCard(card.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Card Container */}
                <div className={`relative h-full p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                  isActive 
                    ? `bg-gradient-to-br ${card.bgGradient} transform -translate-y-2 shadow-2xl shadow-${card.color}-500/20` 
                    : 'bg-white hover:shadow-xl'
                } border border-gray-200 hover:border-transparent`}>
                  
                  {/* Animated border gradient */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${card.gradient} p-[1px]`}>
                    <div className="h-full w-full rounded-3xl bg-white"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with animated background */}
                    <div className="relative mb-6">
                      <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg transform transition-all duration-500 ${
                        isActive ? 'rotate-6 scale-110' : 'group-hover:rotate-3 group-hover:scale-105'
                      }`}>
                        <Icon className="h-8 w-8 text-white drop-shadow-sm" />
                      </div>
                      
                      {/* Floating particles effect */}
                      {isActive && (
                        <>
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce delay-100"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce delay-300"></div>
                        </>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                      <div>
                        <p className={`text-sm font-semibold uppercase tracking-wider mb-2 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                          {card.subtitle}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 transition-colors duration-300">
                          {card.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        {card.description}
                      </p>

                      {/* Call to action arrow */}
                      <div className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? `text-${card.color}-600 translate-x-2` 
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}>
                        <span>Learn more</span>
                        <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`h-1 bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <span>Ready to transform your learning?</span>
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}