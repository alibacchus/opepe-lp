// 旧LP（素HTML）の確定デザインを忠実移植したもの。CSSは src/index.css に verbatim。
// 変更点は3点のみ：①ヒーローのダッシュボードモック（意匠維持）②訴求軸を安心・信頼に
// ③CTAを「PoCに参加する（無料）」＋Googleフォーム接続。レイアウト・構成は旧LPと同一。
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Parallax from "./motion/Parallax";
import { FadeUp, Stagger, StaggerItem, CountUp } from "./motion/Motion";

const FORM_URL = "https://forms.gle/DAarxxYQjMd3R7fQA";

/* Problem/CTA 背景写真のゆるいパララックス（拡大基調＝縁が見えない）。
   親（.problem-media / .cta-media）は overflow:hidden なので scale で奥行きを出す。
   reduce 時は素の表示（scale 1・動かさない）。CSS の opacity は据え置き。 */
function MediaBgImage({
  className,
  src,
  alt,
  onError,
}: {
  className?: string;
  src?: string;
  alt?: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  if (reduce)
    return (
      <img className={className} src={src} alt={alt} aria-hidden="true" onError={onError} />
    );
  return (
    <motion.img
      ref={ref}
      className={className}
      src={src}
      alt={alt}
      aria-hidden="true"
      onError={onError}
      style={{ scale, y, willChange: "transform" }}
    />
  );
}

export default function App() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number>(0);

  /* Header scroll：スクロール位置で .site-header に scrolled を付与 */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* body.nav-open で overflow lock */
  useEffect(() => {
    document.body.classList.toggle("nav-open", navOpen);
    return () => document.body.classList.remove("nav-open");
  }, [navOpen]);

  /* 出現アニメは Motion（whileInView）に一本化。旧 .reveal クラスは外し二重発火を防ぐ。 */

  const closeMenu = () => setNavOpen(false);

  return (
    <>
      {/* HEADER */}
      <header className="site-header" id="siteHeader" ref={headerRef}>
        <div className="wrap">
          <a className="brand" href="#top">
            <img
              src="/assets/opepe-logo.png"
              alt="OPePe"
              style={{ width: "44px", height: "44px", objectFit: "contain", borderRadius: "8px" }}
            />
            OPePe
          </a>
          <nav className="desktop-nav">
            <a href="#solution">機能</a>
            <a href="#how">使い方</a>
            <a href="#pricing">対象者</a>
            <a href="#faq">FAQ</a>
            <a
              className="nav-cta"
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              PoCに参加する（無料）
            </a>
          </nav>
          <button
            className="menu-toggle"
            id="menuToggle"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`mobile-panel${navOpen ? " active" : ""}`}
        id="mobilePanel"
        hidden={!navOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-sheet">
          <nav>
            <a className="mobile-link" href="#solution" onClick={closeMenu}>
              機能
            </a>
            <a className="mobile-link" href="#how" onClick={closeMenu}>
              使い方
            </a>
            <a className="mobile-link" href="#pricing" onClick={closeMenu}>
              対象者
            </a>
            <a className="mobile-link" href="#faq" onClick={closeMenu}>
              よくある質問
            </a>
            <a
              className="mobile-cta"
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              PoCに参加する（無料）
            </a>
          </nav>
        </div>
      </div>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          {/* ★ メディアレイヤー：画像か動画のどちらかのコメントアウトを外して使用 ★ */}
          <div className="hero-media">
            {/* 画像を使う場合 */}
            <img
              className="hero-media-img"
              src="/assets/hero-bg.jpg"
              alt=""
              aria-hidden="true"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* 動画を使う場合（上の<img>をコメントアウトしてこちらを有効化）
            <video class="hero-media-video" autoplay muted loop playsinline preload="metadata">
              <source src="assets/hero-bg.mp4" type="video/mp4">
            </video>
            */}
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-bg"></div>
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
          <div className="wrap">
            <div className="hero-inner">
              <FadeUp className="hero-copy" delay={0.15} y={20}>
                <span className="eyebrow">
                  <span className="eyebrow-dot"></span>
                  沖縄マリン体験事業者専用
                </span>
                <h1 className="hero-title serif">
                  言葉の通じない
                  <br />
                  お客様とも、
                  <br />
                  <span className="accent">安心と信頼を。</span>
                </h1>
                <p className="hero-lead">
                  OPePeは、参加者の体験を「前・当日・後」までまるごと支えます。多言語の案内とリスクの先読みで安心を、いい思い出を口コミに変えて次のお客様へ。
                </p>
                <div className="hero-actions">
                  <a
                    className="btn btn-primary"
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    無料でPoCに参加
                  </a>
                  <a className="btn btn-ghost" href="#problem">
                    課題を見る
                  </a>
                </div>
                <div className="hero-badges">
                  <span className="badge">🏝️ 沖縄マリン特化</span>
                  <span className="badge">📱 スマホだけで完結</span>
                  <span className="badge">🌐 10言語対応</span>
                  <span className="badge">🔴 体調リスク可視化</span>
                </div>
              </FadeUp>

              {/* Mock Dashboard：静かに出現 → 弱いパララックスで奥行き */}
              <FadeUp className="hero-visual" delay={0.3} y={24}>
                <Parallax amount={30}>
                <div className="dashboard-mock">
                  <div className="mock-pulse"></div>
                  <div className="mock-header">
                    <span className="mock-dot r"></span>
                    <span className="mock-dot y"></span>
                    <span className="mock-dot g"></span>
                    <span className="mock-title">OPePe ダッシュボード</span>
                    <span className="mock-date">2026/04/12 06:05</span>
                  </div>
                  {/* 海況ウィジェット */}
                  <div
                    style={{
                      background: "rgba(74,222,128,.08)",
                      border: "1px solid rgba(74,222,128,.2)",
                      borderRadius: "14px",
                      padding: "10px 12px",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#4ade80",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🟢
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "rgba(255,255,255,.5)",
                          letterSpacing: ".1em",
                          textTransform: "uppercase",
                          marginBottom: "2px",
                        }}
                      >
                        今日の海況（川平湾）
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span
                          style={{ fontSize: "11px", color: "rgba(255,255,255,.7)", fontWeight: 600 }}
                        >
                          波高 0.8m
                        </span>
                        <span
                          style={{ fontSize: "11px", color: "rgba(255,255,255,.7)", fontWeight: 600 }}
                        >
                          風速 9km/h
                        </span>
                        <span
                          style={{ fontSize: "11px", color: "rgba(255,255,255,.7)", fontWeight: 600 }}
                        >
                          降水 10%
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#4ade80",
                        background: "rgba(74,222,128,.1)",
                        padding: "3px 7px",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                    >
                      実施可能
                    </div>
                  </div>

                  <div className="mock-stats">
                    <div className="mock-stat">
                      <div className="mock-stat-val green">9</div>
                      <div className="mock-stat-label">到着済み</div>
                    </div>
                    <div className="mock-stat">
                      <div className="mock-stat-val yellow">2</div>
                      <div className="mock-stat-label">遅刻連絡</div>
                    </div>
                    <div className="mock-stat">
                      <div className="mock-stat-val" style={{ color: "#f87171" }}>
                        1
                      </div>
                      <div className="mock-stat-label">体調要注意</div>
                    </div>
                  </div>
                  <div className="mock-list">
                    <div className="mock-row">
                      <div className="mock-avatar">田</div>
                      <span className="mock-name">田中 陽子（3名）</span>
                      <span style={{ fontSize: "13px", flexShrink: 0 }}>🟢</span>
                      <span className="mock-status arrived">✓ 到着</span>
                    </div>
                    <div className="mock-row">
                      <div className="mock-avatar">K</div>
                      <span className="mock-name">Kim Minjun（2名）</span>
                      <span style={{ fontSize: "13px", flexShrink: 0 }}>🔴</span>
                      <span className="mock-status late">⏱ 遅刻</span>
                    </div>
                    <div className="mock-row">
                      <div className="mock-avatar">李</div>
                      <span className="mock-name">李 小明（4名）</span>
                      <span style={{ fontSize: "13px", flexShrink: 0 }}>🟡</span>
                      <span className="mock-status unknown">— 未確認</span>
                    </div>
                  </div>
                </div>
                </Parallax>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section problem" id="problem">
          {/* ★ メディアレイヤー：画像か動画のどちらかのコメントアウトを外して使用 ★ */}
          <div className="problem-media">
            {/* 画像を使う場合（スクロール連動のゆるい拡大パララックス） */}
            <MediaBgImage
              className="problem-media-img"
              src="/assets/problem-photo.png"
              alt=""
              aria-hidden="true"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* 動画を使う場合（上の<img>をコメントアウトしてこちらを有効化）
            <video class="problem-media-video" autoplay muted loop playsinline preload="metadata">
              <source src="assets/problem-bg.mp4" type="video/mp4">
            </video>
            */}
          </div>
          <div className="problem-overlay"></div>
          <div className="problem-bg"></div>
          <div className="wrap">
            <FadeUp>
              <p className="section-label">Problem</p>
              <h2 className="serif">
                毎朝6時の、
                <br />
                静かな消耗。
              </h2>
            </FadeUp>
            {/* 3カードが順次に出る＝課題が積み上がる意味 */}
            <Stagger className="problem-grid" gap={0.14}>
              <StaggerItem as="article" className="problem-card">
                <div className="problem-icon">🌊</div>
                <span className="problem-card-num">01 / Weather Hell</span>
                <h3>海況判断と連絡が、一人に重なる</h3>
                <p>
                  波高を調べて、風を見て、経験則で判断して、中止なら全員に個別LINE。インバウンド客には翻訳して送る。この作業に、毎朝30分消える。
                </p>
              </StaggerItem>
              <StaggerItem as="article" className="problem-card">
                <div className="problem-icon">🩺</div>
                <span className="problem-card-num">02 / Health Risk</span>
                <h3>体調のリスクを、見えないまま出発する</h3>
                <p>
                  飲酒してきた参加者も、睡眠2時間の参加者も、口頭で「大丈夫ですか？」と聞くしかない。飲酒後の溺水リスクは非飲酒時の10倍——把握できていますか？
                </p>
              </StaggerItem>
              <StaggerItem as="article" className="problem-card">
                <div className="problem-icon">📄</div>
                <span className="problem-card-num">03 / Legal Risk</span>
                <h3>紙の同意書は、いざというとき何も証明できない</h3>
                <p>
                  濡れて読めなくなった紙。どこかへ消えた署名。事故のとき、訴訟のとき——「同意していた」と証明できる記録が、あなたの手元にありますか？
                </p>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* AFFINITY + 数字 */}
        <section style={{ background: "var(--navy)", padding: "clamp(48px,7vw,80px) 0" }}>
          <div className="wrap">
            <FadeUp style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "rgba(237,109,70,.9)",
                  marginBottom: "20px",
                }}
              >
                Affinity
              </p>
              <p
                style={{
                  fontSize: "clamp(22px,2.8vw,34px)",
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.55,
                  letterSpacing: ".02em",
                  fontFamily: "'Playfair Display',serif",
                }}
              >
                「長くやってるから大丈夫」——
                <br />
                <span style={{ color: "var(--gold)" }}>
                  その自信が、見えないリスクを積み上げている。
                </span>
              </p>
              <p
                style={{
                  marginTop: "20px",
                  fontSize: "15px",
                  color: "rgba(255,255,255,.7)",
                  lineHeight: 1.95,
                  maxWidth: "620px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                ベテランのガイドほど、朝の消耗に慣れてしまっている。でも慣れは、リスクを見えなくする。2025年、沖縄の水難事故は過去最多を記録した。あなたは今日、参加者全員の体調を把握して出発しましたか？
              </p>
              <Stagger
                gap={0.09}
                amount={0.4}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "12px",
                  marginTop: "32px",
                }}
              >
                <StaggerItem
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <CountUp
                    target={111}
                    suffix="人"
                    style={{
                      fontSize: "clamp(20px,2.5vw,28px)",
                      fontWeight: 800,
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,.6)",
                      lineHeight: 1.4,
                      textAlign: "left",
                    }}
                  >
                    2025年沖縄
                    <br />
                    マリンレジャー事故（過去最多）
                  </span>
                </StaggerItem>
                <StaggerItem
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <CountUp
                    target={10}
                    suffix="倍"
                    style={{
                      fontSize: "clamp(20px,2.5vw,28px)",
                      fontWeight: 800,
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,.6)",
                      lineHeight: 1.4,
                      textAlign: "left",
                    }}
                  >
                    飲酒後の
                    <br />
                    溺水リスク
                  </span>
                </StaggerItem>
                <StaggerItem
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <CountUp
                    target={10}
                    suffix="言語"
                    style={{
                      fontSize: "clamp(20px,2.5vw,28px)",
                      fontWeight: 800,
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,.6)",
                      lineHeight: 1.4,
                      textAlign: "left",
                    }}
                  >
                    参加者マイページ
                    <br />
                    自動翻訳対応
                  </span>
                </StaggerItem>
                <StaggerItem
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(20px,2.5vw,28px)",
                      fontWeight: 800,
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  >
                    1タップ
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,.6)",
                      lineHeight: 1.4,
                      textAlign: "left",
                    }}
                  >
                    天候連絡
                    <br />
                    （個別LINE不要）
                  </span>
                </StaggerItem>
                <StaggerItem
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(20px,2.5vw,28px)",
                      fontWeight: 800,
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  >
                    0枚
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,.6)",
                      lineHeight: 1.4,
                      textAlign: "left",
                    }}
                  >
                    当日必要な
                    <br />
                    紙の同意書
                  </span>
                </StaggerItem>
              </Stagger>
            </FadeUp>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="section solution" id="solution">
          <div className="wrap">
            <FadeUp className="solution-intro">
              <p className="section-label">Solution</p>
              <h2 className="serif">
                お客様の体験を、
                <br />
                前・当日・後までまるごと支える。
              </h2>
              <p className="lead" style={{ marginTop: "16px" }}>
                OPePeは、沖縄の現場の声から生まれました。体験の前（多言語案内・翻訳・体調の先読み・安全同意）、当日（海況判断・チェックイン）、後（AI口コミドラフト）。体験の全行程を1つのツールで支えます。
              </p>
              <div
                style={{
                  marginTop: "20px",
                  padding: "18px 20px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg,rgba(70,83,162,.06),rgba(70,83,162,.03))",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: "10px",
                  }}
                >
                  Benefit
                </p>
                <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.85 }}>
                  言葉が通じなくても、安心して迎える準備ができる。参加者の顔を見る余裕が生まれる。安全同意の記録が手元に残る。そしていい体験が、次のお客様への信頼につながる。OPePeは「効率化ツール」ではなく、
                  <strong>体験の質と信頼を育てるインフラ</strong>だ。
                </p>
              </div>
            </FadeUp>
            {/* 6カードが順次に出る */}
            <Stagger className="feature-grid" gap={0.1}>
              <StaggerItem as="article" className="feature-card featured">
                <div className="feature-icon">🌐</div>
                <span className="feature-tag" style={{ background: "rgba(237,109,70,.2)", color: "var(--gold)" }}>
                  体験の前
                </span>
                <h3>10言語の参加者案内</h3>
                <p>
                  ja・en・zh-CN・zh-TW・zh-HK・ko・es・fr・pt・it に対応。集合案内や注意事項を、お客様の言語で届ける。言葉が通じないお客様にも、安心の準備が整う。
                </p>
              </StaggerItem>
              <StaggerItem as="article" className="feature-card">
                <div className="feature-icon">📝</div>
                <span className="feature-tag" style={{ background: "rgba(237,109,70,.12)", color: "var(--gold)" }}>
                  体験の前
                </span>
                <h3>本文の自動翻訳 + 体調リスクの先読み</h3>
                <p>
                  集合場所・持ち物・注意事項をDeepLで翻訳。飲酒・睡眠・体調の回答を🔴🟡🟢で可視化し、声かけが必要な参加者を出発前に把握。参加可否の最終判断は運営側で。
                </p>
              </StaggerItem>
              <StaggerItem as="article" className="feature-card">
                <div className="feature-icon">🛡️</div>
                <span className="feature-tag">体験の前</span>
                <h3>安全同意デジタル記録</h3>
                <p>
                  お客様の安全同意を記録に残す。「誰が・いつ・何に同意したか」をCSVで書き出せるので、当日のエビデンスが手元に残る。紙の同意書が濡れて消える時代は終わり。
                </p>
              </StaggerItem>
              <StaggerItem as="article" className="feature-card featured">
                <div className="feature-icon">🌊</div>
                <span className="feature-tag">体験の当日</span>
                <h3>海況の判断補助</h3>
                <p>
                  波高・風速・降水確率から、現在と開催時刻の海況を表示。🔴中止推奨・🟡要検討・🟢実施可能を自動判定。毎朝ひとりで抱えていた判断を支える。
                </p>
              </StaggerItem>
              <StaggerItem as="article" className="feature-card featured">
                <div className="feature-icon">📲</div>
                <span className="feature-tag">体験の当日</span>
                <h3>チェックイン</h3>
                <p>
                  参加者ごとの案内ページからチェックイン。当日の到着状況をダッシュボードでひと目で把握。名前を呼ぶ作業は終わり、お客様を迎える時間が生まれる。
                </p>
              </StaggerItem>
              <StaggerItem as="article" className="feature-card">
                <div className="feature-icon">✍️</div>
                <span className="feature-tag">体験の後</span>
                <h3>AI口コミドラフト</h3>
                <p>
                  当日の内容をもとに、お客様が口コミを書く手がかりを生成。本人が編集して投稿する前提なので、いい体験が自然な口コミとしてGoogleに残りやすくなる。次のお客様への信頼へ。
                </p>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section how" id="how">
          <div className="wrap">
            <FadeUp>
              <p className="section-label">How it works</p>
              <h2 className="serif">
                3ステップで、
                <br />
                当日が変わる。
              </h2>
            </FadeUp>
            {/* 上から順に出る＝時間の流れ */}
            <Stagger className="steps" gap={0.16}>
              <StaggerItem className="step">
                <div className="step-num">01</div>
                <div className="step-body">
                  <h3>ツアーと参加者を登録する</h3>
                  <p>
                    ダッシュボードから実施回を作成し、参加者を追加。じゃらん・アソビュー・電話など、どの予約経路でも対応。活動拠点の位置を設定すれば、海況が自動で表示される。
                  </p>
                  <span className="step-visual">
                    📅 実施回を作成 → 参加者を追加 → 海況が自動表示
                  </span>
                </div>
              </StaggerItem>
              <StaggerItem className="step">
                <div className="step-num">02</div>
                <div className="step-body">
                  <h3>ワンタイムURLを参加者に送る</h3>
                  <p>
                    集合場所・持ち物・体調確認・安全同意が入ったマイページのURLをLINEで送信。参加者は前日までに体調を申告・同意を完了。当日朝に事業者は体調リスクを把握できる。
                  </p>
                  <span className="step-visual">📨 URL送信 → 体調申告 + 安全同意 → 完了</span>
                </div>
              </StaggerItem>
              <StaggerItem className="step">
                <div className="step-num">03</div>
                <div className="step-body">
                  <h3>当日は、お客様を迎えることに集中できる</h3>
                  <p>
                    海況スコアを確認して通知を送る。QRでチェックイン。体調リスクのある参加者に声をかける。言葉が通じないお客様にも、安心して送り出せる準備が整う。
                  </p>
                  <span className="step-visual">
                    🌊 海況確認 → 📲 QRチェックイン → 🔴 体調確認 → 出発
                  </span>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* NARROW DOWN */}
        <section style={{ background: "var(--navy)", padding: "clamp(48px,7vw,80px) 0" }} id="pricing">
          <div className="wrap">
            <FadeUp style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "rgba(237,109,70,.9)",
                  marginBottom: "20px",
                }}
              >
                For You
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(22px,2.8vw,32px)",
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.55,
                  letterSpacing: ".02em",
                }}
              >
                OPePeは、沖縄のマリン体験事業者のために、
                <br />
                <span style={{ color: "var(--gold)" }}>現場から設計した専用ツールです。</span>
              </p>
              <p
                style={{
                  marginTop: "20px",
                  fontSize: "15px",
                  color: "rgba(255,255,255,.7)",
                  lineHeight: 1.95,
                  maxWidth: "580px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                全国対応の汎用ツールではない。沖縄の海況・インバウンド参加者・当日の現場——その文脈だけに特化して作った。今PoCに参加する事業者は、一緒にOPePeを育てる立場になる。現場の声がそのまま機能になる。
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "12px",
                  marginTop: "28px",
                }}
              >
                <div
                  style={{
                    padding: "14px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                    fontSize: "14px",
                    color: "rgba(255,255,255,.8)",
                    fontWeight: 500,
                  }}
                >
                  ✅ シュノーケル・カヤック・SUP事業者
                </div>
                <div
                  style={{
                    padding: "14px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                    fontSize: "14px",
                    color: "rgba(255,255,255,.8)",
                    fontWeight: 500,
                  }}
                >
                  ✅ インバウンド参加者がいる
                </div>
                <div
                  style={{
                    padding: "14px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                    fontSize: "14px",
                    color: "rgba(255,255,255,.8)",
                    fontWeight: 500,
                  }}
                >
                  ✅ 自力集合・複数グループ
                </div>
                <div
                  style={{
                    padding: "14px 20px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.1)",
                    fontSize: "14px",
                    color: "rgba(255,255,255,.8)",
                    fontWeight: 500,
                  }}
                >
                  ✅ 安全管理を記録で残したい
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* FAQ */}
        <section className="section faq-section" id="faq">
          <div className="wrap">
            <FadeUp>
              <p className="section-label">FAQ</p>
              <h2 className="serif">よくある質問</h2>
            </FadeUp>
            <div className="faq-list">
              {FAQ_ITEMS.map((item, i) => {
                const open = openFaq === i;
                return (
                  <FadeUp
                    key={i}
                    as="article"
                    y={12}
                    className={`faq${open ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? -1 : i)}
                    >
                      <span style={item.boldQ ? { fontWeight: 700 } : undefined}>{item.q}</span>
                      <span className="faq-icon">{open ? "−" : "＋"}</span>
                    </button>
                    <div className="faq-answer">
                      <div className="faq-answer-inner">{item.a}</div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section" id="contact">
          {/* ★ メディアレイヤー：画像か動画のどちらかのコメントアウトを外して使用 ★ */}
          <div className="cta-media">
            {/* 画像を使う場合（スクロール連動のゆるい拡大パララックス＝Ken Burns系） */}
            <MediaBgImage
              className="cta-media-img"
              src="/assets/action-photo.png"
              alt=""
              aria-hidden="true"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* 動画を使う場合（上の<img>をコメントアウトしてこちらを有効化）
            <video class="cta-media-video" autoplay muted loop playsinline preload="metadata">
              <source src="assets/cta-bg.mp4" type="video/mp4">
            </video>
            */}
          </div>
          <div className="cta-overlay"></div>
          <div className="wrap">
            <FadeUp>
              <p className="section-label" style={{ color: "rgba(237,109,70,.9)" }}>
                Action
              </p>
              <h2 className="serif">まず、話を聞かせてください。</h2>
              <p className="lead">
                フォームに情報を入力していただければ、OPePeチームよりデモの日程をご連絡します。5分で終わります。売り込みは一切しません。PoC期間中は無料です。
              </p>
            </FadeUp>
            <FadeUp
              className="cta-card"
              delay={0.15}
              style={{
                padding: "32px",
                borderRadius: "var(--radius-xl)",
                background: "rgba(255,255,255,.07)",
                border: "1px solid rgba(255,255,255,.12)",
                backdropFilter: "blur(16px)",
                display: "grid",
                gap: "16px",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
                PoCに参加する（無料）
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>
                フォーム送信後、OPePeチームよりご連絡します。5分のデモで、実際の画面をご覧いただけます。PoC期間中は無料です。
              </p>
              <a
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "56px",
                  padding: "0 32px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontSize: "16px",
                  width: "100%",
                  fontWeight: 700,
                  background: "var(--gold)",
                  color: "#fff",
                  boxShadow: "0 12px 32px rgba(237,109,70,.3)",
                  transition: "all .18s",
                }}
              >
                無料でPoCに参加
              </a>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,.4)", textAlign: "center" }}>
                Googleフォームへ遷移します。送信後、OPePeチームよりご連絡します。
              </p>
            </FadeUp>
          </div>
        </section>
      </main>

      <footer>
        <FadeUp className="wrap" y={10}>
          <div className="footer-brand">
            <img
              src="/assets/opepe-logo.png"
              alt="OPePe"
              style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "6px" }}
            />
            OPePe
          </div>
          <p>株式会社EmTrip</p>
        </FadeUp>
      </footer>
    </>
  );
}

type FaqItem = { q: string; a: React.ReactNode; boldQ?: boolean };

// 旧LPのFAQを verbatim 維持。変更2点のみ：
//  ・「ベータ版と正式版の違い」の月5,000円有料前提 → PoC無料募集と整合する記述に（content.ts FAQ準拠）
//  ・「料金はどうなっていますか？」→ PoC期間中は無料の趣旨に（content.ts FAQ準拠）
const FAQ_ITEMS: FaqItem[] = [
  {
    q: "じゃらん・アソビューを今使っています。OPePeと併用できますか？",
    a: "はい、OPePeは既存の予約システムと完全に独立しています。じゃらん・アソビュー・電話・LINE等、どの経路で受けた予約でも、OPePeに転記するだけで当日オペが使えます。予約管理はこれまで通り、当日の現場オペだけOPePeに切り替えるイメージです。",
  },
  {
    q: "スマホだけで使えますか？PCは必要ですか？",
    a: "スマホだけで完結します。ダッシュボードもマイページもスマホブラウザに最適化されており、アプリのインストールも不要です。PCがある場合は、参加者登録等の事前作業がしやすくなります。",
  },
  {
    q: "外国人参加者にも使えますか？",
    a: "はい。参加者マイページは英語・中国語（簡体字・繁体字）・韓国語・スペイン語・フランス語・ポルトガル語・イタリア語に対応しています。参加者の端末の言語設定に合わせて自動的に切り替わります。言葉が通じないお客様にも、最初から安心して向き合えます。",
  },
  {
    q: "PoC（実証）期間中の費用はどうなりますか？",
    a: "PoC（実証）期間中は無料でご利用いただけます。到着確認・遅刻報告・安全同意・悪天候通知など現在の全機能をお使いいただけます。フィードバックを基に機能改善を進めます。PoC期間は3ヶ月程度を想定しています。期間終了後のご継続については、その時点で改めてご相談させてください。",
  },
  {
    q: "何社でも登録できますか？スタッフの追加は？",
    a: "現在は1事業者（1組織）単位でのご契約です。スタッフは複数名追加できます。複数拠点・フランチャイズ対応は正式版以降での対応を予定しています。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい、いつでも解約できます。PoC期間中は縛り期間・違約金はありません。",
  },
  {
    q: "海況の取得はどこのデータを使っていますか？",
    a: "Open-Meteoの気象APIとMarine APIを使用しています。活動拠点の緯度・経度を設定するだけで、その地点の波高・風速・降水確率がリアルタイムで取得されます。川平湾、米原ビーチなど、拠点ごとに異なる海況を確認できます。判断の最終責任はガイドにあります。OPePeは判断材料を整えるツールです。",
  },
  {
    q: "体調確認機能はどう使うのですか？",
    a: "参加者のマイページに3問のセルフチェックが表示されます（飲酒・睡眠・持病）。回答結果が事業者ダッシュボードに🔴🟡🟢でリアルタイム表示され、声かけが必要な参加者を出発前に把握できます。選択肢はフラットな表示にしており、参加者に警戒心を与えず正直な申告を促す設計です。",
  },
  {
    q: "安全同意の記録はいつ役立ちますか？",
    a: "事故・クレーム・訴訟が発生した際に「誰が・いつ・何に同意したか」をCSVで30秒以内に出力できます。紙の同意書と異なり、紛失・汚損のリスクがありません。日本では体験アクティビティ事業者の事前健康確認義務が裁判例で認められつつあり、デジタル記録の重要性が高まっています。",
  },
  {
    q: "料金はどうなっていますか？",
    a: "現在、一緒にOPePeを育ててくださるPoC参加事業者を募集中です。PoC（実証）期間中は無料でご利用いただけます。期間終了後のご継続については、まずデモを見ていただいた上で、その時点で改めてご相談させてください。",
  },
  {
    q: "OPePeは、どんな事業者に向いていますか？",
    boldQ: true,
    a: (
      <>
        <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>
          ✅ 向いている事業者
        </p>
        <p style={{ marginBottom: "12px" }}>
          沖縄で体験・アクティビティ事業を運営している。当日の電話対応・参加者管理に手間を感じている。インバウンド（外国人）参加者への対応に課題がある。安全管理のデジタル化・記録化を進めたい。新しいツールを一緒に育てる柔軟性がある。
        </p>
        <p style={{ fontWeight: 700, color: "var(--muted)", marginBottom: "8px" }}>
          ❌ 向いていない事業者
        </p>
        <p>
          完成された既製品を求めている（PoCは一緒に育てるフェーズです）。大手ホテルや法人向けの大規模システムを探している。IT・スマホ操作に強い抵抗がある。
        </p>
      </>
    ),
  },
];
