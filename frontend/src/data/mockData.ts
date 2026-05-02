import type { RecommendationItem, RequirementProgress, Semester, TableRow } from '../types';

export const aiResponses: string[] = [
  '현재 관심 분야와 학년을 고려했을 때, Google DSC 활동을 추천드려요. 리더십 경험과 기술 역량을 동시에 쌓을 수 있습니다.',
  '이력서에 프로젝트 경험을 추가하시면 좋겠어요. 교내 해커톤 참가를 고려해보세요!',
  '취업 준비를 위해 포트폴리오를 먼저 정리하는 것을 추천드립니다. 어떤 분야에 관심이 있으신가요?',
  '부산대 내부 프로그램 중 멘토링 프로그램이 현재 모집 중이에요. 선배와의 네트워킹 기회가 됩니다.',
];

export const recommendations: RecommendationItem[] = [
  { type: '외부활동', tone: 'bg-emerald-900 text-emerald-300', title: 'Google DSC 리더 모집', due: '마감: 3월 15일' },
  { type: '내부활동', tone: 'bg-blue-900 text-blue-300', title: 'PNU 창업동아리', due: '상시 모집' },
  { type: '공모전', tone: 'bg-purple-900 text-purple-300', title: 'SW 중심대학 해커톤', due: '마감: 4월 1일' },
  { type: '인턴십', tone: 'bg-amber-900 text-amber-300', title: '네이버 체험형 인턴', due: '마감: 3월 20일' },
];

export const semesters: Semester[] = [
  {
    title: '1학년 1학기',
    gpa: '3.85',
    credits: 15,
    courses: [
      ['운영체제', 3, 'A+'],
      ['자료구조', 3, 'A+'],
      ['데이터베이스', 3, 'A'],
      ['웹프로그래밍', 3, 'A'],
      ['선형대수', 3, 'B+'],
    ],
  },
  {
    title: '1학년 2학기',
    gpa: '3.92',
    credits: 16,
    courses: [
      ['알고리즘', 3, 'A+'],
      ['컴퓨터네트워크', 3, 'A'],
      ['소프트웨어공학', 3, 'A+'],
      ['객체지향프로그래밍', 4, 'A'],
      ['이산수학', 3, 'B+'],
    ],
  },
  {
    title: '2학년 1학기',
    gpa: '3.88',
    credits: 15,
    courses: [
      ['머신러닝', 3, 'A'],
      ['모바일프로그래밍', 3, 'A+'],
      ['클라우드컴퓨팅', 3, 'A'],
      ['정보보안', 3, 'B+'],
      ['UI/UX디자인', 3, 'A'],
    ],
  },
];

export const activities: TableRow[] = [
  ['Google DSC', '2023.03 ~ 2023.12', 'Core Member'],
  ['AAAA 인턴십', '2023.07 ~ 2023.08', 'Front-end 인턴'],
];

export const contests: TableRow[] = [
  ['PNU 해커톤', '소프트웨어', '금상'],
  ['창업아이디어 공모전', '창업', '입선'],
];

export const certificates: TableRow[] = [
  ['정보처리기사', '2023.09'],
  ['SQLD', '2023.06'],
];

export const languages: TableRow[] = [
  ['TOEIC', '870'],
  ['OPIC', 'IH'],
];

export const requirements: RequirementProgress[] = [
  ['전공필수', '12/20', 60, 'bg-emerald-500'],
  ['전공선택', '15/30', 50, 'bg-emerald-500'],
  ['교양필수', '8/12', 67, 'bg-blue-500'],
  ['교양선택', '10/15', 67, 'bg-blue-500'],
  ['일반선택', '38/56', 68, 'bg-emerald-500'],
];
