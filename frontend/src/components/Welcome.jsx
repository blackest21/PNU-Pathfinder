import { Compass } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="text-center py-8 fade-in">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <Compass className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-semibold mb-2">무엇을 도와드릴까요?</h2>
      <p className="text-slate-400 text-sm">진로, 활동, 이력서 등 무엇이든 물어보세요</p>
    </div>
  );
}
