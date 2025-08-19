"use client";

import React, { useEffect, useState, useCallback } from "react";

// --- UI Components for different states ---

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div
      className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
    <p className="text-slate-500">Fetching data...</p>
  </div>
);

// A component to display error messages
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-300 bg-red-50 p-8 text-center">
    <p className="font-semibold text-red-700">Oops! Something went wrong.</p>
    <p className="text-sm text-red-600">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
    >
      Try Again
    </button>
  </div>
);

// A component to display the successfully fetched data
const DataCard = ({ content }) => (
  <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5">
    <h2 className="mb-4 text-xl font-bold text-slate-800">API Response</h2>
    <div className="prose prose-slate max-w-none rounded-md bg-slate-50 p-4">
      <p>{content}</p>
    </div>
  </div>
);


// --- Main Page Component ---

export default function Page() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error state on new fetch attempt

    try {
      const response = await fetch(
        "https://diginote-3b4g.onrender.com/diginote/test"
      );

      // Check if the response was successful (e.g., not a 404 or 500)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const textData = await response.text();
      setData(textData);

    } catch (err) {
      // Set a user-friendly error message
      setError(err.message || "An unknown error occurred while fetching data.");
      setData(null); // Clear any stale data
    } finally {
      // This will run whether the fetch succeeded or failed
      setIsLoading(false);
    }
  }, []); // useCallback memoizes the function so it doesn't change on re-renders

  useEffect(() => {
    fetchData();
  }, [fetchData]); // The hook now correctly depends on the memoized fetchData function

  // --- Conditional Rendering Logic ---
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={fetchData} />;
    }

    if (data) {
      return <DataCard content={data} />;
    }

    // Handle the case where there's no data, no error, and it's not loading
    return <p className="text-slate-500">No data available.</p>;
  };

  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-slate-100 p-8 pt-[5rem]">
      {renderContent()}
    </main>
  );
}