import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/lib/notion";
import { GitHubIcon, LinkedInIcon } from "@/shared/components/SocialIcons";
import { ThemeToggle } from "./ThemeToggle";

const AVATAR_SIZE = 46;

const iconLinkClass =
  "flex size-8 items-center justify-center text-foreground/80 hover:text-foreground transition-colors";

/** 목업의 상단 헤더. 프로필(왼쪽) + 소셜 아이콘·테마 토글(오른쪽), 아래 굵은 구분선. */
export async function SiteHeader() {
  const profile = await getProfile();

  return (
    <header className="flex items-end justify-between gap-6 border-b border-border pb-6">
      <Link href="/" className="flex items-center gap-4 min-w-0">
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar}
            alt=""
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="size-[46px] shrink-0 rounded object-cover bg-muted"
          />
        ) : (
          <Image
            src="/avatar.png"
            alt=""
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="size-[46px] shrink-0 rounded object-cover"
            priority
          />
        )}
        <div className="min-w-0">
          <p className="text-[19px] font-bold tracking-[-0.02em] leading-tight truncate">
            {profile.name}
          </p>
          {profile.bio && (
            <p className="mt-[3px] text-[13px] text-muted-foreground truncate">{profile.bio}</p>
          )}
        </div>
      </Link>

      <nav aria-label="Social links" className="flex items-center gap-1 shrink-0">
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLinkClass}>
            <GitHubIcon />
          </a>
        )}
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLinkClass}>
            <LinkedInIcon />
          </a>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
