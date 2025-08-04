import React from 'react';

export default function WhoIsFor() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600 border border-indigo-200/50 mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
            Perfect for Everyone
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 leading-tight">
            Who is DigiNote for?
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're studying, teaching, or exploring new topics, DigiNote adapts to your learning journey with AI-powered educational tools.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Students Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📚
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Students</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                From Class 6 to university level – create comprehensive notes, practice MCQs, and prepare tests efficiently with AI assistance.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  Smart note generation
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                  Interactive MCQ practice
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  Exam preparation tools
                </div>
              </div>
            </div>
          </div>

          {/* Teachers Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                👩‍🏫
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Teachers</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Streamline lesson planning and content creation. Generate engaging materials faster and focus on what matters most – teaching.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                  Rapid content creation
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                  Customizable lesson plans
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                  Assessment tools
                </div>
              </div>
            </div>
          </div>

          {/* Self-Learners Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📖
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Self-Learners</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Explore any topic at your own pace with AI-generated resources, interactive content, and comprehensive chapter videos.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                  Personalized learning paths
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  Video explanations
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></div>
                  Self-paced progress
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50">
            <span className="text-gray-600">Ready to get started?</span>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}