export default function CreditSummary() {
  return (
    <div className="mt-6 pt-4 border-t-2 border-slate-600 space-y-2">
      <SummaryRow label="전공필수" value="12/33학점" color="text-emerald-400" />
      <SummaryRow label="전공선택" value="18/30학점" color="text-emerald-400" />
      <SummaryRow label="교양" value="16/27학점" color="text-blue-400" />
    </div>
  );
}

function SummaryRow({ label, value, color }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      <span className={`${color} font-semibold`}>{value}</span>
    </div>
  );
}
