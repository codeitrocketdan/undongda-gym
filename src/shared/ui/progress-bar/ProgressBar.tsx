interface ProgressBarProps {
  participantCount: number;
  capacity: number;
}

export default function ProgressBar({
  participantCount,
  capacity,
}: ProgressBarProps) {
  const percent = Math.min((participantCount / capacity) * 100, 100);

  return (
    <div className="h-1.25 w-full overflow-hidden rounded-[10px] bg-slate-200">
      <div
        className="bg-gradient-blue-500 h-full rounded-[10px]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
