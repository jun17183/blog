interface PostTagBadgeProps {
  name: string;
}

export function PostTagBadge({ name }: PostTagBadgeProps) {
  return (
    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
      {name}
    </span>
  );
}
