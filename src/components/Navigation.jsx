const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'suggestions', label: 'For You' },
  { key: 'metrics', label: 'All Metrics' },
  { key: 'upload', label: 'Upload' },
];

export default function Navigation({ currentView, setCurrentView }) {
  return (
    <div className="flex justify-start sm:justify-center gap-2 sm:gap-3 mb-6 md:mb-8 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 animate-fadeInUp" style={{animationDelay: '0.3s', WebkitOverflowScrolling: 'touch'}}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setCurrentView(tab.key)}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all whitespace-nowrap text-sm sm:text-base shrink-0 ${
            currentView === tab.key
              ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
              : 'bg-white/60 text-amber-900 hover:bg-white/80'
          }`}
          style={{fontFamily: 'Work Sans, sans-serif'}}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
