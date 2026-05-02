import { useState } from 'react';
import { KeyRound, UserRoundPlus } from 'lucide-react';
import { login, signup } from '../services/authApi';
import { adminLogin } from '../services/adminApi';
import type { AuthResult } from '../types';

interface AuthFormState {
  name: string;
  student_id: string;
  password: string;
  department: string;
  major: string;
  career_goal: string;
  privacy_consent: boolean;
}

const initialForm: AuthFormState = {
  name: '',
  student_id: '',
  password: '',
  department: '',
  major: '',
  career_goal: '',
  privacy_consent: false,
};

export default function AuthPage({ mode, onSwitchMode, onAuthSuccess }: {
  mode: 'login' | 'signup';
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onAuthSuccess: (result: AuthResult) => void;
}) {
  const isSignup = mode === 'signup';
  const Icon = isSignup ? UserRoundPlus : KeyRound;
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignupValid =
    form.name.trim() &&
    form.student_id.trim() &&
    form.password.length >= 8 &&
    form.department.trim() &&
    form.privacy_consent;
  const isAdminLogin = !isSignup && form.student_id.trim() === 'root';
  const isLoginValid = form.student_id.trim() && (isAdminLogin ? form.password.trim() : form.password.length >= 8);
  const canSubmit = isSignup ? isSignupValid : isLoginValid;

  function updateField<Key extends keyof AuthFormState>(field: Key, value: AuthFormState[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) return;

    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const authResult = isSignup
        ? await signup({
            name: form.name.trim(),
            student_id: form.student_id.trim(),
            password: form.password,
            department: form.department.trim(),
            major: form.major.trim() || null,
            career_goal: form.career_goal.trim() || null,
            privacy_consent: form.privacy_consent,
          })
        : isAdminLogin
          ? await adminLogin({
              admin_id: form.student_id.trim(),
              password: form.password,
            })
          : await login({
              student_id: form.student_id.trim(),
              password: form.password,
            });

      setStatus({ type: 'success', message: isSignup ? '회원가입이 완료되었습니다.' : '로그인되었습니다.' });
      onAuthSuccess(authResult);
    } catch (error) {
      setStatus({ type: 'error', message: isAdminLogin ? '해당 학번이 없습니다.' : (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode() {
    setForm(initialForm);
    setStatus({ type: '', message: '' });
    onSwitchMode(isSignup ? 'login' : 'signup');
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{isSignup ? '회원가입' : '로그인'}</h2>
            <p className="text-sm text-slate-400">
              {isSignup ? 'PNU Pathfinder에서 사용할 학업 정보를 입력하세요.' : '학번과 비밀번호로 다시 시작하세요.'}
            </p>
          </div>
        </div>

        <form className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {isSignup && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">이름</span>
              <input className="auth-input" type="text" placeholder="홍길동" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">학번</span>
            <input className="auth-input" type="text" placeholder="202412345" value={form.student_id} onChange={(event) => updateField('student_id', event.target.value)} required />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">비밀번호</span>
            <input className="auth-input" type="password" placeholder="8자 이상" value={form.password} onChange={(event) => updateField('password', event.target.value)} required minLength={isAdminLogin ? 1 : 8} />
          </label>

          {isSignup && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">학부(학과)</span>
                <input className="auth-input" type="text" placeholder="정보컴퓨터공학부" value={form.department} onChange={(event) => updateField('department', event.target.value)} required />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">전공</span>
                <input className="auth-input" type="text" placeholder="컴퓨터공학전공" value={form.major} onChange={(event) => updateField('major', event.target.value)} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">진로</span>
                <input className="auth-input" type="text" placeholder="아직 정하지 않았으면 비워두세요" value={form.career_goal} onChange={(event) => updateField('career_goal', event.target.value)} />
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
                <input
                  className="mt-1 h-4 w-4 accent-emerald-500"
                  type="checkbox"
                  checked={form.privacy_consent}
                  onChange={(event) => updateField('privacy_consent', event.target.checked)}
                />
                <span>
                  개인정보 활용에 동의합니다.
                  <span className="mt-1 block text-xs text-slate-500">입력한 정보는 학업·진로 추천 및 계정 관리 목적으로 활용됩니다.</span>
                </span>
              </label>
            </>
          )}

          {status.message && (
            <p className={`rounded-lg px-3 py-2 text-sm ${status.type === 'error' ? 'bg-rose-950 text-rose-200' : 'bg-emerald-950 text-emerald-200'}`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
              canSubmit && !isSubmitting ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-600 text-slate-300'
            }`}
          >
            {isSubmitting ? '처리 중...' : isSignup ? '가입하기' : '로그인'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-400">
          {isSignup ? '이미 계정이 있나요?' : '아직 계정이 없나요?'}{' '}
          <button className="font-semibold text-emerald-400 hover:text-emerald-300" onClick={switchMode}>
            {isSignup ? '로그인' : '회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}
