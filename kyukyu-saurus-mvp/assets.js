(function (global) {
  if (typeof document !== 'undefined') {
    if (!document.querySelector('link[data-desktop-fix]')) {
      const fix = document.createElement('link');
      fix.rel = 'stylesheet';
      fix.href = 'desktop-fix.css';
      fix.dataset.desktopFix = '1';
      document.head.appendChild(fix);
    }
    if (!document.querySelector('link[data-compact-desktop]')) {
      const compact = document.createElement('link');
      compact.rel = 'stylesheet';
      compact.href = 'compact-desktop.css?v=3';
      compact.dataset.compactDesktop = '1';
      document.head.appendChild(compact);
    }
    if (!document.querySelector('link[data-balance-fix]')) {
      const balance = document.createElement('link');
      balance.rel = 'stylesheet';
      balance.href = 'balance-fix.css?v=2';
      balance.dataset.balanceFix = '1';
      document.head.appendChild(balance);
    }
  }

  const PARTS = Array.from({ length: 8 }, (_, i) => `assets/sprite/part0${i}.txt`);
  const CELLS = {
    stage_00_egg: [0, 0],
    stage_01_egg_shake: [1, 0],
    stage_02_egg_crack: [2, 0],
    stage_03_hatch: [3, 0],
    stage_04_baby: [0, 1],
    stage_05_small: [1, 1],
    stage_06_kid: [2, 1],
    stage_07_grown: [3, 1],
    action_feed: [0, 2],
    action_pet: [1, 2],
    action_play: [2, 2],
    action_sleep: [3, 2]
  };
  let dataUrlPromise = null;

  async function load() {
    if (!dataUrlPromise) {
      dataUrlPromise = Promise.all(PARTS.map(async (path) => {
        const res = await fetch(path, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`asset load failed: ${path}`);
        return (await res.text()).trim();
      })).then(parts => `data:image/webp;base64,${parts.join('')}`);
    }
    return dataUrlPromise;
  }

  function mainCreatureStage() {
    let points = 0;
    try {
      if (typeof isTest !== 'undefined' && isTest && typeof previewState !== 'undefined') {
        points = Number(previewState.growthPoints) || 0;
      } else if (global.GameStore) {
        points = Number(global.GameStore.getState().growthPoints) || 0;
      }
    } catch (_) {
      points = global.GameStore ? Number(global.GameStore.getState().growthPoints) || 0 : 0;
    }
    return global.GameLogic ? global.GameLogic.stageForPoints(points) : { asset: 'stage_00_egg' };
  }

  function updateReactionPreviewControls(stage) {
    if (typeof document === 'undefined') return;
    const allow = stage && stage.asset === 'stage_05_small';
    document.querySelectorAll('#sceneChips .scene-chip').forEach((button) => {
      if (button.dataset.scene === 'normal') return;
      button.disabled = !allow;
      button.title = allow ? '' : 'リアクション差分は「ちび恐竜」で確認できます';
      button.style.opacity = allow ? '1' : '.38';
      button.style.cursor = allow ? 'pointer' : 'not-allowed';
    });
  }

  async function show(element, requestedKey) {
    if (!element) return;

    let key = requestedKey;
    if (element.id === 'creature') {
      const stage = mainCreatureStage();
      updateReactionPreviewControls(stage);

      const isActionAsset = String(key).startsWith('action_');
      if (isActionAsset && stage.asset !== 'stage_05_small') {
        // The current reaction artwork belongs only to the small dinosaur.
        // Fall back completely to the current stage rather than mixing ages.
        key = stage.asset;
        try {
          if (typeof previewScene !== 'undefined') previewScene = 'normal';
        } catch (_) {}
      } else if (stage.asset === 'stage_05_small' && key === 'action_feed') {
        // UI care type is "food" while the artwork/test scene name is "feed".
        // Normalize it so the test title and active chip stay consistent too.
        try {
          if (typeof previewScene !== 'undefined' && previewScene === 'food') previewScene = 'feed';
        } catch (_) {}
      }
    }

    const [x, y] = CELLS[key] || CELLS.stage_00_egg;
    const url = await load();
    element.classList.add('dino-sprite');
    element.style.backgroundImage = `url("${url}")`;
    element.style.backgroundSize = '400% 300%';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = `${x * 33.333333}% ${y * 50}%`;
  }

  global.GameAssets = { PARTS, CELLS, load, show };
})(typeof window !== 'undefined' ? window : globalThis);
