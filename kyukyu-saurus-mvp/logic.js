(function (global) {
  const STAGES = [
    { min: 750, id: 'special', name: 'とくべつな きょうりゅう', icon: '🦖✨', message: 'なんだか ふしぎな ちからを まとっている！' },
    { min: 500, id: 'big', name: 'おおきな きょうりゅう', icon: '🦖', message: 'とっても おおきく そだったね！' },
    { min: 350, id: 'child', name: 'こども きょうりゅう', icon: '🦕', message: 'げんきいっぱい！ いっしょに あそびたそう。' },
    { min: 200, id: 'little', name: 'ちび きょうりゅう', icon: '🦕', message: 'すこしずつ できることが ふえてきた！' },
    { min: 100, id: 'baby', name: 'あかちゃん きょうりゅう', icon: '🦕', message: 'すくすく そだっているよ。' },
    { min: 50, id: 'hatched', name: 'うまれたて きょうりゅう', icon: '🐣🦕', message: 'やった！ たまごから うまれた！' },
    { min: 30, id: 'cracked', name: 'ひびの はいった たまご', icon: '🥚⚡', message: 'ピシッ！ たまごに ひびが はいった！' },
    { min: 10, id: 'wiggle', name: 'うごく たまご', icon: '🥚〰️', message: 'ゴトッ… なかで なにかが うごいた！' },
    { min: 0, id: 'egg', name: 'ふしぎな たまご', icon: '🥚', message: 'なかに だれか いるのかな？' }
  ];

  function bonusForCorrect(correct) {
    const n = Number(correct);
    if (!Number.isFinite(n) || n < 0 || n > 30) throw new Error('correct must be between 0 and 30');
    if (n === 30) return 5;
    if (n >= 28) return 3;
    if (n >= 25) return 1;
    return 0;
  }

  function pointsForWorksheet(correct) { return 10 + bonusForCorrect(correct); }
  function stageForPoints(points) {
    const p = Math.max(0, Number(points) || 0);
    return STAGES.find((stage) => p >= stage.min) || STAGES[STAGES.length - 1];
  }
  function nextStageForPoints(points) {
    const p = Math.max(0, Number(points) || 0);
    const ascending = [...STAGES].sort((a, b) => a.min - b.min);
    return ascending.find((stage) => stage.min > p) || null;
  }
  function allFacts() {
    const facts = [];
    for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) facts.push({ a, b, answer: a * b });
    return facts;
  }
  function shuffled(array, rng = Math.random) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function generateWorksheet(count = 30, rng = Math.random) {
    if (count < 1 || count > 81) throw new Error('count must be between 1 and 81');
    return shuffled(allFacts(), rng).slice(0, count);
  }

  const api = { STAGES, bonusForCorrect, pointsForWorksheet, stageForPoints, nextStageForPoints, allFacts, generateWorksheet };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.GameLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
