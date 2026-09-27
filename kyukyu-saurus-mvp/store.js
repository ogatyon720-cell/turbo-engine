(function (global) {
  const KEY = 'kyukyu-saurus-state-v1';
  const DEFAULT_STATE = {
    growthPoints: 0,
    worksheetsCompleted: 0,
    completedWorksheetIds: [],
    careTokens: 0,
    careCounts: { food: 0, pet: 0, play: 0 },
    dinosaurName: '',
    lastResult: null,
    lastCare: null,
    createdAt: new Date().toISOString()
  };

  function safeParse(raw) { try { return JSON.parse(raw); } catch (_) { return null; } }
  function getState() {
    const raw = global.localStorage ? global.localStorage.getItem(KEY) : null;
    const parsed = raw ? safeParse(raw) : null;
    return {
      ...DEFAULT_STATE,
      ...(parsed || {}),
      careCounts: { ...DEFAULT_STATE.careCounts, ...((parsed && parsed.careCounts) || {}) },
      completedWorksheetIds: Array.isArray(parsed && parsed.completedWorksheetIds) ? parsed.completedWorksheetIds : []
    };
  }
  function saveState(state) {
    if (!global.localStorage) return state;
    global.localStorage.setItem(KEY, JSON.stringify(state));
    return state;
  }
  function registerWorksheet({ worksheetId, correct, minutes }) {
    const state = getState();
    if (!worksheetId) throw new Error('worksheetId is required');
    if (state.completedWorksheetIds.includes(worksheetId)) return { duplicate: true, state, addedPoints: 0 };
    const addedPoints = global.GameLogic.pointsForWorksheet(correct);
    const next = {
      ...state,
      growthPoints: state.growthPoints + addedPoints,
      worksheetsCompleted: state.worksheetsCompleted + 1,
      careTokens: state.careTokens + 1,
      completedWorksheetIds: [...state.completedWorksheetIds, worksheetId],
      lastResult: { worksheetId, correct: Number(correct), minutes: minutes ? Number(minutes) : null, addedPoints, completedAt: new Date().toISOString() }
    };
    saveState(next);
    return { duplicate: false, state: next, addedPoints };
  }
  function useCare(type) {
    const allowed = ['food', 'pet', 'play'];
    if (!allowed.includes(type)) throw new Error('invalid care type');
    const state = getState();
    if (state.careTokens <= 0) return { success: false, state };
    const next = {
      ...state,
      careTokens: state.careTokens - 1,
      careCounts: { ...state.careCounts, [type]: (state.careCounts[type] || 0) + 1 },
      lastCare: { type, caredAt: new Date().toISOString() }
    };
    saveState(next);
    return { success: true, state: next };
  }
  function setDinosaurName(name) {
    const state = getState();
    const next = { ...state, dinosaurName: String(name || '').trim().slice(0, 20) };
    return saveState(next);
  }
  function reset() {
    if (global.localStorage) global.localStorage.removeItem(KEY);
    return getState();
  }
  global.GameStore = { KEY, DEFAULT_STATE, getState, saveState, registerWorksheet, useCare, setDinosaurName, reset };
})(typeof window !== 'undefined' ? window : globalThis);
