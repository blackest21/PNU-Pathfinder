import type { LucideIcon } from 'lucide-react';

export type UserRole = 'user' | 'admin';

export type PageId =
  | 'chat'
  | 'data'
  | 'whatif'
  | 'resume'
  | 'login'
  | 'signup'
  | 'admin-info'
  | 'admin-program-search';

export interface UserSession {
  role?: UserRole;
  id?: number;
  name?: string;
  student_id?: string;
  admin_id?: string;
  department?: string;
  major?: string | null;
  career_goal?: string | null;
}

export interface AuthResult {
  access_token: string;
  token_type?: string;
  user: UserSession;
}

export interface SignupPayload {
  name: string;
  student_id: string;
  password: string;
  department: string;
  major: string | null;
  career_goal: string | null;
  privacy_consent: boolean;
}

export interface LoginPayload {
  student_id: string;
  password: string;
}

export interface AdminLoginPayload {
  admin_id: string;
  password: string;
}

export interface CurriculumCourse {
  id: number;
  completion_category: string;
  course_number: string;
  course_name_ko: string;
  course_name_en: string | null;
  description: string | null;
  recommended_semester: string;
  credits: number;
}

export interface CurriculumCourseForm {
  completion_category: string;
  course_number: string;
  course_name_ko: string;
  course_name_en: string;
  description: string;
  recommended_semester: string;
  credits: number;
}

export interface GraduationRequirement {
  id: number;
  liberal_required: number;
  liberal_elective: number;
  major_basic: number;
  major_required: number;
  major_elective: number;
  general_elective: number;
  total_credits: number;
}

export type GraduationRequirementForm = Omit<GraduationRequirement, 'id'>;

export interface AcademicProgram {
  id: number;
  department: string;
  major: string | null;
  curriculum_year: number;
  courses: CurriculumCourse[];
  graduation_requirement: GraduationRequirement | null;
}

export interface AcademicProgramPayload {
  department: string;
  major: string | null;
  curriculum_year: number;
  graduation_requirement: GraduationRequirementForm;
  courses: Array<Omit<CurriculumCourseForm, 'course_name_en' | 'description'> & {
    course_name_en: string | null;
    description: string | null;
  }>;
}

export interface AcademicProgramForm {
  department: string;
  major: string;
  curriculum_year: number;
  graduation_requirement: GraduationRequirementForm;
  courses: CurriculumCourseForm[];
}

export interface ChatMessageItem {
  role: 'user' | 'assistant';
  text: string;
}

export interface RecommendationItem {
  type: string;
  tone: string;
  title: string;
  due: string;
}

export interface Semester {
  title: string;
  gpa: string;
  credits: number;
  courses: Array<[string, number, string]>;
}

export type TableRow = string[];
export type RequirementProgress = [string, string, number, string];
export type AppIcon = LucideIcon;
