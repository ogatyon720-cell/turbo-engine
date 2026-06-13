(function () {
  "use strict";

  const STORAGE_KEY = "kuku-collection-princess-v1";
  const STATS_KEY = "kuku-collection-princess-stats-v1";
  const factors = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const modeOrder = ["learn", "choice", "sequence", "random", "master"];
  const itemNames = ["ヘアアクセ", "トップス", "スカート", "くつ", "アクセサリー"];
  const itemIcons = ["♡", "◇", "☆", "♧", "✦"];
  const rewardItems = {
    1: ["ショートケーキカチューシャ", "いちごブラウス", "ベリーフリルスカート", "ベリーベリーシューズ", "ストロベリーイヤリング"],
    2: ["にじのティアラ", "レインボーケープ", "にじいろスカート", "にじのくつ", "きらにじブローチ"],
    3: ["アイドルリボンマイク", "ステージトップス", "きらきらアイドルスカート", "スターライトブーツ", "ハートサンライト"],
    4: ["ほしのかみかざり", "よぞらケープ", "きらほしスカート", "おほしさまブーツ", "ムーンペンダント"],
    5: ["キャンディリボン", "スイートドレス", "キャンディスカート", "キャンディシューズ", "ロリポップチャーム"],
    6: ["ゆめいろヘアピン", "ふわゆめトップス", "くものスカート", "ゆめかわブーツ", "まほうチャーム"],
    7: ["おはなクラウン", "フラワーブラウス", "はなびらスカート", "おはなパンプス", "フラワーブレスレット"],
    8: ["ひまわりカチューシャ", "マリンセーラートップス", "なついろスカート", "サマーサンダル", "シェルイヤリング"],
    9: ["リボンの髪飾り", "リボントップス", "ふわリボンスカート", "リボンのヒール", "ダブルハートイヤリング"]
  };
  const assetPaths = {
    treasureClosed: "assets/treasure-closed.png",
    treasureOpen: "assets/treasure-open.png",
    item: (dan, mode) => `assets/items/${dan}-${mode}.png`,
    outfit: (dan) => `assets/outfits/${dan}-full.png`,
    summaryOutfit: (id) => `assets/outfits/${id}-full.png`,
    reviewOutfit: (id) => `assets/outfits/${id}-full.png`
  };
  const modes = {
    learn: { title: "みておぼえる", desc: "いみを みながら ゆっくり おぼえるよ" },
    choice: { title: "3たくでれんしゅう", desc: "こたえを 3つから えらぶよ" },
    sequence: { title: "じゅんばんれんしゅう", desc: "1から9まで じゅんばんに れんしゅう" },
    random: { title: "むしくいれんしゅう", desc: "？に はいる かずを えらぶよ" },
    master: { title: "マスターチャレンジ", desc: "6つのこたえから えらぶ さいごのチャレンジ" }
  };
  const rewards = {
    1: { name: "いちごコーデ", icon: "♡" },
    2: { name: "にじコーデ", icon: "◇" },
    3: { name: "アイドルコーデ", icon: "☆" },
    4: { name: "ほしぞらコーデ", icon: "✦" },
    5: { name: "キャンディコーデ", icon: "○" },
    6: { name: "ゆめかわコーデ", icon: "✧" },
    7: { name: "おはなコーデ", icon: "✿" },
    8: { name: "なついろコーデ", icon: "☀" },
    9: { name: "リボンコーデ", icon: "♡" }
  };
  const summaryStages = [
    { id: "summary-1-3", title: "1〜3のだん", name: "もこもこコーデ", dans: [1, 2, 3] },
    { id: "summary-4-6", title: "4〜6のだん", name: "ジュエルコーデ", dans: [4, 5, 6] },
    { id: "summary-7-9", title: "7〜9のだん", name: "プリンセスコーデ", dans: [7, 8, 9] },
    { id: "summary-all", title: "ぜんぶ", name: "ウエディングコーデ", dans: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
  ];
  const reviewStages = [
    { id: "review-1-3", title: "1〜3のだん", name: "チャイナコーデ", dans: [1, 2, 3] },
    { id: "review-4-6", title: "4〜6のだん", name: "サリーコーデ", dans: [4, 5, 6] },
    { id: "review-7-9", title: "7〜9のだん", name: "チマチョゴリコーデ", dans: [7, 8, 9] },
    { id: "review-all", title: "ぜんぶ", name: "ゆかたコーデ", dans: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
  ];
  const mapPositions = {
    dan: {
      1: { x: 17, y: 82 },
      2: { x: 24, y: 63 },
      3: { x: 35, y: 51 },
      4: { x: 47, y: 42 },
      5: { x: 48, y: 72 },
      6: { x: 61, y: 57 },
      7: { x: 64, y: 79 },
      8: { x: 76, y: 45 },
      9: { x: 84, y: 66 }
    },
    group: {
      "summary-1-3": { x: 24, y: 93 },
      "summary-4-6": { x: 42, y: 93 },
      "summary-7-9": { x: 60, y: 93 },
      "summary-all": { x: 78, y: 93 }
    }
  };
  const readings = {
    "1x1": "いんいちがいち", "1x2": "いんにがに", "1x3": "いんさんがさん", "1x4": "いんしがし", "1x5": "いんごがご", "1x6": "いんろくがろく", "1x7": "いんしちがしち", "1x8": "いんはちがはち", "1x9": "いんくがく",
    "2x1": "にいちがに", "2x2": "ににんがし", "2x3": "にさんがろく", "2x4": "にしがはち", "2x5": "にごじゅう", "2x6": "にろくじゅうに", "2x7": "にしちじゅうし", "2x8": "にはちじゅうろく", "2x9": "にくじゅうはち",
    "3x1": "さんいちがさん", "3x2": "さんにがろく", "3x3": "さざんがく", "3x4": "さんしじゅうに", "3x5": "さんごじゅうご", "3x6": "さぶろくじゅうはち", "3x7": "さんしちにじゅういち", "3x8": "さんぱにじゅうし", "3x9": "さんくにじゅうしち",
    "4x1": "しいちがし", "4x2": "しにがはち", "4x3": "しさんじゅうに", "4x4": "ししじゅうろく", "4x5": "しごにじゅう", "4x6": "しろくにじゅうし", "4x7": "ししちにじゅうはち", "4x8": "しはさんじゅうに", "4x9": "しくさんじゅうろく",
    "5x1": "ごいちがご", "5x2": "ごにじゅう", "5x3": "ごさんじゅうご", "5x4": "ごしにじゅう", "5x5": "ごごにじゅうご", "5x6": "ごろくさんじゅう", "5x7": "ごしちさんじゅうご", "5x8": "ごはしじゅう", "5x9": "ごっくしじゅうご",
    "6x1": "ろくいちがろく", "6x2": "ろくにじゅうに", "6x3": "ろくさんじゅうはち", "6x4": "ろくしにじゅうし", "6x5": "ろくごさんじゅう", "6x6": "ろくろくさんじゅうろく", "6x7": "ろくしちしじゅうに", "6x8": "ろくはしじゅうはち", "6x9": "ろっくごじゅうし",
    "7x1": "しちいちがしち", "7x2": "しちにじゅうし", "7x3": "しちさんにじゅういち", "7x4": "しちしにじゅうはち", "7x5": "しちごさんじゅうご", "7x6": "しちろくしじゅうに", "7x7": "しちしちしじゅうく", "7x8": "しちはごじゅうろく", "7x9": "しちくろくじゅうさん",
    "8x1": "はちいちがはち", "8x2": "はちにじゅうろく", "8x3": "はちさんにじゅうし", "8x4": "はちしさんじゅうに", "8x5": "はちごしじゅう", "8x6": "はちろくしじゅうはち", "8x7": "はちしちごじゅうろく", "8x8": "はっぱろくじゅうし", "8x9": "はっくしちじゅうに",
    "9x1": "くいちがく", "9x2": "くにじゅうはち", "9x3": "くさんにじゅうしち", "9x4": "くしさんじゅうろく", "9x5": "くごしじゅうご", "9x6": "くろくごじゅうし", "9x7": "くしちろくじゅうさん", "9x8": "くはしちじゅうに", "9x9": "くくはちじゅういち"
  };

  const app = document.getElementById("app");
  const homeButton = document.getElementById("homeButton");
  const dressupButton = document.getElementById("dressupButton");
  const resetButton = document.getElementById("resetButton");
  const adminButton = document.getElementById("adminButton");
  const closetButton = document.getElementById("closetButton");
  let state = loadState();
  let stats = loadStats();
  let currentView = { name: "title" };

  homeButton.addEventListener("click", () => renderStages());
  dressupButton.addEventListener("click", renderDressupPage);
  resetButton.addEventListener("click", resetProgress);
  adminButton.addEventListener("click", toggleAdminMode);
  closetButton.addEventListener("click", renderCloset);

  function defaultState() {
    const stages = {};
    factors.forEach((dan) => {
      stages[dan] = {
        clearedModes: {},
        clearCounts: {},
        unlockedModes: { learn: true, choice: true, sequence: false, random: false, master: false },
        items: [false, false, false, false, false],
        mastered: false
      };
    });
    const summaries = {};
    summaryStages.forEach((summary) => {
      summaries[summary.id] = { clearCount: 0, mastered: false };
    });
    const reviews = {};
    reviewStages.forEach((review) => {
      reviews[review.id] = { clearCount: 0, mastered: false };
    });
    return { stages, summaries, reviews, selectedOutfit: 1, selectedPrincess: { type: "default", id: "default" }, adminMode: false, adminBackup: null };
  }

  function defaultStats() {
    const problems = {};
    factors.forEach((dan) => {
      factors.forEach((multiplier) => {
        problems[problemKey(dan, multiplier)] = { attempts: 0, correct: 0 };
      });
    });
    return { problems };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return mergeState(defaultState(), saved || {});
    } catch (error) {
      return defaultState();
    }
  }

  function loadStats() {
    try {
      const saved = JSON.parse(localStorage.getItem(STATS_KEY));
      return mergeStats(defaultStats(), saved || {});
    } catch (error) {
      return defaultStats();
    }
  }

  function mergeStats(base, saved) {
    const incoming = saved.problems || {};
    factors.forEach((dan) => {
      factors.forEach((multiplier) => {
        const key = problemKey(dan, multiplier);
        const item = incoming[key] || {};
        base.problems[key] = {
          attempts: Math.max(0, Number(item.attempts || 0)),
          correct: Math.max(0, Number(item.correct || 0))
        };
      });
    });
    return base;
  }

  function mergeState(base, saved) {
    factors.forEach((dan) => {
      const incoming = saved.stages && saved.stages[dan] ? saved.stages[dan] : {};
      const mergedItems = Array.isArray(incoming.items) ? incoming.items.slice(0, 5).concat([false, false, false, false, false]).slice(0, 5) : base.stages[dan].items;
      const mergedClearCounts = { ...base.stages[dan].clearCounts, ...(incoming.clearCounts || {}) };
      modeOrder.forEach((mode, index) => {
        if (mergedClearCounts[mode] === undefined) {
          if (mergedItems[index]) {
            mergedClearCounts[mode] = 3;
          } else if (incoming.clearedModes && incoming.clearedModes[mode]) {
            mergedClearCounts[mode] = 1;
          } else {
            mergedClearCounts[mode] = 0;
          }
        }
      });
      base.stages[dan] = {
        ...base.stages[dan],
        ...incoming,
        clearedModes: { ...base.stages[dan].clearedModes, ...(incoming.clearedModes || {}) },
        clearCounts: mergedClearCounts,
        unlockedModes: { ...base.stages[dan].unlockedModes, ...(incoming.unlockedModes || {}) },
        items: mergedItems
      };
    });
    summaryStages.forEach((summary) => {
      const incoming = saved.summaries && saved.summaries[summary.id] ? saved.summaries[summary.id] : {};
      base.summaries[summary.id] = {
        ...base.summaries[summary.id],
        ...incoming,
        clearCount: Math.min(5, Number(incoming.clearCount || 0)),
        mastered: Boolean(incoming.mastered)
      };
    });
    reviewStages.forEach((review) => {
      const incoming = saved.reviews && saved.reviews[review.id] ? saved.reviews[review.id] : {};
      base.reviews[review.id] = {
        ...base.reviews[review.id],
        ...incoming,
        clearCount: Math.min(3, Number(incoming.clearCount || 0)),
        mastered: Boolean(incoming.mastered)
      };
    });
    base.selectedOutfit = saved.selectedOutfit || 1;
    base.selectedPrincess = saved.selectedPrincess || (saved.selectedOutfit ? { type: "dan", id: saved.selectedOutfit } : { type: "default", id: "default" });
    base.adminMode = Boolean(saved.adminMode);
    base.adminBackup = saved.adminBackup || null;
    return base;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function saveStats() {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  function problemKey(dan, multiplier) {
    return `${dan}x${multiplier}`;
  }

  function recordProblemAnswer(dan, multiplier, isCorrect) {
    const key = problemKey(dan, multiplier);
    if (!stats.problems[key]) stats.problems[key] = { attempts: 0, correct: 0 };
    stats.problems[key].attempts += 1;
    if (isCorrect) stats.problems[key].correct += 1;
    saveStats();
  }

  function resetProgress() {
    const ok = window.confirm("すすみぐあいを ぜんぶ リセットしますか？");
    if (!ok) return;
    state = defaultState();
    saveState();
    updateAdminButton();
    renderStages();
  }

  function toggleAdminMode() {
    if (state.adminMode) {
      state = state.adminBackup ? mergeState(defaultState(), state.adminBackup) : defaultState();
      state.adminMode = false;
      state.adminBackup = null;
      saveState();
      updateAdminButton();
      renderCurrentView();
      return;
    }
    state.adminBackup = JSON.parse(JSON.stringify({ ...state, adminMode: false, adminBackup: null }));
    factors.forEach((dan) => {
      const stage = state.stages[dan];
      modeOrder.forEach((mode, index) => {
        stage.clearedModes[mode] = true;
        stage.clearCounts[mode] = 3;
        stage.unlockedModes[mode] = true;
        stage.items[index] = true;
      });
      stage.mastered = true;
    });
    summaryStages.forEach((summary) => {
      state.summaries[summary.id] = { clearCount: 5, mastered: true };
    });
    reviewStages.forEach((review) => {
      state.reviews[review.id] = { clearCount: 3, mastered: true };
    });
    state.adminMode = true;
    saveState();
    updateAdminButton();
    renderCurrentView();
  }

  function updateAdminButton() {
    adminButton.classList.toggle("active", state.adminMode);
    adminButton.textContent = state.adminMode ? "管理者ON" : "管理者OFF";
    adminButton.setAttribute("aria-pressed", state.adminMode ? "true" : "false");
  }

  function renderCurrentView() {
    if (currentView.name === "stages") {
      renderStages();
    } else if (currentView.name === "stage") {
      renderStage(currentView.dan);
    } else if (currentView.name === "closet") {
      renderCloset();
    } else if (currentView.name === "dressup") {
      renderDressupPage();
    } else if (currentView.name === "guardian") {
      renderGuardianPage();
    } else {
      renderStages();
    }
  }

  function renderTitle() {
    document.body.classList.remove("home-image-mode");
    currentView = { name: "title" };
    app.innerHTML = `
      <section class="panel hero">
        <div>
          <h2>かわいい コーデを あつめながら、くくを おぼえよう</h2>
          <p>まずは みて、つぎに 3つから えらぶよ。ゆっくり できたを ふやしていこう。</p>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="stages">ステージをえらぶ</button>
            <button class="secondary-button" type="button" data-action="closet">クローゼット</button>
          </div>
        </div>
        <div class="princess-preview" aria-hidden="true">
          <div class="princess-card">
            <span class="floating-item">☆</span>
            <span class="floating-item">◆</span>
            <span class="floating-item">♡</span>
            <span class="princess">姫</span>
          </div>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelector('[data-action="closet"]').addEventListener("click", renderCloset);
  }

  function renderStages(selected = null) {
    document.body.classList.add("home-image-mode");
    currentView = { name: "stages", selected };
    app.innerHTML = `
      <section class="image-home">
        <div class="image-home-canvas">
          <img class="image-home-bg" src="assets/home-bg.png" alt="くくコレプリンセス ステージマップ">
          ${homePrincessBustHtml(selected)}
          ${homeSelectedInfoHtml(selected)}
          ${homeRecommendationHtml()}
          <img class="home-closet-button-art" src="assets/closet_button_transparent.png" alt="" aria-hidden="true">
          <button class="home-hotspot dressup-hotspot" type="button" data-action="dressup" aria-label="きせかえ"></button>
          <button class="home-hotspot closet-hotspot" type="button" data-action="closet" aria-label="クローゼット"></button>
          <button class="home-hotspot guardian-hotspot" type="button" data-action="guardian" aria-label="おうちの人"></button>
          ${factors.map((dan) => homeDanHotspotHtml(dan, selected)).join("")}
          ${summaryStages.map((summary) => homeGroupHotspotHtml(summary, selected)).join("")}
        </div>
      </section>
    `;
    app.querySelector('[data-action="dressup"]').addEventListener("click", renderDressupPage);
    app.querySelector('[data-action="closet"]').addEventListener("click", renderCloset);
    app.querySelector('[data-action="guardian"]').addEventListener("click", renderGuardianPage);
    app.querySelector('[data-action="recommend"]').addEventListener("click", () => openRecommendation(getRecommendation()));
    app.querySelectorAll("[data-select-dan]").forEach((button) => {
      const selectDan = () => {
        const dan = Number(button.dataset.selectDan);
        if (!isSameHomeSelection(currentView.selected, { type: "dan", id: dan })) renderStages({ type: "dan", id: dan });
      };
      button.addEventListener("mouseenter", selectDan);
      button.addEventListener("focus", selectDan);
      button.addEventListener("click", () => {
        renderStage(Number(button.dataset.selectDan));
      });
    });
    app.querySelectorAll("[data-select-group]").forEach((button) => {
      const selectGroup = () => {
        const id = button.dataset.selectGroup;
        const summary = summaryStages.find((item) => item.id === id);
        if (!isSummaryUnlocked(summary)) return;
        if (!isSameHomeSelection(currentView.selected, { type: "summary", id })) {
          renderStages({ type: "summary", id });
        }
      };
      button.addEventListener("mouseenter", selectGroup);
      button.addEventListener("focus", selectGroup);
      button.addEventListener("click", () => {
        const id = button.dataset.selectGroup;
        const summary = summaryStages.find((item) => item.id === id);
        if (!isSummaryUnlocked(summary)) return;
        renderSummaryStage(summary);
      });
    });
  }

  function homeDanHotspotHtml(dan, selected) {
    const positions = {
      1: { x: 12.2, y: 57.8, w: 13.8, h: 16.8 },
      2: { x: 20.4, y: 32.5, w: 12.8, h: 12.6 },
      3: { x: 34.0, y: 27.0, w: 11.8, h: 12.4 },
      4: { x: 50.0, y: 37.6, w: 12.6, h: 12.5 },
      5: { x: 36.5, y: 47.2, w: 12.5, h: 12.8 },
      6: { x: 53.5, y: 58.0, w: 12.5, h: 12.8 },
      7: { x: 29.2, y: 63.8, w: 12.3, h: 11.7 },
      8: { x: 43.0, y: 70.8, w: 12.3, h: 12.0 },
      9: { x: 61.7, y: 70.0, w: 12.7, h: 12.5 }
    };
    const pos = positions[dan];
    const active = isSameHomeSelection(selected, { type: "dan", id: dan });
    return `<button class="home-hotspot stage-hotspot ${active ? "selected" : ""}" style="${hotspotStyle(pos)}" type="button" data-select-dan="${dan}" aria-label="${dan}のだん"></button>`;
  }

  function homePrincessBustHtml(selected) {
    const princess = getHomePreviewPrincess(selected);
    return `
      <div class="home-princess-bust ${selected ? "stage-preview" : ""}" aria-label="${princess.name}">
        <img class="${princess.locked ? "silhouette-img" : ""}" src="${princess.src}" alt="${princess.name}" onload="hideFallback(this)" onerror="this.hidden=true">
        <span class="outfit-silhouette" aria-hidden="true"></span>
      </div>
    `;
  }

  function getHomePreviewPrincess(selected) {
    if (!selected) return { ...getSelectedPrincess(), locked: false };
    if (selected.type === "dan") {
      const dan = Number(selected.id);
      const complete = state.stages[dan].items.every(Boolean);
      return { name: complete ? rewards[dan].name : "まだひみつのコーデ", src: assetPaths.outfit(dan), locked: !complete };
    }
    if (selected.type === "summary") {
      const summary = summaryStages.find((item) => item.id === selected.id);
      const review = reviewStages.find((item) => item.title === summary.title);
      const reviewComplete = state.reviews[review.id].mastered;
      const summaryComplete = state.summaries[summary.id].mastered;
      if (!reviewComplete) return { name: "まだひみつのコーデ", src: assetPaths.reviewOutfit(review.id), locked: true };
      return { name: summaryComplete ? summary.name : "まだひみつのコーデ", src: assetPaths.summaryOutfit(summary.id), locked: !summaryComplete };
    }
    return { ...getSelectedPrincess(), locked: false };
  }

  function homeSelectedInfoHtml(selected) {
    if (!selected) return "";
    if (selected.type === "summary") return homeSelectedSummaryInfoHtml(selected);
    const info = getHomeStageInfo(selected);
    return `
      <div class="home-stage-info" aria-label="${info.title} クリアじょうきょう">
        <img class="home-stage-info-frame" src="assets/stage_info_frame.png" alt="" aria-hidden="true">
        <div class="home-stage-info-content">
          <strong>${info.outfitName}</strong>
          <span class="home-stage-info-count">${info.countText}</span>
          <div class="home-stage-info-reward ${info.complete ? "complete" : "locked"}">
            ${info.rewardHtml}
          </div>
          ${info.note ? `<small>${info.note}</small>` : ""}
        </div>
      </div>
    `;
  }

  function homeSelectedSummaryInfoHtml(selected) {
    const summary = summaryStages.find((item) => item.id === selected.id);
    const review = reviewStages.find((item) => item.title === summary.title);
    const summaryState = state.summaries[summary.id];
    const reviewState = state.reviews[review.id];
    return `
      <div class="home-stage-info summary-info" aria-label="${summary.title} クリアじょうきょう">
        <img class="home-stage-info-frame" src="assets/stage_info_frame.png" alt="" aria-hidden="true">
        <div class="home-stage-info-content summary-info-content">
          ${homeSummaryProgressBlock("おさらい", reviewState.mastered ? review.name : "？？？コーデ", reviewState.clearCount, 3, reviewState.mastered)}
          <span class="home-summary-divider" aria-hidden="true"></span>
          ${homeSummaryProgressBlock("マスター", summaryState.mastered ? summary.name : "？？？コーデ", summaryState.clearCount, 5, summaryState.mastered)}
        </div>
      </div>
    `;
  }

  function homeSummaryProgressBlock(label, name, count, total, complete) {
    return `
      <div class="home-summary-progress-block ${complete ? "complete" : ""}">
        <strong>${label}</strong>
        <span>${name}</span>
        <em>${complete ? "クリア済み" : `${count}/${total}`}</em>
      </div>
    `;
  }

  function getHomeStageInfo(selected) {
    if (selected.type === "dan") {
      const dan = Number(selected.id);
      const stage = state.stages[dan];
      const itemCount = stage.items.filter(Boolean).length;
      const complete = itemCount === 5;
      const nextIndex = Math.min(4, stage.items.findIndex((owned) => !owned));
      const safeNextIndex = nextIndex < 0 ? 4 : nextIndex;
      return {
        title: `${dan}のだん`,
        outfitName: complete ? rewards[dan].name : "？？？コーデ",
        countText: `${itemCount}/5`,
        complete,
        rewardHtml: complete
          ? `<span class="home-complete-message">クリアずみ！</span>`
          : `<img class="silhouette-img" src="${assetPaths.item(dan, modeOrder[safeNextIndex])}" alt="${getRewardItemName(dan, safeNextIndex)}" onload="hideFallback(this)" onerror="this.hidden=true"><span class="item-fallback" aria-hidden="true">？</span>`,
        note: complete ? "" : "つぎは これ！"
      };
    }
    const summary = summaryStages.find((item) => item.id === selected.id);
    const summaryState = state.summaries[summary.id];
    const complete = summaryState.mastered;
    return {
      title: summary.title,
      outfitName: complete ? summary.name : "？？？コーデ",
      countText: `${summaryState.clearCount}/5`,
      complete,
      rewardHtml: complete
        ? `<span class="home-complete-message">クリアずみ！</span>`
        : `<img class="silhouette-img" src="${assetPaths.summaryOutfit(summary.id)}" alt="${summary.name}" onload="hideFallback(this)" onerror="this.hidden=true"><span class="item-fallback" aria-hidden="true">？</span>`,
      note: complete ? "" : "5かいでゲット！"
    };
  }

  function homeRecommendationHtml() {
    const recommend = getRecommendation();
    return `
      <button class="home-recommend-card" type="button" data-action="recommend" aria-label="きょうのおすすめ ${recommend.title}">
        <span class="home-recommend-title">${recommend.title}</span>
        <span class="home-recommend-mode">${recommend.modeLabel}</span>
        <span class="home-recommend-cta" aria-hidden="true">
          <img src="assets/start_button.png" alt="">
        </span>
      </button>
    `;
  }

  function getRecommendation() {
    const summary13 = summaryStages.find((summary) => summary.id === "summary-1-3");
    const summary46 = summaryStages.find((summary) => summary.id === "summary-4-6");
    const summary79 = summaryStages.find((summary) => summary.id === "summary-7-9");
    const summaryAll = summaryStages.find((summary) => summary.id === "summary-all");
    const checkpoints = [
      { upto: 3, summary: summary13 },
      { upto: 6, summary: summary46 },
      { upto: 9, summary: summary79 }
    ];
    const checkpoint = checkpoints.find((item) => isSummaryUnlocked(item.summary) && !state.summaries[item.summary.id].mastered);
    if (checkpoint) {
      return {
        type: "summary",
        id: checkpoint.summary.id,
        title: checkpoint.summary.title,
        modeLabel: "まとめステージ"
      };
    }
    if ([summary13, summary46, summary79].every((summary) => state.summaries[summary.id].mastered) && !state.summaries[summaryAll.id].mastered) {
      return { type: "summary", id: summaryAll.id, title: summaryAll.title, modeLabel: "まとめステージ" };
    }
    for (const dan of factors) {
      const mode = modeOrder.find((item) => getModeClearCount(state.stages[dan], item) < 3);
      if (mode) {
        return { type: "dan", id: dan, mode, title: `${dan}のだん`, modeLabel: modes[mode].title };
      }
    }
    return { type: "summary", id: summaryAll.id, title: "ぜんぶ", modeLabel: "まとめステージ" };
  }

  function isDansComplete(start, end) {
    for (let dan = start; dan <= end; dan += 1) {
      if (!state.stages[dan].items.every(Boolean)) return false;
    }
    return true;
  }

  function openRecommendation(recommend) {
    if (recommend.type === "summary") {
      const summary = summaryStages.find((item) => item.id === recommend.id);
      renderSummaryStage(summary);
      return;
    }
    startMode(recommend.id, recommend.mode);
  }

  function homeGroupHotspotHtml(summary, selected) {
    const positions = {
      "summary-1-3": { x: 11.0, y: 88.2, w: 17.4, h: 19.5 },
      "summary-4-6": { x: 26.6, y: 88.2, w: 17.4, h: 19.5 },
      "summary-7-9": { x: 42.9, y: 88.2, w: 17.4, h: 19.5 },
      "summary-all": { x: 59.9, y: 88.2, w: 17.4, h: 19.5 }
    };
    const pos = positions[summary.id];
    const active = isSameHomeSelection(selected, { type: "summary", id: summary.id });
    const unlocked = isSummaryUnlocked(summary);
    const lockedArt = `<span class="home-summary-lock-art home-summary-lock-${summary.id}" aria-hidden="true"><img src="assets/home-summary-locked-strip.png" alt=""></span>`;
    return `<button class="home-hotspot group-hotspot ${active ? "selected" : ""} ${unlocked ? "" : "locked"}" style="${hotspotStyle(pos)}" type="button" data-select-group="${summary.id}" aria-label="${summary.title}" ${unlocked ? "" : "disabled"}>${unlocked ? "" : lockedArt}</button>`;
  }

  function isSameHomeSelection(a, b) {
    return a && b && a.type === b.type && String(a.id) === String(b.id);
  }

  function hotspotStyle(pos) {
    return `--x:${pos.x}%; --y:${pos.y}%; --w:${pos.w}%; --h:${pos.h}%;`;
  }

  function todayRecommendHtml(selected) {
    const recommendDan = factors.find((dan) => state.stages[dan].items.some((owned) => !owned)) || 1;
    const isSelected = selected.type === "dan" && selected.id === recommendDan;
    return `
      <section class="side-card recommend-card">
        <h3>きょうのおすすめ</h3>
        <p>${recommendDan}のだんを ちょっとだけ やってみよう。</p>
        <button class="recommend-button ${isSelected ? "active" : ""}" type="button" data-select-dan="${recommendDan}">
          ${recommendDan}のだんを みる
        </button>
      </section>
    `;
  }

  function princessStandardHtml() {
    const princess = getSelectedPrincess();
    return `
      <section class="side-card princess-standard">
        <div class="standard-princess-frame">
          <img src="${princess.src}" alt="${princess.name}" onload="hideFallback(this)" onerror="this.hidden=true">
          <span class="outfit-silhouette" aria-hidden="true"></span>
        </div>
      </section>
    `;
  }

  function dressupTabHtml() {
    const choices = getOwnedPrincessChoices();
    return `
      <section class="side-card dressup-card">
        <h3>きせかえ</h3>
        <div class="dressup-scroll">
          ${choices.map((choice) => {
            const active = isSamePrincess(choice.key, state.selectedPrincess);
            return `
              <button class="dressup-choice ${active ? "active" : ""}" type="button" data-princess-choice='${JSON.stringify(choice.key)}'>
                <span class="dressup-thumb">
                  <img src="${choice.src}" alt="${choice.name}" onload="hideFallback(this)" onerror="this.hidden=true">
                  <span class="outfit-silhouette" aria-hidden="true"></span>
                </span>
                <span>${choice.name}</span>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderDressupPage() {
    document.body.classList.remove("home-image-mode");
    currentView = { name: "dressup" };
    const choices = getOwnedPrincessChoices();
    app.innerHTML = `
      <section class="panel dressup-page">
        <div class="dressup-page-head">
          <div>
            <h2 class="section-title">きせかえ</h2>
            <p class="soft-text">すきなプリンセスを ひとり えらぼう。横にスクロールできるよ。</p>
          </div>
          <button class="secondary-button" type="button" data-action="stages">ホームにもどる</button>
        </div>
        <div class="dressup-wide-scroll">
          ${choices.map((choice) => {
            const active = isSamePrincess(choice.key, state.selectedPrincess);
            return `
              <button class="dressup-full-card ${active ? "active" : ""}" type="button" data-princess-choice='${JSON.stringify(choice.key)}'>
                <span class="dressup-full-frame">
                  <img src="${choice.src}" alt="${choice.name}" onload="hideFallback(this)" onerror="this.hidden=true">
                  <span class="outfit-silhouette" aria-hidden="true"></span>
                </span>
                <strong>${choice.name}</strong>
                <span class="badge">${active ? "いまのプリンセス" : "えらぶ"}</span>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-princess-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedPrincess = JSON.parse(button.dataset.princessChoice);
        saveState();
        renderDressupPage();
      });
    });
  }

  function renderGuardianPage() {
    document.body.classList.remove("home-image-mode");
    currentView = { name: "guardian" };
    app.innerHTML = `
      <section class="panel guardian-page">
        <div class="guardian-head">
          <div>
            <h2 class="section-title">おうちの人</h2>
            <p class="soft-text">すすみぐあい、リセット、かくにん用のスイッチを ここに まとめました。</p>
          </div>
          <button class="secondary-button" type="button" data-action="stages">ホームへ</button>
        </div>
        <div class="guardian-actions">
          <article class="guardian-card">
            <h3>はじめから</h3>
            <p>あつめたアイテムやクリアを、ぜんぶ さいしょにもどします。</p>
            <button class="reset-button guardian-control-button" type="button" data-action="guardian-reset">リセット</button>
          </article>
          <article class="guardian-card">
            <h3>かくにんモード</h3>
            <p>画面やアイテムをためすために、すべてクリアした状態にします。</p>
            <button class="admin-button guardian-control-button ${state.adminMode ? "active" : ""}" type="button" data-action="guardian-admin" aria-pressed="${state.adminMode ? "true" : "false"}">
              ${state.adminMode ? "管理者ON" : "管理者OFF"}
            </button>
          </article>
        </div>
        ${guardianProgressControlsHtml()}
        ${guardianStatsHtml()}
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelector('[data-action="guardian-reset"]').addEventListener("click", resetProgress);
    app.querySelector('[data-action="guardian-admin"]').addEventListener("click", toggleAdminMode);
    app.querySelectorAll("[data-progress-toggle]").forEach((input) => {
      input.addEventListener("change", () => {
        toggleProgressFromGuardian(input);
      });
    });
  }

  function guardianProgressControlsHtml() {
    return `
      <section class="guardian-progress-tools">
        <div class="guardian-stats-head">
          <h3>ステージのクリア</h3>
          <p>ひとつずつ クリア/未クリアを きりかえます。</p>
        </div>
        <div class="guardian-stage-list">
          ${factors.map((dan) => `
            <article class="guardian-stage-toggle-card">
              <h4>${dan}のだん</h4>
              <div class="guardian-stage-toggle-body">
                ${guardianSwitchHtml({
                  type: "danAll",
                  id: dan,
                  label: "まとめて",
                  checked: state.stages[dan].items.every(Boolean),
                  extraClass: "all-toggle"
                })}
                <div class="guardian-toggle-grid">
                ${modeOrder.map((mode) => guardianSwitchHtml({
                  type: "dan",
                  id: dan,
                  mode,
                  label: modes[mode].title,
                  checked: getModeClearCount(state.stages[dan], mode) >= 3
                })).join("")}
                </div>
              </div>
            </article>
          `).join("")}
          <article class="guardian-stage-toggle-card wide">
            <h4>おさらいステージ</h4>
            <div class="guardian-toggle-grid summary-toggle-grid">
              ${reviewStages.map((review) => guardianSwitchHtml({
                type: "review",
                id: review.id,
                label: `${review.title} おさらい`,
                checked: state.reviews[review.id].mastered
              })).join("")}
            </div>
          </article>
          <article class="guardian-stage-toggle-card wide">
            <h4>まとめステージ</h4>
            <div class="guardian-toggle-grid summary-toggle-grid">
              ${summaryStages.map((summary) => guardianSwitchHtml({
                type: "summary",
                id: summary.id,
                label: `${summary.title} まとめ`,
                checked: state.summaries[summary.id].mastered
              })).join("")}
            </div>
          </article>
        </div>
      </section>
    `;
  }

  function guardianSwitchHtml({ type, id, mode = "", label, checked, extraClass = "" }) {
    return `
      <label class="guardian-switch ${extraClass} ${checked ? "checked" : ""}">
        <input type="checkbox" data-progress-toggle data-type="${type}" data-id="${id}" data-mode="${mode}" ${checked ? "checked" : ""}>
        <span class="switch-track" aria-hidden="true"><span></span></span>
        <strong>${label}</strong>
      </label>
    `;
  }

  function toggleProgressFromGuardian(input) {
    const type = input.dataset.type;
    const id = input.dataset.id;
    const checked = input.checked;
    if (type === "dan") {
      setModeCleared(Number(id), input.dataset.mode, checked);
    } else if (type === "danAll") {
      setDanAllCleared(Number(id), checked);
    } else if (type === "summary") {
      setSummaryCleared(id, checked);
    } else if (type === "review") {
      setReviewCleared(id, checked);
    }
    saveState();
    renderGuardianPage();
  }

  function guardianStatsHtml() {
    return `
      <section class="guardian-stats">
        <div class="guardian-stats-head">
          <h3>せいとうりつ</h3>
          <p>リセットしても のこります。</p>
        </div>
        <div class="stats-grid">
          ${factors.map((dan) => `
            <article class="stats-row-card">
              <h4>${dan}のだん</h4>
              <div class="problem-rate-grid">
                ${factors.map((multiplier) => problemRateHtml(dan, multiplier)).join("")}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function problemRateHtml(dan, multiplier) {
    const item = stats.problems[problemKey(dan, multiplier)] || { attempts: 0, correct: 0 };
    const rate = item.attempts ? Math.round((item.correct / item.attempts) * 100) : null;
    return `
      <span class="problem-rate ${rate === null ? "empty" : rate >= 80 ? "good" : rate >= 50 ? "ok" : "care"}">
        <strong>${dan}×${multiplier}</strong>
        <em>${rate === null ? "--" : `${rate}%`}</em>
        <small>${item.correct}/${item.attempts}</small>
      </span>
    `;
  }

  function getSelectedPrincess() {
    const choices = getOwnedPrincessChoices();
    const selected = choices.find((choice) => isSamePrincess(choice.key, state.selectedPrincess));
    return selected || choices[0];
  }

  function getOwnedPrincessChoices() {
    const choices = [{ key: { type: "default", id: "default" }, name: "はじめのプリンセス", src: "assets/outfits/default-girl.png" }];
    factors.forEach((dan) => {
      if (state.stages[dan].items.every(Boolean)) {
        choices.push({ key: { type: "dan", id: dan }, name: rewards[dan].name, src: assetPaths.outfit(dan) });
      }
    });
    reviewStages.forEach((review) => {
      if (state.reviews[review.id].mastered) {
        choices.push({ key: { type: "review", id: review.id }, name: review.name, src: assetPaths.reviewOutfit(review.id) });
      }
    });
    summaryStages.forEach((summary) => {
      if (state.summaries[summary.id].mastered) {
        choices.push({ key: { type: "summary", id: summary.id }, name: summary.name, src: assetPaths.summaryOutfit(summary.id) });
      }
    });
    return choices;
  }

  function isSamePrincess(a, b) {
    return a && b && a.type === b.type && String(a.id) === String(b.id);
  }

  function coordinateProgressHtml() {
    const normalOwned = factors.reduce((sum, dan) => sum + state.stages[dan].items.filter(Boolean).length, 0);
    const reviewOwned = reviewStages.filter((review) => state.reviews[review.id].mastered).length;
    const summaryOwned = summaryStages.filter((summary) => state.summaries[summary.id].mastered).length;
    return `
      <section class="side-card">
        <h3>コーデ進捗</h3>
        <div class="progress-lines">
          <span>だんコーデ <strong>${normalOwned}/45</strong></span>
          <span>おさらい <strong>${reviewOwned}/4</strong></span>
          <span>まとめ <strong>${summaryOwned}/4</strong></span>
        </div>
      </section>
    `;
  }

  function selectedStageInfoHtml(selected) {
    if (selected.type === "group") return selectedGroupInfoHtml(selected.id);
    return selectedDanInfoHtml(selected.id);
  }

  function selectedDanInfoHtml(dan) {
    const stage = state.stages[dan];
    const count = stage.items.filter(Boolean).length;
    return `
      <section class="side-card selected-info-card">
        <h3>${dan}のだん</h3>
        <p class="soft-text">${count === 5 ? rewards[dan].name : "？？？コーデ"} / ${count}/5</p>
        <div class="selected-mode-list">
          ${modeOrder.map((mode, index) => `
            <div class="selected-mode-row">
              <span>${modes[mode].title}</span>
              <span>${starHtml(getModeClearCount(stage, mode))}</span>
              <span class="mode-reward tiny ${stage.items[index] ? "owned" : "missing"}">${modeRewardGraphic(dan, index, stage.items[index])}</span>
            </div>
          `).join("")}
        </div>
        <p class="soft-text small-note">いまは確認だけ。問題画面へは進みません。</p>
      </section>
    `;
  }

  function selectedGroupInfoHtml(summaryId) {
    const summary = summaryStages.find((item) => item.id === summaryId);
    const review = reviewStages.find((item) => item.title === summary.title);
    const reviewState = state.reviews[review.id];
    const summaryState = state.summaries[summary.id];
    const summaryUnlocked = isSummaryUnlocked(summary);
    return `
      <section class="side-card selected-info-card">
        <h3>${summary.title}</h3>
        <div class="group-info-block">
          <strong>おさらいステージ</strong>
          <span>${reviewState.mastered ? review.name : "？？？コーデ"}</span>
          <span>${smallStarHtml(reviewState.clearCount, 3)}</span>
        </div>
        <div class="group-info-block ${summaryUnlocked ? "" : "locked"}">
          <strong>まとめステージ</strong>
          <span>${summaryUnlocked ? (summaryState.mastered ? summary.name : "？？？コーデ") : "通常ステージを先にクリア"}</span>
          <span>${summaryUnlocked ? summaryStarHtml(summaryState.clearCount) : "ロック"}</span>
        </div>
        <p class="soft-text small-note">このカードから、おさらいとまとめに入る予定です。</p>
      </section>
    `;
  }

  function renderStage(dan) {
    document.body.classList.remove("home-image-mode");
    currentView = { name: "stage", dan };
    updateUnlocks(dan);
    const stage = state.stages[dan];
    const choiceCleared = getModeClearCount(stage, "choice") > 0;
    const templateSrc = choiceCleared ? "assets/stage-mode-template.png" : "assets/stage-mode-template-locked.png";
    const modeButtons = modeOrder.map((mode, index) => {
      const unlocked = stage.unlockedModes[mode];
      const clearCount = getModeClearCount(stage, mode);
      const rewardReady = stage.items[index];
      return `
        <button class="stage-mode-hotspot stage-mode-${mode} ${rewardReady ? "owned" : "missing"}" type="button" data-mode="${mode}" ${unlocked ? "" : "disabled"} aria-label="${modes[mode].title}">
          ${choiceCleared && !unlocked ? `<span class="stage-lock-card-art" aria-hidden="true"><img src="assets/stage-mode-template-locked.png" alt=""></span>` : ""}
          <span class="stage-template-stars" aria-label="${clearCount}かい クリア">${starHtml(clearCount)}</span>
          <span class="stage-template-item" aria-label="${rewardReady ? `${getRewardItemName(dan, index)} ゲット` : "まだ もっていない アイテム"}">
            ${modeRewardGraphic(dan, index, rewardReady)}
          </span>
        </button>
      `;
    }).join("");
    app.innerHTML = `
      <section class="stage-template-screen" aria-label="${dan}のだん">
        <div class="stage-template-canvas">
          <img class="stage-template-bg" src="${templateSrc}" alt="" aria-hidden="true">
          <h2 class="stage-template-title">${dan}のだん</h2>
          ${modeButtons}
          <button class="stage-template-back" type="button" data-action="stages" aria-label="ホームにもどる"></button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => startMode(dan, button.dataset.mode));
    });
  }

  function renderSummaryStage(summary) {
    document.body.classList.remove("home-image-mode");
    currentView = { name: "summary", summaryId: summary.id };
    const review = reviewStages.find((item) => item.title === summary.title);
    const reviewState = state.reviews[review.id];
    const summaryState = state.summaries[summary.id];
    const templateSrc = reviewState.mastered ? "assets/summary-stage-template.png" : "assets/summary-stage-template-locked.png";
    app.innerHTML = `
      <section class="summary-stage-template-screen">
        <div class="summary-stage-template-canvas">
          <img class="summary-stage-template-bg" src="${templateSrc}" alt="" aria-hidden="true">
          <h2 class="summary-stage-template-title">${summary.title}</h2>
          <div class="summary-stage-template-progress review-progress">
            <strong>${reviewState.mastered ? review.name : "？？？コーデ"}</strong>
            <span>${smallStarHtml(reviewState.clearCount, 3)}</span>
          </div>
          <div class="summary-stage-template-progress master-progress">
            <strong>${summaryState.mastered ? summary.name : "？？？コーデ"}</strong>
            <span>${summaryStarHtml(summaryState.clearCount)}</span>
          </div>
          <button class="summary-stage-template-button review-start" type="button" data-action="start-review" aria-label="おさらいを はじめる"></button>
          <button class="summary-stage-template-button master-start" type="button" data-action="start-summary" aria-label="マスターを はじめる" ${reviewState.mastered ? "" : "disabled"}></button>
          <button class="summary-stage-template-button summary-home" type="button" data-action="stages" aria-label="ホームにもどる"></button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="start-review"]').addEventListener("click", () => {
      renderReviewQuiz(review, makeBalancedSummaryOrder(review.dans, 12), 0, 0);
    });
    app.querySelector('[data-action="start-summary"]').addEventListener("click", () => {
      if (!reviewState.mastered) return;
      renderSummaryQuiz(summary, makePrioritySummaryOrder(summary.dans, 15), 0, 0);
    });
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
  }

  function renderReviewStage(review) {
    document.body.classList.remove("home-image-mode");
    currentView = { name: "review", reviewId: review.id };
    const reviewState = state.reviews[review.id];
    app.innerHTML = `
      <section class="panel">
        <h2 class="section-title">${review.title} おさらい</h2>
        <p class="soft-text">12もんだけ おさらいしよう。かく段から バランスよく出るよ。10もん正解でクリア。</p>
        <div class="summary-progress-card">
          <strong>${reviewState.mastered ? review.name : "？？？コーデ"}</strong>
          <span>${smallStarHtml(reviewState.clearCount, 3)}</span>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="start-review">はじめる</button>
          <button class="secondary-button" type="button" data-action="stages">ホームにもどる</button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="start-review"]').addEventListener("click", () => {
      renderReviewQuiz(review, makeBalancedSummaryOrder(review.dans, 12), 0, 0);
    });
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
  }

  function renderReviewQuiz(review, order, index, score, lastFeedback) {
    currentView = { name: "reviewQuiz", reviewId: review.id };
    if (index >= order.length) {
      renderReviewResult(review, score, order.length);
      return;
    }
    const problem = order[index];
    const correct = problem.dan * problem.multiplier;
    const choices = makeChoices(problem.dan, problem.multiplier);
    app.innerHTML = `
      <section class="quiz-template-screen review-quiz-template">
        <div class="quiz-template-canvas">
          <img class="quiz-template-bg" src="assets/quiz-choice-template.png" alt="" aria-hidden="true">
          <div class="quiz-template-progress">${progressDots(index + 1, order.length)}</div>
          <p class="quiz-template-formula">${problem.dan} × ${problem.multiplier} = ?</p>
          <div class="grid choice-grid quiz-template-choices">
            ${choices.map((choice) => `<button class="choice-button" type="button" data-choice="${choice}">${choice}</button>`).join("")}
          </div>
          <div class="feedback quiz-template-feedback ${lastFeedback ? lastFeedback.type : ""}">${lastFeedback ? lastFeedback.text : "こたえを えらんでね"}</div>
          <aside class="quiz-template-meter">
            <div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (score / order.length) * 100)}%"></div></div>
            <p class="soft-text">${score}こ せいかい</p>
          </aside>
          <button class="quiz-template-home" type="button" data-action="stages" aria-label="ホームにもどる"></button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = Number(button.dataset.choice);
        recordProblemAnswer(problem.dan, problem.multiplier, selected === correct);
        if (selected === correct) {
          burstSparkles();
          renderReviewQuiz(review, order, index + 1, score + 1, { type: "good", text: "せいかい！ すごい！" });
          return;
        }
        app.querySelectorAll("[data-choice]").forEach((choiceButton) => choiceButton.disabled = true);
        app.querySelector(".quiz-template-canvas").insertAdjacentHTML("beforeend", wrongAnswerWindowHtml(problem.dan, problem.multiplier, correct));
        document.getElementById("wrongNext").addEventListener("click", () => {
          renderReviewQuiz(review, order, index + 1, score, { type: "try", text: "つぎも やってみよう" });
        });
      });
    });
  }

  function renderReviewResult(review, score, total) {
    const cleared = score >= 10;
    const newReward = cleared ? clearReview(review.id) : false;
    const count = state.reviews[review.id].clearCount;
    app.innerHTML = `
      <section class="panel">
        <h2 class="section-title">${cleared ? "おさらい クリア！" : "おさらい おしまい！"}</h2>
        <p class="soft-text">${review.title}：${total}もんちゅう ${score}もん せいかい。</p>
        <p class="soft-text">${reviewResultMessage(cleared, newReward, count)}</p>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="again">もういちど</button>
          <button class="secondary-button" type="button" data-action="stages">ホームにもどる</button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="again"]').addEventListener("click", () => {
      renderReviewQuiz(review, makeBalancedSummaryOrder(review.dans, 12), 0, 0);
    });
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    if (newReward) setTimeout(() => showReviewTreasure(review), 250);
  }

  function renderSummaryQuiz(summary, order, index, score, lastFeedback) {
    currentView = { name: "summaryQuiz", summaryId: summary.id };
    if (index >= order.length) {
      renderSummaryResult(summary, score, order.length);
      return;
    }
    const problem = order[index];
    const correct = problem.dan * problem.multiplier;
    const choices = makeSixAnswerChoices(problem.dan, problem.multiplier);
    app.innerHTML = `
      <section class="quiz-template-screen summary-quiz-template">
        <div class="quiz-template-canvas">
          <img class="quiz-template-bg" src="assets/quiz-summary-template.png" alt="" aria-hidden="true">
          <div class="quiz-template-progress">${progressDots(index + 1, order.length)}</div>
          <p class="quiz-template-formula">${problem.dan} × ${problem.multiplier} = ?</p>
          <div class="grid choice-grid quiz-template-choices summary-template-choices">
            ${choices.map((choice) => `<button class="choice-button" type="button" data-choice="${choice}"><span class="choice-value">${choice}</span></button>`).join("")}
          </div>
          <div class="feedback quiz-template-feedback ${lastFeedback ? lastFeedback.type : ""}">${lastFeedback ? lastFeedback.text : "6つのなかから こたえを えらんでね"}</div>
          <aside class="quiz-template-meter">
            <div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (score / order.length) * 100)}%"></div></div>
            <p class="soft-text">${score}こ せいかい</p>
          </aside>
          <button class="quiz-template-home" type="button" data-action="stages" aria-label="ホームにもどる"></button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = Number(button.dataset.choice);
        recordProblemAnswer(problem.dan, problem.multiplier, selected === correct);
        if (selected === correct) {
          burstSparkles();
          renderSummaryQuiz(summary, order, index + 1, score + 1, { type: "good", text: "せいかい！ すごい！" });
          return;
        }
        app.querySelectorAll("[data-choice]").forEach((choiceButton) => choiceButton.disabled = true);
        app.querySelector(".quiz-template-canvas").insertAdjacentHTML("beforeend", wrongAnswerWindowHtml(problem.dan, problem.multiplier, correct));
        document.getElementById("wrongNext").addEventListener("click", () => {
          renderSummaryQuiz(summary, order, index + 1, score, { type: "try", text: "つぎも やってみよう" });
        });
      });
    });
  }

  function renderSummaryResult(summary, score, total) {
    const cleared = score >= 12;
    const newReward = cleared ? clearSummary(summary.id) : false;
    const count = state.summaries[summary.id].clearCount;
    app.innerHTML = `
      <section class="panel">
        <h2 class="section-title">${cleared ? "マスター クリア！" : "マスター おしまい！"}</h2>
        <p class="soft-text">${summary.title}：${total}もんちゅう ${score}もん せいかい。</p>
        <p class="soft-text">${summaryResultMessage(cleared, newReward, count)}</p>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="again">もういちど</button>
          <button class="secondary-button" type="button" data-action="stages">ホームにもどる</button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="again"]').addEventListener("click", () => {
      renderSummaryQuiz(summary, makePrioritySummaryOrder(summary.dans, 15), 0, 0);
    });
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    if (newReward) setTimeout(() => showSummaryTreasure(summary), 250);
  }

  function startMode(dan, mode) {
    if (mode === "learn") renderLearn(dan, 1);
    if (mode === "choice") renderChoiceQuiz(dan, makeOrder("sequence"), mode, 0, 0);
    if (mode === "sequence") renderChoiceQuiz(dan, makeOrder("sequence"), mode, 0, 0);
    if (mode === "random") renderMissingQuiz(dan, makeOrder("random", 10), 0, 0);
    if (mode === "master") renderMasterChoice(dan, makeOrder("random", 10), 0, 0);
  }

  function renderLearn(dan, multiplier) {
    currentView = { name: "learn", dan, multiplier };
    const product = dan * multiplier;
    app.innerHTML = `
      <section class="learn-template-screen">
        <div class="learn-template-canvas">
          <img class="learn-template-bg" src="assets/learn-template.png" alt="" aria-hidden="true">
          <div class="learn-progress">${progressDots(multiplier)}</div>
          <div class="learn-main-text">
            <p class="learn-formula">${dan} × ${multiplier}</p>
            <p class="learn-answer">こたえ ${product}</p>
            <p class="learn-reading">${getReading(dan, multiplier)}</p>
          </div>
          <div class="learn-meaning">
            <p>${dan}こずつが ${multiplier}つで ${product}こ</p>
            <p>${repeatAddition(dan, multiplier)} = ${product}</p>
            <p>${skipCount(dan, multiplier).join("、")}</p>
          </div>
          <div class="learn-array-panel">
            ${arrayHtml(dan, multiplier)}
          </div>
          <button class="learn-button learn-next" type="button" data-action="next">${multiplier === 9 ? "できた！" : "つぎへ"}</button>
          <button class="learn-button learn-speak" type="button" data-action="speak">もういちど よむ</button>
          <button class="learn-button learn-home" type="button" data-action="stages">ホームにもどる</button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="next"]').addEventListener("click", () => {
      if (multiplier >= 9) {
        const newReward = clearMode(dan, "learn");
        renderStage(dan);
        if (newReward) setTimeout(() => showTreasure(dan, "learn"), 250);
      } else {
        renderLearn(dan, multiplier + 1);
      }
    });
    app.querySelector('[data-action="speak"]').addEventListener("click", () => speak(getReading(dan, multiplier)));
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    setTimeout(() => speak(getReading(dan, multiplier)), 350);
  }

  function renderChoiceQuiz(dan, order, mode, index, score, lastFeedback) {
    currentView = { name: "quiz", dan, mode };
    if (index >= order.length) {
      const needed = mode === "random" ? 7 : 7;
      const cleared = score >= needed;
      renderResult(dan, mode, score, order.length, cleared);
      return;
    }
    const multiplier = order[index];
    const choices = makeChoices(dan, multiplier);
    app.innerHTML = `
      <section class="quiz-template-screen">
        <div class="quiz-template-canvas">
          <img class="quiz-template-bg" src="assets/quiz-choice-template.png" alt="" aria-hidden="true">
          <div class="quiz-template-progress">${progressDots(index + 1, order.length)}</div>
          <p class="quiz-template-formula">${dan} × ${multiplier} = ?</p>
          <div class="grid choice-grid quiz-template-choices">
            ${choices.map((choice) => `<button class="choice-button" type="button" data-choice="${choice}">${choice}</button>`).join("")}
          </div>
          <div class="feedback quiz-template-feedback ${lastFeedback ? lastFeedback.type : ""}">${lastFeedback ? lastFeedback.text : "こたえを えらんでね"}</div>
          <div class="hint-box quiz-template-hint hidden" id="hintBox"></div>
          <aside class="quiz-template-meter">
            <div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (score / 7) * 100)}%"></div></div>
            <p class="soft-text">${score}こ せいかい</p>
          </aside>
          <button class="quiz-template-home" type="button" data-action="stages" aria-label="ホームにもどる"></button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = Number(button.dataset.choice);
        const correct = dan * multiplier;
        recordProblemAnswer(dan, multiplier, selected === correct);
        if (selected === correct) {
          burstSparkles();
          renderChoiceQuiz(dan, order, mode, index + 1, score + 1, { type: "good", text: "せいかい！ すごい！" });
        } else {
          app.querySelectorAll("[data-choice]").forEach((choiceButton) => choiceButton.disabled = true);
          app.querySelector(".quiz-template-canvas").insertAdjacentHTML("beforeend", wrongAnswerWindowHtml(dan, multiplier, correct));
          document.getElementById("wrongNext").addEventListener("click", () => {
            renderChoiceQuiz(dan, order, mode, index + 1, score, { type: "try", text: "だいじょうぶ。つぎも やってみよう" });
          });
        }
      });
    });
  }

  function renderMissingQuiz(dan, order, index, score, lastFeedback) {
    const mode = "random";
    currentView = { name: "quiz", dan, mode };
    if (index >= order.length) {
      renderResult(dan, mode, score, order.length, score >= 7);
      return;
    }
    const multiplier = order[index];
    const product = dan * multiplier;
    const choices = makeMultiplierChoices(multiplier);
    app.innerHTML = `
      <section class="quiz-template-screen">
        <div class="quiz-template-canvas">
          <img class="quiz-template-bg" src="assets/quiz-choice-template.png" alt="" aria-hidden="true">
          <div class="quiz-template-progress">${progressDots(index + 1, order.length)}</div>
          <p class="quiz-template-formula">${dan} × ? = ${product}</p>
          <div class="grid choice-grid quiz-template-choices">
            ${choices.map((choice) => `<button class="choice-button" type="button" data-choice="${choice}">${choice}</button>`).join("")}
          </div>
          <div class="feedback quiz-template-feedback ${lastFeedback ? lastFeedback.type : ""}">${lastFeedback ? lastFeedback.text : "？に はいる かずを えらんでね"}</div>
          <div class="hint-box quiz-template-hint hidden" id="hintBox"></div>
          <aside class="quiz-template-meter">
            <div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (score / 7) * 100)}%"></div></div>
            <p class="soft-text">${score}こ せいかい</p>
          </aside>
          <button class="quiz-template-home" type="button" data-action="stages" aria-label="ホームにもどる"></button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = Number(button.dataset.choice);
        recordProblemAnswer(dan, multiplier, selected === multiplier);
        if (selected === multiplier) {
          burstSparkles();
          renderMissingQuiz(dan, order, index + 1, score + 1, { type: "good", text: "せいかい！ すごい！" });
          return;
        }
        app.querySelectorAll("[data-choice]").forEach((choiceButton) => choiceButton.disabled = true);
        app.querySelector(".quiz-template-canvas").insertAdjacentHTML("beforeend", wrongAnswerWindowHtml(dan, multiplier, product));
        document.getElementById("wrongNext").addEventListener("click", () => {
          renderMissingQuiz(dan, order, index + 1, score, { type: "try", text: "だいじょうぶ。つぎも やってみよう" });
        });
      });
    });
  }

  function renderMasterChoice(dan, order, index, score, lastFeedback) {
    const mode = "master";
    currentView = { name: "master", dan };
    if (index >= order.length) {
      renderResult(dan, mode, score, order.length, score >= 8);
      return;
    }
    const multiplier = order[index];
    const correct = dan * multiplier;
    const choices = makeSixAnswerChoices(dan, multiplier);
    app.innerHTML = `
      <section class="quiz-template-screen summary-quiz-template master-six-template">
        <div class="quiz-template-canvas">
          <img class="quiz-template-bg" src="assets/quiz-summary-template.png" alt="" aria-hidden="true">
          <div class="quiz-template-progress">${progressDots(index + 1, order.length)}</div>
          <p class="quiz-template-formula">${dan} × ${multiplier} = ?</p>
          <div class="grid choice-grid quiz-template-choices summary-template-choices">
            ${choices.map((choice) => `<button class="choice-button" type="button" data-choice="${choice}"><span class="choice-value">${choice}</span></button>`).join("")}
          </div>
          <div class="feedback quiz-template-feedback ${lastFeedback ? lastFeedback.type : ""}">${lastFeedback ? lastFeedback.text : "6つのなかから こたえを えらんでね"}</div>
          <aside class="quiz-template-meter">
            <div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (score / 8) * 100)}%"></div></div>
            <p class="soft-text">${score}こ せいかい</p>
          </aside>
          <button class="quiz-template-home" type="button" data-action="stages" aria-label="ホームにもどる"></button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = Number(button.dataset.choice);
        recordProblemAnswer(dan, multiplier, selected === correct);
        if (selected === correct) {
          burstSparkles();
          renderMasterChoice(dan, order, index + 1, score + 1, { type: "good", text: "せいかい！ すてき！" });
          return;
        }
        app.querySelectorAll("[data-choice]").forEach((choiceButton) => choiceButton.disabled = true);
        app.querySelector(".quiz-template-canvas").insertAdjacentHTML("beforeend", wrongAnswerWindowHtml(dan, multiplier, correct));
        document.getElementById("wrongNext").addEventListener("click", () => {
          renderMasterChoice(dan, order, index + 1, score, { type: "try", text: "だいじょうぶ。つぎも やってみよう" });
        });
      });
    });
  }

  function renderMaster(dan, order, index, score, entry, feedback) {
    currentView = { name: "master", dan };
    if (index >= order.length) {
      renderResult(dan, "master", score, order.length, score >= 8);
      return;
    }
    const multiplier = order[index];
    app.innerHTML = `
      <section class="panel">
        <div class="quiz-layout">
          <div>
            ${progressDots(index + 1, order.length)}
            <p class="formula">${dan} × ${multiplier} = ?</p>
            <div class="number-display">${entry || " "}</div>
            <div class="keypad">
              ${[1,2,3,4,5,6,7,8,9,"けす",0,"OK"].map((key) => `<button class="key-button" type="button" data-key="${key}">${key}</button>`).join("")}
            </div>
            <div class="feedback ${feedback ? feedback.type : ""}">${feedback ? feedback.text : "すうじを おしてね"}</div>
          </div>
          <aside class="treasure-meter">
            <h3>マスターまで</h3>
            <div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (score / 8) * 100)}%"></div></div>
            <p class="soft-text">${score}こ せいかい</p>
            <button class="secondary-button" type="button" data-action="stages">ホームにもどる</button>
          </aside>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    app.querySelectorAll("[data-key]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.key;
        if (key === "けす") {
          renderMaster(dan, order, index, score, entry.slice(0, -1), feedback);
          return;
        }
        if (key === "OK") {
          const correct = dan * multiplier;
          const isCorrect = Number(entry) === correct;
          recordProblemAnswer(dan, multiplier, isCorrect);
          if (isCorrect) burstSparkles();
          renderMaster(dan, order, index + 1, score + (isCorrect ? 1 : 0), "", {
            type: isCorrect ? "good" : "try",
            text: isCorrect ? "せいかい！ すてき！" : `${getReading(dan, multiplier)}。こたえは ${correct} だよ。`
          });
          return;
        }
        if (entry.length < 2) renderMaster(dan, order, index, score, entry + key, feedback);
      });
    });
  }

  function renderResult(dan, mode, score, total, cleared) {
    const modeName = modes[mode].title;
    const newReward = cleared ? clearMode(dan, mode) : false;
    app.innerHTML = `
      <section class="panel">
        <h2 class="section-title">${cleared ? "クリア！" : "さいごまで できたね"}</h2>
        <p class="soft-text">${modeName}：${total}もんちゅう ${score}もん せいかい。</p>
        <p class="soft-text">${resultMessage(cleared, newReward, dan, mode)}</p>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="again">もういちど</button>
          <button class="secondary-button" type="button" data-action="stages">ホームにもどる</button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="again"]').addEventListener("click", () => startMode(dan, mode));
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
    if (newReward) setTimeout(() => showTreasure(dan, mode), 250);
  }

  function resultMessage(cleared, newReward, dan, mode) {
    if (!cleared) return "もういちど あそぶと、もっと できるよ。";
    if (newReward) return "たからばこを あけよう！";
    const stage = state.stages[dan];
    const count = stage ? getModeClearCount(stage, mode) : 0;
    if (count < 3) return `あと ${3 - count}かい クリアで たからばこだよ。`;
    return "たからばこは もう ゲットしているよ。";
  }

  function summaryResultMessage(cleared, newReward, count) {
    if (!cleared) return "12もん せいかいで クリアだよ。もういちど あそんでみよう。";
    if (newReward) return "まとめコーデの たからばこを あけよう！";
    if (count < 5) return `あと ${5 - count}かい クリアで まとめコーデだよ。`;
    return "まとめコーデは もう ゲットしているよ。";
  }

  function reviewResultMessage(cleared, newReward, count) {
    if (!cleared) return "10もん せいかいで クリアだよ。もういちど あそんでみよう。";
    if (newReward) return "おさらいコーデの たからばこを あけよう！";
    if (count < 3) return `あと ${3 - count}かい クリアで おさらいコーデだよ。`;
    return "おさらいコーデは もう ゲットしているよ。";
  }

  function renderCloset() {
    document.body.classList.remove("home-image-mode");
    currentView = { name: "closet" };
    const cards = factors.map((dan) => {
      const stage = state.stages[dan];
      const count = stage.items.filter(Boolean).length;
      const complete = count === itemNames.length;
      const closetName = complete ? rewards[dan].name : "？？？コーデ";
      return `
        <article class="closet-card">
          <h3>${dan}のだん ${closetName}</h3>
          <p class="soft-text">かんせいど ${count}/5 ${stage.mastered ? "マスター！" : ""}</p>
          <div class="outfit-preview ${complete ? "complete" : "locked"}">
            <img class="outfit-img ${complete ? "" : "silhouette-img"}" src="${assetPaths.outfit(dan)}" alt="${rewards[dan].name}のたちえ" onload="hideFallback(this)" onerror="this.hidden=true">
            <span class="outfit-silhouette" aria-label="${complete ? `${rewards[dan].name}のたちえ` : "まだ そろっていない コーデ"}"></span>
          </div>
          <div class="items">
            ${itemNames.map((name, index) => `
              <div class="item ${stage.items[index] ? "owned" : "missing"}" title="${stage.items[index] ? getRewardItemName(dan, index) : name}" aria-label="${stage.items[index] ? `${getRewardItemName(dan, index)} ゲット` : `${name} まだ`}">
                ${stage.items[index] ? closetItemGraphic(dan, index) : `<span class="item-silhouette">?</span>`}
              </div>
            `).join("")}
          </div>
        </article>
      `;
    }).join("");
    const summaryCards = summaryStages.map((summary) => {
      const summaryState = state.summaries[summary.id];
      const complete = summaryState.mastered;
      const closetName = complete ? summary.name : "？？？コーデ";
      return `
        <article class="closet-card summary-closet-card">
          <h3>${summary.title} ${closetName}</h3>
          <p class="soft-text">かんせいど ${summaryState.clearCount}/5</p>
          <div class="outfit-preview ${complete ? "complete" : "locked"}">
            <img class="outfit-img ${complete ? "" : "silhouette-img"}" src="${assetPaths.summaryOutfit(summary.id)}" alt="${summary.name}のたちえ" onload="hideFallback(this)" onerror="this.hidden=true">
            <span class="outfit-silhouette" aria-label="${complete ? `${summary.name}のたちえ` : "まだ そろっていない まとめコーデ"}"></span>
          </div>
          <div class="summary-star-row">${summaryStarHtml(summaryState.clearCount)}</div>
        </article>
      `;
    }).join("");
    const reviewCards = reviewStages.map((review) => {
      const reviewState = state.reviews[review.id];
      const complete = reviewState.mastered;
      const closetName = complete ? review.name : "？？？コーデ";
      return `
        <article class="closet-card summary-closet-card">
          <h3>${review.title} ${closetName}</h3>
          <p class="soft-text">かんせいど ${reviewState.clearCount}/3</p>
          <div class="outfit-preview ${complete ? "complete" : "locked"}">
            <img class="outfit-img ${complete ? "" : "silhouette-img"}" src="${assetPaths.reviewOutfit(review.id)}" alt="${review.name}のたちえ" onload="hideFallback(this)" onerror="this.hidden=true">
            <span class="outfit-silhouette" aria-label="${complete ? `${review.name}のたちえ` : "まだ そろっていない おさらいコーデ"}"></span>
          </div>
          <div class="summary-star-row">${smallStarHtml(reviewState.clearCount, 3)}</div>
        </article>
      `;
    }).join("");
    app.innerHTML = `
      <section class="panel">
        <h2 class="section-title">クローゼット</h2>
        <div class="grid closet-grid">${cards}</div>
        <h3>おさらいコーデ</h3>
        <div class="grid closet-grid">${reviewCards}</div>
        <h3>まとめコーデ</h3>
        <div class="grid closet-grid">${summaryCards}</div>
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="stages">ホームにもどる</button>
        </div>
      </section>
    `;
    app.querySelector('[data-action="stages"]').addEventListener("click", () => renderStages());
  }

  function clearMode(dan, mode) {
    const stage = state.stages[dan];
    const modeIndex = modeOrder.indexOf(mode);
    const beforeCount = getModeClearCount(stage, mode);
    const afterCount = Math.min(3, beforeCount + 1);
    stage.clearCounts[mode] = afterCount;
    stage.clearedModes[mode] = true;
    const wasNew = modeIndex >= 0 && beforeCount < 3 && afterCount >= 3 && !stage.items[modeIndex];
    if (wasNew) stage.items[modeIndex] = true;
    updateUnlocks(dan);
    if (mode === "master" && stage.items[modeIndex]) stage.mastered = true;
    state.selectedOutfit = dan;
    if (state.stages[dan].items.every(Boolean)) state.selectedPrincess = { type: "dan", id: dan };
    saveState();
    return wasNew;
  }

  function setModeCleared(dan, mode, cleared) {
    const stage = state.stages[dan];
    const modeIndex = modeOrder.indexOf(mode);
    if (modeIndex < 0) return;
    stage.clearCounts[mode] = cleared ? 3 : 0;
    stage.clearedModes[mode] = cleared;
    stage.items[modeIndex] = cleared;
    updateUnlocks(dan);
    stage.mastered = stage.items.every(Boolean);
    normalizeSelectedPrincess();
  }

  function setDanAllCleared(dan, cleared) {
    modeOrder.forEach((mode) => setModeCleared(dan, mode, cleared));
  }

  function clearSummary(summaryId) {
    const summaryState = state.summaries[summaryId];
    const beforeCount = Math.min(5, Number(summaryState.clearCount || 0));
    const afterCount = Math.min(5, beforeCount + 1);
    summaryState.clearCount = afterCount;
    const wasNew = beforeCount < 5 && afterCount >= 5 && !summaryState.mastered;
    if (wasNew) {
      summaryState.mastered = true;
      state.selectedPrincess = { type: "summary", id: summaryId };
    }
    saveState();
    return wasNew;
  }

  function setSummaryCleared(summaryId, cleared) {
    const summaryState = state.summaries[summaryId];
    if (!summaryState) return;
    summaryState.clearCount = cleared ? 5 : 0;
    summaryState.mastered = cleared;
    if (cleared) state.selectedPrincess = { type: "summary", id: summaryId };
    normalizeSelectedPrincess();
  }

  function clearReview(reviewId) {
    const reviewState = state.reviews[reviewId];
    const beforeCount = Math.min(3, Number(reviewState.clearCount || 0));
    const afterCount = Math.min(3, beforeCount + 1);
    reviewState.clearCount = afterCount;
    const wasNew = beforeCount < 3 && afterCount >= 3 && !reviewState.mastered;
    if (wasNew) {
      reviewState.mastered = true;
      state.selectedPrincess = { type: "review", id: reviewId };
    }
    saveState();
    return wasNew;
  }

  function setReviewCleared(reviewId, cleared) {
    const reviewState = state.reviews[reviewId];
    if (!reviewState) return;
    reviewState.clearCount = cleared ? 3 : 0;
    reviewState.mastered = cleared;
    if (cleared) state.selectedPrincess = { type: "review", id: reviewId };
    normalizeSelectedPrincess();
  }

  function normalizeSelectedPrincess() {
    factors.forEach((dan) => {
      state.stages[dan].mastered = state.stages[dan].items.every(Boolean);
    });
    const choices = getOwnedPrincessChoices();
    if (!choices.some((choice) => isSamePrincess(choice.key, state.selectedPrincess))) {
      state.selectedPrincess = { type: "default", id: "default" };
    }
  }

  function isSummaryUnlocked(summary) {
    if (summary.id === "summary-all") {
      return summaryStages
        .filter((item) => item.id !== "summary-all")
        .every((item) => state.summaries[item.id].mastered);
    }
    return summary.dans.every((dan) => state.stages[dan].mastered || state.stages[dan].items.every(Boolean));
  }

  function updateUnlocks(dan) {
    const stage = state.stages[dan];
    const choiceCleared = getModeClearCount(stage, "choice") > 0;
    const sequenceCleared = getModeClearCount(stage, "sequence") > 0;
    const randomCleared = getModeClearCount(stage, "random") > 0;
    stage.unlockedModes.learn = true;
    stage.unlockedModes.choice = true;
    stage.unlockedModes.sequence = choiceCleared;
    stage.unlockedModes.random = sequenceCleared;
    stage.unlockedModes.master = randomCleared;
    saveState();
  }

  function showTreasure(dan, mode) {
    const template = document.getElementById("treasureTemplate");
    const fragment = template.content.cloneNode(true);
    const modeIndex = modeOrder.indexOf(mode);
    document.body.appendChild(fragment);
    const modal = document.querySelector(".treasure-modal");
    const closeButton = document.getElementById("treasureClose");
    let step = 0;
    const steps = [
      {
        title: "たからばこを みつけた！",
        text: "なにが はいっているかな？",
        button: "あける",
        html: treasureGraphic("closed", assetPaths.treasureClosed, "しまっている たからばこ")
      },
      {
        title: "たからばこ オープン！",
        text: "キラキラが とびだしたよ！",
        button: "アイテムをみる",
        html: treasureGraphic("open", assetPaths.treasureOpen, "ひらいた たからばこ")
      },
      {
        title: "アイテム ゲット！",
        text: `${getRewardItemName(dan, modeIndex)} を ゲット！`,
        button: "やったね",
        html: itemCardGraphic(dan, mode, modeIndex)
      }
    ];
    function paintTreasure() {
      const data = steps[step];
      modal.querySelector("#treasureTitle").textContent = data.title;
      modal.querySelector("#treasureText").textContent = data.text;
      modal.querySelector(".treasure-art").innerHTML = data.html;
      closeButton.textContent = data.button;
      if (step > 0) burstSparkles();
    }
    paintTreasure();
    burstSparkles();
    closeButton.addEventListener("click", () => {
      if (step < steps.length - 1) {
        step += 1;
        paintTreasure();
        return;
      }
      document.querySelector(".modal-backdrop").remove();
    });
  }

  function showSummaryTreasure(summary) {
    const template = document.getElementById("treasureTemplate");
    const fragment = template.content.cloneNode(true);
    document.body.appendChild(fragment);
    const modal = document.querySelector(".treasure-modal");
    const closeButton = document.getElementById("treasureClose");
    let step = 0;
    const steps = [
      {
        title: "まとめの たからばこ！",
        text: "全身コーデが はいっているかも？",
        button: "あける",
        html: treasureGraphic("closed", assetPaths.treasureClosed, "しまっている たからばこ")
      },
      {
        title: "たからばこ オープン！",
        text: "まとめコーデが かがやいているよ！",
        button: "コーデをみる",
        html: treasureGraphic("open", assetPaths.treasureOpen, "ひらいた たからばこ")
      },
      {
        title: "全身コーデ ゲット！",
        text: `${summary.name} を ゲット！`,
        button: "やったね",
        html: summaryRewardCardGraphic(summary)
      }
    ];
    function paintTreasure() {
      const data = steps[step];
      modal.querySelector("#treasureTitle").textContent = data.title;
      modal.querySelector("#treasureText").textContent = data.text;
      modal.querySelector(".treasure-art").innerHTML = data.html;
      closeButton.textContent = data.button;
      if (step > 0) burstSparkles();
    }
    paintTreasure();
    burstSparkles();
    closeButton.addEventListener("click", () => {
      if (step < steps.length - 1) {
        step += 1;
        paintTreasure();
        return;
      }
      document.querySelector(".modal-backdrop").remove();
    });
  }

  function showReviewTreasure(review) {
    const template = document.getElementById("treasureTemplate");
    const fragment = template.content.cloneNode(true);
    document.body.appendChild(fragment);
    const modal = document.querySelector(".treasure-modal");
    const closeButton = document.getElementById("treasureClose");
    let step = 0;
    const steps = [
      {
        title: "おさらいの たからばこ！",
        text: "ふくしゅうコーデが はいっているかも？",
        button: "あける",
        html: treasureGraphic("closed", assetPaths.treasureClosed, "しまっている たからばこ")
      },
      {
        title: "たからばこ オープン！",
        text: "おさらいコーデが かがやいているよ！",
        button: "コーデをみる",
        html: treasureGraphic("open", assetPaths.treasureOpen, "ひらいた たからばこ")
      },
      {
        title: "全身コーデ ゲット！",
        text: `${review.name} を ゲット！`,
        button: "やったね",
        html: reviewRewardCardGraphic(review)
      }
    ];
    function paintTreasure() {
      const data = steps[step];
      modal.querySelector("#treasureTitle").textContent = data.title;
      modal.querySelector("#treasureText").textContent = data.text;
      modal.querySelector(".treasure-art").innerHTML = data.html;
      closeButton.textContent = data.button;
      if (step > 0) burstSparkles();
    }
    paintTreasure();
    burstSparkles();
    closeButton.addEventListener("click", () => {
      if (step < steps.length - 1) {
        step += 1;
        paintTreasure();
        return;
      }
      document.querySelector(".modal-backdrop").remove();
    });
  }

  function treasureGraphic(kind, src, alt) {
    const fallback = kind === "closed" ? "□" : "◇";
    return `
      <div class="treasure-image ${kind}">
        <img src="${src}" alt="${alt}" onload="hideFallback(this)" onerror="this.hidden=true">
        <span class="treasure-fallback" aria-hidden="true">${fallback}</span>
      </div>
    `;
  }

  function itemCardGraphic(dan, mode, modeIndex) {
    const rewardItemName = getRewardItemName(dan, modeIndex);
    return `
      <div class="reward-card">
        <img src="${assetPaths.item(dan, mode)}" alt="${rewardItemName}" onload="hideFallback(this)" onerror="this.hidden=true">
        <span class="reward-card-icon" aria-hidden="true">${itemIcons[modeIndex]}</span>
        <strong>${rewardItemName}</strong>
      </div>
    `;
  }

  function summaryRewardCardGraphic(summary) {
    return `
      <div class="reward-card">
        <img src="${assetPaths.summaryOutfit(summary.id)}" alt="${summary.name}" onload="hideFallback(this)" onerror="this.hidden=true">
        <span class="reward-card-icon" aria-hidden="true">□</span>
        <strong>${summary.name}</strong>
      </div>
    `;
  }

  function reviewRewardCardGraphic(review) {
    return `
      <div class="reward-card">
        <img src="${assetPaths.reviewOutfit(review.id)}" alt="${review.name}" onload="hideFallback(this)" onerror="this.hidden=true">
        <span class="reward-card-icon" aria-hidden="true">□</span>
        <strong>${review.name}</strong>
      </div>
    `;
  }

  function closetItemGraphic(dan, itemIndex) {
    const mode = modeOrder[itemIndex];
    return `
      <img class="closet-item-img" src="${assetPaths.item(dan, mode)}" alt="${getRewardItemName(dan, itemIndex)}" onload="hideFallback(this)" onerror="this.hidden=true">
      <span class="closet-item-fallback" aria-hidden="true">${itemIcons[itemIndex]}</span>
    `;
  }

  function modeRewardGraphic(dan, itemIndex, owned) {
    const mode = modeOrder[itemIndex];
    return `
      <img class="mode-reward-img ${owned ? "" : "silhouette-img"}" src="${assetPaths.item(dan, mode)}" alt="${getRewardItemName(dan, itemIndex)}" onload="hideFallback(this)" onerror="this.hidden=true">
      <span class="mode-reward-fallback" aria-hidden="true">${owned ? itemIcons[itemIndex] : "?"}</span>
    `;
  }

  function stageItemProgressHtml(dan, itemIndex) {
    const stage = state.stages[dan];
    const mode = modeOrder[itemIndex];
    const owned = stage.items[itemIndex];
    const clearCount = getModeClearCount(stage, mode);
    return `
      <span class="stage-item-slot ${owned ? "owned" : "missing"}" aria-label="${getRewardItemName(dan, itemIndex)} ${clearCount}かい クリア">
        <span class="stage-item-icon">
          <img class="${owned ? "" : "silhouette-img"}" src="${assetPaths.item(dan, mode)}" alt="" onload="hideFallback(this)" onerror="this.hidden=true">
          <span class="stage-item-fallback" aria-hidden="true">${owned ? itemIcons[itemIndex] : "?"}</span>
        </span>
        <span class="stage-star-row" aria-hidden="true">${starHtml(clearCount)}</span>
      </span>
    `;
  }

  function starHtml(count) {
    const lit = Math.min(3, Math.max(0, count || 0));
    return Array.from({ length: 3 }, (_, index) => `<span class="progress-star ${index < lit ? "lit" : ""}">★</span>`).join("");
  }

  function summaryStarHtml(count) {
    const lit = Math.min(5, Math.max(0, count || 0));
    return Array.from({ length: 5 }, (_, index) => `<span class="progress-star ${index < lit ? "lit" : ""}">★</span>`).join("");
  }

  function smallStarHtml(count, total) {
    const lit = Math.min(total, Math.max(0, count || 0));
    return Array.from({ length: total }, (_, index) => `<span class="progress-star ${index < lit ? "lit" : ""}">★</span>`).join("");
  }

  function getModeClearCount(stage, mode) {
    if (!stage.clearCounts) stage.clearCounts = {};
    return Math.min(3, Number(stage.clearCounts[mode] || 0));
  }

  function getRewardItemName(dan, itemIndex) {
    return rewardItems[dan][itemIndex] || itemNames[itemIndex];
  }

  window.hideFallback = function (image) {
    const fallback = image.nextElementSibling;
    if (!fallback) return;
    fallback.hidden = true;
    fallback.style.display = "none";
  };

  function makeOrder(type, count) {
    if (type === "sequence") return factors.slice();
    return makeMostlyUniqueRandomOrder(count);
  }

  function makeMostlyUniqueRandomOrder(count) {
    const uniquePart = shuffle(factors).slice(0, Math.min(9, count));
    while (uniquePart.length < count) {
      uniquePart.push(factors[Math.floor(Math.random() * factors.length)]);
    }
    return shuffle(uniquePart);
  }

  function makeSummaryOrder(dans, count) {
    return makeBalancedSummaryOrder(dans, count);
  }

  function makeBalancedSummaryOrder(dans, count) {
    const allProblems = [];
    dans.forEach((dan) => {
      factors.forEach((multiplier) => allProblems.push({ dan, multiplier }));
    });
    const order = [];
    const shuffledDans = shuffle(dans.slice());
    const base = Math.floor(count / dans.length);
    const extra = count % dans.length;
    shuffledDans.forEach((dan, index) => {
      const take = base + (index < extra ? 1 : 0);
      shuffle(factors).slice(0, Math.min(take, 9)).forEach((multiplier) => {
        order.push({ dan, multiplier });
      });
    });
    return shuffle(order).slice(0, count);
  }

  function makePrioritySummaryOrder(dans, count) {
    const problems = [];
    dans.forEach((dan) => {
      factors.forEach((multiplier) => {
        const item = stats.problems[problemKey(dan, multiplier)] || { attempts: 0, correct: 0 };
        const rate = item.attempts ? item.correct / item.attempts : 0.5;
        problems.push({ dan, multiplier, rate, attempts: item.attempts });
      });
    });
    const hasUsefulStats = problems.some((problem) => problem.attempts > 0);
    if (!hasUsefulStats) return makeBalancedSummaryOrder(dans, count);
    return shuffle(problems)
      .sort((a, b) => a.rate - b.rate || b.attempts - a.attempts)
      .slice(0, count)
      .map(({ dan, multiplier }) => ({ dan, multiplier }));
  }

  function makeChoices(dan, multiplier) {
    const correct = dan * multiplier;
    const candidates = [];
    [multiplier - 1, multiplier + 1, multiplier - 2, multiplier + 2].forEach((near) => {
      if (near >= 1 && near <= 9) candidates.push(dan * near);
    });
    factors.forEach((a) => factors.forEach((b) => {
      const value = a * b;
      if (Math.abs(value - correct) <= Math.max(4, dan * 2)) candidates.push(value);
    }));
    const unique = [...new Set(candidates)].filter((value) => value !== correct && value > 0);
    while (unique.length < 2) unique.push(correct + dan + unique.length + 1);
    return shuffle([correct, unique[0], unique[1]]);
  }

  function makeSummaryChoices(dan, multiplier) {
    return makeChoices(dan, multiplier);
  }

  function makeTwoChoices(dan, multiplier) {
    const correct = dan * multiplier;
    const candidates = [];
    [multiplier - 1, multiplier + 1, multiplier - 2, multiplier + 2].forEach((near) => {
      if (near >= 1 && near <= 9) candidates.push(dan * near);
    });
    factors.forEach((a) => factors.forEach((b) => {
      const value = a * b;
      if (Math.abs(value - correct) <= Math.max(4, dan * 2)) candidates.push(value);
    }));
    const unique = [...new Set(candidates)].filter((value) => value !== correct && value > 0);
    return shuffle([correct, unique[0] || correct + dan]);
  }

  function makeMultiplierChoices(multiplier) {
    const candidates = [];
    [multiplier - 1, multiplier + 1, multiplier - 2, multiplier + 2].forEach((near) => {
      if (near >= 1 && near <= 9) candidates.push(near);
    });
    factors.forEach((factor) => candidates.push(factor));
    const unique = [...new Set(candidates)].filter((value) => value !== multiplier);
    return shuffle([multiplier, unique[0], unique[1]]);
  }

  function makeSixAnswerChoices(dan, multiplier) {
    const correct = dan * multiplier;
    const candidates = [];
    [multiplier - 1, multiplier + 1, multiplier - 2, multiplier + 2, multiplier - 3, multiplier + 3].forEach((near) => {
      if (near >= 1 && near <= 9) candidates.push(dan * near);
    });
    factors.forEach((a) => factors.forEach((b) => {
      const value = a * b;
      if (Math.abs(value - correct) <= Math.max(8, dan * 3)) candidates.push(value);
    }));
    const unique = [...new Set(candidates)].filter((value) => value !== correct && value > 0);
    let offset = 1;
    while (unique.length < 5) {
      unique.push(correct + dan + offset);
      offset += 1;
    }
    return shuffle([correct, ...unique.slice(0, 5)]);
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function progressDots(current, total = 9) {
    return `<div class="progress-strip">${Array.from({ length: total }, (_, index) => `<span class="dot ${index < current ? "done" : ""}">${index + 1}</span>`).join("")}</div>`;
  }

  function wrongAnswerWindowHtml(dan, multiplier, answer) {
    const addition = `${repeatAddition(dan, multiplier)} = ${answer}`;
    const skip = skipCount(dan, multiplier).join("、");
    return `
      <div class="wrong-answer-backdrop">
        <div class="wrong-answer-window">
          <img class="wrong-answer-bg" src="assets/wrong-answer-window.png" alt="" aria-hidden="true">
          <p class="wrong-title">おしい！</p>
          <p class="wrong-reading">${getReading(dan, multiplier)}。${dan}こずつが ${multiplier}つで ${answer}こだよ。</p>
          <div class="wrong-explain">
            <p>${dan}こずつを ${multiplier}つ ならべると、ぜんぶで ${answer}こ。</p>
            <p>${addition}</p>
            <p>${skip} と かぞえられるよ。</p>
          </div>
          <button class="wrong-next-button" type="button" id="wrongNext">つぎへ</button>
        </div>
      </div>
    `;
  }

  function getReading(dan, multiplier) {
    return readings[`${dan}x${multiplier}`] || `${dan}かける${multiplier}`;
  }

  function repeatAddition(dan, multiplier) {
    return Array.from({ length: multiplier }, () => dan).join(" + ");
  }

  function skipCount(dan, multiplier) {
    return Array.from({ length: multiplier }, (_, index) => dan * (index + 1));
  }

  function arrayHtml(dan, multiplier) {
    const topLabels = Array.from({ length: multiplier }, (_, index) => `<span class="array-label top">${index + 1}つめ</span>`).join("");
    const rowLabels = Array.from({ length: dan }, (_, index) => `<span class="array-label side">${index + 1}こ</span>`).join("");
    const cells = Array.from({ length: dan * multiplier }, () => `<span class="gem">◆</span>`).join("");
    return `
      <div class="array-wrap">
        <div class="array-header">
          <span>${dan}こずつが ${multiplier}つ</span>
          <span class="reading">${getReading(dan, multiplier)}</span>
        </div>
        <div class="array-board" style="--cols:${multiplier}; --rows:${dan};">
          <span></span>
          ${topLabels}
          <div class="array-side-labels">${rowLabels}</div>
          <div class="array-grid" aria-label="${dan}ぎょう ${multiplier}れつ">${cells}</div>
        </div>
      </div>
    `;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  function burstSparkles() {
    const host = document.getElementById("sparkles");
    for (let i = 0; i < 18; i += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.textContent = ["☆", "◇", "♪", "♡"][Math.floor(Math.random() * 4)];
      sparkle.style.left = `${20 + Math.random() * 60}%`;
      sparkle.style.top = `${30 + Math.random() * 50}%`;
      sparkle.style.animationDelay = `${Math.random() * 180}ms`;
      host.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1100);
    }
  }

  updateAdminButton();
  renderStages();
})();
