import { ShieldCheck } from 'lucide-react';

export default function AdminInfoPage() {
  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold">내 정보</h2>
        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">관리자</p>
              <p className="text-sm text-slate-400">학과별 교육과정과 졸업 기준 정보를 관리합니다.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
