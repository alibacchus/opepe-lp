// App.tsx 用の出現モーション primitives（§2.0R・B2B信頼系＝最小モーション）。
// CSS意匠は触らず、動きだけを足す。すべて prefers-reduced-motion 完全対応。
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  type Variants,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* 単体の静かな出現（fade-up）。FAQ/footer/見出し等。 */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 16,
  as = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "article" | "section";
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/* 順次出現の親コンテナ。子は <StaggerItem> を使う。意味＝積み上がり／時間の流れ。 */
export function Stagger({
  children,
  className = "",
  gap = 0.1,
  amount = 0.2,
  style,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  amount?: number;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : gap },
    },
  };
  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/* Stagger の子。fade-up（B2B＝控えめ）。as でタグを選べる。 */
export function StaggerItem({
  children,
  className = "",
  y = 18,
  as = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "article";
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  const item: Variants = {
    hidden: reduce ? {} : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE },
    },
  };
  return (
    <Comp className={className} style={style} variants={item}>
      {children}
    </Comp>
  );
}

/* 画面に入ったら数字を 0→target にカウントアップ。数値部だけ置換し suffix は据え置き。 */
export function CountUp({
  target,
  suffix = "",
  className = "",
  style,
  duration = 1.1,
}: {
  target: number;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [val, setVal] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setVal(target);
      return;
    }
    const unsub = rounded.on("change", (v) => setVal(v));
    if (inView) {
      const controls = animate(mv, target, { duration, ease: [0.22, 1, 0.36, 1] });
      return () => {
        controls.stop();
        unsub();
      };
    }
    return unsub;
  }, [inView, reduce, target, duration, mv, rounded]);

  return (
    <span ref={ref} className={className} style={style}>
      {val}
      {suffix}
    </span>
  );
}
