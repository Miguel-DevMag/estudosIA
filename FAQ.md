# ❓ FAQ - Perguntas Frequentes

Respostas para as perguntas mais comuns sobre EstudosIA.

---

## 🚀 Início Rápido

### P: Como eu começo a usar EstudosIA?
**R:** 
1. Abra `index.html` em seu navegador (Chrome, Firefox, Edge, Safari)
2. Cole ou escreva um texto que quer estudar
3. Clique em uma ação (Gerar Resumo, Perguntas, Flashcards)
4. Visualize na seção correspondente

### P: Preciso instalar algo?
**R:** Não! EstudosIA é 100% navegador. Você só precisa:
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet (para API Gemini)
- Arquivo com sua chave Gemini API

### P: Qual navegador é melhor?
**R:** Todos funcionam bem! Recomendações:
- **Chrome/Edge** - Melhor performance, melhor DevTools
- **Firefox** - Excelente privacidade, sem rastreamento
- **Safari** - Bom para Mac/iPhone
- **Opera** - Alternativa com bom suporte a CSS moderno

---

## 🔑 API e Configuração

### P: Como obtenho chave Gemini API?
**R:** Siga os passos:
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Clique "Create API Key"
3. Copie a chave
4. Cole em `script.js` na linha: `const GEMINI_API_KEY = 'COLE_AQUI';`
5. Salve o arquivo

**⚠️ IMPORTANTE:** Proteja sua chave! Não compartilhe nem comete em git.

### P: Quanto custa usar Gemini API?
**R:**
- Primeiros 60 chamadas/minuto = GRÁTIS ✅
- Após limite gratuito = Paga conforme uso
- Preço típico: $0.00025 por 1K tokens
- Estimativa: 1000 resumos = ~$0.25

Veja preços atuais em: https://ai.google.dev/pricing

### P: E se não tiver chave API?
**R:** Pode usar mesmo assim! Tem modo "Offline":
- Clique "Usar Offline" (aparece após erro)
- Geração local com templates padrão
- Sem internet necessário (depois)
- Menos customizado mas funciona

### P: Posso usar outra IA (Claude, GPT, etc)?
**R:** Futura feature em v1.2.0! Atualmente apenas Gemini.
Mas é fácil de adaptar no código se souber JavaScript.

---

## 📱 Uso e Funcionalidades

### P: Diferença entre Resumo, Perguntas e Flashcards?
**R:**
| Tipo | O que faz | Quando usar |
|------|-----------|-------------|
| **Resumo** | Reduz texto à essência | Revisão rápida |
| **Perguntas** | Cria questões sobre assunto | Autoteste |
| **Flashcards** | Cria pares Q&A interativos | Estudo ativo |

### P: Posso gerar múltiplos de uma vez?
**R:** Não automaticamente, mas pode:
1. Gerar Resumo
2. Copiar resultado
3. Colar em "Histórico" seção
4. Gerar Perguntas do resumo
5. Gerar Flashcards das perguntas

### P: Meu histórico pode "encher"?
**R:** Sim, mas com proteção:
- Máximo 50 últimos itens salvos
- Acima disso, remove os mais antigos
- Pode limpar manualmente em "Configurações"
- Para guardar tudo, exporte antes

### P: Posso exportar dados?
**R:** Ainda não, mas é roadmap v1.1.0:
- [ ] Exportar como PDF
- [ ] Exportar como CSV
- [ ] Compartilhar resumos
- [ ] Sincronizar entre dispositivos

---

## 🎨 Tema e Aparência

### P: Como mudar para modo claro?
**R:** Clique no ícone 🌙/☀️ no topo (lado esquerdo navegação)
- 🌙 = Dark mode (padrão, melhor para noite)
- ☀️ = Light mode (melhor para dia, menos fadiga)

### P: Tema volta ao padrão ao reabrir?
**R:** Não! Sua escolha é salva:
- Abre em Dark/Light conforme última vez
- Salvo localmente no navegador
- Persiste mesmo fechando browser

### P: Posso personalizar cores?
**R:** 
- Atualmente não, mas CSS é configurável
- Se souber CSS, abra `style.css` e mude variáveis:
```css
:root {
  --primary: #ff6b6b;   /* mude pra cor que quiser */
  --success: #51cf66;
  --danger: #ff922b;
}
```

### P: Interface fica distorcida no meu celular?
**R:** Pode ser:
1. Atualize navegador
2. Limpe cache (Ctrl+Shift+Delete)
3. Teste em navegador diferente
4. Reporte issue em GitHub

---

## 💾 Dados e Privacidade

### P: Meus dados são enviados para servidor?
**R:** Não, exceto:
- ✅ Texto que você manda pro Gemini (processado Google)
- ✅ Resposta da IA
- ❌ Nada mais é enviado
- ❌ Sem cookies rastreadores
- ❌ Sem dados em servidor nosso

### P: Posso usar online/offline?
**R:**
- **Online** (recomendado): Acesso a todas as IA, melhores resultados
- **Offline**: Modo reduzido com fallback local
- **Histórico**: Sempre local, funciona offline

### P: Quanto espaço ocupa?
**R:**
- **Arquivos**: ~100KB (HTML, CSS, JS)
- **LocalStorage**: ~500KB a 2MB (dados seu)
- **Cache Browser**: ~1-2MB

### P: Posso sincronizar entre dispositivos?
**R:** Ainda não (v1.2.0):
- [ ] Cloud sync
- [ ] Login com Google/GitHub
- [ ] Compartilhamento de resumos
- [ ] Acesso multi-dispositivo

---

## 🐛 Problemas Comuns

### P: "Erro na API" ou "Falha ao conectar"
**R:** Tente:
1. Verifique conexão internet
2. Verifique chave API é válida
3. Verifique limite de uso não excedeu
4. Tente novamente em alguns segundos
5. Se persistir, use modo Offline

### P: Flashcard está muito grande/pequeno
**R:** Ajuste zoom:
- **Aumentar:** Ctrl++ (ou Cmd++ Mac)
- **Diminuir:** Ctrl+- (ou Cmd+- Mac)
- **Resetar:** Ctrl+0 (ou Cmd+0 Mac)

### P: Ícones não aparecem
**R:** Verifique:
1. Pasta `img/` existe
2. Arquivos: `logo.png`, `dashboard.png`, `document.png`, etc.
3. Aplicação foi movida? Ajuste caminhos relativos
4. Tire print e reporte issue

### P: LocalStorage "cheio"
**R:** Limpe dados:
1. Vá em "Configurações"
2. Clique "Limpar Histórico"
3. Confirme operação
4. Recarregue página

### P: Tema não salvando
**R:** Possível causa:
- LocalStorage desabilitado no navegador
- Modo privado/anônimo (limpa ao fechar)
- Conflito de extensão
- Solução: Use navegador normal, desabilite VPN

### P: Página carrega lenta
**R:** Pode ser:
1. Internet lenta (~2s é normal no Gemini)
2. Muitos itens no histórico (limpe)
3. Navegador com muitas abas (feche outras)
4. Extensões conflitantes

---

## 👨‍💻 Desenvolvimento

### P: Posso modificar o código?
**R:** **SIM!** Licença MIT permite:
- ✅ Usar privadamente
- ✅ Modificar
- ✅ Redistribuir
- ❌ Remover atribuição (MIT pede mantê-la)

### P: Posso fazer PR (Pull Request)?
**R:** **CLARO!** Siga:
1. Fork repositório
2. Crie branch: `feature/sua-feature`
3. Faça mudanças + teste
4. Commit com mensagem clara
5. Abra PR com descrição
6. Aguardar review

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

### P: Como debugar?
**R:** Use DevTools (F12):
1. **Console** (F12): Veja erros e logs
2. **Elements**: Inspecione HTML/CSS
3. **Application**: Veja LocalStorage
4. **Network**: Veja requisições API

### P: Como reportar bug?
**R:**
1. Descreva o problema
2. Passos pra reproduzir
3. Seu navegador/SO
4. Screenshot se possível
5. Abra Issue em GitHub

### P: Posso usar em produção?
**R:** Sim! Com considerações:
- [ ] Use backend para chaves API
- [ ] Adicione autenticação
- [ ] Monitorar rate limits
- [ ] Implementar punching
- [ ] Setup CI/CD

---

## 📊 Performance e Limitações

### P: Por que é lento às vezes?
**R:** Fatores comuns:
1. **Gemini latência** (1-5s é normal, ~100 tokens)
2. **Internet lenta** (afeta requisições)
3. **Histórico grande** (50+ itens = mais lento)
4. **Navegador sobrecarregado** (feche abas)
5. **Quota excedida** (aguarde reset diário)

### P: Quantos flashcards posso criar?
**R:**
- Quantidade: 5-10 por geração (padrão)
- Limite: ~50 no histórico (por performance)
- Sem limite teórico (use lógica)

### P: Muito lento com PDF (futura feature)?
**R:** Esperado:
- PDFs grandes = processamento mais lento
- Pode levar minutos
- Considere extrair texto antes

---

## 🌍 Internacionalização

### P: Funciona em outros idiomas?
**R:**
- **Atualmente**: Português do Brasil (PT-BR)
- **Gemini**: Suporta 100+ idiomas
- **Futuro v1.2.0**: Multi-idioma (EN, ES, FR, etc)

### P: Pode usar em inglês?
**R:** Pode! Funciona assim:
1. Digite em inglês
2. Gemini está em inglês
3. Interface continua PT-BR
4. Resultados em inglês

### P: Como contribuir tradução?
**R:** Veja [CONTRIBUTING.md](CONTRIBUTING.md)
- Ajude com tradução de UI
- Issue discussion sobre novos idiomas
- Pull request com arquivos i18n

---

## 🔐 Segurança

### P: É seguro usar com dados sensíveis?
**R:** ⚠️ **NÃO use para:**
- Senhas
- Informações médicas
- Dados financeiros
- Dados pessoais identificáveis (PII)
- Segredos empresa

✅ **Seguro para:**
- Notas de estudo
- Resumos públicos
- Perguntas educação
- Materiais genéricos

### P: Minha chave API é risada?
**R:** Sim! Se compartilharem:
- [ ] Alguém pode usar sua quota
- [ ] Você paga pelo uso deles
- [ ] Risco de abuso

**Solução:**
1. Regenere chave em Google Cloud Console
2. Nova chave instantaneamente ativa
3. Velha chave não funciona mais

### P: O projeto tem vulnerabilidades?
**R:** Se encontrar:
1. NÃO abra issue público
2. Envie email: security@example.com
3. Inclua: descrição, passos, impacto
4. Aguarde resposta em 48h

Veja [SECURITY.md](SECURITY.md) para detalhes.

---

## ❤️ Contribuição e Comunidade

### P: Como posso ajudar?
**R:** Várias formas:
- 🐛 Reporte bugs
- 💡 Sugira features
- 📝 Melhore documentação
- 💻 Contribua código
- 🎨 Melhore design
- ⭐ Deixe estrela (GitHub)
- 📢 Compartilhe com amigos

### P: Tem comunidade?
**R:** Em construção:
- [ ] Discord servidor (v1.1.0)
- [ ] Fórum discussão (v1.1.0)
- [ ] Telegram grupo (v1.1.0)
- [ ] Reddit community (v1.1.0)

Siga GitHub para atualizações!

### P: Posso patrocinar?
**R:** Agradeço o interesse! Opções futuras:
- [ ] Sponsor no GitHub
- [ ] Patreon (v1.2.0)
- [ ] Buy Me a Coffee
- [ ] Doações criptográficas

---

## 📚 Recuros Adicionais

### Documentação Completa
- [README.md](README.md) - Overview e setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - Design técnico
- [CONTRIBUTING.md](CONTRIBUTING.md) - Como contribuir
- [SECURITY.md](SECURITY.md) - Segurança
- [CHANGELOG.md](CHANGELOG.md) - Histórico versões

### Links Úteis
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Tricks](https://css-tricks.com/)
- [Responsive Web Design](https://web.dev/responsive-web-design-basics/)

### Comunidade
- GitHub Issues: Bugs e features
- GitHub Discussions: Perguntas
- Email: [seu-email]@example.com
- Twitter: [@seu-usuario]

---

## 👋 Ainda com Dúvidas?

1. **Procure** em [SECURITY.md](SECURITY.md) (segurança)
2. **Procure** em [CONTRIBUTING.md](CONTRIBUTING.md) (desenvolvimento)
3. **Procure** em [ARCHITECTURE.md](ARCHITECTURE.md) (tecnologia)
4. **Abra Issue** em GitHub
5. **Envie email** com dúvida

---

**Última Atualização:** 2024-01-20
**FAQ Versão:** 1.0
**Total de Perguntas:** 50+

Não encontrou resposta? [Abra uma Nova Issue!](https://github.com/seu-usuario/estudosia/issues/new)
