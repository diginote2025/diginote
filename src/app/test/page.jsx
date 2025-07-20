"use client"

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Plus, 
  BookOpen, 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  FolderPlus, 
  Book, 
  Calendar,
  Clock,
  Star,
  Archive,
  Settings
} from 'lucide-react';

export default function StudyNote() {
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', color: 'bg-blue-500', topics: [] },
    { id: 2, name: 'Physics', color: 'bg-green-500', topics: [] },
    { id: 3, name: 'Chemistry', color: 'bg-purple-500', topics: [] }
  ]);
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const subjectColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];

  const addSubject = () => {
    if (newSubjectName.trim()) {
      const newSubject = {
        id: Date.now(),
        name: newSubjectName,
        color: subjectColors[subjects.length % subjectColors.length],
        topics: []
      };
      setSubjects([...subjects, newSubject]);
      setNewSubjectName('');
      setIsCreating(false);
    }
  };

  const addTopic = () => {
    if (newTopicName.trim() && selectedSubject) {
      const newTopic = {
        id: Date.now(),
        title: newTopicName,
        content: '',
        createdAt: new Date().toLocaleDateString(),
        lastModified: new Date().toLocaleString(),
        starred: false
      };
      
      setSubjects(subjects.map(subject => 
        subject.id === selectedSubject.id 
          ? { ...subject, topics: [...subject.topics, newTopic] }
          : subject
      ));
      setNewTopicName('');
    }
  };

  const toggleStar = (topicId) => {
    setSubjects(subjects.map(subject => 
      subject.id === selectedSubject.id
        ? {
            ...subject,
            topics: subject.topics.map(topic =>
              topic.id === topicId ? { ...topic, starred: !topic.starred } : topic
            )
          }
        : subject
    ));
  };

  const deleteTopic = (topicId) => {
    setSubjects(subjects.map(subject => 
      subject.id === selectedSubject.id
        ? { ...subject, topics: subject.topics.filter(topic => topic.id !== topicId) }
        : subject
    ));
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic(null);
    }
  };

  const updateTopicContent = (content) => {
    if (selectedTopic) {
      setSubjects(subjects.map(subject => 
        subject.id === selectedSubject.id
          ? {
              ...subject,
              topics: subject.topics.map(topic =>
                topic.id === selectedTopic.id 
                  ? { ...topic, content, lastModified: new Date().toLocaleString() }
                  : topic
              )
            }
          : subject
      ));
    }
  };

  const filteredTopics = selectedSubject 
    ? selectedSubject.topics.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const currentSubject = subjects.find(s => s.id === selectedSubject?.id) || selectedSubject;
  const currentTopic = currentSubject?.topics.find(t => t.id === selectedTopic?.id) || selectedTopic;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    StudyNote
                  </h1>
                  <p className="text-xs text-slate-400">Smart Study Companion</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {sidebarOpen && (
          <>
            {/* Navigation */}
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-blue-600/20 text-blue-400 rounded-lg">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Subject</span>
              </button>
            </div>

            {/* Create Subject Form */}
            {isCreating && (
              <div className="p-4 border-b border-slate-700/50">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Subject name..."
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={addSubject}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {setIsCreating(false); setNewSubjectName('');}}
                      className="flex-1 bg-slate-600 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Subjects List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Subjects</h2>
              <div className="space-y-2">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-slate-700/50 ${
                      selectedSubject?.id === subject.id ? 'bg-slate-700/70 ring-1 ring-blue-500/50' : ''
                    }`}
                  >
                    <div className={`w-4 h-4 ${subject.color} rounded-full`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-xs text-slate-400">{subject.topics.length} topics</div>
                    </div>
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Topics Panel */}
      {selectedSubject && (
        <div className="w-80 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
          {/* Topics Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 ${selectedSubject.color} rounded-lg`} />
              <div>
                <h2 className="font-bold text-lg">{selectedSubject.name}</h2>
                <p className="text-sm text-slate-400">{filteredTopics.length} topics</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Topic */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="New topic title..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="flex-1 p-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addTopic()}
              />
              <button
                onClick={addTopic}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Topics List */}
          <div className="flex-1 overflow-y-auto">
            {filteredTopics.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No topics yet</p>
                <p className="text-xs mt-1">Add your first topic to get started</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredTopics.map(topic => (
                  <div
                    key={topic.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-700/30 ${
                      selectedTopic?.id === topic.id ? 'bg-slate-700/50 ring-1 ring-blue-500/50' : 'bg-slate-700/20'
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm flex-1">{topic.title}</h3>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={(e) => {e.stopPropagation(); toggleStar(topic.id);}}
                          className={`p-1 rounded hover:bg-slate-600/50 ${topic.starred ? 'text-yellow-400' : 'text-slate-400'}`}
                        >
                          <Star className="w-3 h-3" fill={topic.starred ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={(e) => {e.stopPropagation(); deleteTopic(topic.id);}}
                          className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{topic.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{topic.lastModified}</span>
                      </div>
                    </div>
                    {topic.content && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {topic.content.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedTopic ? (
          <>
            {/* Editor Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 ${selectedSubject.color} rounded-full`} />
                  <div>
                    <h1 className="text-xl font-bold">{currentTopic?.title}</h1>
                    <p className="text-sm text-slate-400">
                      Last modified: {currentTopic?.lastModified}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStar(currentTopic.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      currentTopic?.starred 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'hover:bg-slate-700/50 text-slate-400'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={currentTopic?.starred ? 'currentColor' : 'none'} />
                  </button>
                  <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-6">
              <textarea
                value={currentTopic?.content || ''}
                onChange={(e) => updateTopicContent(e.target.value)}
                placeholder="Start writing your notes here..."
                className="w-full h-full resize-none bg-transparent border-none focus:outline-none text-slate-100 placeholder-slate-400 leading-relaxed"
              />
            </div>
          </>
        ) : selectedSubject ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <Edit3 className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Select a topic to start writing</h2>
              <p className="text-slate-400">Choose a topic from the sidebar or create a new one</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <Book className="w-20 h-20 mx-auto mb-6 text-slate-400 opacity-50" />
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to StudyNote
              </h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Organize your studies with smart note-taking. Create subjects, add topics, and keep your knowledge structured.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}