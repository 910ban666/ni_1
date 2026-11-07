<template>
  <div class="app">
    <header class="masthead">
      <p class="kicker">EST. MMXXV &middot; A TINY TYPESET STUDY</p>
      <h1 class="masthead-title">字·印</h1>
      <p class="tagline">一眼计数，一句好话，<em>静。#字</em></p>
      <div class="rule" aria-hidden="true"></div>
    </header>

    <main class="columns">
      <Count />
      <LikeTook />
    </main>
  </div>
</template>

<script setup lang="ts" name="App">
  import Count from './components/Count.vue'
  import LikeTook from './components/LikeTook.vue'
</script>

<style>
  :root {
    --paper: #f1e9d6;          /* 纸张暖米 */
    --card: #faf4e4;           /* 纸卡 */
    --card-deep: #efe5cd;
    --ink: #2b2721;            /* 深墨 */
    --ink-soft: #5f5749;
    --ink-faint: #8a8070;
    --seal: #b2442f;           /* 印章朱红 */
    --line: #ddd0b4;           /* 淡描边 */
    --shadow: 0 10px 24px rgba(43, 39, 33, 0.14);

    --serif: "Noto Serif SC", "Songti SC", "SimSun", Georgia, serif;
    --deco: "Kaiti SC", "STKaiti", "KaiTi", "SimSun", serif;
    --sans: system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;

    --radius: 6px;
    --page-gap: clamp(12px, 2.6vw, 28px);
    --page-pad: clamp(18px, 4vw, 40px);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    min-height: 100vh;
    background-color: var(--paper);
    /* 轻微网点纹理，避免纯色「新拟态」感 */
    background-image: radial-gradient(rgba(43, 39, 33, 0.05) 0.8px, transparent 0.9px);
    background-size: 9px 9px;
    color: var(--ink);
    font-family: var(--sans);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    max-width: 1080px;
    margin: 0 auto;
    padding: clamp(22px, 5vw, 56px) var(--page-pad) 60px;
  }

  /* ---------- 刊头 ---------- */
  .masthead {
    text-align: left;
    margin-bottom: clamp(22px, 4vw, 40px);
    padding-bottom: clamp(14px, 2vw, 20px);
    position: relative;
  }

  .kicker {
    margin: 0 0 6px;
    font-family: var(--serif);
    font-size: clamp(0.62rem, 1.6vw, 0.72rem);
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--seal);
  }

  .masthead-title {
    margin: 0;
    font-family: var(--deco);
    font-weight: 700;
    font-size: clamp(2.2rem, 7vw, 3.4rem);
    letter-spacing: 0.28em;
    text-indent: 0.28em;      /* 抵消末字 letter-spacing 造成的偏移 */
    line-height: 1.15;
  }

  .tagline {
    margin: clamp(6px, 1.4vw, 10px) 0 0;
    font-family: var(--deco);
    font-size: clamp(0.92rem, 2.5vw, 1.05rem);
    color: var(--ink-soft);
  }

  .tagline em {
    color: var(--seal);
    font-style: normal;
  }

  .rule {
    height: 1px;
    margin-top: clamp(14px, 3vw, 22px);
    background-image: linear-gradient(90deg,
        var(--seal) 0 42px,
        transparent 42px 54px,
        var(--ink) 54px 100%);
    opacity: 0.85;
  }

  /* ---------- 列布局 ---------- */
  .columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--page-gap);
    align-items: start;
  }

  /* ---------- 纸卡通用 ---------- */
  .count,
  .talk {
    min-width: 0;
    position: relative;
    padding: clamp(20px, 4vw, 30px);
    background-color: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  /* 左上角贴纸角标：提升「手工标贴」感 */
  .count::before,
  .talk::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 12px;
    width: 34px;
    height: 5px;
    background: var(--seal);
    border-radius: 0 0 3px 3px;
    opacity: 0.85;
  }

  .card-title {
    margin: 0 0 clamp(16px, 3vw, 24px);
    font-family: var(--serif);
    font-weight: 700;
    font-size: clamp(1.05rem, 3vw, 1.25rem);
    letter-spacing: 0.06em;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid var(--line);
    padding-bottom: clamp(10px, 2vw, 14px);
  }

  .card-title.current {
    color: var(--seal);
  }

  /* ---------- 计数器 ---------- */
  .count {
    display: flex;
    flex-direction: column;
    gap: clamp(14px, 3vw, 20px);
  }

  .readings {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(8px, 2vw, 12px);
  }

  .readings span {
    text-align: center;
    padding: clamp(8px, 2vw, 12px);
    background: var(--card-deep);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    font-size: clamp(0.72rem, 2vw, 0.82rem);
    color: var(--ink-soft);
    letter-spacing: 0.04em;
  }

  .readings b {
    display: block;
    margin-top: 2px;
    font-family: var(--serif);
    font-size: clamp(1.25rem, 4vw, 1.6rem);
    color: var(--ink);
    font-variant-numeric: tabular-nums;
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: clamp(10px, 2.4vw, 13px);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--card);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%232b2721' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>");
    background-repeat: no-repeat;
    background-position: right 14px center;
    color: var(--ink);
    font-family: inherit;
    font-size: clamp(0.9rem, 2.4vw, 1rem);
    cursor: pointer;
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(10px, 2.4vw, 14px);
  }

  /* ---------- 按钮：印章手感 ---------- */
  .btn {
    padding: clamp(11px, 2.6vw, 14px);
    border: 1px solid var(--ink);
    border-radius: var(--radius);
    background: transparent;
    color: var(--ink);
    font-family: var(--serif);
    font-size: clamp(0.95rem, 3vw, 1.05rem);
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: background-color 0.18s ease, color 0.18s ease, transform 0.06s ease;
  }

  .btn:hover {
    background: var(--ink);
    color: var(--paper);
  }

  .btn:active {
    transform: translate(1px, 1px);
  }

  .btn-up:hover {
    background: var(--seal);
    border-color: var(--seal);
  }

  .btn-down {
    /* 完全统一，仅保留语义差异在 hover 色上 */
  }

  .btn-quote {
    width: 100%;
    background: var(--seal);
    border-color: var(--seal);
    color: #fdf9ee;
  }

  .btn-quote:hover {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }

  .btn-quote:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ---------- 一言列表 ---------- */
  .error {
    margin: 0 0 clamp(10px, 2vw, 14px);
    padding: clamp(8px, 2vw, 10px);
    border-left: 3px solid var(--seal);
    background: rgba(178, 68, 47, 0.07);
    font-size: clamp(0.8rem, 2.2vw, 0.9rem);
    color: var(--seal);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* 列表固定在限定高度内滚动，避免无限下拉变长 */
  .talk-scroll {
    max-height: clamp(300px, 46vh, 440px);
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--line) transparent;
  }

  .talk-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .talk-scroll::-webkit-scrollbar-thumb {
    background: var(--line);
    border-radius: 3px;
  }

  li {
    padding: clamp(11px, 2.6vw, 14px) 0;
    border-bottom: 1px dashed var(--line);
  }

  li:last-child {
    border-bottom: none;
  }

  .row-top {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .talk-text {
    margin: 0;
    flex: 1;
    font-family: var(--deco);
    font-size: clamp(1rem, 3vw, 1.1rem);
    line-height: 1.7;
    color: var(--ink);
    text-align: left;
    overflow-wrap: anywhere;
  }

  .row-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 6px;
  }

  .talk-author {
    margin: 0;
    font-family: var(--sans);
    font-size: 0.82rem;
    color: var(--ink-soft);
    text-align: left;
  }

  .talk-author::before {
    content: '—— ';
    letter-spacing: 0.5px;
  }

  .row-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  /* 收藏心形按钮 */
  .fav-btn {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border: none;
    background: transparent;
    font-size: 1.15rem;
    line-height: 1;
    color: var(--ink-faint);
    cursor: pointer;
    transition: transform 0.06s ease, color 0.18s ease;
  }

  .fav-btn:hover {
    color: var(--seal);
    transform: scale(1.12);
  }

  .fav-btn.on {
    color: var(--seal);
  }

  /* 细线文字按钮：复制 / 删除 / 清空 */
  .link-btn {
    border: none;
    background: none;
    padding: 0;
    font-family: var(--sans);
    font-size: 0.8rem;
    color: var(--ink-soft);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: var(--line);
  }

  .link-btn:hover {
    color: var(--ink);
    text-decoration-color: var(--seal);
  }

  .link-btn.danger:hover {
    color: var(--seal);
  }

  li.empty {
    color: var(--ink-faint);
    font-family: var(--sans);
    font-size: 0.9rem;
    text-align: center;
    padding: 16px 0;
    border-bottom: none;
  }

  /* ---------- 名言工具栏：tab + 条数 + 清空 ---------- */
  .talk-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: clamp(10px, 2vw, 14px);
  }

  .talk-tabs {
    display: flex;
    gap: 2px;
  }

  .tab {
    border: 1px solid var(--line);
    background: transparent;
    color: var(--ink-soft);
    padding: 5px 14px;
    margin: 0;
    border-radius: 3px;
    font-family: var(--sans);
    font-size: 0.82rem;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .tab + .tab {
    border-left: none;
  }

  .tab b {
    color: var(--seal);
    font-weight: 700;
  }

  .tab.on {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }

  .talk-meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .count-note {
    font-family: var(--sans);
    font-size: 0.8rem;
    color: var(--ink-faint);
  }

  /* ---------- 焦点可访问性 ---------- */
  button:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--seal);
    outline-offset: 2px;
  }

  /* ---------- 移动端优先已满足；宽屏起两列 ---------- */
  @media (min-width: 860px) {
    .columns {
      grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.5fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
    }
  }
</style>