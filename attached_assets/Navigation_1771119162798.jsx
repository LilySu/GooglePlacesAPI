const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'suggestions', label: 'For You' },
  { key: 'metrics', label: 'All Metrics' },
  { key: 'upload', label: 'Upload' },
];

export default function Navigation({ currentView, setCurrentView }) {
  return (
    <div className="flex justify-center gap-3 mb-8 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setCurrentView(tab.key)}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
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
