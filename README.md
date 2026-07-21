# 🇯🇲 Jamaica - Sistema de Vendas

Sistema de vendas completo com tema Jamaica, desenvolvido em **HTML5, CSS3 e JavaScript puro** (sem frameworks).

![Jamaica Theme](https://img.shields.io/badge/Theme-Jamaica-0B8D3A?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Funcionalidades

### 🧮 Calculadora
- **Lista fixa de produtos** visível de uma só vez
- 5 produtos pré-configurados: Five-Seven, M60, M4A1, MPX, Metanfetamina
- Adicione apenas as **quantidades** - cálculos automáticos
- **Sistema de parceria**: alterna entre preços "Com Parceria" e "Sem Parceria"
- Cálculo automático de:
  - Subtotal
  - Total
  - Lucro estimado
  - Quantidade total de itens

### 📜 Histórico
- **Persistência total** com localStorage
- Salva automaticamente cada venda com:
  - Data e hora
  - Modo (Parceria/Normal)
  - Todos os itens vendidos
  - Valor total
- Botões para **Ver detalhes** e **Excluir** cada venda
- Dados mantidos mesmo após fechar o navegador

### 📊 Estatísticas em Tempo Real
- 💰 Total vendido
- 📦 Total de itens vendidos
- 📈 Número de vendas
- 🤝 Vendas com parceria
- 🚫 Vendas sem parceria

### 📥 Exportação de Dados
- **JSON** - dados brutos para backup
- **PDF** - relatório formatado para impressão
- **Excel (.xlsx)** - planilha real com SheetJS

### 🎨 Interface
- **Design Glassmorphism** com efeitos de vidro e blur
- Cores da Jamaica: Verde (#0B8D3A), Amarelo (#FFD000), Vermelho (#D31E1E), Preto (#111111)
- Gradientes e efeitos neon
- Fundo decorativo criado 100% com CSS
- SVG embutido do leão com dreadlocks
- Efeitos de glow e sombras

### 🌓 Temas
- **Tema Escuro** (padrão)
- **Tema Claro**
- Preferência salva automaticamente

### ⏰ Extras
- Relógio digital em tempo real
- Data atualizada automaticamente
- Botão para limpar calculadora

## ⚡ Otimizações de Performance

- **Backdrop-filter otimizado**: blur(8px) para melhor performance
- **Relógio eficiente**: usa `requestAnimationFrame` ao invés de `setInterval`
- **Atualização seletiva de DOM**: apenas elementos modificados são atualizados
- **Animações simplificadas**: removidas animações pesadas, mantidas apenas essenciais
- **Cálculos otimizados**: apenas produtos com quantidade > 0 são processados

## 📱 Responsividade

Funciona perfeitamente em:
- 📱 **Mobile** (smartphones)
- 📱 **Tablet**
- 💻 **Desktop**
- 🖥️ **Widescreen**

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** no navegador
2. **Adicione quantidades** nos produtos desejados
3. **Alterne o modo** Parceria/Normal conforme necessário
4. Clique em **💾 Salvar Cálculo** quando finalizar
5. Visualize **estatísticas** e **histórico** na lateral
6. **Exporte** quando precisar de relatórios

## 📁 Estrutura do Projeto

```
Jamaica/
├── index.html      # Estrutura HTML
├── style.css       # Estilos e tema Jamaica
├── script.js       # Lógica da aplicação
└── README.md       # Documentação
```

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Glassmorphism, gradientes, animações
- **JavaScript** (ES6+) - Lógica pura sem frameworks
- **localStorage** - Persistência de dados
- **SheetJS** - Exportação Excel

## 🎯 Preços Configurados

| Produto | Com Parceria | Sem Parceria |
|---------|-------------|--------------|
| Five-Seven | $116.910 | $125.000 |
| M60 | $175.770 | $180.000 |
| M4A1 | $194.400 | $204.000 |
| MPX | $288.900 | $300.000 |
| Metanfetamina | $600 | $700 |

*Os preços podem ser facilmente editados no arquivo `script.js`*

## 💾 Persistência de Dados

Todos os dados são salvos localmente no navegador usando `localStorage`:

- **Histórico de vendas** - `jamaica_history`
- **Quantidades dos produtos** - `jamaica_quantities`
- **Tema preferido** - `jamaica_theme`

## 🎨 Cores do Tema Jamaica

```css
--jm-green: #0B8D3A;    /* Verde Jamaica */
--jm-yellow: #FFD000;   /* Amarelo Jamaica */
--jm-red: #D31E1E;      /* Vermelho Jamaica */
--jm-black: #111111;    /* Preto */
```

## 📝 Como Adicionar Novos Produtos

Edite o objeto `PRODUCTS` em `script.js`:

```javascript
const PRODUCTS = {
  'Five-Seven':    { parceria: 116910, normal: 125000 },
  'M60':           { parceria: 175770, normal: 180000 },
  'M4A1':          { parceria: 194400, normal: 204000 },
  'MPX':           { parceria: 288900, normal: 300000 },
  'Metanfetamina': { parceria: 600,    normal: 700    },
  // Adicione novos produtos aqui:
  'Novo Produto':  { parceria: 10000,  normal: 12000 },
};
```

## 🌐 Demonstração

Abra o `index.html` diretamente no navegador - não precisa de servidor!

## 📄 Licença

Este projeto foi desenvolvido para uso pessoal.

## 🤝 Contribuições

Desenvolvido com 🦁 e ❤️

---

**Jamaica** - Sistema de Vendas Premium 🇯🇲
