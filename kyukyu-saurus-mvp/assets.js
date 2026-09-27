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

  async function show(element, key) {
    if (!element) return;
    const [x, y] = CELLS[key] || CELLS.stage_00_egg;
    const url = await load();
    element.classList.add('dino-sprite');
    element.style.backgroundImage = `url("${url}")`;
    element.style.backgroundPosition = `${x * 33.333333}% ${y * 50}%`;
  }

  global.GameAssets = { PARTS, CELLS, load, show };
})(typeof window !== 'undefined' ? window : globalThis);
