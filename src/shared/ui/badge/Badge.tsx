interface BadgeProps {
  count: number;
}

export default function Badge({ count }: BadgeProps) {
  return (
    <div className="flex h-4 w-5 items-center justify-center rounded-xl bg-blue-500 text-xs text-white md:h-5 md:w-6">
      {count >= 99 ? "99+" : count}
    </div>
  );
}
