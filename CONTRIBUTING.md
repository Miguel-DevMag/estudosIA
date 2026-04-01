# Contribuindo para EstudosIA

Obrigado por se interessar em contribuir para o EstudosIA! Este documento fornece orientações e instruções para contribuir com o projeto.

## 📋 Código de Conduta

Todos os contribuidores devem aderir a um Código de Conduta que promove respeito, inclusão e profissionalismo.

- Seja respeitoso e inclusivo
- Não tolera assédio nem discriminação
- Aceita críticas bem-intencionadas
- Focado na comunidade

## 🚀 Como Contribuir

### Tipos de Contribuições

1. **🐛 Relatório de Bugs**
   - Descreva o problema em detalhes
   - Forneça passos para reproduzir
   - Inclua seu navegador/SO
   - Screenshots são valiosos

2. **💡 Sugestões de Funções**
   - Explique o caso de uso
   - Descreva o benefício
   - Considere alternativas
   - Estude funcionalidades similares

3. **📝 Melhorias na Documentação**
   - Correções de typos
   - Exemplos mais claros
   - Documentação de FQA
   - Guias de troubleshooting

4. **♻️ Código**
   - Correções de bugs
   - Novas funcionalidades
   - Refatoração
   - Testes

### Processo de Contribuição

#### 1. Report um Bug

**Antes de criar um relatório:**
- Verifique se o bug já foi reportado
- Teste na versão mais recente
- Tente em modo anônimo
- Limpe cache do navegador

**Ao reportar, inclua:**
```
Título: [BUG] Descrição breve

Descrição:
Descreva o comportamento esperado vs. recebido

Passos para reproduzir:
1. Abra a página
2. Clique em botão X
3. Observe o problema

Ambiente:
- Navegador: Chrome 120
- SO: Windows 11
- Versão: 1.0.0

Screenshots:
[Anexe imagem se relevante]
```

#### 2. Sugerir uma Funcionalidade

```
Título: [FEATURE] Breve descrição

Problema:
Qual problema isto resolve?

Solução:
Descreva a solução proposta

Alternativas:
Existem outras abordagens?

Contexto adicional:
Informações relevantes
```

#### 3. Pull Request

1. **Fork o repositório**
   ```bash
   git clone https://github.com/seu-usuario/estudosia.git
   ```

2. **Crie uma branch**
   ```bash
   git checkout -b feature/sua-feature
   # ou
   git checkout -b bugfix/seu-bug
   ```

3. **Faça suas mudanças**
   - Siga o estilo de código existente
   - Teste suas mudanças
   - Commit com mensagens claras

4. **Mensagens de Commit**
   ```
   [FEATURE] Descrição breve
   
   Descrição detalhada do que foi feito.
   
   - Ponto 1
   - Ponto 2
   
   Fixes #123
   ```

5. **Push para seu fork**
   ```bash
   git push origin feature/sua-feature
   ```

6. **Abra um Pull Request**
   - Descreva as mudanças
   - Referencie issues relacionadas
   - Explique o porquê das mudanças

## 📐 Guia de Estilo

### HTML

```html
<!-- Classes em português, sem abreviações -->
<div class="card">
  <h3>Título</h3>
</div>

<!-- Atributos em ordem: id, class, data-*, event-handlers -->
<button id="btn" class="btn btn-primary" onclick="handleClick()">
  Clique em mim
</button>

<!-- Use semantica apropriada -->
<nav class="nav">         <!-- Navigation -->
<main class="main">       <!-- Main content -->
<aside class="sidebar">   <!-- Sidebar -->
<section class="card">    <!-- Section -->
```

### CSS

```css
/* Organize por componente */
/* 1. Variáveis globais */
:root {
  --bg: #0b0f17;
}

/* 2. Reset/Layout global */
* { box-sizing: border-box; }
body { font-family: Inter; }

/* 3. Componentes */
.button { /* estilos */ }
.button:hover { /* estados */ }
.button.primary { /* variantes */ }

/* 4. Responsividade */
@media (max-width: 768px) {
  .button { /* ajustes */ }
}

/* Convenções */
- Use variáveis CSS quando possível
- BEM para nomenclatura (.block__element--modifier)
- Mobile-first approach
- Prefira flex/grid sobre float
```

### JavaScript

```javascript
// 1. Constantes no topo
const GEMINI_API_KEY = 'xxx';
const MAX_ITEMS = 50;

// 2. Funções pequenas e focadas
async function gerarResumo() {
  const text = $('#inputText').value;
  if (!text.trim()) return alert('vazio');
  // ...
}

// 3. Nomes descritivos
// ❌ const x = getItems();
// ✅ const savedMaterials = getMaterials();

// 4. Comentários úteis
// Apenas para lógica complexa, não óbvio
// ❌ const a = 1; // incrementar a
// ✅ // Limitar a 50 últimos itens para performance
const limited = items.slice(0, 50);

// 5. Erro handling
try {
  await callGeminiAI(prompt);
} catch (error) {
  console.error('Erro Gemini:', error);
  return fallbackGenerate(prompt);
}

// 6. Use const por padrão
const x = 10;           // ✅
let y = 20;             // Use apenas se mudar
var z = 30;             // ❌ Evite
```

## ✅ Checklist Antes do Submit

- [ ] Código segue guia de estilo
- [ ] Sem console.log() de debug
- [ ] Comentários claros quando necessário
- [ ] Testado em múltiplos navegadores
- [ ] Sem erros no console (F12)
- [ ] Responsivo (mobile/tablet/desktop)
- [ ] Commit messages descritivas
- [ ] Referencia issue relevante
- [ ] Update na documentação se necessário
- [ ] Sem breaking changes ou menciona em PR

## 🧪 Testando Mudanças

### Teste Manual
```bash
# Abra em diferentes navegadores
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (se possível)

# Teste diferentes resoluções
- Desktop (1920x1080)
- Tablet (768px)
- Mobile (375px)

# Teste funcionalidades
- Gerar resumo
- Gerar perguntas
- Gerar flashcards
- Trocar tema
- Limpar dados
```

### DevTools
```
1. Abra F12
2. Guia "Console" - sem erros
3. Guia "Network" - requisições OK
4. Guia "Application" - localStorage OK
5. Responsive (Ctrl+Shift+M) - layouts OK
```

## 📝 Documentação

Se sua contribuição muda funcionalidades:

1. **Update README.md**
   - Adicione à seção de funcionalidades
   - Atualize exemplos se necessário

2. **Update ARCHITECTURE.md**
   - Descreva nova estrutura se aplicável
   - Atualize diagramas

3. **Adicione comentários claros**
   - Explique lógica complexa
   - Documente funções públicas

4. **Crie/Update guias**
   - Se nova feature, crie guia
   - Screenshots são uteis

## 📞 Suporte e Discussão

- **Issues** para bugs e features
- **Discussions** para perguntas
- **Email** para questões privadas

## 🙏 Reconhecimento

Todos os contribuidores serão:
- Listados em CONTRIBUTORS.md
- Mencionados em release notes
- Creditados em documentação

## ⚖️ Licença

Ao contribuir, você concorda que suas contribuições sejam licenciadas sob MIT License.

---

**Obrigado por ajudar a melhorar EstudosIA!** 🌟
