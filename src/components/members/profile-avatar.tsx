interface ProfileAvatarProps {
  image: string | null;
  className?: string;
}

export function ProfileAvatar({ image, className = "size-16" }: ProfileAvatarProps) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e3e7ec] text-[#1b2027] ${className}`}>
      {image ? (
        <img src={image} alt="프로필 이미지" className="size-full object-cover" />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-1/2">
          <circle cx="12" cy="8" r="4" />
          <path d="M3 20c0-4.2 3.5-7 9-7s9 2.8 9 7v1H3z" />
        </svg>
      )}
    </div>
  );
}
