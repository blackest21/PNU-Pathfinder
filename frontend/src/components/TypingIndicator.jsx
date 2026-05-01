export default function TypingIndicator() {
  return (
    <div className="flex justify-start fade-in">
      <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
        <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full inline-block" />
      </div>
    </div>
  );
}
