"use client";

import { Home, Notebook, PlusCircle, Menu, X, Settings, User, Moon, Sun } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/themeSlice";
import { toggleAsidebar } from "@/redux/asidebarSlice";
import Link from "next/link";
import Image from "next/image";

export default function Asidebar({ setActive, active }) {
  const dispatch = useDispatch();
  const isAsideOpen = useSelector((state) => state.asidebar.isAsideOpen);
  const { isDark } = useSelector((state) => state.theme);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if device is mobile and initialize properly
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // If switching to mobile and sidebar is open, close it
      if (mobile && isAsideOpen && isInitialized) {
        dispatch(toggleAsidebar());
      }
    };
    
    // Initial check
    checkIsMobile();
    setIsInitialized(true);
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [dispatch, isAsideOpen, isInitialized]);

  // Ensure sidebar is closed on mobile when component mounts
  useEffect(() => {
    if (isInitialized && isMobile && isAsideOpen) {
      dispatch(toggleAsidebar());
    }
  }, [isMobile, isInitialized, dispatch, isAsideOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isAsideOpen && !event.target.closest('aside') && !event.target.closest('.mobile-menu-btn')) {
        dispatch(toggleAsidebar());
      }
    };

    if (isMobile && isAsideOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, isAsideOpen, dispatch]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isAsideOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobile, isAsideOpen]);

  const toggleSidebar = () => {
    dispatch(toggleAsidebar());
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleMenuItemClick = (itemId) => {
    setActive(itemId);
    // Auto-close sidebar on mobile after selection
    if (isMobile) {
      dispatch(toggleAsidebar());
    }
  };

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/workspace",
      description: "Dashboard and overview"
    },
    {
      id: "create",
      label: "Create",
      icon: PlusCircle,
      href: "/workspace/create",
      description: "Create new notes"
    },
    {
      id: "notes",
      label: "My Notes",
      icon: Notebook,
      href: "/workspace/notes",
      description: "View all your notes"
    }
  ];

  // Don't render until initialized to prevent flash
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="relative">
      {/* Mobile overlay with enhanced backdrop */}
      {isAsideOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out"
          onClick={toggleSidebar}
          style={{ 
            opacity: isAsideOpen ? 1 : 0,
            visibility: isAsideOpen ? 'visible' : 'hidden'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full lg:h-screen z-50
          ${isAsideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed && !isMobile ? "w-16" : "w-72 sm:w-80 lg:w-64"}
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          shadow-2xl lg:shadow-none
          flex flex-col
          max-h-screen overflow-hidden
        `}
      >
        {/* Header - Enhanced for mobile */}
        <div className="flex items-center justify-between p-4 lg:p-4 border-b border-gray-200 dark:border-gray-700 min-h-[64px]">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-8 h-8 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image 
                  src={"/images/homepage/navbar/DN.png"} 
                  width={32} 
                  height={32} 
                  alt="DigiNote Logo" 
                  className="rounded w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white bg-clip-text ">
                DigiNote
              </h1>
            </div>
          )}
          
          {/* Close button - Only visible on mobile */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation - Enhanced scrolling */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleMenuItemClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  group relative flex items-center rounded-xl transition-all duration-200 touch-manipulation
                  ${isCollapsed && !isMobile ? "justify-center p-3" : "px-3 py-3 lg:py-3"}
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-800"
                  }
                  min-h-[44px] lg:min-h-[48px]
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                )}
                
                {/* Icon */}
                <div className={`flex-shrink-0 ${isCollapsed && !isMobile ? "" : "mr-3"}`}>
                  <Icon className={`w-5 h-5 lg:w-5 lg:h-5 transition-transform duration-200 ${isHovered ? "scale-110" : ""}`} />
                </div>
                
                {/* Label */}
                {(!isCollapsed || isMobile) && (
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium truncate text-sm lg:text-base">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Tooltip for collapsed state - Desktop only */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Enhanced for mobile */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={handleThemeToggle}
            className={`
              w-full flex items-center rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-800 touch-manipulation
              ${isCollapsed && !isMobile ? "justify-center p-3" : "px-3 py-2 lg:py-2"}
              min-h-[44px] lg:min-h-[40px]
            `}
            aria-label="Toggle theme"
          >
            <div className={`flex-shrink-0 ${isCollapsed && !isMobile ? "" : "mr-3"}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-medium text-sm lg:text-base">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          {/* Collapse toggle - Desktop only */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                w-full flex items-center rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50
                ${isCollapsed ? "justify-center p-3" : "px-3 py-2"}
                min-h-[40px]
              `}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <div className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}>
                <Menu className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className="font-medium text-base">Collapse</span>
              )}
            </button>
          )}

          {/* User section */}
          {(!isCollapsed || isMobile) && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer touch-manipulation min-h-[44px] lg:min-h-[48px]">
                <div className="w-8 h-8 lg:w-8 lg:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Free Plan
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile menu button - Enhanced positioning and styling */}
      {!isAsideOpen && (
        <button
          onClick={toggleSidebar}
          className="mobile-menu-btn fixed top-4 left-4 z-30 p-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden transition-all duration-200 hover:shadow-xl active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}