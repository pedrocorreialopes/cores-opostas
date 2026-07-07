(function () {
  'use strict';

  // ---------- State ----------
  let hue = 0;          // 0-360, angle measured clockwise from top of wheel
  let lightness = 50;   // 10-90
  const saturation = 100;
  const HANDLE_RADIUS_FRACTION = 0.37; // fraction of wheel radius where handles sit

  // ---------- DOM refs ----------
  const wheel = document.getElementById('wheel');
  const handleA = document.getElementById('handle-a');
  const handleB = document.getElementById('handle-b');
  const connectorLine = document.getElementById('connector-line');

  const swatchA = document.getElementById('swatch-a');
  const swatchB = document.getElementById('swatch-b');
  const previewA = document.getElementById('preview-a');
  const previewB = document.getElementById('preview-b');

  const hexA = document.getElementById('hex-a');
  const rgbA = document.getElementById('rgb-a');
  const hslA = document.getElementById('hsl-a');
  const hexB = document.getElementById('hex-b');
  const rgbB = document.getElementById('rgb-b');
  const hslB = document.getElementById('hsl-b');

  const lightnessRange = document.getElementById('lightness-range');
  const lightnessValue = document.getElementById('lightness-value');
  const paletteButtons = document.getElementById('palette-buttons');

  const copyBtn = document.getElementById('copy-btn');
  const copyFeedback = document.getElementById('copy-feedback');

  // ---------- Color conversion helpers ----------
  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255)
    ];
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0').toUpperCase()).join('');
  }

  function normalizeHue(h) {
    let n = h % 360;
    if (n < 0) n += 360;
    return n;
  }

  // ---------- Geometry helpers ----------
  // theta: degrees, 0 = top of circle, increasing clockwise
  function angleToFraction(thetaDeg, radiusFraction) {
    const rad = (thetaDeg * Math.PI) / 180;
    return {
      xFrac: 0.5 + radiusFraction * Math.sin(rad),
      yFrac: 0.5 - radiusFraction * Math.cos(rad)
    };
  }

  // Given pointer coords relative to wheel element, return hue angle (0-360)
  function pointToHue(dx, dy) {
    const rad = Math.atan2(dx, -dy);
    let deg = (rad * 180) / Math.PI;
    return normalizeHue(deg);
  }

  // ---------- Rendering ----------
  function render() {
    const compHue = normalizeHue(hue + 180);

    const rgbAv = hslToRgb(hue, saturation, lightness);
    const rgbBv = hslToRgb(compHue, saturation, lightness);
    const hexAv = rgbToHex(...rgbAv);
    const hexBv = rgbToHex(...rgbBv);
    const hslAStr = `${Math.round(hue)}°, ${saturation}%, ${lightness}%`;
    const hslBStr = `${Math.round(compHue)}°, ${saturation}%, ${lightness}%`;
    const cssA = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const cssB = `hsl(${compHue}, ${saturation}%, ${lightness}%)`;

    swatchA.style.backgroundColor = cssA;
    swatchB.style.backgroundColor = cssB;
    previewA.style.backgroundColor = cssA;
    previewB.style.backgroundColor = cssB;
    handleA.style.backgroundColor = cssA;
    handleB.style.backgroundColor = cssB;

    hexA.textContent = hexAv;
    rgbA.textContent = rgbAv.join(', ');
    hslA.textContent = hslAStr;

    hexB.textContent = hexBv;
    rgbB.textContent = rgbBv.join(', ');
    hslB.textContent = hslBStr;

    lightnessValue.textContent = `${lightness}%`;
    lightnessRange.value = lightness;

    positionHandles(hue, compHue);
  }

  function positionHandles(hueA, hueB) {
    const posA = angleToFraction(hueA, HANDLE_RADIUS_FRACTION);
    const posB = angleToFraction(hueB, HANDLE_RADIUS_FRACTION);

    handleA.style.left = `${posA.xFrac * 100}%`;
    handleA.style.top = `${posA.yFrac * 100}%`;

    handleB.style.left = `${posB.xFrac * 100}%`;
    handleB.style.top = `${posB.yFrac * 100}%`;

    // Update connector line in SVG (viewBox 0 0 400 400)
    connectorLine.setAttribute('x1', posA.xFrac * 400);
    connectorLine.setAttribute('y1', posA.yFrac * 400);
    connectorLine.setAttribute('x2', posB.xFrac * 400);
    connectorLine.setAttribute('y2', posB.yFrac * 400);
  }

  // ---------- Interaction ----------
  let dragging = false;

  function updateHueFromPointer(clientX, clientY) {
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    hue = pointToHue(dx, dy);
    render();
  }

  function onPointerDown(e) {
    dragging = true;
    wheel.setPointerCapture(e.pointerId);
    updateHueFromPointer(e.clientX, e.clientY);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    updateHueFromPointer(e.clientX, e.clientY);
  }

  function onPointerUp(e) {
    dragging = false;
    try { wheel.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
  }

  wheel.addEventListener('pointerdown', onPointerDown);
  wheel.addEventListener('pointermove', onPointerMove);
  wheel.addEventListener('pointerup', onPointerUp);
  wheel.addEventListener('pointercancel', onPointerUp);

  // Keyboard support on handle A
  handleA.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      hue = normalizeHue(hue + step);
      render();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      hue = normalizeHue(hue - step);
      render();
      e.preventDefault();
    }
  });

  // Lightness slider
  lightnessRange.addEventListener('input', (e) => {
    lightness = Number(e.target.value);
    render();
  });

  // Palette quick buttons
  paletteButtons.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-hue]');
    if (!btn) return;
    hue = Number(btn.dataset.hue);
    render();
  });

  // Copy hex codes
  copyBtn.addEventListener('click', async () => {
    const text = `${hexA.textContent} / ${hexB.textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      copyFeedback.textContent = `Copiado: ${text}`;
    } catch (err) {
      copyFeedback.textContent = 'Não foi possível copiar automaticamente.';
    }
    setTimeout(() => { copyFeedback.textContent = ''; }, 2500);
  });

  // Reposition handles on resize (fractions handle it, but recalc line just in case)
  window.addEventListener('resize', render);

  // Initial render
  hue = 0;
  render();
})();
