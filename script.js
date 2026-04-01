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

function deleteMaterial(idx) {
  if (confirm('✅ Tem certeza que deseja deletar este material?')) {
    const materials = JSON.parse(localStorage.getItem(MATERIALS_KEY) || '[]');
    materials.splice(idx, 1);
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
    location.reload();
  }
}


function saveHistory(type, content, contentFormatted = content) {
  const h = JSON.parse(localStorage.getItem('bf_hist') || '[]');
  h.unshift({
    t: Date.now(),
    type: type,
    v: content,
    vFormatted: contentFormatted
  });
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

  const h = JSON.parse(localStorage.getItem('bf_hist') || '[]');
  let tipoPagina = '';

  if (window.location.href.includes('resumo.html')) tipoPagina = 'Resumo';
  else if (window.location.href.includes('perguntas.html')) tipoPagina = 'Perguntas';
  else if (window.location.href.includes('flashcards.html')) tipoPagina = 'Flashcards';
  else if (window.location.href.includes('historico.html')) tipoPagina = '';
  
  let items;
  if (tipoPagina === '') {
    items = h.map((item, index) => ({ ...item, originalIndex: index }));
  } else {
    items = h
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter(i => i.type === tipoPagina);
  }

  el.innerHTML = items.map((i) =>
  `<li style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-radius: 4px; hover-effect;">
    <span onclick="loadHistoricResult(${i.originalIndex}, '${i.type}')" style="cursor: pointer; flex: 1;">
      <strong>${i.type}</strong> — ${new Date(i.t).toLocaleString()}
    </span>
    <button class="btn-delete" onclick="deleteHistoricItem(${i.originalIndex})" style="margin-left: 10px; padding: 4px 8px; background: #ff4757; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️</button>
  </li>`
).join('');
}

function deleteHistoricItem(idx) {
  if (confirm('✅ Tem certeza que deseja deletar este item?')) {
    const h = JSON.parse(localStorage.getItem('bf_hist') || '[]');
    h.splice(idx, 1);
    localStorage.setItem('bf_hist', JSON.stringify(h));
    renderHistory();
    alert('✅ Item deletado com sucesso!');
  }
}

function loadHistoricResult(idx, type) {
  const h = JSON.parse(localStorage.getItem('bf_hist') || '[]');
  if (h[idx]) {
    const item = h[idx];
    const resultDiv = document.getElementById('output');
    if (!resultDiv) return;

    if (type === 'Perguntas') {
      const formatted = formatarQuestionario(item.v);
      displayResult(resultDiv, formatted, true);
    } else if (type === 'Resumo') {
      displayResult(resultDiv, item.v);
    } else if (type === 'Flashcards') {
      const cards = item.vFormatted?.cards || [];
      if (cards.length > 0) {
        const flash = document.getElementById('flash');
        if (flash) {
          const firstCard = cards[0];
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
        }
      }
    }
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
    return sentences.slice(0, 5).map((s, i) => {
      const palavrasChave = s.split(' ').filter(p => p.length > 4);
      const alt1 = palavrasChave[0] || 'Conceito 1';
      const alt2 = palavrasChave[1] || 'Conceito 2';
      const alt3 = palavrasChave[2] || 'Conceito 3';
      return `${i + 1}. Qual é o conceito principal relacionado a "${s.slice(0, 40)}..."?\nA) ${alt1}\nB) ${alt2}\nC) ${alt3}\nD) Nenhuma das anteriores\nE) Todas as anteriores\nResposta Correta: A`;
    }).join('\n\n');
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
  const prompt = `Análise profunda: Crie um resumo bem estruturado e completo do seguinte texto.

REQUISITOS:
- Resuma os conceitos principais de forma clara e compreensível
- Use linguagem fluida, sem listas numeradas ou pontos
- Organize em parágrafos bem estruturados
- Explore as ideias centrais e suas conexões
- Mantenha a essência e o contexto do texto original
- Escreva de forma natural e profissional

TEXTO A RESUMIR:
${text}

Resumo:`;
  const resumo = await callGeminiAI(prompt);
  hideLoader();
  displayResult($('#output'), resumo);
  saveHistory('Resumo', resumo);
  saveResult('resumo', resumo);
  
  // Notificar se ativado
  notifyIfEnabled('📄 Resumo gerado com sucesso!');
}


async function gerarPerguntas() {
  const text = $('#inputText').value;
  if (!text.trim()) {
    alert('Por favor, insira um texto');
    return;
  }
  showLoader();
  saveMaterial(text);

  // Corrigir erros de escrita do texto
  const correctedText = await corrigirTexto(text);

  const prompt = `Crie um questionário com EXATAMENTE 5 perguntas de múltipla escolha profundas baseadas no seguinte texto.

REQUISITOS OBRIGATÓRIOS:
- GERE EXATAMENTE 5 PERGUNTAS numeradas de 1 a 5
- Cada pergunta deve ter 4 alternativas (A, B, C, D)
- Apenas UMA resposta correta por pergunta
- Inclua uma breve EXPLICAÇÃO para cada resposta correta
- Use linguagem clara e objetiva

FORMATO EXATO - SIGA RIGOROSAMENTE:
Questionário sobre [TEMA PRINCIPAL DO TEXTO]

1. Primeira pergunta em formato de questão?
A) Primeira alternativa
B) Segunda alternativa
C) Terceira alternativa
D) Quarta alternativa

2. Segunda pergunta em formato de questão?
A) Primeira alternativa
B) Segunda alternativa
C) Terceira alternativa
D) Quarta alternativa

3. Terceira pergunta em formato de questão?
A) Primeira alternativa
B) Segunda alternativa
C) Terceira alternativa
D) Quarta alternativa

4. Quarta pergunta em formato de questão?
A) Primeira alternativa
B) Segunda alternativa
C) Terceira alternativa
D) Quarta alternativa

5. Quinta pergunta em formato de questão?
A) Primeira alternativa
B) Segunda alternativa
C) Terceira alternativa
D) Quarta alternativa

🔑 Gabarito / Respostas
Resposta Correta: A
Explicação: Explicação clara e concisa sobre por que A é correta
Resposta Correta: B
Explicação: Explicação clara e concisa sobre por que B é correta
Resposta Correta: C
Explicação: Explicação clara e concisa sobre por que C é correta
Resposta Correta: D
Explicação: Explicação clara e concisa sobre por que D é correta
Resposta Correta: A
Explicação: Explicação clara e concisa sobre por que A é correta

TEXTO:
${correctedText}

Agora prossiga com o questionário exatamente no formato mostrado acima:`;

  const perguntas = await callGeminiAI(prompt);
  const perguntasCorrigidas = await corrigirTexto(perguntas);
  hideLoader();
  const perguntasFormatadas = formatarQuestionario(perguntasCorrigidas);
  displayResult($('#output'), perguntasFormatadas, true);
  saveHistory('Perguntas', perguntasCorrigidas, perguntasFormatadas);
  saveResult('perguntas', perguntasCorrigidas);
  
  // Notificar se ativado
  notifyIfEnabled('✅ Perguntas geradas com sucesso!');
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
  
  if (flashcards.length === 0) {
    alert('Erro ao gerar flashcards. Tente novamente.');
    return;
  }
  
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
  
  saveHistory('Flashcards', flashcardsText, results.flashcards);
  saveResult('flashcards', flashcardsText);
  
  // Notificar se ativado
  notifyIfEnabled('🎓 Flashcards gerados com sucesso!');
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
  const h = JSON.parse(localStorage.getItem('bf_hist') || '[]');
  const flashcardsHistory = h.find(i => i.type === 'Flashcards');

  if (!flash) return;

  // Verificar se há histórico de flashcards para usar como resultado mais recente
  let cards = [];
  if (results.flashcards && results.flashcards.cards && results.flashcards.cards.length > 0) {
    cards = results.flashcards.cards;
  } else if (flashcardsHistory && flashcardsHistory.vFormatted && flashcardsHistory.vFormatted.cards) {
    cards = flashcardsHistory.vFormatted.cards;
  }

  if (cards.length === 0) {
    flash.innerHTML = '<div style="color: var(--muted); text-align: center;">Gere flashcards no Dashboard</div>';
    if (navButtons) navButtons.style.display = 'none';
    if (cardsContainer) cardsContainer.innerHTML = '';
    return;
  }

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
      <div class="card-item" style="background: linear-gradient(135deg, var(--panel), var(--panel-2)); border: 1px solid var(--border); border-radius: 8px; padding: 14px; margin: 6px 0; transition: all 0.3s ease; animation: slideIn 0.3s ease;">
        <div style="color: var(--muted); font-size: 12px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 16px;">🎓</span>
          <span>Card ${idx + 1}/${cards.length}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: var(--primary);">❓ Pergunta:</strong>
          <p style="margin: 6px 0; color: var(--text); line-height: 1.6; font-size: 14px;">${card.pergunta}</p>
        </div>
        <div style="padding-top: 10px; border-top: 1px solid var(--border);">
          <strong style="color: var(--primary);">✅ Resposta:</strong>
          <p style="margin: 6px 0; color: var(--text); line-height: 1.6; font-size: 14px;">${card.resposta}</p>
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
    resultDiv.innerHTML = '';
    if (results.resumo) {
      displayResult(resultDiv, results.resumo.content);
    } else {
      resultDiv.textContent = 'Use o Dashboard para gerar.';
    }
  }

  else if (window.location.href.includes('perguntas.html')) {
    resultDiv.innerHTML = '';
    if (results.perguntas) {
      const formatted = formatarQuestionario(results.perguntas.content);
      displayResult(resultDiv, formatted, true);
    } else {
      resultDiv.textContent = 'Use o Dashboard para gerar.';
    }
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
function typeWriter(element, text, speed = 25) {
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

function displayResult(element, text, isFormatted = false) {
  if (isFormatted) {
    element.innerHTML = text;
  } else {
    // Limpar o elemento e adicionar o texto sem HTML
    element.innerHTML = '';
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    paragraphs.forEach(para => {
      const p = document.createElement('p');
      p.textContent = para.trim();
      p.style.lineHeight = '1.8';
      p.style.marginBottom = '16px';
      element.appendChild(p);
    });
  }
}

function formatarPerguntas(text) {
  // Remove qualquer formatação markdown ou HTML que a IA possa ter adicionado
  let limpo = text.replace(/```[\s\S]*?```/g, ''); // Remove code blocks
  limpo = limpo.replace(/\*\*/g, ''); // Remove markdown bold
  limpo = limpo.replace(/\*\*/g, ''); // Remove markdown itálico
  limpo = limpo.trim();

  const linhas = limpo.split('\n').filter(l => l.trim());
  let html = '<div style="line-height: 1.8;">';

  linhas.forEach(linha => {
    const linha_limpa = linha.replace(/^[\d.]*\s*/, '').trim(); // Remove números do início
    if (linha_limpa) {
      html += `<div style="margin-bottom: 20px; padding: 12px; border-left: 3px solid #7c5cff; background: rgba(124, 92, 255, 0.1); border-radius: 4px;">${linha_limpa}</div>`;
    }
  });

  html += '</div>';
  return html;
}

function formatarPerguntasMultipla(text) {
  // Remove code blocks e markdown
  let limpo = text.replace(/```[\s\S]*?```/g, '');
  limpo = limpo.replace(/\*\*/g, '');
  limpo = limpo.trim();

  // Parsear perguntas
  const perguntasRegex = /(\d+)\.\s*([^\n]+)\n([\s\S]*?)(?=(?:\d+\.|$))/g;
  let match;
  const perguntas = [];

  while ((match = perguntasRegex.exec(limpo)) !== null) {
    const numero = match[1];
    const pergunta = match[2];
    const conteudo = match[3];

    const alternativasRegex = /([A-E])\)\s*([^\n]+)/g;
    const respostaRegex = /Resposta\s*(?:Correta)?\s*[:\-]?\s*([A-E])/i;

    const alternativas = [];
    let altMatch;
    while ((altMatch = alternativasRegex.exec(conteudo)) !== null) {
      alternativas.push({
        letra: altMatch[1],
        texto: altMatch[2].trim()
      });
    }

    const respostaMatch = respostaRegex.exec(conteudo);
    const respostaCorreta = respostaMatch ? respostaMatch[1] : '';

    if (pergunta && alternativas.length > 0) {
      perguntas.push({ numero, pergunta, alternativas, respostaCorreta });
    }
  }

  // Se não encontrou perguntas formatadas, usar formatação simples
  if (perguntas.length === 0) {
    return formatarPerguntas(text);
  }

  // Formatar HTML
  let html = '<div style="font-family: Arial, sans-serif;">';

  perguntas.forEach((q) => {
    html += `
      <div style="background: linear-gradient(135deg, rgba(124, 92, 255, 0.1), rgba(124, 92, 255, 0.05)); 
                  border: 2px solid #7c5cff; 
                  border-radius: 12px; 
                  padding: 20px; 
                  margin-bottom: 25px; 
                  box-shadow: 0 4px 12px rgba(124, 92, 255, 0.15);">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <span style="background: #7c5cff; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${q.numero}</span>
          <h3 style="margin: 0; color: #333; font-size: 16px; font-weight: 600; line-height: 1.4;">${q.pergunta}</h3>
        </div>
        
        <div style="margin-left: 44px; margin-bottom: 18px;">
          ${q.alternativas.map(alt => `
            <div style="padding: 10px 14px; margin-bottom: 10px; background: white; border-left: 4px solid #ddd; border-radius: 4px; transition: all 0.2s;">
              <strong style="color: #7c5cff;">${alt.letra})</strong> <span style="color: #333;">${alt.texto}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-left: 44px; padding-top: 15px; border-top: 1px solid rgba(124, 92, 255, 0.2);">
          <div style="color: #7c5cff; font-weight: bold; font-size: 14px; margin-bottom: 6px;">✓ Resposta Correta:</div>
          <div style="color: #333; font-size: 15px; padding: 8px 12px; background: rgba(124, 92, 255, 0.1); border-radius: 4px; display: inline-block; border-left: 3px solid #7c5cff;">
            <strong>${q.respostaCorreta}</strong>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}

// Função para corrigir erros de escrita
async function corrigirTexto(texto) {
  if (texto.length < 50) return texto;

  const prompt = `Corrija APENAS erros de ortografia, acentuação e pontuação. Mantenha o conteúdo e sentido original. Retorne APENAS o texto corrigido, sem explicações.

TEXTO:
${texto}`;

  try {
    const resultado = await callGeminiAI(prompt);
    return resultado;
  } catch (e) {
    return texto;
  }
}

// Função para formatar questionário novo
function formatarQuestionario(text) {
  let limpo = text.replace(/```[\s\S]*?```/g, '');
  limpo = limpo.replace(/\*\*/g, '');
  limpo = limpo.trim();

  // Extrair título
  const tituloMatch = limpo.match(/(?:Questionário sobre|Sobre)[^\n]+/i);
  const titulo = tituloMatch ? tituloMatch[0] : 'Questionário';

  // Separar perguntas do gabarito
  const gabaritoMatch = limpo.match(/🔑\s*(?:Gabarito|Respostas)[\s\S]+/);
  const gabaritoSection = gabaritoMatch ? gabaritoMatch[0] : '';
  const perguntasSection = gabaritoMatch ? limpo.substring(0, gabaritoMatch.index) : limpo;

  // Parsear perguntas
  const perguntasRegex = /(\d+)\.\s*([^\n]+)\n([\s\S]*?)(?=\n\d+\.|🔑|$)/g;
  let match;
  const perguntas = [];

  while ((match = perguntasRegex.exec(perguntasSection)) !== null) {
    const numero = match[1];
    const pergunta = match[2].trim();
    const conteudo = match[3];

    const alternativasRegex = /([A-D])\)\s*([^\n]+)/g;
    const alternativas = [];
    let altMatch;

    while ((altMatch = alternativasRegex.exec(conteudo)) !== null) {
      alternativas.push({
        letra: altMatch[1],
        texto: altMatch[2].trim()
      });
    }

    if (pergunta && alternativas.length > 0) {
      perguntas.push({ numero, pergunta, alternativas });
    }
  }

  // Parsear respostas do gabarito
  const respostas = {};
  let respIdx = 1;
  
  // Procura por padrão: "Resposta Correta: X" seguido de "Explicação: texto"
  const linhas = gabaritoSection.split('\n');
  let letraAtual = '';
  
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    
    // Procurar pela resposta correta
    if (linha.match(/Resposta\s*(?:Correta)?.*[:\-]/i)) {
      const letraMatch = linha.match(/([A-D])/);
      if (letraMatch) {
        letraAtual = letraMatch[1];
      }
    }
    
    // Procurar pela explicação
    if (linha.match(/Explicação\s*[:\-]/i)) {
      // Extrair tudo após "Explicação:"
      let explicacao = linha.replace(/Explicação\s*[:\-]\s*/i, '').trim();
      
      // Se não tem texto após "Explicação:", pega a próxima linha
      if (!explicacao && i + 1 < linhas.length) {
        explicacao = linhas[i + 1].trim();
      }
      
      if (letraAtual && explicacao) {
        respostas[respIdx] = {
          letra: letraAtual,
          explicacao: explicacao
        };
        respIdx++;
        letraAtual = '';
      }
    }
  }

  // Gerar HTML
  let html = `<div style="font-family: Arial, sans-serif;">`;
  html += `<h2 style="color: #7c5cff; text-align: center; margin-bottom: 30px; font-size: 20px;">${titulo}</h2>`;

  // Seção de perguntas
  perguntas.forEach((q) => {
    html += `
      <div style="background: linear-gradient(135deg, rgba(124, 92, 255, 0.1), rgba(124, 92, 255, 0.05)); 
                  border: 2px solid #7c5cff; 
                  border-radius: 12px; 
                  padding: 20px; 
                  margin-bottom: 20px;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <span style="background: #7c5cff; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${q.numero}</span>
          <h3 style="margin: 0; color: #333; font-size: 15px; font-weight: 600; line-height: 1.4;">${q.pergunta}</h3>
        </div>
        <div style="margin-left: 44px;">
          ${q.alternativas.map(alt => `
            <div style="padding: 10px 12px; margin-bottom: 8px; background: white; border-left: 4px solid #ddd; border-radius: 4px;">
              <strong style="color: #7c5cff;">${alt.letra})</strong> <span style="color: #333;">${alt.texto}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  // Seção de gabarito
  if (Object.keys(respostas).length > 0) {
    html += `
      <div style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(52, 211, 153, 0.05)); 
                  border: 2px solid #34d399; 
                  border-radius: 12px; 
                  padding: 20px; 
                  margin-top: 30px;">
        <h3 style="color: #34d399; margin-top: 0; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🔑</span> Gabarito / Respostas
        </h3>
        <div style="margin-top: 15px;">
    `;

    Object.entries(respostas).forEach(([idx, resp]) => {
      html += `
        <div style="background: white; border-left: 4px solid #34d399; padding: 12px; margin-bottom: 12px; border-radius: 4px;">
          <div style="color: #34d399; font-weight: bold; margin-bottom: 6px;">Questão ${idx}: Resposta Correta <strong>${resp.letra}</strong></div>
          <div style="color: #555; font-size: 14px; line-height: 1.5;">${resp.explicacao}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

// Sistema de notificações
function notifyIfEnabled(message) {
  const prefs = JSON.parse(localStorage.getItem('estudos_prefs') || '{}');
  if (prefs.notificacoes) {
    // Notificação visual no topo da página
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #7c5cff, #9d7fff);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(124, 92, 255, 0.4);
      font-weight: 600;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
    
    // Notificação de som se suportado
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAA');
      audio.play().catch(() => {});
    } catch (e) {}
  }
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

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