const $ = (q) => document.querySelector(q)
const GEMINI_API_KEY = 'AIzaSyDz6qVGkiSm5h5rW-vZ7V_f6vVjXj7nJy0';
const MATERIALS_KEY = 'estudos_materiais';
const RESULTS_KEY = 'estudos_resultados';
const THEME_KEY = 'estudos_tema';

window.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  renderHistory();
  renderResults();
  renderFlashcards();
});


function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  if (savedTheme === 'light') document.body.classList.add('light');
  updateThemeButton();
}

function toggleTheme() {
  event.preventDefault();
  const isLight = document.body.classList.toggle('light');
  const theme = isLight ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, theme);
  updateThemeButton();
}

function updateThemeButton() {
  const themeBtn = document.querySelector('.theme-btn');
  if (!themeBtn) return;
  const isLight = document.body.classList.contains('light');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  
  if (themeIcon) {
    themeIcon.src = isLight ? 'img/brightness.png' : 'img/night-mode.png';
    themeIcon.alt = isLight ? 'Luz' : 'Tema';
  }
  if (themeText) {
    themeText.textContent = isLight ? 'Light' : 'Dark';
  }
}

function toggleMenu() { document.querySelector('.sidebar').classList.toggle('open') }

function saveMaterial(text) {
  const materials = JSON.parse(localStorage.getItem(MATERIALS_KEY) || '[]');
  materials.unshift({ id: Date.now(), text: text, created: new Date().toLocaleString() });
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials.slice(0, 50)));
}

function getMaterials() {
  return JSON.parse(localStorage.getItem(MATERIALS_KEY) || '[]');
}


function saveHistory(type, content) {
  const h = JSON.parse(localStorage.getItem('bf_hist') || '[]');
  h.unshift({ t: Date.now(), type: type, v: content });
  localStorage.setItem('bf_hist', JSON.stringify(h.slice(0, 50)));
  renderHistory();
}

function saveResult(type, content) {
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  results[type] = { content: content, created: Date.now() };
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

function renderHistory() {
  const el = document.getElementById('hist');
  if (!el) return;

  const h = JSON.parse(localStorage.getItem('bf_hist') || []);
  let tipoPagina = '';

  if (window.location.href.includes('resumo.html')) tipoPagina = 'Resumo';
  else if (window.location.href.includes('perguntas.html')) tipoPagina = 'Perguntas';
  else if (window.location.href.includes('flashcards.html')) tipoPagina = 'Flashcards';

  const filtrado = h.filter(i => i.type === tipoPagina);

  el.innerHTML = filtrado.map(i =>
    `<li><strong>${i.type}</strong> — ${new Date(i.t).toLocaleString()}</li>`
  ).join('');
}

function renderResults() {
  const resultDiv = document.getElementById('output');
  if (!resultDiv) return;
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  if (resultDiv.id === 'output' && window.location.href.includes('resumo.html')) {
    resultDiv.textContent = results.resumo ? results.resumo.content : 'Use o Dashboard para gerar.';
  } else if (resultDiv.id === 'output' && window.location.href.includes('perguntas.html')) {
    resultDiv.textContent = results.perguntas ? results.perguntas.content : 'Use o Dashboard para gerar.';
  }
}


function showLoader() {
  const bar = document.getElementById('loader');
  if (bar) bar.style.display = 'block';
}

function hideLoader() {
  const bar = document.getElementById('loader');
  if (bar) bar.style.display = 'none';
}


async function callGeminiAI(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      throw new Error('Erro na API');
    }

    const data = await response.json();

    if (
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      return data.candidates[0].content.parts[0].text;
    }

    return fallbackGenerate(prompt);

  } catch (error) {
    console.error('Erro Gemini:', error);
    return fallbackGenerate(prompt);
  }
}

function fallbackGenerate(prompt) {
  const input = $('#inputText')?.value || '';

  const sentences = input
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (!input) return 'Digite um texto para gerar conteúdo.';

  if (prompt.toLowerCase().includes('resumo')) {
    const scored = sentences.map(s => ({
      text: s,
      score: s.split(' ').length
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map(s => s.text).join('. ') + '.';
  }

  if (prompt.toLowerCase().includes('perguntas')) {
    return sentences.slice(0, 3).map((s, i) =>
      `${i + 1}. Qual a importância de: "${s.slice(0, 50)}..."?`
    ).join('\n');
  }

  if (prompt.toLowerCase().includes('flashcard')) {
    return sentences.slice(0, 3).map(s =>
      `Pergunta: ${s.slice(0, 40)}?\nResposta: ${s}`
    ).join('\n\n');
  }

  return 'Conteúdo gerado automaticamente.';
}


async function gerarResumo() {
  const text = $('#inputText').value;
  if (!text.trim()) {
    alert('Por favor, insira um texto');
    return;
  }
  showLoader();
  saveMaterial(text);
  const prompt = `Crie um resumo conciso e bem estruturado do seguinte texto em 3-4 linhas:\n\n${text}`;
  const resumo = await callGeminiAI(prompt);
  hideLoader();
  const highlighted = highlightText(resumo);
 typeWriter($('#output'), highlighted);
  setTimeout(() => {
    $('#output').innerHTML = highlighted;
  }, 300);
  saveHistory('Resumo', resumo);
  saveResult('resumo', resumo);
}


async function gerarPerguntas() {
  const text = $('#inputText').value;
  if (!text.trim()) {
    alert('Por favor, insira um texto');
    return;
  }
  showLoader();
  const prompt = `Gere 5 perguntas de estudo importantes sobre o seguinte texto:\n\n${text}\n\nFormate como lista numerada.`;
  const perguntas = await callGeminiAI(prompt);
  hideLoader();
  const highlighted = highlightText(perguntas);
 typeWriter($('#output'), highlighted);
  setTimeout(() => {
    $('#output').innerHTML = highlighted;
  }, 300);
  saveHistory('Perguntas', perguntas);
  saveResult('perguntas', perguntas);
}

async function gerarFlashcards() {
  const text = $('#inputText').value;
  if (!text.trim()) {
    alert('Por favor, insira um texto');
    return;
  }
  showLoader();

const prompt = `
Crie entre 5 e 10 flashcards educativos baseados no texto abaixo.
Cada flashcard deve ter uma pergunta e uma resposta.

Formate EXATO de cada flashcard:
Pergunta: [pergunta clara e objetiva]
Resposta: [resposta concisa]

Texto:
${text}`;
  const flashcardsText = await callGeminiAI(prompt);
  hideLoader();
  
  // Parsear flashcards
  const flashcards = parseFlashcards(flashcardsText);
  
  // Salvar estruturado
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  results.flashcards = { 
    content: flashcardsText, 
    cards: flashcards,
    created: Date.now() 
  };
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  
  // Exibir formatado no dashboard
  $('#output').innerHTML = formatFlashcardsOutput(flashcards);
  
  saveHistory('Flashcards', flashcardsText);
  saveResult('flashcards', flashcardsText);
  renderFlashcards();
}

function formatFlashcardsOutput(cards) {
  if (!cards || cards.length === 0) {
    return '<p style="color: var(--muted); text-align: center; padding: 20px;">Nenhum flashcard gerado.</p>';
  }
  
  let html = `<div style="color: var(--muted); margin-bottom: 20px; font-size: 14px; display: flex; align-items: center; gap: 8px;">
    <span style="font-size: 20px;">📚</span>
    <span><strong>Total: ${cards.length} flashcards gerados</strong></span>
  </div>`;
  
  cards.forEach((card, idx) => {
    html += `
      <div style="background: linear-gradient(135deg, rgba(124, 92, 255, 0.15), rgba(124, 92, 255, 0.05)); border-left: 4px solid var(--primary); border-radius: 8px; padding: 16px; margin: 12px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
        <div style="color: var(--primary); font-weight: bold; margin-bottom: 12px; font-size: 13px; display: flex; align-items: center; gap: 6px;">
          <span>🎓</span>
          <span>Card ${idx + 1}/${cards.length}</span>
        </div>
        <div style="margin-bottom: 14px;">
          <div style="color: var(--muted); font-size: 11px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">❓ Pergunta:</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 15px;">${card.pergunta}</div>
        </div>
        <div style="border-top: 1px solid rgba(124, 92, 255, 0.2); padding-top: 14px;">
          <div style="color: var(--muted); font-size: 11px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">✅ Resposta:</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 15px;">${card.resposta}</div>
        </div>
      </div>
    `;
  });
  
  return html;
}

function parseFlashcards(text) {
  const cards = [];
  const regex = /Pergunta:\s*(.+?)\s*Resposta:\s*(.+?)(?=Pergunta:|$)/gs;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    cards.push({
      pergunta: match[1].trim(),
      resposta: match[2].trim()
    });
  }
  
  return cards.length > 0 ? cards : [];
}

function renderFlashcards() {
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  const cardsContainer = document.getElementById('cardsList');
  const navButtons = document.getElementById('navButtons');
  const flash = document.getElementById('flash');
  
  if (!flash) return;
  
  if (!results.flashcards || !results.flashcards.cards || results.flashcards.cards.length === 0) {
    flash.innerHTML = '<div style="color: var(--muted); text-align: center;">Gere flashcards no Dashboard</div>';
    if (navButtons) navButtons.style.display = 'none';
    if (cardsContainer) cardsContainer.innerHTML = '';
    return;
  }
  
  const cards = results.flashcards.cards;
  const firstCard = cards[0];
  
  // Exibir primeiro card no elemento flash
  flash.innerHTML = `
    <div style="text-align: left; width: 100%; cursor: pointer;" id="flash-content">
      <div style="color: var(--muted); font-size: 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 18px;">📍</span>
        <span>Card 1/${cards.length}</span>
      </div>
      <div style="margin-bottom: 20px;">
        <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">❓ Pergunta:</div>
        <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${firstCard.pergunta}</div>
      </div>
      <div style="border-top: 1px solid var(--border); padding-top: 20px; transition: all 0.3s ease; opacity: 0; pointer-events: none;" id="flash-answer-0">
        <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">✅ Resposta:</div>
        <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${firstCard.resposta}</div>
      </div>
      <div style="color: var(--muted); font-size: 12px; margin-top: 20px; text-align: center; font-style: italic;">🔄 Clique para virar</div>
    </div>
  `;
  flash.dataset.s = 'q';
  flash.dataset.index = 0;
  flash.style.cursor = 'pointer';
  
  // Renderizar lista completa de cards
  if (cardsContainer) {
    cardsContainer.innerHTML = cards.map((card, idx) => `
      <div class="card-item" style="background: linear-gradient(135deg, var(--panel), var(--panel-2)); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin: 12px 0; transition: all 0.3s ease; animation: slideIn 0.3s ease;">
        <div style="color: var(--muted); font-size: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 16px;">🎓</span>
          <span>Card ${idx + 1}/${cards.length}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: var(--primary);">❓ Pergunta:</strong>
          <p style="margin: 8px 0; color: var(--text); line-height: 1.7;">${card.pergunta}</p>
        </div>
        <div style="padding-top: 12px; border-top: 1px solid var(--border);">
          <strong style="color: var(--primary);">✅ Resposta:</strong>
          <p style="margin: 8px 0; color: var(--text); line-height: 1.7;">${card.resposta}</p>
        </div>
      </div>
    `).join('');
  }
  
  // Mostrar botões de navegacao
  if (navButtons) {
    navButtons.style.display = 'flex';
    updateCardCounter(0, cards.length);
  }
}

function updateCardCounter(current, total) {
  const counter = document.getElementById('cardCounter');
  if (counter) {
    counter.textContent = `${current + 1} / ${total}`;
  }
}

let currentCardIndex = 0;

function flip() {
  const el = document.getElementById('flash');
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  
  if (!results.flashcards || !results.flashcards.cards || results.flashcards.cards.length === 0) {
    el.innerHTML = '<div style="color: var(--muted); text-align: center;">Gere flashcards no Dashboard</div>';
    return;
  }
  
  const cards = results.flashcards.cards;
  const currentIndex = parseInt(el.dataset.index || 0);
  const card = cards[currentIndex];
  const answerDiv = document.getElementById(`flash-answer-${currentIndex}`);
  
  el.dataset.s = el.dataset.s === 'q' ? 'a' : 'q';
  
  if (answerDiv) {
    if (el.dataset.s === 'a') {
      answerDiv.style.opacity = '1';
      answerDiv.style.pointerEvents = 'auto';
    } else {
      answerDiv.style.opacity = '0';
      answerDiv.style.pointerEvents = 'none';
    }
  }
}

function nextCard() {
  const el = document.getElementById('flash');
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  
  if (!results.flashcards || !results.flashcards.cards) return;
  
  const cards = results.flashcards.cards;
  let currentIndex = parseInt(el.dataset.index || 0);
  
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    el.dataset.index = currentIndex;
    el.dataset.s = 'q';
    
    const card = cards[currentIndex];
    el.innerHTML = `
      <div style="text-align: left; width: 100%; cursor: pointer;">
        <div style="color: var(--muted); font-size: 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 18px;">🎓</span>
          <span>Card ${currentIndex + 1}/${cards.length}</span>
        </div>
        <div style="margin-bottom: 20px;">
          <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">❓ Pergunta:</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${card.pergunta}</div>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 20px; transition: all 0.3s ease; opacity: 0; pointer-events: none;" id="flash-answer-${currentIndex}">
          <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">✅ Resposta:</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${card.resposta}</div>
        </div>
        <div style="color: var(--muted); font-size: 12px; margin-top: 20px; text-align: center; font-style: italic;">🔄 Clique para virar</div>
      </div>
    `;
    updateCardCounter(currentIndex, cards.length);
  }
}

function prevCard() {
  const el = document.getElementById('flash');
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  
  if (!results.flashcards || !results.flashcards.cards) return;
  
  const cards = results.flashcards.cards;
  let currentIndex = parseInt(el.dataset.index || 0);
  
  if (currentIndex > 0) {
    currentIndex--;
    el.dataset.index = currentIndex;
    el.dataset.s = 'q';
    
    // Atualizar conteúdo do flash
    const card = cards[currentIndex];
    el.innerHTML = `
      <div style="text-align: left; width: 100%;">
        <div style="color: var(--muted); font-size: 12px; margin-bottom: 12px;">📍 Card ${currentIndex + 1}/${cards.length}</div>
        <div style="margin-bottom: 20px;">
          <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">Pergunta:</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${card.pergunta}</div>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 20px; display: none;" id="answer-${currentIndex}">
          <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">Resposta:</div>
          <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${card.resposta}</div>
        </div>
        <div style="color: var(--muted); font-size: 12px; margin-top: 20px; text-align: center; font-style: italic;">Clique no card para virar →</div>
      </div>
    `;
    updateCardCounter(currentIndex, cards.length);
  }
}

function resetFlashcards() {
  const el = document.getElementById('flash');
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
  
  if (!results.flashcards || !results.flashcards.cards || results.flashcards.cards.length === 0) {
    el.innerHTML = '<div style="color: var(--muted);">Gere flashcards no Dashboard</div>';
    return;
  }
  
  const cards = results.flashcards.cards;
  const card = cards[0];
  el.dataset.index = 0;
  el.dataset.s = 'q';
  el.innerHTML = `
    <div style="text-align: left; width: 100%;">
      <div style="color: var(--muted); font-size: 12px; margin-bottom: 12px;">📍 Card 1/${cards.length}</div>
      <div style="margin-bottom: 20px;">
        <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">Pergunta:</div>
        <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${card.pergunta}</div>
      </div>
      <div style="border-top: 1px solid var(--border); padding-top: 20px; display: none;" id="answer-0">
        <div style="color: var(--primary); font-weight: bold; margin-bottom: 8px; font-size: 14px;">Resposta:</div>
        <div style="color: var(--text); line-height: 1.8; font-size: 16px;">${card.resposta}</div>
      </div>
      <div style="color: var(--muted); font-size: 12px; margin-top: 20px; text-align: center; font-style: italic;">Clique no card para virar →</div>
    </div>
  `;
  updateCardCounter(0, cards.length);
}

function renderResults() {
  const resultDiv = document.getElementById('output');
  if (!resultDiv) return;

  const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');

  if (window.location.href.includes('resumo.html')) {
    resultDiv.innerHTML = results.resumo
      ? highlightText(results.resumo.content)
      : 'Use o Dashboard para gerar.';
  }

  else if (window.location.href.includes('perguntas.html')) {
    resultDiv.innerHTML = results.perguntas
      ? highlightText(results.perguntas.content)
      : 'Use o Dashboard para gerar.';
  }

  else if (window.location.href.includes('flashcards.html')) {
    if (results.flashcards) {
      renderFlashcards();
    } else {
      const el = document.getElementById('flash');
      if (el) el.textContent = 'Gere flashcards no Dashboard';
    }
  }
}
function typeWriter(element, text, speed = 15) {
  element.innerHTML = '';
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}
function highlightText(text) {
  const keywords = text.split(' ').filter(w => w.length > 6);

  return text.split(' ').map(word => {
    if (keywords.includes(word)) {
      return `<span style="color:#7c5cff;font-weight:bold">${word}</span>`;
    }
    return word;
  }).join(' ');
}

const pdfInput = document.getElementById('pdfInput');

if (pdfInput) {
  pdfInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      const input = document.getElementById('inputText');
      if (input) input.value = reader.result;
    };

    reader.readAsText(file);
  });
}