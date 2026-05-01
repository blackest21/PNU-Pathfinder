import { recommendations } from '../data/mockData.js';

export default function Recommendations() {
  return (
    <div className="shrink-0 border-t border-slate-800 bg-slate-950 p-4 overflow-x-auto">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-2">추천 활동</p>
      <div className="flex gap-3 pb-1">
        {recommendations.map((item) => (
          <div key={item.title} className="recommendation-card flex-shrink-0 w-56 p-4 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs rounded-full ${item.tone}`}>{item.type}</span>
            </div>
            <p className="text-sm font-medium mb-1">{item.title}</p>
            <p className="text-xs text-slate-400">{item.due}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
