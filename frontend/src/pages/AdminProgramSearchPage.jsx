import { Fragment, useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, LibraryBig, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { createAcademicProgram, deleteAcademicProgram, getAcademicPrograms, updateAcademicProgram } from '../services/adminApi.js';

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

function formFromProgram(program) {
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
  const [programs, setPrograms] = useState([]);
  const [query, setQuery] = useState('');
  const [openProgramId, setOpenProgramId] = useState(null);
  const [editorMode, setEditorMode] = useState(null);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadPrograms(nextOpenId = openProgramId) {
    try {
      const token = window.localStorage.getItem('pnu-pathfinder-token');
      const result = await getAcademicPrograms(token);
      setPrograms(result);
      setOpenProgramId(nextOpenId);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms(null);
  }, []);

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
  }

  function startEdit(program) {
    setEditorMode('edit');
    setEditingProgramId(program.id);
    setForm(formFromProgram(program));
    setOpenProgramId(program.id);
    setStatus({ type: '', message: '' });
  }

  function closeEditor() {
    setEditorMode(null);
    setEditingProgramId(null);
    setForm(blankForm());
  }

  async function requestCloseEditor() {
    if (editorMode !== 'edit') {
      closeEditor();
      return;
    }

    const shouldSave = window.confirm('수정하시겠습니까?');
    if (shouldSave) {
      await saveCurrentForm();
      return;
    }

    closeEditor();
  }

  function updateProgramField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: field === 'curriculum_year' ? Number(value) : value,
    }));
  }

  function updateRequirement(field, value) {
    setForm((current) => ({
      ...current,
      graduation_requirement: {
        ...current.graduation_requirement,
        [field]: Number(value),
      },
    }));
  }

  function updateCourse(index, field, value) {
    setForm((current) => ({
      ...current,
      courses: current.courses.map((course, courseIndex) => (
        courseIndex === index ? { ...course, [field]: field === 'credits' ? Number(value) : value } : course
      )),
    }));
  }

  function addCourse() {
    setForm((current) => ({ ...current, courses: [...current.courses, { ...emptyCourse }] }));
  }

  function removeCourse(index) {
    setForm((current) => ({
      ...current,
      courses: current.courses.length === 1 ? [{ ...emptyCourse }] : current.courses.filter((_, courseIndex) => courseIndex !== index),
    }));
  }

  function buildPayload() {
    return {
      department: form.department.trim(),
      major: form.major.trim() || null,
      curriculum_year: Number(form.curriculum_year),
      graduation_requirement: form.graduation_requirement,
      courses: form.courses
        .filter((course) => course.completion_category.trim() && course.course_number.trim() && course.course_name_ko.trim() && course.recommended_semester.trim())
        .map((course) => ({
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

  async function saveCurrentForm() {
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const token = window.localStorage.getItem('pnu-pathfinder-token');
      const payload = buildPayload();
      const saved = editorMode === 'edit'
        ? await updateAcademicProgram(token, editingProgramId, payload)
        : await createAcademicProgram(token, payload);

      setStatus({ type: 'success', message: editorMode === 'edit' ? '학과 정보가 수정되었습니다.' : '학과 정보가 생성되었습니다.' });
      closeEditor();
      await loadPrograms(saved.id);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await saveCurrentForm();
  }

  async function handleDelete(program) {
    const confirmed = window.confirm(`${program.department} ${program.major || ''} ${program.curriculum_year} 교과과정을 삭제할까요?`);
    if (!confirmed) return;

    try {
      const token = window.localStorage.getItem('pnu-pathfinder-token');
      await deleteAcademicProgram(token, program.id);
      setStatus({ type: 'success', message: '학과 정보가 삭제되었습니다.' });
      if (editingProgramId === program.id) closeEditor();
      await loadPrograms(null);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="mx-auto max-w-6xl">
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
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
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

        {status.message && (
          <p className={`mb-4 rounded-lg px-3 py-2 text-sm ${status.type === 'error' ? 'bg-rose-950 text-rose-200' : 'bg-emerald-950 text-emerald-200'}`}>
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
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
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

function ProgramEditor({ mode, form, isSubmitting, onSubmit, onClose, onProgramChange, onRequirementChange, onCourseChange, onCourseAdd, onCourseRemove, embedded = false }) {
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
      course.credits,
    ].filter(Boolean).join(' ').toLowerCase().includes(keyword));
  }, [form.courses, courseQuery]);

  return (
    <form className={`${embedded ? 'space-y-6' : 'mb-6 space-y-6 rounded-xl border border-emerald-800 bg-slate-900 p-6'}`} onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{mode === 'edit' ? '학과 정보 편집' : '새 학과 생성'}</h3>
          <p className="text-sm text-slate-400">학과 단위로 졸업요건과 교과목을 함께 저장합니다.</p>
        </div>
        <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800" onClick={onClose} aria-label="닫기">
          <X className="h-5 w-5" />
        </button>
      </div>

      <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <h4 className="mb-4 font-semibold text-slate-100">기본 정보</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextInput label="학부/학과" value={form.department} onChange={(value) => onProgramChange('department', value)} placeholder="의생명융합공학부" required />
          <TextInput label="전공" value={form.major} onChange={(value) => onProgramChange('major', value)} placeholder="첨단바이오공학전공" />
          <TextInput label="교과과정 연도" type="number" value={form.curriculum_year} onChange={(value) => onProgramChange('curriculum_year', value)} placeholder="2024" required min="2000" />
        </div>
      </section>

      <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <h4 className="mb-4 font-semibold text-slate-100">졸업이수학점</h4>
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
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="font-semibold text-slate-100">교과과정</h4>
            <p className="mt-1 text-xs text-slate-500">검색해서 필요한 교과목만 빠르게 수정할 수 있습니다.</p>
          </div>
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
                <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-300" onClick={() => onCourseRemove(index)} aria-label="교과목 삭제">
                  <Trash2 className="h-4 w-4" />
                </button>
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

      <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
        <Save className="h-4 w-4" />
        {isSubmitting ? '저장 중...' : mode === 'edit' ? '수정 저장' : '생성 저장'}
      </button>
    </form>
  );
}

function buildCourseGroups(courses) {
  const used = new Set();
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

function RequirementBadge({ label, value, wide = false }) {
  return (
    <div className={`rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 ${wide ? 'md:col-span-6' : ''}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 font-semibold text-emerald-400 ${wide ? 'text-2xl' : 'text-lg'}`}>{value}</p>
    </div>
  );
}

function CourseCategory({ title, courses }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);

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

function TextInput({ label, value, onChange, placeholder, type = 'text', required = false, min }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input className="auth-input" type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </label>
  );
}

function TextAreaInput({ label, value, onChange, placeholder, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <textarea className="auth-input min-h-24 resize-y" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function NumberInput({ label, field, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input className="auth-input" type="number" min="0" value={value} onChange={(event) => onChange(field, event.target.value)} required />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <select className="auth-input" value={value} onChange={(event) => onChange(event.target.value)} required>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
