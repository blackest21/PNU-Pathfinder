import { CheckCircle } from 'lucide-react';
import { requirements } from '../data/mockData.js';
import Section from './Section.jsx';

export default function GraduationRequirements() {
  return (
    <Section title="졸업요건 (컴퓨터공학과)" icon={CheckCircle}>
      <div className="space-y-4">
        {requirements.map(([label, value, width, color]) => (
          <div key={label}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm text-emerald-400">{value}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className={`${color} h-2 rounded-full`} style={{ width: `${width}%` }} />
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">총 학점</p>
              <p className="text-2xl font-bold text-emerald-400">83/133</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">졸업까지 남은 학점</p>
              <p className="text-lg font-semibold text-slate-300">50학점</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-600 rounded-full h-3">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full" style={{ width: '62%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-2">졸업까지 약 62% 완료</p>
        </div>
      </div>
    </Section>
  );
}
