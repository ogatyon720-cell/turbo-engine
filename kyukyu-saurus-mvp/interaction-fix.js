(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes kyukyuObservePop {
      0% { transform: translateY(0) scale(1); }
      35% { transform: translateY(-8px) scale(1.035); }
      65% { transform: translateY(-2px) scale(1.015); }
      100% { transform: translateY(0) scale(1); }
    }
    @keyframes kyukyuPetHappy {
      0% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(-3deg) scale(1.025); }
      50% { transform: rotate(3deg) scale(1.045); }
      75% { transform: rotate(-2deg) scale(1.025); }
      100% { transform: rotate(0deg) scale(1); }
    }
    @keyframes kyukyuEggWiggle {
      0%,100% { transform: rotate(0deg) translateY(0); }
      20% { transform: rotate(-4deg) translateY(-2px); }
      40% { transform: rotate(4deg) translateY(-3px); }
      60% { transform: rotate(-3deg) translateY(-2px); }
      80% { transform: rotate(2deg) translateY(-1px); }
    }
    #creature.kyukyu-observe { animation: kyukyuObservePop .72s ease-out !important; }
    #creature.kyukyu-pet { animation: kyukyuPetHappy .82s ease-in-out !important; }
    #creature.kyukyu-egg-react { animation: kyukyuEggWiggle .82s ease-in-out !important; }
    #speechBubble.kyukyu-speaking {
      box-shadow: 0 7px 20px rgba(244,72,132,.18);
      border-color: #ff7da8;
    }
  `;
  document.head.appendChild(style);

  const observeMessages = {
    stage_00_egg: 'しーっ… なかで ちいさな おとが するかも！',
    stage_01_egg_shake: 'いま、コトッて うごいた！',
    stage_02_egg_crack: 'ひびが すこし ひろがった みたい！',
    stage_03_hatch: 'もうすぐ ぜんぶ でてきそう！',
    stage_04_baby: 'こっちを じーっと みてる！',
    stage_05_small: 'げんきいっぱい。なにか したそう！',
    stage_06_kid: 'しっぽを ふって、こちらを みているよ！',
    stage_07_grown: 'どっしり たのもしく なったね！'
  };

  const petMessages = {
    stage_00_egg: 'あったかいね。コト…って うごいた！',
    stage_01_egg_shake: 'なでたら、うれしそうに コトコトした！',
    stage_02_egg_crack: 'やさしく なでると、なかから コツン！',
    stage_03_hatch: 'もうすぐ あえるね。うれしそう！',
    stage_04_baby: 'きもちいい〜！ もっと なでてほしそう！',
    stage_05_small: 'うれしそうに からだを ゆらした！',
    stage_06_kid: 'ニコニコしながら しっぽを ふってる！',
    stage_07_grown: '大きくなっても、なでなでは だいすき！'
  };

  let restoreTimer = null;

  function currentStage() {
    let points = 0;
    const testBtn = document.getElementById('testModeBtn');
    const testInput = document.getElementById('testPoints');
    const testMode = testBtn && testBtn.classList.contains('active');
    if (testMode && testInput) points = Number(testInput.value) || 0;
    else if (window.GameStore) points = Number(GameStore.getState().growthPoints) || 0;
    return window.GameLogic ? GameLogic.stageForPoints(points) : { asset: 'stage_00_egg', message: '' };
  }

  function animate(kind, stage) {
    const creature = document.getElementById('creature');
    if (!creature) return;
    creature.classList.remove('kyukyu-observe', 'kyukyu-pet', 'kyukyu-egg-react');
    void creature.offsetWidth;
    const egg = ['stage_00_egg','stage_01_egg_shake','stage_02_egg_crack','stage_03_hatch'].includes(stage.asset);
    creature.classList.add(egg ? 'kyukyu-egg-react' : (kind === 'pet' ? 'kyukyu-pet' : 'kyukyu-observe'));
    setTimeout(() => creature.classList.remove('kyukyu-observe','kyukyu-pet','kyukyu-egg-react'), 950);
  }

  function speak(text, stage) {
    const bubble = document.getElementById('speechBubble');
    if (!bubble) return;
    clearTimeout(restoreTimer);
    bubble.textContent = text;
    bubble.classList.add('kyukyu-speaking');
    restoreTimer = setTimeout(() => {
      bubble.classList.remove('kyukyu-speaking');
      if (stage && stage.message) bubble.textContent = stage.message;
    }, 2300);
  }

  function bind() {
    const observe = document.getElementById('observeBtn');
    const pet = document.getElementById('petBtn');
    if (observe && !observe.dataset.reactionBound) {
      observe.dataset.reactionBound = '1';
      observe.addEventListener('click', () => {
        const stage = currentStage();
        setTimeout(() => {
          animate('observe', stage);
          speak(observeMessages[stage.asset] || stage.message || 'じーっと こちらを みているよ！', stage);
        }, 30);
      });
    }
    if (pet && !pet.dataset.reactionBound) {
      pet.dataset.reactionBound = '1';
      pet.addEventListener('click', () => {
        const stage = currentStage();
        setTimeout(() => {
          animate('pet', stage);
          speak(petMessages[stage.asset] || 'うれしそう！', stage);
        }, 90);
      });
    }
  }

  bind();
})();
