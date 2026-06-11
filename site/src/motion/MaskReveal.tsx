// 写真が「マスクで開く」演出（clip-path inset を 50%→0 へ）。
// 看板シフォン・抹茶ポラロイドで再利用。一律ズームより"現れる"ライブ感が出る。
// 意味：焼きたて／作品が目の前に立ち上がる。
import { type ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type Dir = "center" | "left" | "bottom";

const FROM: Record<Dir, string> = {
  center: "inset(0% 50% 0% 50%)", // 中央から左右に開く
  left: "inset(0% 100% 0% 0%)", // 左から開く
  bottom: "inset(100% 0% 0% 0%)", // 下から立ち上がる
};
const TO = "inset(0% 0% 0% 0%)";

export default function MaskReveal({
  children,
  dir = "center",
  className = "",
}: {
  children: ReactNode;
  dir?: Dir;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // 要素が画面下から入り始め→中央に来るまでで開ききる
    offset: ["start end", "center center"],
  });
  const clipPath = useTransform(scrollYProgress, [0, 1], [FROM[dir], TO]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ clipPath }}>
      {children}
    </motion.div>
  );
}
