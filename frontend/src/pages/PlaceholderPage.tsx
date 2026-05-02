import type { AppIcon } from '../types';

interface PlaceholderPageProps {
  title: string;
  icon: AppIcon;
  text: string;
}

export default function PlaceholderPage({ title, icon: Icon, text }: PlaceholderPageProps) {
  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
          <Icon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}
