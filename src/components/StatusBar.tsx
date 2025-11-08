import { SelfTestResult } from '../types';

interface StatusBarProps {
  statusMessage: string;
  selfTestResult: SelfTestResult;
}

const StatusBar: React.FC<StatusBarProps> = ({ statusMessage, selfTestResult }) => {
  const chipBaseStyle = "text-xs px-2 py-1 rounded-full shadow-DEFAULT border";
  const chipStyle = selfTestResult.passed
    ? "bg-green-900/50 border-green-700 text-green-300"
    : "bg-red-900/50 border-red-700 text-red-300";

  return (
    <div className="flex justify-between gap-2 my-2.5 items-center text-sm">
      <span className="text-text-muted">{statusMessage}</span>
      <span aria-live="polite" className={`${chipBaseStyle} ${chipStyle}`}>
        {selfTestResult.message}
      </span>
    </div>
  );
};

export default StatusBar;
