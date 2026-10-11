import Image from "next/image";

// 본문과 겹치지 않도록 오른쪽 여백(50vw - 본문 절반 - 간격)보다 작게 둔다
export function CornerCharacter() {
  return (
    <Image
      src="/corner-character.png"
      alt=""
      aria-hidden
      width={480}
      height={670}
      sizes="150px"
      className="pointer-events-none fixed right-0 bottom-0 hidden h-auto w-[min(150px,calc(50vw-400px))] select-none xl:block"
    />
  );
}
