"use client"

import React, { useState } from 'react';
import { Home, Plus, BookOpen, Search, Moon, Sun, Settings, FileText, Sparkles, Zap, Target, ChevronRight, Import, FolderPlus, BookOpenCheck, Clock, TrendingUp } from 'lucide-react';

export default function EnhancedEmptyState() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const themeClasses = darkMode 
    ? 'bg-slate-900 text-white' 
    : 'bg-gray-50 text-gray-900';
  
  const cardClasses = darkMode 
    ? 'bg-slate-800 border-slate-700' 
    : 'bg-white border-gray-200';

  const quickActions = [
    {
      title: 'Create New Note',
      description: 'Start writing your first note',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      action: 'create'
    },
    {
      title: 'Import Notes',
      description: 'Import from other apps',
      icon: Import,
      color: 'from-green-500 to-green-600',
      action: 'import'
    },
    {
      title: 'Create Notebook',
      description: 'Organize notes by topics',
      icon: FolderPlus,
      color: 'from-purple-500 to-purple-600',
      action: 'notebook'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Rich Text Editor',
      description: 'Format your notes with markdown support'
    },
    {
      icon: Zap,
      title: 'Quick Search',
      description: 'Find any note instantly with powerful search'
    },
    {
      icon: Target,
      title: 'Organized',
      description: 'Keep notes organized with tags and notebooks'
    }
  ];

  const templates = [
    {
      title: 'Meeting Notes',
      description: 'Template for meeting minutes',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      title: 'Project Planning',
      description: 'Plan and track your projects',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Learning Journal',
      description: 'Track your learning progress',
      icon: BookOpenCheck,
      color: 'bg-purple-500'
    },
    {
      title: 'Daily Reflection',
      description: 'Daily thoughts and reflections',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className={`min-h-screen flex ${themeClasses} transition-colors duration-300`}>
      {/* Enhanced Sidebar */}
      <div className={`w-64 ${cardClasses} border-r flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DigiNote
          </h1>
          <p className="text-sm text-slate-400 mt-1">Smart note-taking</p>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'create' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Create</span>
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'notes' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>My Notes</span>
            </button>
          </div>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${cardClasses} border-b px-8 py-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome to DigiNote</h1>
              <p className="text-slate-400 mt-1">Let's create something amazing together</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="w-4 h-4" />
                Create First Note
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 scale-150"></div>
                <div className="relative">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center border border-slate-600 shadow-2xl">
                    <div className="relative">
                      <BookOpen className="w-16 h-16 text-blue-400" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Your digital notebook is <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">empty</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Start your journey by creating your first note. Capture ideas, organize thoughts, and build your knowledge base.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className={`${cardClasses} p-6 rounded-2xl border hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{action.description}</p>
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Get started
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center mb-8">Why choose DigiNote?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Start with a template</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View all templates
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    className={`${cardClasses} p-4 rounded-xl border hover:border-blue-500 transition-all cursor-pointer group hover:shadow-lg`}
                  >
                    <div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <template.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1 text-sm">{template.title}</h4>
                    <p className="text-xs text-slate-400">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className={`${cardClasses} rounded-2xl border p-8 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20`}>
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Create your first note and begin organizing your thoughts and ideas in a beautiful, intuitive interface.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  <Plus className="w-4 h-4" />
                  Create Your First Note
                </button>
                <button className={`px-8 py-3 ${cardClasses} border hover:border-blue-500 font-medium rounded-lg transition-all hover:bg-slate-700`}>
                  Import Existing Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`${cardClasses} border-t px-8 py-4`}>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div>Welcome to DigiNote - Your smart note-taking companion</div>
            <div className="flex items-center gap-4">
              <span>Press Ctrl+N to create a new note</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}