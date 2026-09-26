// Slow drifting starfield with twinkle. Static when reduced motion is requested.
(() => {
  const canvas = document.getElementById('stars');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, stars = [], color = '231, 240, 255', last = 0, raf = 0;

  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue('--star').trim() || color;
  };

  const makeStar = (anywhere) => {
    const depth = Math.random();
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 4,
      r: 0.4 + depth * 1.3,
      vx: (Math.random() - 0.5) * 2 * (2 + depth * 4),
      vy: -(3 + depth * 9),
      base: 0.25 + depth * 0.55,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.6,
      life: anywhere ? Math.random() : 0,
    };
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(160, Math.max(50, (w * h) / 9000)));
    stars = Array.from({ length: count }, () => makeStar(true));
    if (still) draw(0, 0);
  };

  const draw = (t, dt) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.life = Math.min(1, s.life + dt / 4);
      if (s.y < -4 || s.x < -4 || s.x > w + 4) { stars[i] = makeStar(false); continue; }
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      const a = s.base * (0.35 + 0.65 * twinkle) * s.life;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${a.toFixed(3)})`;
      ctx.fill();
    }
  };

  const loop = (now) => {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    draw(now / 1000, dt);
    raf = requestAnimationFrame(loop);
  };

  readColor(); resize();
  window.addEventListener('resize', resize);
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { readColor(); if (still) draw(0, 0); });
  if (still) return;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); last = 0; }
    else raf = requestAnimationFrame(loop);
  });
  raf = requestAnimationFrame(loop);
})();
