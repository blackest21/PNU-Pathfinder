import type { ReactNode } from 'react';
import type { AppIcon } from '../types';

interface SectionProps {
  title: string;
  icon: AppIcon;
  children: ReactNode;
}

export default function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-emerald-400" />
        {title}
      </h3>
      {children}
    </section>
  );
}
