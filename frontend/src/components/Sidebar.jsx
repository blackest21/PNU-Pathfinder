import { Plus } from 'lucide-react';

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`${isOpen ? 'absolute z-50 h-full flex' : 'hidden'} w-64 bg-slate-900 border-r border-slate-800 flex-col lg:relative lg:z-auto lg:h-auto lg:flex shrink-0`}>
      <div className="p-4 border-b border-slate-800">
        <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition">
          <Plus className="w-4 h-4" />
          새 대화
        </button>
      </div>
      <div className="flex-1 overflow-y-auto chat-scroll p-3 space-y-1">
        <p className="text-xs text-slate-500 px-3 py-2 uppercase tracking-wider">오늘</p>
        <HistoryButton active label="진로 탐색 상담" />
        <HistoryButton label="대외활동 추천 요청" />
        <p className="text-xs text-slate-500 px-3 py-2 uppercase tracking-wider mt-3">어제</p>
        <HistoryButton label="학과 관련 인턴십 탐색" />
        <HistoryButton label="포트폴리오 준비 방법" />
      </div>
    </aside>
  );
}

function HistoryButton({ active = false, label }) {
  return (
    <button className={`chat-item w-full text-left px-3 py-2.5 rounded-lg text-sm truncate ${active ? 'bg-slate-800 text-slate-200' : 'hover:bg-slate-800 text-slate-400'}`}>
      {label}
    </button>
  );
}
