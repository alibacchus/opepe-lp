// 縦パララックス（スクロールで子要素がゆっくり上下にずれる）。
// Hero写真で使用＝奥行き＝空間への期待。弱め（スマホでカクつかせない）。
import { type ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export default function Parallax({
  children,
  amount = 40, // ずれ幅(px)。大きいほど強い。Heroは弱めに。
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // 画面を通過する間で動かす
  });
  // 進行 0→1 で +amount/2 → -amount/2（中央付近で素の位置）
  const y = useTransform(scrollYProgress, [0, 1], [amount / 2, -amount / 2]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
