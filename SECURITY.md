# Segurança - EstudosIA

## 🔒 Políticas de Segurança

Este documento descreve as practices de segurança do projeto EstudosIA e como reportar vulnerabilidades.

---

## 🚨 Reportar Vulnerabilidades

**NÃO abra Issues públicas para vulnerabilidades de segurança.**

Se você descobrir uma vulnerabilidade, por favor:

1. **Envie um email** para: [seu-email]@example.com
   - Assunto: `[SECURITY] EstudosIA - Vulnerabilidade Descoberta`
   - Descreva a vulnerabilidade em detalhes
   - Inclua passos para reproduzir se possível
   - Forneça seu contato caso precisem de esclarecimentos

2. **Prazo de Resposta:**
   - Confirmação recebida: 48 horas
   - Análise inicial: 5-7 dias
   - Plano de correção: 14 dias

3. **Processo:**
   - Confirmamos a vulnerabilidade
   - Criamos correção em branch privada
   - Testamos a solução
   - Publicamos patch com crédito
   - Fechamos comunicação

---

## 🔐 Considerações de Segurança

### 1. Chaves de API

**⚠️ IMPORTANTE: Nunca compartilhe sua chave Gemini API publicamente!**

#### Por que a chave não está no código:
- Chaves públicas podem ser usadas por terceiros
- Sua cota de uso pode ser esgotada
- Cobranças inesperadas em sua conta
- Risco de abuso

#### Como usar com segurança:

**Desenvolvimento Local:**
```javascript
// Em seu script.js local, adicione:
const GEMINI_API_KEY = 'sua-chave-segura-aqui';

// Ou use um arquivo .env (no .gitignore):
// process/env.GEMINI_API_KEY
```

**Deploy em Produção:**
- Use serviço de gerenciamento de segredos (AWS Secrets Manager, Azure Key Vault)
- Configure variáveis de ambiente no servidor
- Nunca comite chaves em git
- Rotacione chaves regularmente
- Monitore uso de API

**Arquivo `.env` (exemplo):**
```
# .env (adicione ao .gitignore!)
GEMINI_API_KEY=sua-chave-aqui
ENVIRONMENT=production
LOG_LEVEL=error
```

**Usando com Node.js:**
```javascript
require('dotenv').config();
const API_KEY = process.env.GEMINI_API_KEY;

// Valide antes de usar
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY não configurada!');
}
```

### 2. Dados do Usuário (LocalStorage)

#### LocalStorage NÃO é seguro para:
```javascript
// ❌ NUNCA guarde no localStorage:
- Senhas
- Tokens de autenticação
- Informações financeiras
- Dados médicos sensíveis
- Chaves criptográficas
```

#### O que estudosIA guarda (seguro):
```javascript
// ✅ Dados persistidos no localStorage:
- estudos_tema: 'light' | 'dark'
- estudos_materiais: histórico de textos de entrada
- bf_hist: histórico de flashcards
- estudos_resultados: resumos/perguntas geradas
- estudos_prefs: preferências do usuário

// Importante: Dados entram/saem do navegador,
// não são enviados para servidor externo (exceto Gemini)
```

#### Limitações de Segurança:
```javascript
// LocalStorage limitations:
- localStorage é suscetível a XSS attacks
- Acessível a qualquer script na mesma origem
- ~5-10MB limite por domínio
- Permanece mesmo após fechar navegador
- Sem criptografia nativa

// Proteções aplicadas:
✅ Entrada sanitizada antes de usar em innerHTML
✅ Sem eval() ou dynamic code execution
✅ Content Security Policy (recomendado adicionar)
✅ CORS configurado para APIs externas
```

### 3. Entradas de Usuário

#### XSS (Cross-Site Scripting) Prevention:

**Vulnerable:**
```javascript
// ❌ Nunca faça isto:
document.getElementById('output').innerHTML = userInput;
// Usuário pode injetar: <img src=x onerror="alert('hack')">
```

**Seguro:**
```javascript
// ✅ Use textContent para texto puro:
element.textContent = userInput;

// ✅ Ou sanitize HTML:
element.innerHTML = sanitizeHTML(userInput);

// ✅ Ou use template literals com decodificação:
const div = document.createElement('div');
div.textContent = userInput;
element.appendChild(div);
```

**Em EstudosIA:**
```javascript
// O projeto usa:
- textContent para exibir dados brutos
- Parsing seguro de respostas Gemini
- Sem eval() ou Function() constructor
- Validação de entrada antes de processar
```

### 4. API Security

#### Google Gemini API:

**Boas Práticas:**
```javascript
// ✅ Sempre use HTTPS
const endpoint = 'https://generativelanguage.googleapis.com/...'

// ✅ Valide respostas
if (!response.ok) {
  throw new Error(`API Error: ${response.status}`);
}

// ✅ Rate limiting
const maxRequests = 10; // por minuto
const requestQueue = [];

// ✅ Timeout em requisições
const timeout = 30000; // 30 segundos

// ✅ Error handling robusto
try {
  const result = await fetch(endpoint, { timeout });
} catch (error) {
  // Fallback seguro
  return generateLocal(prompt);
}
```

**Constraints Implementados:**
- Request timeout: 30s
- Máximo 50 itens em cache
- Fallback generation sem internet
- Sem retry automático infinito

### 5. CORS (Cross-Origin Resource Sharing)

```javascript
// A aplicação faz fetch para:
// ✅ generativelanguage.googleapis.com - API Gemini pública
// ✅ Mesma origem para arquivos HTML, CSS, JS

// CORS de entrada (de qual origem o site aceita):
// Configurar no servidor (future backend):
// Access-Control-Allow-Origin: https://seu-dominio.com
// Access-Control-Allow-Methods: POST
// Access-Control-Allow-Headers: Content-Type
```

### 6. Dependências (Sem dependências é seguro!)

```javascript
// EstudosIA vantagem:
✅ Sem npm packages = sem vulnerabilidades transitivas
✅ Código 100% auditável
✅ Nenhuma supply-chain attacks
✅ Nenhum malware em dependências

// Ao adicionar dependências no futuro:
- Auditoria: npm audit
- Lock files: package-lock.json
- Checksums: npm ci
- Atualizações: npm audit fix
```

---

## ✅ Checklist de Segurança

### Antes de Publicar
- [ ] Nenhuma chave de API no código
- [ ] Nenhuma senha no git
- [ ] .gitignore configurado
- [ ] Sem console.log() de dados sensíveis
- [ ] Sem debugger; statements
- [ ] HTTPS habilitado (se servidor)
- [ ] Headers de segurança configurados

### Código Review
- [ ] Nenhuma vulnerabilidade XSS (innerHTML com dados)
- [ ] Nenhuma injeção SQL (não aplicável, mas se adicionar BD)
- [ ] Nenhuma brute force
- [ ] Rate limiting implementado
- [ ] Error handling sem stack traces
- [ ] Validação de entrada realizada
- [ ] Output escapado/sanitizado

### Infraestrutura
- [ ] HTTPS/TLS para comunicação
- [ ] CORS configurado corretamente
- [ ] CSP headers definidos
- [ ] Secrets versionados em sistema seguro
- [ ] Logs monitorados
- [ ] Backups implementados
- [ ] Plano de incidente preparado

---

## 🛡️ Recomendações Futuras

### Quando Adicionar Backend

```javascript
// Mover para servidor:
1. Autenticação (JWT tokens)
2. Chaves API (server-side keys)
3. Validação robusta (server-side)
4. Rate limiting (por usuário)
5. Logging seguro
6. Criptografia end-to-end (opcional)
7. 2FA multi-fator (futuro)
```

### Segurança em Produção

```nginx
# nginx exemplo (security headers)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self';" always;
```

---

## 📚 Recursos de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Google Cloud Security](https://cloud.google.com/security)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk Security Scanner](https://snyk.io/)

---

## 📞 Contato de Segurança

Para dúvidas ou preocupações de segurança:
- Email: [seu-email]@example.com
- Website: [seu-site]
- GitHub: [@seu-usuario]

---

**Última Atualização:** 2024-01-20
**Versão:** 1.0.0
**Status:** ✅ Production Ready
