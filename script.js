/* =========================================================
   UZAIR'S BIRTHDAY WEBSITE — Main Script
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. AUDIO SETUP
  --------------------------------------------------------- */
  const bgMusic = new Audio('assets/music/birthday-music.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.45;

  const clickSound = new Audio('assets/music/click.mp3');
  clickSound.volume = 0.5;

  let musicStarted = false;
  let isMuted = false;

  function playClick(){
    try{
      clickSound.currentTime = 0;
      clickSound.play().catch(()=>{});
    }catch(e){}
  }

  function startMusic(){
    if(musicStarted) return;
    musicStarted = true;
    bgMusic.play().catch(()=>{ /* autoplay blocked, user can unmute/tap */ });
    document.getElementById('mute-btn').classList.remove('hidden');
  }

  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    clickSound.muted = isMuted;
    muteIcon.textContent = isMuted ? '🔇' : '🔊';
  });

  /* ---------------------------------------------------------
     1. PAGE NAVIGATION
  --------------------------------------------------------- */
  const pages = document.querySelectorAll('.page');
  const pageOrder = [
    'page-loading','page-welcome','page-reveal','page-kittens',
    'page-letter','page-prayer','page-reasons','page-meaoo',
    'page-gallery','page-final'
  ];

  function goToPage(id){
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    // trigger page-specific entrance logic
    if(id === 'page-reveal') runRevealPage();
    if(id === 'page-kittens') {}
    if(id === 'page-letter') resetLetterPage();
    if(id === 'page-prayer') resetPrayerPage();
    if(id === 'page-reasons') buildReasonsCards();
    if(id === 'page-meaoo') resetMeaooPage();
    if(id === 'page-gallery') startGallery();
    if(id === 'page-final') runFinalPage();
  }

  // Wire up all "Continue" buttons with data-next
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      playClick();
      goToPage(btn.getAttribute('data-next'));
    });
  });

  /* ---------------------------------------------------------
     2. LOADING SCREEN
  --------------------------------------------------------- */
  const pawContainer = document.getElementById('loading-paws');
  const pawPositions = [10, 60, 110, 160, 210];
  pawPositions.forEach((left, i) => {
    const paw = document.createElement('span');
    paw.className = 'paw-print';
    paw.textContent = '🐾';
    paw.style.left = left + 'px';
    paw.style.bottom = (i % 2 === 0 ? '0px' : '18px');
    paw.style.animationDelay = (i * 0.28) + 's';
    pawContainer.appendChild(paw);
  });

  const loadingBarFill = document.getElementById('loading-bar-fill');
  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 18 + 8;
    if(loadProgress >= 100){
      loadProgress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        goToPage('page-welcome');
      }, 350);
    }
    loadingBarFill.style.width = loadProgress + '%';
  }, 380);

  /* ---------------------------------------------------------
     3. WELCOME PAGE — GIFT BOX
  --------------------------------------------------------- */
  const giftBox = document.getElementById('gift-box');
  const openGiftBtn = document.getElementById('open-gift-btn');

  function openGift(){
    if(giftBox.classList.contains('opened')) return;
    startMusic();
    playClick();
    giftBox.classList.add('opened');

    if(typeof confetti === 'function'){
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffb8d4', '#e8a9a0', '#e3d4f5', '#ffe3d0', '#ffffff']
      });
      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#ffb8d4','#e8a9a0'] });
        confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#e3d4f5','#ffe3d0'] });
      }, 200);
    }

    setTimeout(() => { goToPage('page-reveal'); }, 1300);
  }
  giftBox.addEventListener('click', openGift);
  openGiftBtn.addEventListener('click', openGift);

  /* ---------------------------------------------------------
     4. REVEAL PAGE — FIREWORKS
  --------------------------------------------------------- */
  let revealFireworksRunning = false;
  function runRevealPage(){
    if(revealFireworksRunning) return;
    revealFireworksRunning = true;
    const canvas = document.getElementById('fireworks-canvas');
    startFireworks(canvas, 4500);

    if(typeof confetti === 'function'){
      const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
      myConfetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    }
    spawnFloatingBatch('💗', 10);
    spawnFloatingBatch('🌸', 8);
  }

  /* ---------------------------------------------------------
     5. FIREWORKS CANVAS ENGINE (shared by reveal + final page)
  --------------------------------------------------------- */
  function startFireworks(canvas, duration){
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize(){
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#ffb8d4','#e8a9a0','#e3d4f5','#ffe3d0','#f584ac','#ffffff'];
    let particles = [];
    let running = true;

    function spawnBurst(){
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 26;
      for(let i = 0; i < count; i++){
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 2.5 + 1.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color
        });
      }
    }

    let burstTimer = setInterval(spawnBurst, 500);

    function tick(){
      if(!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.alpha -= 0.015;
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });
      particles = particles.filter(p => p.alpha > 0);
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    tick();

    if(duration){
      setTimeout(() => {
        clearInterval(burstTimer);
        setTimeout(() => { running = false; ctx.clearRect(0,0,canvas.width,canvas.height); }, 1200);
      }, duration);
    }
  }

  /* ---------------------------------------------------------
     6. LETTER PAGE
  --------------------------------------------------------- */
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');
  const letterContinueBtn = document.getElementById('letter-continue-btn');
  const letterTypedEl = document.getElementById('letter-typed');
  let letterTypedInstance = null;
  let letterOpened = false;

  const letterText = `Dear Uzair,

Happy Birthday.

You are one of the quietest, kindest, loveliest, and most supportive people I know.

Thank you for always being there.

Some friendships don't need loud words.

They simply stay.

Meaoo Meaoo forever.

May Allah bless every step you take.

May He grant you happiness, peace, success, good health, and endless smiles.

I'm truly grateful to have you.

Happy Birthday.

❤️`;

  function resetLetterPage(){
    // nothing to reset visually unless replaying; envelope stays as-is unless full replay
  }

  envelope.addEventListener('click', () => {
    if(letterOpened) return;
    letterOpened = true;
    playClick();
    envelope.classList.add('opened');
    envelopeHint.classList.add('hidden');

    setTimeout(() => {
      if(typeof Typed !== 'undefined'){
        letterTypedInstance = new Typed('#letter-typed', {
          strings: [letterText.replace(/\n/g, '<br>')],
          typeSpeed: 18,
          showCursor: false,
          contentType: 'html',
          onComplete: () => {
            letterContinueBtn.classList.remove('hidden');
          }
        });
      } else {
        letterTypedEl.innerHTML = letterText.replace(/\n/g, '<br>');
        letterContinueBtn.classList.remove('hidden');
      }
    }, 500);
  });

  /* ---------------------------------------------------------
     7. PRAYER PAGE
  --------------------------------------------------------- */
  const prayers = [
    '✨ May Allah protect you.',
    '✨ May Allah grant you happiness.',
    '✨ May Allah bless your family.',
    '✨ May Allah grant you success.',
    '✨ May Allah make every hardship easy.',
    '✨ May Allah fill your life with barakah.',
    '✨ Ameen.'
  ];
  let prayerIndex = 0;
  const glowingHeart = document.getElementById('glowing-heart');
  const prayerLine = document.getElementById('prayer-line');
  const prayerDotsContainer = document.getElementById('prayer-dots');
  const prayerContinueBtn = document.getElementById('prayer-continue-btn');

  function resetPrayerPage(){
    prayerIndex = 0;
    prayerLine.textContent = 'Tap the heart';
    prayerContinueBtn.classList.add('hidden');
    prayerDotsContainer.innerHTML = '';
    prayers.forEach(() => {
      const dot = document.createElement('span');
      dot.className = 'prayer-dot';
      prayerDotsContainer.appendChild(dot);
    });
  }
  resetPrayerPage();

  glowingHeart.addEventListener('click', () => {
    if(prayerIndex >= prayers.length) return;
    playClick();
    prayerLine.style.animation = 'none';
    void prayerLine.offsetWidth;
    prayerLine.style.animation = 'prayer-fade-in 0.7s ease';
    prayerLine.textContent = prayers[prayerIndex];

    const dots = prayerDotsContainer.querySelectorAll('.prayer-dot');
    if(dots[prayerIndex]) dots[prayerIndex].classList.add('done');

    prayerIndex++;
    spawnFloatingBatch('✨', 3);

    if(prayerIndex >= prayers.length){
      setTimeout(() => prayerContinueBtn.classList.remove('hidden'), 500);
    }
  });

  /* ---------------------------------------------------------
     8. REASONS PAGE
  --------------------------------------------------------- */
  const reasons = [
    '🌸 You listen.',
    '🌸 You care.',
    '🌸 You are genuine.',
    '🌸 You are kind.',
    '🌸 You always support.',
    '🌸 Our friendship means a lot.'
  ];
  const reasonsGrid = document.getElementById('reasons-grid');
  let reasonsBuilt = false;

  function buildReasonsCards(){
    if(reasonsBuilt) return;
    reasonsBuilt = true;
    reasons.forEach((text, i) => {
      const card = document.createElement('div');
      card.className = 'reason-card';
      card.innerHTML = `
        <div class="reason-card-face reason-card-front">🌸</div>
        <div class="reason-card-face reason-card-back">${text.replace('🌸 ', '')}</div>
      `;
      card.addEventListener('click', () => {
        playClick();
        card.classList.toggle('flipped');
        if(card.classList.contains('flipped')){
          spawnFloatingBatch('🌸', 2);
        }
      });
      reasonsGrid.appendChild(card);
    });
  }

  /* ---------------------------------------------------------
     9. MEAOO INTERACTION PAGE
  --------------------------------------------------------- */
  const meaooKitten = document.getElementById('meaoo-kitten');
  const meaooBubbleZone = document.getElementById('meaoo-bubble-zone');
  const meaooTapText = document.getElementById('meaoo-tap-text');
  const meaooContinueBtn = document.getElementById('meaoo-continue-btn');
  const meaooMessages = ['🐱 Meaoo', '🐱 Meaooo', "You're my favorite human ❤️"];
  let meaooClicks = 0;

  function resetMeaooPage(){
    meaooClicks = 0;
    meaooTapText.textContent = 'tap the kitten';
    meaooTapText.classList.remove('hidden');
    meaooBubbleZone.querySelectorAll('.meaoo-result').forEach(el => el.remove());
    meaooContinueBtn.classList.add('hidden');
  }

  meaooKitten.addEventListener('click', () => {
    if(meaooClicks >= meaooMessages.length) return;
    playClick();
    meaooTapText.classList.add('hidden');
    meaooBubbleZone.querySelectorAll('.meaoo-result').forEach(el => el.remove());

    const result = document.createElement('p');
    result.className = 'meaoo-result';
    result.textContent = meaooMessages[meaooClicks];
    meaooBubbleZone.appendChild(result);

    meaooClicks++;
    if(meaooClicks >= meaooMessages.length){
      spawnFloatingBatch('❤️', 8);
      setTimeout(() => meaooContinueBtn.classList.remove('hidden'), 600);
    }
  });

  /* ---------------------------------------------------------
     10. MEMORY GALLERY
  --------------------------------------------------------- */
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const galleryDotsContainer = document.getElementById('gallery-dots');
  let galleryIndex = 0;
  let galleryTimer = null;

  gallerySlides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    galleryDotsContainer.appendChild(dot);
  });

  function showGallerySlide(i){
    gallerySlides.forEach(s => s.classList.remove('active'));
    galleryDotsContainer.querySelectorAll('.gallery-dot').forEach(d => d.classList.remove('active'));
    gallerySlides[i].classList.add('active');
    galleryDotsContainer.querySelectorAll('.gallery-dot')[i].classList.add('active');
    galleryIndex = i;
  }

  function startGallery(){
    galleryIndex = 0;
    showGallerySlide(0);
    if(galleryTimer) clearInterval(galleryTimer);
    galleryTimer = setInterval(() => {
      const next = (galleryIndex + 1) % gallerySlides.length;
      showGallerySlide(next);
    }, 2800);
  }

  /* ---------------------------------------------------------
     11. FINAL CELEBRATION PAGE
  --------------------------------------------------------- */
  let finalRunning = false;
  function runFinalPage(){
    if(galleryTimer) clearInterval(galleryTimer);
    const canvas = document.getElementById('final-fireworks-canvas');
    startFireworks(canvas, null); // runs until page leaves (replay)

    if(typeof confetti === 'function'){
      const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
      const duration = 3000;
      const end = Date.now() + duration;
      (function frame(){
        myConfetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffb8d4','#e8a9a0','#ffe3d0'] });
        myConfetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#e3d4f5','#f584ac','#ffffff'] });
        if(Date.now() < end) requestAnimationFrame(frame);
      })();
    }
    spawnFloatingBatch('🎈', 6);
    spawnFloatingBatch('🌹', 6);
    spawnFloatingBatch('💗', 10);
  }

  const replayBtn = document.getElementById('replay-btn');
  replayBtn.addEventListener('click', () => {
    playClick();
    // reset states for a fresh replay
    letterOpened = false;
    envelope.classList.remove('opened');
    envelopeHint.classList.remove('hidden');
    letterContinueBtn.classList.add('hidden');
    letterTypedEl.innerHTML = '';
    giftBox.classList.remove('opened');
    resetPrayerPage();
    resetMeaooPage();
    goToPage('page-welcome');
  });

  /* ---------------------------------------------------------
     12. AMBIENT FLOATING ELEMENTS (hearts, petals, sparkles, bubbles)
  --------------------------------------------------------- */
  const ambientCanvas = document.getElementById('ambient-canvas');
  const actx = ambientCanvas.getContext('2d');
  function resizeAmbient(){
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  resizeAmbient();
  window.addEventListener('resize', resizeAmbient);

  const ambientEmojis = ['💗','🌸','✨','🐾'];
  let ambientParticles = [];

  function makeAmbientParticle(){
    return {
      x: Math.random() * ambientCanvas.width,
      y: ambientCanvas.height + 30,
      size: Math.random() * 14 + 14,
      speed: Math.random() * 0.6 + 0.3,
      drift: Math.random() * 0.6 - 0.3,
      emoji: ambientEmojis[Math.floor(Math.random() * ambientEmojis.length)],
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.2,
      alpha: Math.random() * 0.4 + 0.4
    };
  }
  for(let i = 0; i < 14; i++){
    const p = makeAmbientParticle();
    p.y = Math.random() * ambientCanvas.height;
    ambientParticles.push(p);
  }

  function ambientTick(){
    actx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    ambientParticles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      if(p.y < -30){
        Object.assign(p, makeAmbientParticle());
        p.y = ambientCanvas.height + 30;
      }
      actx.save();
      actx.globalAlpha = p.alpha;
      actx.translate(p.x, p.y);
      actx.rotate((p.rot * Math.PI) / 180);
      actx.font = p.size + 'px sans-serif';
      actx.textAlign = 'center';
      actx.fillText(p.emoji, 0, 0);
      actx.restore();
    });
    requestAnimationFrame(ambientTick);
  }
  ambientTick();

  // Spawn a temporary batch of floating emoji (DOM based, for celebratory bursts)
  function spawnFloatingBatch(emoji, count){
    for(let i = 0; i < count; i++){
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'floating-el';
        el.textContent = emoji;
        el.style.left = Math.random() * 100 + 'vw';
        el.style.bottom = '-40px';
        el.style.fontSize = (Math.random() * 16 + 18) + 'px';
        document.body.appendChild(el);

        const duration = Math.random() * 2 + 3;
        const drift = (Math.random() - 0.5) * 120;

        if(typeof gsap !== 'undefined'){
          gsap.to(el, {
            y: -(window.innerHeight + 100),
            x: drift,
            rotation: Math.random() * 180 - 90,
            opacity: 0,
            duration: duration,
            ease: 'power1.out',
            onComplete: () => el.remove()
          });
        } else {
          el.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
          requestAnimationFrame(() => {
            el.style.transform = `translateY(-${window.innerHeight + 100}px) translateX(${drift}px)`;
            el.style.opacity = '0';
          });
          setTimeout(() => el.remove(), duration * 1000);
        }
      }, i * 120);
    }
  }

  /* ---------------------------------------------------------
     13. CURSOR SPARKLE TRAIL
  --------------------------------------------------------- */
  const cursorCanvas = document.getElementById('cursor-canvas');
  const cctx = cursorCanvas.getContext('2d');
  function resizeCursor(){
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  }
  resizeCursor();
  window.addEventListener('resize', resizeCursor);

  let sparkles = [];
  function addSparkle(x, y){
    sparkles.push({
      x, y,
      size: Math.random() * 3 + 2,
      alpha: 1,
      vy: -Math.random() * 0.6 - 0.2
    });
  }
  window.addEventListener('pointermove', (e) => {
    if(Math.random() > 0.55) addSparkle(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if(e.touches && e.touches[0]) addSparkle(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function cursorTick(){
    cctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    sparkles.forEach(s => {
      s.alpha -= 0.03;
      s.y += s.vy;
      cctx.globalAlpha = Math.max(s.alpha, 0);
      cctx.fillStyle = '#f584ac';
      cctx.beginPath();
      cctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      cctx.fill();
    });
    sparkles = sparkles.filter(s => s.alpha > 0);
    cctx.globalAlpha = 1;
    requestAnimationFrame(cursorTick);
  }
  cursorTick();

  /* ---------------------------------------------------------
     14. Start music on first user interaction (autoplay policies)
  --------------------------------------------------------- */
  document.body.addEventListener('click', startMusic, { once: true });

});
