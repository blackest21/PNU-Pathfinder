export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${isUser ? 'bg-emerald-600 text-white rounded-br-md' : 'bg-slate-800 text-slate-100 rounded-bl-md'}`}>
        {message.text}
      </div>
    </div>
  );
}
