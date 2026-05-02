import { ChevronDown } from 'lucide-react';
import type { Semester } from '../types';

interface SemesterCardProps {
  semester: Semester;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SemesterCard({ semester, isOpen, onToggle }: SemesterCardProps) {
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-750">
      <button className="w-full flex justify-between items-center px-4 py-3 hover:bg-slate-700 transition" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          <h4 className="font-semibold text-slate-200">{semester.title}</h4>
        </div>
        <span className="text-sm text-emerald-400">GPA {semester.gpa} | {semester.credits}학점</span>
      </button>
      {isOpen && (
        <div className="border-t border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800">
                <th className="text-left py-2 px-4 text-slate-400 font-medium">과목명</th>
                <th className="text-right py-2 px-4 text-slate-400 font-medium">학점</th>
                <th className="text-right py-2 px-4 text-slate-400 font-medium">성적</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {semester.courses.map(([name, credit, grade]) => (
                <tr key={name}>
                  <td className="py-2.5 px-4 text-slate-300">{name}</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">{credit}</td>
                  <td className={`py-2.5 px-4 text-right ${grade.startsWith('A') ? 'text-emerald-400' : 'text-blue-400'}`}>{grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
