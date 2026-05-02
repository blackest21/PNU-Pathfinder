import { Fragment, useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, LibraryBig, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { createAcademicProgram, deleteAcademicProgram, getAcademicPrograms, updateAcademicProgram } from '../services/adminApi';
import type { AcademicProgram, AcademicProgramPayload, CurriculumCourse, CurriculumCourseForm } from '../types';

const categoryGroups = [
  { title: '효원핵심교양', matches: ['효원핵심교양'] },
  { title: '효원균형,창의교양', matches: ['효원균형교양', '효원창의교양'] },
  { title: '전공기초', matches: ['전공기초', '기초교양'] },
  { title: '전공필수', matches: ['전공필수'] },
  { title: '전공선택', matches: ['전공선택'] },
  { title: '일반선택', matches: ['일반선택'] },
];

const categoryOptions = ['효원핵심교양', '효원균형교양', '효원창의교양', '기초교양', '전공기초', '전공필수', '전공선택', '일반선택'];

const emptyCourse = {
  completion_category: '전공필수',
  course_number: '',
  course_name_ko: '',
  course_name_en: '',
  description: '',
  recommended_semester: '',
  credits: 3,
};

const emptyRequirements = {
  liberal_required: 0,
  liberal_elective: 0,
  major_basic: 0,
  major_required: 0,
  major_elective: 0,
  general_elective: 0,
  total_credits: 0,
};

function blankForm() {
  return {
    department: '',
    major: '',
    curriculum_year: new Date().getFullYear(),
    graduation_requirement: { ...emptyRequirements },
    courses: [{ ...emptyCourse }],
  };
}

function formFromProgram(program: AcademicProgram) {
  return {
    department: program.department || '',
    major: program.major || '',
    curriculum_year: program.curriculum_year || new Date().getFullYear(),
    graduation_requirement: {
      ...emptyRequirements,
      ...(program.graduation_requirement || {}),
    },
    courses: program.courses.length > 0
      ? program.courses.map((course) => ({
        completion_category: course.completion_category || '',
        course_number: course.course_number || '',
        course_name_ko: course.course_name_ko || '',
        course_name_en: course.course_name_en || '',
        description: course.description || '',
        recommended_semester: course.recommended_semester || '',
        credits: course.credits || 3,
      }))
      : [{ ...emptyCourse }],
  };
}

export default function AdminProgramSearchPage() {
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [query, setQuery] = useState('');
  const [openProgramId, setOpenProgramId] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | null>(null);
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null);
  const [form, setForm] = useState(blankForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isBasicDirty, setIsBasicDirty] = useState(false);
  const [isRequirementDirty, setIsRequirementDirty] = useState(false);
  const [dirtyCourseIndexes, setDirtyCourseIndexes] = useState<Set<number>>(new Set());
  const [isCourseSectionDirty, setIsCourseSectionDirty] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  async function loadPrograms(nextOpenId: number | null = openProgramId) {
    try {
      const token = window.localStorage.getItem('pnu-pathfinder-token')!;
      const result = await getAcademicPrograms(token);
      setPrograms(result);
      setOpenProgramId(nextOpenId);
    } catch (error) {
      setStatus({ type: 'error', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms(null);
  }, []);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToastMessage('');
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const filteredPrograms = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return programs;

    return programs.filter((program) => {
      const programText = [program.department, program.major, program.curriculum_year].filter(Boolean).join(' ').toLowerCase();
      const courseText = program.courses
        .map((course) => [course.completion_category, course.course_number, course.course_name_ko, course.course_name_en, course.description, course.recommended_semester].filter(Boolean).join(' '))
        .join(' ')
        .toLowerCase();

      return `${programText} ${courseText}`.includes(keyword);
    });
  }, [programs, query]);

  function startCreate() {
    setEditorMode('create');
    setEditingProgramId(null);
    setOpenProgramId(null);
    setForm(blankForm());
    setStatus({ type: '', message: '' });
    setHasUnsavedChanges(false);
    setIsBasicDirty(false);
    setIsRequirementDirty(false);
    setDirtyCourseIndexes(new Set());
    setIsCourseSectionDirty(false);
  }

  function startEdit(program: AcademicProgram) {
    setEditorMode('edit');
    setEditingProgramId(program.id);
    setForm(formFromProgram(program));
    setOpenProgramId(program.id);
    setStatus({ type: '', message: '' });
    setHasUnsavedChanges(false);
    setIsBasicDirty(false);
    setIsRequirementDirty(false);
    setDirtyCourseIndexes(new Set());
    setIsCourseSectionDirty(false);
  }

  function closeEditor() {
    setEditorMode(null);
    setEditingProgramId(null);
    setForm(blankForm());
    setHasUnsavedChanges(false);
    setIsBasicDirty(false);
    setIsRequirementDirty(false);
    setDirtyCourseIndexes(new Set());
    setIsCourseSectionDirty(false);
    setIsCloseConfirmOpen(false);
  }

  function requestCloseEditor() {
    if (!hasUnsavedChanges) {
      closeEditor();
      return;
    }

    setIsCloseConfirmOpen(true);
  }

  async function confirmSaveAndClose() {
    setIsCloseConfirmOpen(false);
    await saveCurrentForm(true);
  }

  function discardChangesAndClose() {
    setIsCloseConfirmOpen(false);
    closeEditor();
  }

  function updateProgramField(field: string, value: string) {
    setHasUnsavedChanges(true);
    setIsBasicDirty(true);
    setForm((current) => ({
      ...current,
      [field]: field === 'curriculum_year' ? Number(value) : value,
    }));
  }

  function updateRequirement(field: string, value: string) {
    setHasUnsavedChanges(true);
    setIsRequirementDirty(true);
    setForm((current) => ({
      ...current,
      graduation_requirement: {
        ...current.graduation_requirement,
        [field]: Number(value),
      },
    }));
  }

  function updateCourse(index: number, field: string, value: string) {
    setHasUnsavedChanges(true);
    setIsCourseSectionDirty(true);
    setDirtyCourseIndexes((current) => new Set(current).add(index));
    setForm((current) => ({
      ...current,
      courses: current.courses.map((course, courseIndex) => (
        courseIndex === index ? { ...course, [field]: field === 'credits' ? Number(value) : value } : course
      )),
    }));
  }

  function addCourse() {
    setHasUnsavedChanges(true);
    setIsCourseSectionDirty(true);
    setDirtyCourseIndexes((current) => {
      const next = new Set<number>([0]);
      current.forEach((index) => next.add(index + 1));
      return next;
    });
    setForm((current) => ({ ...current, courses: [{ ...emptyCourse }, ...current.courses] }));
  }

  function removeCourse(index: number) {
    setHasUnsavedChanges(true);
    setIsCourseSectionDirty(true);
    setDirtyCourseIndexes((current) => {
      const next = new Set<number>();
      current.forEach((dirtyIndex) => {
        if (dirtyIndex < index) next.add(dirtyIndex);
        if (dirtyIndex > index) next.add(dirtyIndex - 1);
      });
      return next;
    });
    setForm((current) => ({
      ...current,
      courses: current.courses.length === 1 ? [{ ...emptyCourse }] : current.courses.filter((_, i) => i !== index),
    }));
  }

  function isDraftCourse(course: CurriculumCourseForm) {
    return !course.course_number.trim() && !course.course_name_ko.trim() && !course.course_name_en.trim() && !course.description.trim() && !course.recommended_semester.trim();
  }

  function isCompleteCourse(course: CurriculumCourseForm) {
    return Boolean(course.completion_category.trim() && course.course_number.trim() && course.course_name_ko.trim() && course.recommended_semester.trim());
  }

  function buildPayload(): AcademicProgramPayload {
    const curriculumYear = Number(form.curriculum_year);
    const completedCourses = form.courses.filter(isCompleteCourse);
    const incompleteCourses = form.courses.filter((course) => !isDraftCourse(course) && !isCompleteCourse(course));

    if (!form.department.trim()) {
      throw new Error('학부/학과를 입력해주세요.');
    }

    if (!Number.isInteger(curriculumYear) || curriculumYear < 2000 || curriculumYear > 2100) {
      throw new Error('교과과정 연도는 2000년부터 2100년 사이의 숫자로 입력해주세요.');
    }

    if (incompleteCourses.length > 0) {
      throw new Error('작성 중인 교과목의 교과목 번호, 한글명, 이수학기를 모두 입력하거나 빈 교과목 행을 삭제해주세요.');
    }

    if (completedCourses.some((course) => Number(course.credits) < 1)) {
      throw new Error('교과목 이수학점은 1 이상이어야 합니다.');
    }

    return {
      department: form.department.trim(),
      major: form.major.trim() || null,
      curriculum_year: curriculumYear,
      graduation_requirement: {
        liberal_required: Number(form.graduation_requirement.liberal_required),
        liberal_elective: Number(form.graduation_requirement.liberal_elective),
        major_basic: Number(form.graduation_requirement.major_basic),
        major_required: Number(form.graduation_requirement.major_required),
        major_elective: Number(form.graduation_requirement.major_elective),
        general_elective: Number(form.graduation_requirement.general_elective),
        total_credits: Number(form.graduation_requirement.total_credits),
      },
      courses: completedCourses.map((course) => ({
        completion_category: course.completion_category.trim(),
        course_number: course.course_number.trim(),
        course_name_ko: course.course_name_ko.trim(),
        course_name_en: course.course_name_en.trim() || null,
        description: course.description.trim() || null,
        recommended_semester: course.recommended_semester.trim(),
        credits: Number(course.credits),
      })),
    };
  }

  async function saveCurrentForm(closeAfter = false) {
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const token = window.localStorage.getItem('pnu-pathfinder-token');
      const payload = buildPayload();
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('저장 데이터 형식이 올바르지 않습니다.');
      }
      if (!payload.graduation_requirement || typeof payload.graduation_requirement !== 'object' || Array.isArray(payload.graduation_requirement)) {
        throw new Error('졸업이수학점 데이터 형식이 올바르지 않습니다.');
      }
      if (!Array.isArray(payload.courses)) {
        throw new Error('교과과정 데이터 형식이 올바르지 않습니다.');
      }
      if (payload.courses.some((course) => !course || typeof course !== 'object' || Array.isArray(course))) {
        throw new Error('교과목 데이터 형식이 올바르지 않습니다.');
      }
      if (!token) {
        throw new Error('관리자 로그인이 필요합니다. 다시 로그인해주세요.');
      }

      let saved;
      if (editorMode === 'edit') {
        if (editingProgramId === null) {
          throw new Error('수정할 학과 정보를 찾지 못했습니다. 다시 편집을 눌러주세요.');
        }
        saved = await updateAcademicProgram(token, editingProgramId, payload);
      } else {
        saved = await createAcademicProgram(token, payload);
      }

      setHasUnsavedChanges(false);
      setIsBasicDirty(false);
      setIsRequirementDirty(false);
      setDirtyCourseIndexes(new Set());
      setIsCourseSectionDirty(false);
      setToastMessage('저장되었습니다!');
      setPrograms((current) => {
        const exists = current.some((program) => program.id === saved.id);
        return exists ? current.map((program) => (program.id === saved.id ? saved : program)) : [saved, ...current];
      });
      setForm(formFromProgram(saved));
      setEditingProgramId(saved.id);
      setOpenProgramId(saved.id);

      if (closeAfter) {
        closeEditor();
      } else if (editorMode === 'create') {
        setEditorMode('edit');
      }

      await loadPrograms(saved.id);
    } catch (error) {
      setStatus({ type: 'error', message: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(program: AcademicProgram) {
    const confirmed = window.confirm(`${program.department} ${program.major || ''} ${program.curriculum_year} 교과과정을 삭제할까요?`);
    if (!confirmed) return;

    try {
      const token = window.localStorage.getItem('pnu-pathfinder-token')!;
      await deleteAcademicProgram(token, program.id);
      setToastMessage('학과 정보가 삭제되었습니다.');
      if (editingProgramId === program.id) closeEditor();
      await loadPrograms(null);
    } catch (error) {
      setStatus({ type: 'error', message: (error as Error).message });
    }
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="mx-auto max-w-6xl">
        {toastMessage && (
          <div className="pointer-events-none fixed inset-x-4 top-1/2 z-50 flex -translate-y-1/2 justify-center">
            <div className="w-full max-w-sm rounded-xl bg-emerald-600 px-5 py-4 text-center text-sm font-semibold text-white shadow-2xl shadow-emerald-950/40 md:max-w-md">
              {toastMessage}
            </div>
          </div>
        )}

        {isCloseConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4" role="dialog" aria-modal="true" aria-labelledby="close-confirm-title">
            <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
              <h3 id="close-confirm-title" className="text-base font-semibold text-slate-100">모두 저장하시겠습니까?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">네를 누르면 변경 사항을 저장하고, 아니요를 누르면 저장하지 않고 원래 상태로 돌아갑니다.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60" onClick={confirmSaveAndClose} disabled={isSubmitting}>
                  네
                </button>
                <button type="button" className="rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60" onClick={discardChangesAndClose} disabled={isSubmitting}>
                  아니요
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600">
              <LibraryBig className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">학과 정보</h2>
              <p className="text-sm text-slate-400">교과과정 연도별로 학과 정보와 졸업요건을 관리합니다.</p>
            </div>
          </div>
          <button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            새 학과 생성
          </button>
        </div>

        {editorMode === 'create' && (
          <ProgramEditor
            mode="create"
            form={form}
            status={status}
            isSubmitting={isSubmitting}
            isBasicDirty={isBasicDirty}
            isRequirementDirty={isRequirementDirty}
            dirtyCourseIndexes={dirtyCourseIndexes}
            isCourseSectionDirty={isCourseSectionDirty}
            onSave={saveCurrentForm}
            onClose={requestCloseEditor}
            onProgramChange={updateProgramField}
            onRequirementChange={updateRequirement}
            onCourseChange={updateCourse}
            onCourseAdd={addCourse}
            onCourseRemove={removeCourse}
          />
        )}

        <section className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">검색어</span>
            <input
              className="auth-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="첨단바이오공학전공, 2024, AB2003552, 면역학..."
            />
          </label>
        </section>

        {status.message && editorMode === null && (
          <p className={`mb-4 whitespace-pre-line rounded-lg px-3 py-2 text-sm ${status.type === 'error' ? 'bg-rose-950 text-rose-200' : 'bg-emerald-950 text-emerald-200'}`}>
            {status.message}
          </p>
        )}

        <section className="space-y-4">
          {isLoading && <p className="text-sm text-slate-400">불러오는 중...</p>}
          {!isLoading && filteredPrograms.length === 0 && <p className="text-sm text-slate-400">검색 결과가 없습니다.</p>}

          {filteredPrograms.map((program) => {
            const requirement = program.graduation_requirement;
            const isOpen = openProgramId === program.id;
            const isEditing = editorMode === 'edit' && editingProgramId === program.id;

            return (
              <article key={program.id} className={`overflow-hidden rounded-xl border bg-slate-800 ${isEditing ? 'border-emerald-700' : 'border-slate-700'}`}>
                <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-700">
                  <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => setOpenProgramId(isOpen ? null : program.id)}>
                    <BookOpen className="h-5 w-5 shrink-0 text-emerald-400" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-100">{program.department}</p>
                      <p className="truncate text-sm text-slate-400">{program.major || '전공 없음'} · {program.curriculum_year} 교과과정 · 교과목 {program.courses.length}개</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-emerald-300" onClick={() => startEdit(program)} aria-label="편집" title="편집">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-300" onClick={() => handleDelete(program)} aria-label="삭제" title="삭제">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800" onClick={() => setOpenProgramId(isOpen ? null : program.id)} aria-label="펼치기" title="펼치기">
                      <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-700 p-6">
                    {isEditing ? (
                      <ProgramEditor
                        mode="edit"
                        form={form}
                        status={status}
                        isSubmitting={isSubmitting}
                        isBasicDirty={isBasicDirty}
                        isRequirementDirty={isRequirementDirty}
                        dirtyCourseIndexes={dirtyCourseIndexes}
                        isCourseSectionDirty={isCourseSectionDirty}
                        onSave={saveCurrentForm}
                        onClose={requestCloseEditor}
                        onProgramChange={updateProgramField}
                        onRequirementChange={updateRequirement}
                        onCourseChange={updateCourse}
                        onCourseAdd={addCourse}
                        onCourseRemove={removeCourse}
                        embedded
                      />
                    ) : (
                      <div className="space-y-8">
                        <section>
                          <h3 className="mb-3 text-base font-semibold text-slate-100">졸업이수학점</h3>
                          {requirement ? (
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                              <RequirementBadge label="교양필수" value={requirement.liberal_required} />
                              <RequirementBadge label="교양선택" value={requirement.liberal_elective} />
                              <RequirementBadge label="전공기초" value={requirement.major_basic} />
                              <RequirementBadge label="전공필수" value={requirement.major_required} />
                              <RequirementBadge label="전공선택" value={requirement.major_elective} />
                              <RequirementBadge label="일반선택" value={requirement.general_elective} />
                              <RequirementBadge label="총 졸업 이수 학점" value={requirement.total_credits} wide />
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400">저장된 졸업이수학점이 없습니다.</p>
                          )}
                        </section>

                        <section>
                          <h3 className="mb-4 text-base font-semibold text-slate-100">교과과정</h3>
                          <div className="space-y-6">
                            {buildCourseGroups(program.courses).map((group) => (
                              <CourseCategory key={group.title} title={group.title} courses={group.courses} />
                            ))}
                          </div>
                        </section>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}

function SectionSaveButton({ isSubmitting, isDirty, onSave }: { isSubmitting: boolean; isDirty: boolean; onSave: () => void }) {
  return (
    <button
      type="button"
      disabled={isSubmitting || !isDirty}
      onClick={() => onSave()}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 enabled:bg-emerald-700 enabled:hover:bg-emerald-600"
    >
      <Save className="h-3.5 w-3.5" />
      {isSubmitting ? '저장 중...' : '저장'}
    </button>
  );
}

function ProgramEditor({ mode, form, status, isSubmitting, isBasicDirty, isRequirementDirty, dirtyCourseIndexes, isCourseSectionDirty, onSave, onClose, onProgramChange, onRequirementChange, onCourseChange, onCourseAdd, onCourseRemove, embedded = false }: {
  mode: string;
  form: ReturnType<typeof blankForm>;
  status: { type: string; message: string };
  isSubmitting: boolean;
  isBasicDirty: boolean;
  isRequirementDirty: boolean;
  dirtyCourseIndexes: Set<number>;
  isCourseSectionDirty: boolean;
  onSave: () => void;
  onClose: () => void;
  onProgramChange: (field: string, value: string) => void;
  onRequirementChange: (field: string, value: string) => void;
  onCourseChange: (index: number, field: string, value: string) => void;
  onCourseAdd: () => void;
  onCourseRemove: (index: number) => void;
  embedded?: boolean;
}) {
  const [courseQuery, setCourseQuery] = useState('');

  const visibleCourses = useMemo(() => {
    const keyword = courseQuery.trim().toLowerCase();
    const indexedCourses = form.courses.map((course, index) => ({ course, index }));
    if (!keyword) return indexedCourses;

    return indexedCourses.filter(({ course }) => [
      course.completion_category,
      course.course_number,
      course.course_name_ko,
      course.course_name_en,
      course.description,
      course.recommended_semester,
      String(course.credits),
    ].join(' ').toLowerCase().includes(keyword));
  }, [form.courses, courseQuery]);

  return (
    <form className={`${embedded ? 'space-y-6' : 'mb-6 space-y-6 rounded-xl border border-emerald-800 bg-slate-900 p-6'}`} onSubmit={(event) => { event.preventDefault(); onSave(); }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{mode === 'edit' ? '학과 정보 편집' : '새 학과 생성'}</h3>
          <p className="text-sm text-slate-400">학과 단위로 졸업요건과 교과목을 함께 저장합니다.</p>
        </div>
        <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800" onClick={onClose} aria-label="닫기">
          <X className="h-5 w-5" />
        </button>
      </div>

      {status.message && (
        <p className={`whitespace-pre-line rounded-lg px-3 py-2 text-sm ${status.type === 'error' ? 'bg-rose-950 text-rose-200' : 'bg-emerald-950 text-emerald-200'}`}>
          {status.message}
        </p>
      )}

      <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="font-semibold text-slate-100">기본 정보</h4>
          {mode === 'edit' && <SectionSaveButton isSubmitting={isSubmitting} isDirty={isBasicDirty} onSave={onSave} />}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextInput label="학부/학과" value={form.department} onChange={(value) => onProgramChange('department', value)} placeholder="의생명융합공학부" required />
          <TextInput label="전공" value={form.major} onChange={(value) => onProgramChange('major', value)} placeholder="첨단바이오공학전공" />
          <TextInput label="교과과정 연도" type="number" value={form.curriculum_year} onChange={(value) => onProgramChange('curriculum_year', value)} placeholder="2024" required min="2000" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="font-semibold text-slate-100">졸업이수학점</h4>
          {mode === 'edit' && <SectionSaveButton isSubmitting={isSubmitting} isDirty={isRequirementDirty} onSave={onSave} />}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <NumberInput label="교양필수" field="liberal_required" value={form.graduation_requirement.liberal_required} onChange={onRequirementChange} />
          <NumberInput label="교양선택" field="liberal_elective" value={form.graduation_requirement.liberal_elective} onChange={onRequirementChange} />
          <NumberInput label="전공기초" field="major_basic" value={form.graduation_requirement.major_basic} onChange={onRequirementChange} />
          <NumberInput label="전공필수" field="major_required" value={form.graduation_requirement.major_required} onChange={onRequirementChange} />
          <NumberInput label="전공선택" field="major_elective" value={form.graduation_requirement.major_elective} onChange={onRequirementChange} />
          <NumberInput label="일반선택" field="general_elective" value={form.graduation_requirement.general_elective} onChange={onRequirementChange} />
          <div className="md:col-span-6">
            <NumberInput label="총 졸업 이수 학점" field="total_credits" value={form.graduation_requirement.total_credits} onChange={onRequirementChange} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="font-semibold text-slate-100">교과과정</h4>
          {mode === 'edit' && <SectionSaveButton isSubmitting={isSubmitting} isDirty={isCourseSectionDirty} onSave={onSave} />}
        </div>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">검색해서 필요한 교과목만 빠르게 수정할 수 있습니다.</p>
          <button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" onClick={onCourseAdd}>
            <Plus className="h-4 w-4" />
            교과목 추가
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-slate-300">교과목 검색</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="auth-input"
              style={{ paddingLeft: '2.5rem' }}
              value={courseQuery}
              onChange={(event) => setCourseQuery(event.target.value)}
              placeholder="교과목명, 번호, 이수 구분, 학기 검색"
            />
          </div>
        </label>

        <div className="space-y-4">
          {visibleCourses.length === 0 && <p className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-400">검색된 교과목이 없습니다.</p>}
          {visibleCourses.map(({ course, index }) => (
            <div key={`${index}-${course.course_number}`} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-300">교과목 {index + 1}</p>
                <div className="flex items-center gap-1">
                  {mode === 'edit' && <SectionSaveButton isSubmitting={isSubmitting} isDirty={dirtyCourseIndexes.has(index)} onSave={onSave} />}
                  <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-300" onClick={() => onCourseRemove(index)} aria-label="교과목 삭제">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <SelectInput label="이수 구분" value={course.completion_category} onChange={(value) => onCourseChange(index, 'completion_category', value)} options={categoryOptions} />
                <TextInput label="교과목 번호" value={course.course_number} onChange={(value) => onCourseChange(index, 'course_number', value)} placeholder="AB2003552" required />
                <TextInput label="교과목명(한글)" value={course.course_name_ko} onChange={(value) => onCourseChange(index, 'course_name_ko', value)} placeholder="첨단바이오공학입문" required />
                <TextInput label="교과목명(영어)" value={course.course_name_en} onChange={(value) => onCourseChange(index, 'course_name_en', value)} placeholder="Introduction to Advanced Biotechnology" />
                <TextInput label="이수학기" value={course.recommended_semester} onChange={(value) => onCourseChange(index, 'recommended_semester', value)} placeholder="1-1" required />
                <TextInput label="이수학점" type="number" value={course.credits} onChange={(value) => onCourseChange(index, 'credits', value)} placeholder="3" required min="1" />
              </div>
              <TextAreaInput className="mt-3" label="과목 설명" value={course.description} onChange={(value) => onCourseChange(index, 'description', value)} placeholder="이 과목은 첨단바이오공학의 핵심 개념과 응용 분야를 다룹니다." />
            </div>
          ))}
        </div>
      </section>
      {mode === 'create' && (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSave()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? '저장 중...' : '학과 생성 저장'}
        </button>
      )}

    </form>
  );
}

function buildCourseGroups(courses: CurriculumCourse[]) {
  const used = new Set<number>();
  const groups = categoryGroups
    .map((group) => {
      const groupedCourses = courses.filter((course) => group.matches.includes(course.completion_category));
      groupedCourses.forEach((course) => used.add(course.id));
      return { title: group.title, courses: groupedCourses };
    })
    .filter((group) => group.courses.length > 0);

  const others = courses.filter((course) => !used.has(course.id));
  if (others.length > 0) groups.push({ title: '기타', courses: others });
  return groups;
}

function RequirementBadge({ label, value, wide = false }: { label: string; value: number; wide?: boolean }) {
  return (
    <div className={`rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 ${wide ? 'md:col-span-6' : ''}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 font-semibold text-emerald-400 ${wide ? 'text-2xl' : 'text-lg'}`}>{value}</p>
    </div>
  );
}

function CourseCategory({ title, courses }: { title: string; courses: CurriculumCourse[] }) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-semibold text-slate-100">{title}</h4>
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">{courses.length}개</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="px-3 py-2 text-left font-medium">이수 구분</th>
              <th className="px-3 py-2 text-left font-medium">교과목 번호</th>
              <th className="px-3 py-2 text-left font-medium">교과목명</th>
              <th className="px-3 py-2 text-left font-medium">영문명</th>
              <th className="px-3 py-2 text-left font-medium">이수학기</th>
              <th className="px-3 py-2 text-right font-medium">학점</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {courses.map((course) => {
              const isSelected = selectedCourseId === course.id;

              return (
                <Fragment key={course.id}>
                  <tr
                    className={`cursor-pointer text-slate-300 transition hover:bg-slate-800 ${isSelected ? 'bg-slate-800' : ''}`}
                    onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
                  >
                    <td className="px-3 py-2">{course.completion_category}</td>
                    <td className="px-3 py-2 font-mono text-xs text-emerald-300">{course.course_number}</td>
                    <td className="px-3 py-2">{course.course_name_ko}</td>
                    <td className="px-3 py-2 text-slate-400">{course.course_name_en || '-'}</td>
                    <td className="px-3 py-2">{course.recommended_semester}</td>
                    <td className="px-3 py-2 text-right">{course.credits}</td>
                  </tr>
                  {isSelected && (
                    <tr className="bg-slate-950 text-slate-300">
                      <td className="px-3 py-4" colSpan={6}>
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-xs font-medium text-emerald-300">{course.course_number}</span>
                            <h5 className="font-semibold text-slate-100">{course.course_name_ko}</h5>
                          </div>
                          <p className="text-sm leading-6 text-slate-300">
                            {course.description || '아직 등록된 과목 설명이 없습니다. 관리자가 편집에서 설명을 추가할 수 있습니다.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type = 'text', required = false, min = undefined }: {
  label: string; value: string | number; onChange: (value: string) => void;
  placeholder: string; type?: string; required?: boolean; min?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input className="auth-input" type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </label>
  );
}

function TextAreaInput({ label, value, onChange, placeholder, className = '' }: {
  label: string; value: string; onChange: (value: string) => void; placeholder: string; className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <textarea className="auth-input min-h-24 resize-y" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function NumberInput({ label, field, value, onChange }: {
  label: string; field: string; value: number; onChange: (field: string, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input className="auth-input" type="number" min="0" value={value} onChange={(event) => onChange(field, event.target.value)} required />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <select className="auth-input" value={value} onChange={(event) => onChange(event.target.value)} required>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
