/* ============================================
   スタンプメーカー - メインスクリプト
   ============================================ */

// ── 定数 ──────────────────────────────────

const FONTS = [
  { name: 'Noto Sans JP', category: '日本語' },
  { name: 'Noto Serif JP', category: '日本語' },
  { name: 'M PLUS Rounded 1c', category: '日本語' },
  { name: 'M PLUS 1p', category: '日本語' },
  { name: 'Zen Maru Gothic', category: '日本語' },
  { name: 'Zen Kaku Gothic New', category: '日本語' },
  { name: 'Roboto', category: '英語' },
  { name: 'Montserrat', category: '英語' },
  { name: 'Poppins', category: '英語' },
  { name: 'Oswald', category: '英語' },
  { name: 'Playfair Display', category: '英語' },
];

const PRESETS = [
  { name: 'ポップ',     bgColor: '#FFD600', textColor: '#333333', font: 'M PLUS Rounded 1c', fontStyle: 'bold',   shape: 'rounded' },
  { name: 'ビジネス',   bgColor: '#1A237E', textColor: '#FFFFFF', font: 'Noto Sans JP',       fontStyle: 'normal', shape: 'square' },
  { name: '警告',       bgColor: '#D32F2F', textColor: '#FFFFFF', font: 'Noto Sans JP',       fontStyle: 'bold',   shape: 'square' },
  { name: 'パステル',   bgColor: '#FCE4EC', textColor: '#C2185B', font: 'Zen Maru Gothic',    fontStyle: 'normal', shape: 'rounded' },
  { name: 'クール',     bgColor: '#263238', textColor: '#00E5FF', font: 'Montserrat',         fontStyle: 'bold',   shape: 'square' },
  { name: 'ナチュラル', bgColor: '#2E7D32', textColor: '#FFFFFF', font: 'Zen Maru Gothic',    fontStyle: 'normal', shape: 'rounded' },
  { name: 'エレガント', bgColor: '#4A148C', textColor: '#FFD700', font: 'Noto Serif JP',      fontStyle: 'normal', shape: 'square' },
  { name: 'モノクロ',   bgColor: '#212121', textColor: '#FFFFFF', font: 'Noto Sans JP',       fontStyle: 'bold',   shape: 'square' },
  { name: 'サンセット', bgColor: '#E65100', textColor: '#FFF8E1', font: 'M PLUS Rounded 1c',  fontStyle: 'bold',   shape: 'rounded' },
  { name: 'ミント',     bgColor: '#E0F2F1', textColor: '#00695C', font: 'Zen Maru Gothic',    fontStyle: 'normal', shape: 'rounded' },
];

const COLOR_SWATCHES = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
  '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
  '#795548', '#607D8B', '#9E9E9E', '#333333', '#FFFFFF',
];

const RECENT_FONTS_KEY = 'stampmaker_recent_fonts';
const MAX_RECENT_FONTS = 5;
const ROUNDED_RADIUS_RATIO = 0.15;

// ── 状態 ──────────────────────────────────

const state = {
  text: 'OK',
  bgColor: '#5C6BC0',
  textColor: '#FFFFFF',
  font: 'Noto Sans JP',
  fontStyle: 'normal',
  shape: 'square',
  transparent: false,
  resolution: 128,
};

// ── DOM 要素 ──────────────────────────────

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let dom = {};

// ── 初期化 ────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  buildColorSwatches();
  buildFontList();
  buildPresets();
  bindEvents();

  // フォント読み込み完了後に再描画
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      renderAllPreviews();
      renderPresetThumbnails();
    });
  } else {
    // fallback
    setTimeout(() => {
      renderAllPreviews();
      renderPresetThumbnails();
    }, 1000);
  }

  renderAllPreviews();
  updateUI();
});

function cacheDom() {
  dom = {
    previewCanvas: $('#preview-canvas'),
    smallCanvas: $('#small-canvas'),
    mediumCanvas: $('#medium-canvas'),
    previewMain: $('#preview-main'),
    previewSmallWrap: $('#preview-small-wrap'),
    previewMediumWrap: $('#preview-medium-wrap'),
    textInput: $('#text-input'),
    fontTrigger: $('#font-trigger'),
    fontTriggerText: $('#font-trigger-text'),
    fontTriggerArrow: $('#font-trigger-arrow'),
    fontPanel: $('#font-panel'),
    recentFontsSection: $('#recent-fonts-section'),
    recentFontsList: $('#recent-fonts-list'),
    allFontsList: $('#all-fonts-list'),
    fontStyleGroup: $('#font-style-group'),
    bgColorPicker: $('#bg-color-picker'),
    bgColorHex: $('#bg-color-hex'),
    bgSwatches: $('#bg-swatches'),
    textColorPicker: $('#text-color-picker'),
    textColorHex: $('#text-color-hex'),
    textSwatches: $('#text-swatches'),
    shapeGroup: $('#shape-group'),
    transparentToggle: $('#transparent-toggle'),
    resolutionGroup: $('#resolution-group'),
    downloadBtn: $('#download-btn'),
    downloadHint: $('#download-hint'),
    presetsContainer: $('#presets-container'),
  };
}

// ── UI 構築 ───────────────────────────────

function buildColorSwatches() {
  [dom.bgSwatches, dom.textSwatches].forEach((container) => {
    const targetType = container === dom.bgSwatches ? 'bg' : 'text';
    COLOR_SWATCHES.forEach((color) => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      swatch.dataset.color = color;
      swatch.dataset.target = targetType;
      swatch.title = color;

      // 明るい色にはボーダーを追加
      if (isLightColor(color)) {
        swatch.classList.add('swatch-light');
      }

      container.appendChild(swatch);
    });
  });
  updateSwatchActiveState();
}

function buildFontList() {
  const recentFonts = loadRecentFonts();

  // 最近使ったフォント
  if (recentFonts.length > 0) {
    dom.recentFontsSection.classList.remove('hidden');
    dom.recentFontsList.innerHTML = '';
    recentFonts.forEach((fontName) => {
      dom.recentFontsList.appendChild(createFontItem(fontName));
    });
  } else {
    dom.recentFontsSection.classList.add('hidden');
  }

  // すべてのフォント
  dom.allFontsList.innerHTML = '';
  FONTS.forEach((font) => {
    dom.allFontsList.appendChild(createFontItem(font.name));
  });

  updateFontActiveState();
}

function createFontItem(fontName) {
  const item = document.createElement('div');
  item.className = 'font-item';
  item.dataset.font = fontName;
  item.style.fontFamily = `"${fontName}", sans-serif`;
  item.innerHTML = `
    <span>${fontName}</span>
    <span class="font-item-check">✓</span>
  `;
  return item;
}

function buildPresets() {
  dom.presetsContainer.innerHTML = '';
  PRESETS.forEach((preset, index) => {
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.dataset.index = index;

    const canvas = document.createElement('canvas');
    canvas.width = 104;
    canvas.height = 104;
    canvas.className = 'preset-thumb';

    const name = document.createElement('span');
    name.className = 'preset-card-name';
    name.textContent = preset.name;

    card.appendChild(canvas);
    card.appendChild(name);
    dom.presetsContainer.appendChild(card);
  });

  renderPresetThumbnails();
}

function renderPresetThumbnails() {
  const cards = dom.presetsContainer.querySelectorAll('.preset-card');
  cards.forEach((card, index) => {
    const preset = PRESETS[index];
    const canvas = card.querySelector('canvas');
    const text = state.text || 'Aa';
    renderStamp(canvas, 104, {
      text: text,
      bgColor: preset.bgColor,
      textColor: preset.textColor,
      font: preset.font,
      fontStyle: preset.fontStyle,
      shape: preset.shape,
      transparent: false,
    });
  });
}

// ── イベントバインド ──────────────────────

function bindEvents() {
  // テキスト入力
  dom.textInput.addEventListener('input', () => {
    state.text = dom.textInput.value;
    renderAllPreviews();
    renderPresetThumbnails();
  });

  // フォント選択トリガー
  dom.fontTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFontPanel();
  });

  // フォント項目クリック
  dom.fontPanel.addEventListener('click', (e) => {
    const item = e.target.closest('.font-item');
    if (!item) return;
    const fontName = item.dataset.font;
    state.font = fontName;
    saveRecentFont(fontName);
    buildFontList();
    closeFontPanel();
    updateUI();
    renderAllPreviews();
  });

  // パネル外クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!dom.fontPanel.contains(e.target) && e.target !== dom.fontTrigger && !dom.fontTrigger.contains(e.target)) {
      closeFontPanel();
    }
  });

  // フォントスタイル
  dom.fontStyleGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-option');
    if (!btn) return;
    state.fontStyle = btn.dataset.value;
    setActiveButton(dom.fontStyleGroup, btn);
    renderAllPreviews();
  });

  // 背景色ピッカー
  dom.bgColorPicker.addEventListener('input', (e) => {
    state.bgColor = e.target.value;
    dom.bgColorHex.textContent = e.target.value.toUpperCase();
    updateSwatchActiveState();
    renderAllPreviews();
    renderPresetThumbnails();
  });

  // 文字色ピッカー
  dom.textColorPicker.addEventListener('input', (e) => {
    state.textColor = e.target.value;
    dom.textColorHex.textContent = e.target.value.toUpperCase();
    updateSwatchActiveState();
    renderAllPreviews();
    renderPresetThumbnails();
  });

  // カラースウォッチ
  document.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    const color = swatch.dataset.color;
    const target = swatch.dataset.target;
    if (target === 'bg') {
      state.bgColor = color;
      dom.bgColorPicker.value = color;
      dom.bgColorHex.textContent = color.toUpperCase();
    } else {
      state.textColor = color;
      dom.textColorPicker.value = color;
      dom.textColorHex.textContent = color.toUpperCase();
    }
    updateSwatchActiveState();
    renderAllPreviews();
    renderPresetThumbnails();
  });

  // 形状
  dom.shapeGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-option');
    if (!btn) return;
    state.shape = btn.dataset.value;
    setActiveButton(dom.shapeGroup, btn);
    renderAllPreviews();
    renderPresetThumbnails();
  });

  // 背景透過
  dom.transparentToggle.addEventListener('change', () => {
    state.transparent = dom.transparentToggle.checked;
    updateTransparencyUI();
    renderAllPreviews();
  });

  // 出力サイズ
  dom.resolutionGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-option');
    if (!btn) return;
    state.resolution = parseInt(btn.dataset.value, 10);
    setActiveButton(dom.resolutionGroup, btn);
    updateDownloadHint();
  });

  // プリセット
  dom.presetsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.preset-card');
    if (!card) return;
    const index = parseInt(card.dataset.index, 10);
    applyPreset(PRESETS[index]);
    // active 表示
    dom.presetsContainer.querySelectorAll('.preset-card').forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
  });

  // ダウンロード
  dom.downloadBtn.addEventListener('click', downloadStamp);
}

// ── フォントパネル ────────────────────────

function toggleFontPanel() {
  const isOpen = dom.fontPanel.classList.contains('open');
  if (isOpen) {
    closeFontPanel();
  } else {
    openFontPanel();
  }
}

function openFontPanel() {
  dom.fontPanel.classList.add('open');
  dom.fontTrigger.classList.add('open');
}

function closeFontPanel() {
  dom.fontPanel.classList.remove('open');
  dom.fontTrigger.classList.remove('open');
}

// ── プリセット適用 ────────────────────────

function applyPreset(preset) {
  state.bgColor = preset.bgColor;
  state.textColor = preset.textColor;
  state.font = preset.font;
  state.fontStyle = preset.fontStyle;
  state.shape = preset.shape;

  saveRecentFont(preset.font);
  buildFontList();
  updateUI();
  renderAllPreviews();
}

// ── UI 更新 ───────────────────────────────

function updateUI() {
  // フォント表示
  dom.fontTriggerText.textContent = state.font;
  dom.fontTriggerText.style.fontFamily = `"${state.font}", sans-serif`;

  // カラーピッカー
  dom.bgColorPicker.value = state.bgColor;
  dom.bgColorHex.textContent = state.bgColor.toUpperCase();
  dom.textColorPicker.value = state.textColor;
  dom.textColorHex.textContent = state.textColor.toUpperCase();

  // フォントスタイル
  dom.fontStyleGroup.querySelectorAll('.btn-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.value === state.fontStyle);
  });

  // 形状
  dom.shapeGroup.querySelectorAll('.btn-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.value === state.shape);
  });

  // 解像度
  dom.resolutionGroup.querySelectorAll('.btn-option').forEach((btn) => {
    btn.classList.toggle('active', parseInt(btn.dataset.value, 10) === state.resolution);
  });

  // 透過
  dom.transparentToggle.checked = state.transparent;
  updateTransparencyUI();

  // スウォッチ
  updateSwatchActiveState();
  updateFontActiveState();
  updateDownloadHint();
}

function updateTransparencyUI() {
  dom.previewMain.classList.toggle('transparent', state.transparent);
  dom.previewSmallWrap.classList.toggle('transparent', state.transparent);
  dom.previewMediumWrap.classList.toggle('transparent', state.transparent);
}

function updateSwatchActiveState() {
  dom.bgSwatches.querySelectorAll('.color-swatch').forEach((s) => {
    s.classList.toggle('active', s.dataset.color.toUpperCase() === state.bgColor.toUpperCase());
  });
  dom.textSwatches.querySelectorAll('.color-swatch').forEach((s) => {
    s.classList.toggle('active', s.dataset.color.toUpperCase() === state.textColor.toUpperCase());
  });
}

function updateFontActiveState() {
  dom.fontPanel.querySelectorAll('.font-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.font === state.font);
  });
}

function setActiveButton(group, activeBtn) {
  group.querySelectorAll('.btn-option').forEach((btn) => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

function updateDownloadHint() {
  const res = state.resolution;
  if (res >= 256) {
    dom.downloadHint.textContent = `Slack の上限は 128KB です。${res}px ではファイルサイズが大きくなる場合があります。`;
    dom.downloadHint.className = 'download-hint warning';
  } else {
    dom.downloadHint.textContent = `${res}x${res}px の PNG で出力します。`;
    dom.downloadHint.className = 'download-hint';
  }
}

// ── Canvas 描画 ───────────────────────────

function renderAllPreviews() {
  renderStamp(dom.previewCanvas, 256, state);
  renderStamp(dom.smallCanvas, 22, state);
  renderStamp(dom.mediumCanvas, 48, state);
}

function renderStamp(canvas, size, opts) {
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;

  ctx.clearRect(0, 0, size, size);

  const text = opts.text || '';
  const transparent = opts.transparent || false;

  // 背景
  if (!transparent) {
    ctx.fillStyle = opts.bgColor;
    if (opts.shape === 'rounded') {
      drawRoundedRect(ctx, 0, 0, size, size, size * ROUNDED_RADIUS_RATIO);
    } else {
      ctx.fillRect(0, 0, size, size);
    }
  }

  // テキスト
  if (text.length > 0) {
    const fontSize = calculateFontSize(ctx, text, opts.font, opts.fontStyle, size);
    ctx.font = buildFontString(opts.fontStyle, fontSize, opts.font);
    ctx.fillStyle = opts.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 微調整: 日本語フォントは少し上にずれるので補正
    const metrics = ctx.measureText(text);
    let yOffset = 0;
    if (metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent) {
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      yOffset = (metrics.actualBoundingBoxAscent - textHeight / 2);
    }

    ctx.fillText(text, size / 2, size / 2 + yOffset);
  }
}

function buildFontString(fontStyle, fontSize, fontFamily) {
  const italic = fontStyle.includes('italic') ? 'italic ' : '';
  const bold = fontStyle.includes('bold') ? 'bold ' : '';
  return `${italic}${bold}${fontSize}px "${fontFamily}"`;
}

function calculateFontSize(ctx, text, fontFamily, fontStyle, canvasSize) {
  const padding = canvasSize * 0.12;
  const maxWidth = canvasSize - padding * 2;
  const maxHeight = canvasSize - padding * 2;

  let low = 4;
  let high = Math.floor(canvasSize * 0.9);
  let result = low;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    ctx.font = buildFontString(fontStyle, mid, fontFamily);
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;

    // 高さの推定: actualBoundingBox が使えればそれを使う
    let textHeight = mid; // fallback
    if (metrics.actualBoundingBoxAscent !== undefined && metrics.actualBoundingBoxDescent !== undefined) {
      textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }

    if (textWidth <= maxWidth && textHeight <= maxHeight) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// ── ダウンロード ──────────────────────────

function downloadStamp() {
  const size = state.resolution;
  const offscreen = document.createElement('canvas');
  renderStamp(offscreen, size, state);

  offscreen.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = (state.text || 'stamp').replace(/[\\/:*?"<>|]/g, '_');
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // ファイルサイズ警告
    if (blob.size > 128 * 1024) {
      dom.downloadHint.textContent = `ダウンロード完了（${(blob.size / 1024).toFixed(1)}KB）。Slack の上限 128KB を超えています。`;
      dom.downloadHint.className = 'download-hint warning';
    } else {
      dom.downloadHint.textContent = `ダウンロード完了（${(blob.size / 1024).toFixed(1)}KB）`;
      dom.downloadHint.className = 'download-hint';
    }
  }, 'image/png');
}

// ── localStorage: 最近使ったフォント ──────

function loadRecentFonts() {
  try {
    const data = localStorage.getItem(RECENT_FONTS_KEY);
    if (data) {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        return arr.slice(0, MAX_RECENT_FONTS);
      }
    }
  } catch (e) {
    // localStorage が使えない場合は無視
  }
  return [];
}

function saveRecentFont(fontName) {
  try {
    let recent = loadRecentFonts();
    // 既にあれば先頭に移動
    recent = recent.filter((f) => f !== fontName);
    recent.unshift(fontName);
    recent = recent.slice(0, MAX_RECENT_FONTS);
    localStorage.setItem(RECENT_FONTS_KEY, JSON.stringify(recent));
  } catch (e) {
    // localStorage が使えない場合は無視
  }
}

// ── ユーティリティ ────────────────────────

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.85;
}
