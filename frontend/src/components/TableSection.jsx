import Section from './Section.jsx';

export default function TableSection({ title, icon, headers, rows, compact = false }) {
  return (
    <Section title={title} icon={icon}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            {headers.map((header) => (
              <th key={header} className={`text-left py-3 ${compact ? 'px-2' : 'px-4'} text-slate-400 font-medium`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell) => (
                <td key={cell} className={`py-3 ${compact ? 'px-2' : 'px-4'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
