import { FileText, GitBranch, IdCard, KeyRound, LibraryBig, LogOut, Menu, UserRoundPlus } from 'lucide-react';
import type { AppIcon, PageId, UserSession } from '../types';

interface HeaderProps {
  currentUser: UserSession | null;
  onLogout: () => void;
  onMenu: () => void;
  onHome: () => void;
  onNavigate: (page: PageId) => void;
}

export default function Header({ currentUser, onLogout, onMenu, onHome, onNavigate }: HeaderProps) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
      <div className="flex items-center gap-3">
        {!isAdmin && (
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-800" onClick={onMenu} aria-label="사이드바 열기">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <button className="mono text-lg font-bold text-emerald-400 hover:opacity-80 transition cursor-pointer" onClick={onHome}>
          PNU Pathfinder
        </button>
      </div>
      <nav className="flex items-center gap-1">
        {isAdmin ? (
          <>
            <NavButton icon={IdCard} label="내 정보" onClick={() => onNavigate('admin-info')} />
            <NavButton icon={LibraryBig} label="학과 정보" onClick={() => onNavigate('admin-program-search')} />
            <div className="mx-1 h-6 w-px bg-slate-700" />
            <NavButton icon={LogOut} label="로그아웃" onClick={onLogout} />
          </>
        ) : (
          <>
            <NavButton icon={GitBranch} label="What If?" onClick={() => onNavigate('whatif')} />
            <NavButton icon={FileText} label="이력서 작성" onClick={() => onNavigate('resume')} />
            <div className="mx-1 h-6 w-px bg-slate-700" />
            {currentUser ? (
              <>
                <NavButton icon={IdCard} label="내 정보" onClick={() => onNavigate('data')} />
                <NavButton icon={LogOut} label="로그아웃" onClick={onLogout} />
              </>
            ) : (
              <>
                <NavButton icon={KeyRound} label="로그인" onClick={() => onNavigate('login')} />
                <NavButton icon={UserRoundPlus} label="회원가입" onClick={() => onNavigate('signup')} />
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

interface NavButtonProps {
  icon: AppIcon;
  label: string;
  onClick: () => void;
}

function NavButton({ icon: Icon, label, onClick }: NavButtonProps) {
  return (
    <button className="nav-btn px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition flex items-center gap-2" onClick={onClick} aria-label={label} title={label}>
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
