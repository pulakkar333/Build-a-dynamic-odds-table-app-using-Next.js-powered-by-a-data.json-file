'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data.json
  useEffect(() => {
    setIsLoading(true);
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Filter match suggestions
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = data.filter(match =>
      match.matchId.includes(query) ||
      match.match.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
  }, [query, data]);

  const selectMatch = (match) => {
    setSelectedMatch(match);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <span className="animate-bounce">⚽</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
              OddsPulse Pro
            </span>
            <span className="animate-bounce">🏆</span>
          </h1>
          <p className="text-blue-200">Real-time odds at your fingertips</p>
        </header>

        {/* Search Section */}
        <div className="relative mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search matches by ID or name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-4 pr-12 rounded-lg bg-blue-800 bg-opacity-50 border border-blue-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none transition-all duration-300 placeholder-blue-300"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
              </div>
            )}
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-blue-800 rounded-lg shadow-xl overflow-hidden border border-blue-600 max-h-96 overflow-y-auto">
              {suggestions.map((match) => (
                <li
                  key={match.matchId}
                  onClick={() => selectMatch(match)}
                  className="px-4 py-3 hover:bg-blue-700 cursor-pointer transition-colors duration-200 border-b border-blue-700 last:border-b-0 flex justify-between items-center"
                >
                  <span className="font-medium">{match.match}</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">{match.matchId}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content */}
        {selectedMatch ? (
          <div className="animate-fadeIn">
            <div className="bg-blue-800 bg-opacity-50 rounded-xl p-6 mb-6 border border-blue-600 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-yellow-300 mb-1">{selectedMatch.match}</h2>
                  <div className="flex items-center text-blue-200 text-sm">
                    <span className="bg-blue-700 px-2 py-1 rounded mr-2">ID: {selectedMatch.matchId}</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Live
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMatch(null)}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Odds Tables */}
              <div className="space-y-6">
                {Object.entries(selectedMatch.odds).map(([category, odds]) => (
                  <div key={category} className="bg-blue-900 bg-opacity-50 rounded-lg overflow-hidden border border-blue-700">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-800">
                      <h3 className="font-bold text-lg">{category}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-blue-800 bg-opacity-50">
                            {Object.keys(odds).map((key) => (
                              <th key={key} className="px-4 py-3 text-left font-medium text-blue-200 border-b border-blue-700">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-blue-800 transition-colors duration-150">
                            {Object.values(odds).map((value, index) => (
                              <td key={index} className="px-4 py-3 border-b border-blue-800 last:border-b-0">
                                <span className={`inline-block px-3 py-1 rounded-full ${value > 2.5 ? 'bg-pink-600 bg-opacity-70' : 'bg-green-600 bg-opacity-70'}`}>
                                  {value}
                                </span>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
                <p>Loading matches...</p>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="bg-blue-800 bg-opacity-50 p-6 rounded-xl border border-dashed border-blue-600">
                  <svg className="w-16 h-16 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2">No match selected</h3>
                  <p className="text-blue-300">Search for a match above to view live odds</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-blue-300 text-sm">
          <p>OddsPulse Pro • Real-time sports betting data • {new Date().getFullYear()}</p>
        </footer>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        body {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
}