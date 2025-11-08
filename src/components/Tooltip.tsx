import { Info } from 'lucide-react';

interface TooltipProps {
  tip: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ tip }) => {
  return (
    <div className="relative group flex items-center justify-center">
      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-air-bg text-air-text text-xs font-sans cursor-help">
        <Info size={10} />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 max-w-xs bg-[#0b2740] text-white border border-[#0f4d66] rounded-lg px-2.5 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-sm">
        {tip}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-b-6 border-b-[#0b2740]" style={{borderLeftWidth: '6px', borderRightWidth: '6px', borderBottomWidth: '6px'}}></div>
      </div>
    </div>
  );
};

export default Tooltip;
