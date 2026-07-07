# Roda de Cores Complementares 🎨

Um site estático e interativo que exibe um **círculo cromático (color wheel)** e mostra, em tempo real, a **cor complementar** (oposta a 180°) de qualquer cor escolhida.

## 🎯 Objetivo

Ajudar designers, estudantes e curiosos a visualizar e entender o conceito de cores complementares na teoria das cores, de forma visual e interativa.

## ✅ Funcionalidades implementadas

- **Círculo cromático (conic-gradient)** representando todo o espectro de matizes (hue 0°–360°).
- **Alça arrastável (drag & drop / touch)**: clique, arraste ou toque em qualquer ponto do círculo para escolher uma cor.
- **Cálculo automático da cor complementar** (hue + 180°), exibida com uma segunda alça conectada por uma linha tracejada ao centro do círculo.
- **Cartões de detalhes de cor** mostrando código **HEX**, **RGB** e **HSL** tanto da cor selecionada quanto da complementar.
- **Prévia lado a lado** das duas cores em um bloco grande, para avaliar contraste.
- **Controle de luminosidade** (slider) que ajusta o brilho de ambas as cores mantendo o matiz e a saturação.
- **Paletas rápidas**: botões de atalho para cores comuns (Vermelho, Laranja, Amarelo, Verde, Ciano, Azul, Roxo, Magenta).
- **Botão "Copiar códigos HEX"** que copia os dois códigos para a área de transferência.
- **Suporte a teclado** (setas ⬅️➡️⬆️⬇️ com foco na alça principal, Shift para passos maiores).
- **Seção educativa** explicando o conceito de cores complementares com exemplos visuais.
- **Design responsivo**, com fundo decorativo animado (blobs), tipografia Poppins (Google Fonts) e ícones Font Awesome.

## 🗂️ Estrutura do projeto

```
index.html          → Estrutura da página (círculo, painéis, seção educativa)
css/style.css        → Estilos, layout responsivo, animações e tema visual
js/main.js           → Lógica de interação: conversão de cores (HSL → RGB → HEX),
                        cálculo de ângulo/posição das alças, drag & drop, sliders,
                        paletas rápidas e cópia para clipboard
```

## 🔗 Entradas/URIs funcionais

Este é um site de página única (SPA estática), sem parâmetros de rota:

- `index.html` — página principal com todo o conteúdo e funcionalidades acima.

Não há chamadas a APIs externas nem uso da RESTful Table API — todo o cálculo de cores é feito no navegador (client-side), sem necessidade de persistência de dados.

## 🧮 Modelo de dados

Não há banco de dados. O estado é mantido apenas em variáveis JavaScript em memória durante a sessão do usuário:

- `hue` (0–360): matiz da cor selecionada.
- `lightness` (10–90): luminosidade aplicada a ambas as cores.
- `saturation`: fixa em 100%.
- A cor complementar é derivada automaticamente como `(hue + 180) % 360`.

## 🚧 Funcionalidades não implementadas (possíveis melhorias futuras)

- Histórico de cores selecionadas (poderia usar a RESTful Table API para salvar paletas favoritas).
- Exportação da paleta em formatos como `.ase`, `.json` ou imagem PNG.
- Modo com esquemas de cores adicionais (análogas, triádicas, tetrádicas), além de apenas complementares.
- Alternância entre modo claro/escuro do próprio site (atualmente só tema escuro).
- Compartilhamento de uma cor específica via URL (query string), ex: `index.html?hue=210`.

## 🚀 Próximos passos recomendados

1. Adicionar suporte a esquemas de cores extras (análogas, triádicas) com abas de seleção.
2. Persistir paletas favoritas usando a RESTful Table API (`tables/palettes`).
3. Implementar leitura de parâmetros via URL para compartilhar uma cor específica.
4. Adicionar testes de acessibilidade adicionais (contraste de texto, navegação 100% por teclado nas paletas rápidas).

## 🌐 Publicação

Para publicar o site e obter uma URL pública, utilize a aba **Publish** da plataforma — ela cuida de todo o processo de deploy automaticamente.
