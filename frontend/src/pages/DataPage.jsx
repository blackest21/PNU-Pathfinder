import { useState } from 'react';
import { Award, Badge, Book, Globe, Users } from 'lucide-react';
import {
  activities,
  certificates,
  contests,
  languages,
  semesters,
} from '../data/mockData.js';
import CreditSummary from '../components/CreditSummary.jsx';
import GraduationRequirements from '../components/GraduationRequirements.jsx';
import Section from '../components/Section.jsx';
import SemesterCard from '../components/SemesterCard.jsx';
import TableSection from '../components/TableSection.jsx';

export default function DataPage() {
  const [openSemesters, setOpenSemesters] = useState({});

  function toggleSemester(index) {
    setOpenSemesters((current) => ({ ...current, [index]: !current[index] }));
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">내 데이터</h2>
        <div className="space-y-6">
          <Section title="성적" icon={Book}>
            <div className="space-y-3">
              {semesters.map((semester, index) => (
                <SemesterCard
                  key={semester.title}
                  semester={semester}
                  isOpen={Boolean(openSemesters[index])}
                  onToggle={() => toggleSemester(index)}
                />
              ))}
              <CreditSummary />
            </div>
          </Section>

          <TableSection title="외부활동" icon={Users} headers={['활동명', '기간', '역할']} rows={activities} />
          <TableSection title="내부활동 및 공모전" icon={Award} headers={['대회명', '분야', '수상']} rows={contests} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TableSection title="자격증" icon={Badge} headers={['자격증', '취득일']} rows={certificates} compact />
            <TableSection title="어학성적" icon={Globe} headers={['시험', '성적']} rows={languages} compact />
          </div>

          <GraduationRequirements />
        </div>
      </div>
    </div>
  );
}
