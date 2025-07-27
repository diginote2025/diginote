"use client"

import React, { useState } from 'react';
import { Home, Plus, BookOpen, ChevronLeft, Edit3, Trash2, Search, Moon, Sun, Settings, Save, Eye, Code, Monitor } from 'lucide-react';

export default function EnhancedDigiNote() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('edit');
  const [chapterName, setChapterName] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const notes = [
    { id: 1, title: 'html', subject: 'HTML', lastModified: '2 hours ago', color: 'bg-blue-500' },
    { id: 2, title: 'css-basics', subject: 'CSS', lastModified: '1 day ago', color: 'bg-green-500' },
    { id: 3, title: 'javascript-fundamentals', subject: 'JavaScript', lastModified: '3 days ago', color: 'bg-yellow-500' }
  ];

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const themeClasses = darkMode 
    ? 'bg-slate-900 text-white' 
    : 'bg-gray-50 text-gray-900';
  
  const cardClasses = darkMode 
    ? 'bg-slate-800 border-slate-700' 
    : 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen flex ${themeClasses} transition-colors duration-300`}>
      {/* Enhanced Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 ${cardClasses} border-r flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DigiNote
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {!sidebarCollapsed && (
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
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white transition-colors">
              <Home className="w-5 h-5" />
              {!sidebarCollapsed && <span>Home</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
              <Plus className="w-5 h-5" />
              {!sidebarCollapsed && <span>Create</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
              <BookOpen className="w-5 h-5" />
              {!sidebarCollapsed && <span>My Notes</span>}
            </button>
          </div>

          {/* Recent Notes */}
          {!sidebarCollapsed && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Notes</h3>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${note.color}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{note.title}</p>
                        <p className="text-xs text-slate-400">{note.lastModified}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                        <button className="p-1 hover:bg-slate-600 rounded">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-slate-600 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
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
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className={`${cardClasses} border-b px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">HTML</h1>
                <p className="text-sm text-slate-400">The Foundation of the Web</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('edit')}
                  className={`p-2 rounded-md transition-colors ${activeView === 'edit' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600'}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`p-2 rounded-md transition-colors ${activeView === 'preview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600'}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('split')}
                  className={`p-2 rounded-md transition-colors ${activeView === 'split' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Main Editor */}
          <div className={`flex-1 ${activeView === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="h-full p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-invert max-w-none">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">What is HTML?</h2>
                    <div className={`${cardClasses} p-6 rounded-xl border shadow-sm`}>
                      <p className="text-slate-300 leading-relaxed mb-4">
                        HTML (HyperText Markup Language) is the standard markup language for creating web pages. 
                        It's the foundational language that tells web browsers how to display content. Instead of 
                        directly displaying text and images, HTML uses <span className="text-yellow-400 font-mono">tags</span> enclosed 
                        in angle brackets (<span className="text-pink-400">&lt; &gt;</span>) to structure the content.
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        These tags define elements, which represent different parts of a web page, 
                        like headings, paragraphs, images, links, and more.
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Basic Structure of an HTML Document</h2>
                    <div className={`${cardClasses} p-6 rounded-xl border shadow-sm`}>
                      <p className="text-slate-300 leading-relaxed mb-4">
                        Every HTML document follows a basic structure:
                      </p>
                      <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500 font-mono text-sm">
                        <div className="text-gray-400">&lt;!DOCTYPE html&gt;</div>
                        <div className="text-pink-400">&lt;html&gt;</div>
                        <div className="ml-4 text-pink-400">&lt;head&gt;</div>
                        <div className="ml-8 text-yellow-400">&lt;title&gt;Page Title&lt;/title&gt;</div>
                        <div className="ml-4 text-pink-400">&lt;/head&gt;</div>
                        <div className="ml-4 text-pink-400">&lt;body&gt;</div>
                        <div className="ml-8 text-green-400">&lt;h1&gt;Main Heading&lt;/h1&gt;</div>
                        <div className="ml-8 text-green-400">&lt;p&gt;Paragraph content&lt;/p&gt;</div>
                        <div className="ml-4 text-pink-400">&lt;/body&gt;</div>
                        <div className="text-pink-400">&lt;/html&gt;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Topic Management */}
          <div className={`w-80 ${cardClasses} border-l p-6 ${activeView === 'split' ? 'block' : 'block'}`}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Subject: <span className="text-blue-400">HTML</span></h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Chapter name</label>
                  <input
                    type="text"
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    placeholder="Enter chapter name"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Topic title</label>
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="Enter topic title"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  Add Topic
                </button>
              </div>
            </div>

            {/* Current Topics */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3">Current Topics</h4>
              <div className="space-y-2">
                <div className={`${cardClasses} p-3 rounded-lg border hover:border-blue-500 transition-colors group cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">html</span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <button className="p-1 hover:bg-slate-600 rounded">
                        <Edit3 className="w-3 h-3 text-blue-400" />
                      </button>
                      <button className="p-1 hover:bg-red-600 rounded">
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Insert Code Block</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Add Reference</span>
                </button>
              </div>
            </div>

            {/* Open Notebook Button */}
            <div className="mt-8">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                Open Notebook
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`${cardClasses} border-t px-6 py-2`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Words: 156</span>
              <span>Characters: 892</span>
              <span>Last saved: 2 minutes ago</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}