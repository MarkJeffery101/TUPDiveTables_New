import { DecompressionRecord, EXPECTED_HEADERS } from '../types';

interface DecompressionTableProps {
  records: DecompressionRecord[];
  selectedRowIndex: number | null;
  onRowClick: (index: number) => void;
}

const HeaderCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <th className={`font-semibold text-center text-xs p-1.5 h-14 align-middle whitespace-nowrap border-r border-black/20 ${className}`}>
    {children}
  </th>
);

const MultiLineHeader: React.FC<{ top: string; sub: string }> = ({ top, sub }) => (
  <>
    <span className="block font-bold">{top}</span>
    <span className="block text-xs opacity-90 mt-0.5">{sub}</span>
  </>
);

const DecompressionTable: React.FC<DecompressionTableProps> = ({ records, selectedRowIndex, onRowClick }) => {
  const getRowClass = (flag: number | null) => {
    switch (flag) {
      case 1: return 'bg-flag-green';
      case 2: return 'bg-flag-pink shadow-[inset_0_-4px_0_theme(colors.flag-red-shadow)]';
      case 3: return 'bg-flag-red';
      default: return 'odd:bg-gray-900/50 even:bg-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse separate border-spacing-0 bg-card-bg border border-border shadow-DEFAULT rounded-xl overflow-hidden">
        <thead className="text-sm">
          <tr>
            <HeaderCell className="air-bg text-air-text text-left pl-3 rounded-tl-xl"><MultiLineHeader top="Depth" sub="(m/sw)" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text"><MultiLineHeader top="Bottom" sub="Time Min" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text"><MultiLineHeader top="Time till" sub="(1st stop Min)" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text">24 Air</HeaderCell>
            <HeaderCell className="air-bg text-air-text">21 Air</HeaderCell>
            <HeaderCell className="air-bg text-air-text">18 Air</HeaderCell>
            <HeaderCell className="tup-bg text-tup-text">15 Air<br />TUP</HeaderCell>
            <HeaderCell className="oxy-bg text-oxy-text"><MultiLineHeader top="15" sub="Oxygen" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text">12 Air</HeaderCell>
            <HeaderCell className="oxy-bg text-oxy-text"><MultiLineHeader top="12" sub="Oxygen" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text">9 Air</HeaderCell>
            <HeaderCell className="oxy-bg text-oxy-text"><MultiLineHeader top="9" sub="Oxygen" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text">6 Air</HeaderCell>
            <HeaderCell className="oxy-bg text-oxy-text"><MultiLineHeader top="6" sub="Oxygen" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text">3 Air</HeaderCell>
            <HeaderCell className="oxy-bg text-oxy-text"><MultiLineHeader top="3" sub="Oxygen" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text"><MultiLineHeader top="Total Deco" sub="Time Min" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text"><MultiLineHeader top="Total" sub="OTU" /></HeaderCell>
            <HeaderCell className="air-bg text-air-text border-r-0 rounded-tr-xl"><MultiLineHeader top="Total" sub="ESOT" /></HeaderCell>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, index) => {
            const isSelected = selectedRowIndex === index;
            const isFlagged = rec._flag !== null;
            const useDarkText = isSelected || isFlagged;

            return (
              <tr 
                key={index} 
                className={`transition-colors duration-150 cursor-pointer ${getRowClass(rec._flag)} hover:bg-gray-700 ${isSelected ? '!bg-selection-yellow' : ''}`}
                onClick={() => onRowClick(index)}
              >
                {EXPECTED_HEADERS.map((header, cellIndex) => (
                  <td key={header} className={`border-t border-border p-1.5 text-xs text-center ${cellIndex === 0 ? 'text-left pl-3' : ''} ${useDarkText ? 'text-dark-strong' : 'text-text-dark'}`}>
                    {rec[header]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DecompressionTable;
