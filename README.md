#<lv/>— Portfólio Lucas Velozo
Site pessoal construído do zero, sem framework, sem build tool, sem nada baixado via npm — só HTML, CSS e JavaScript puro mesmo. A ideia por trás disso foi simples: eu queria um lugar pra colocar minha trajetória (Avantia, UNIT, AWS re/Start, Porto Digital, DEV LINK) que ao mesmo tempo servisse como prova de que eu manjo os fundamentos da web antes de sair usando framework pra tudo.

Estética: terminal escuro, preto e amarelo, fonte JetBrains Mono. Se você é dev e caiu aqui, vai se sentir em casa.

🔗 Live:  (cole aqui a URL depois do deploy)


Sobre o projeto

Não é apenas uma página estática parada. Tem um pré-carregador que simula inicialização do sistema, um terminal de verdade que aceita comandos digitados, cursor customizado, tema claro/escuro que persiste entre visitas, chuva de matriz no fundo do herói, partículas inseridas tipo constelação, contadores que sobem quando entram na tela, e até um ovo de páscoa escondido (tenta digitar devlinkem qualquer lugar da página).

Grande parte disso eu fiz mais por diversão e pra treinar Canvas API, IntersectionObserver e manipulação de DOM sem depender de biblioteca nenhuma — só o Lenis pra scroll suave, que é a única dependência externa do projeto inteiro.

O que tem em cada seção

Herói — terminal falso com efeito de digitação (máquina de escrever), mais um terminal de verdade logo abaixo dele, funcional, que responde a comandos.

Sobre — quem eu sou, o que eu faço hoje e uma linha do tempo resumida (Avantia, UNIT, AWS re/Start, Porto Digital, DEV LINK).

Habilidades — grade de cartões com a pilha que eu uso no dia a dia (JS, REST, banco de dados, Sydle One, AWS, Linux, Ágil, lógica, HTML/CSS, Git).

Projetos — cartões filtráveis ​​por categoria (JavaScript / AWS-Cloud / HTML-CSS), com modal de detalhes que mostram as decisões técnicas de cada um. Essa seção também puxa automaticamente meus repositórios públicos mais recentes direto da API do GitHub, sem precisar de token nem nada — é tudo público.

Contato — e-mail com botão de copiar (com brinde de confirmação), LinkedIn, GitHub, Discord da DEV LINK, download do currículo em PDF e um QR Code gerado na hora apontando pro meu GitHub.

O terminal interativo

Esse aqui é o detalhe que eu mais gosto. Tem uma entrada de verdade no herói que aceita os seguintes comandos:

help       → lista os comandos
about      → um resumo rápido de quem eu sou
skills     → stack principal em formato de array JS
projects   → os projetos em destaque
contact    → meus contatos
devlink    → sobre a comunidade DEV LINK
github     → abre meu GitHub em nova aba
linkedin   → abre meu LinkedIn em nova aba
clear      → limpa a tela

Se você digitar qualquer coisa que não exista, ele te avisa e sugere o help. Tudo escrito manualmente em script.js, sem lib de terminal nenhum.

Pilha

Nada, nenhum sentido de framework — e é exatamente esse o ponto.

CamadaTecnologiaEstruturaSemântico HTML5EstiloCSS3 puro (propriedades customizadas, Grid, Flexbox, animações)ComportamentoJavaScript puro (ES6+)Deslize suavementeLenis via CDN (única dependência externa)FontesJetBrains Mono + Inter, via Google FontsDados dos proAPI pública do GitHub ( api.github.com)Código QRapi.qrserver.com

Nada de React, Vue, Tailwind, bundler ou gerenciador de pacotes. Isso é proposital — o objetivo aqui era dominar o que está por baixo de tudo isso antes de abstrair.

Rodando localmente

Como não tem build step nenhum, basta abrir o index.htmlno navegador. Mas se quiser rodar com um servidor local de verdade (recomendado, pra evitar problema de CORS com fontes e afins), qualquer uma dessas resolva:

bash# com Python
python3 -m http.server 5500

# com Node (npx, sem instalar nada global)
npx serve .

# com a extensão Live Server do VS Code
# clique com o botão direito no index.html → "Open with Live Server"

Depois é só acessar http://localhost:5500(ou a porta que aparece).

Estrutura de massas

.
├── index.html          # marcação e conteúdo de todas as seções
├── style.css            # todo o visual — tema, variáveis, responsividade
├── script.js             # toda a interatividade (terminal, tema, modais, filtros...)
└── assets/
    └── curriculo.pdf      # currículo em PDF pra download


Repare que a pasta assets/com o curriculo.pdfprecisa existir no repositório pra o botão de download funcionar — ela não está incluída nesse ZIP/upload, então lembre-se de adicionar antes do deploy.



Implantar

Como é um site 100% estático, o deploy é o mais simples possível — não tem variável de ambiente, não tem build command, não tem nada pra configurar.

Vercel


Importe o repositório em vercel.com/new
Em Framework Preset , selecione Outro
Deixa Build Command e Output Directory em branco (ou aponta a raiz .)
Implantar.


Não precisa cor nenhuma variável de ambiente — o projeto não consome nenhuma chave de API privada. As integrações externas (GitHub API, QR Server, Google Fonts) são todas públicas.

Netlify / GitHub Pages

Funciona do mesmo jeito: sobe os três arquivos + a pasta assets/e pronto, sem passo de build.

Acessibilidade e desempenho

Dei atenção real pra isso, não é só enfeite:


Respeita prefers-reduced-motion— quem tem essa preferência ativada não recebe preloader animado, matriz chuva, cursor customizado nem scroll suave via Lenis (cai pro scroll nativo do navegador)
aria-label, aria-live, rolee afins nos componentes interativos (terminal, barra de progresso, modais, brinde de cópia)
Navegação por teclado funcional nos cards de habilidade e nos modais (fecha com Esc)
HTML5 semântico com <header>, <main>, <footer>, <section>bem definido
Meta tags de SEO e Open Graph preenchidas


Sobre mim

Sou o Lucas — ou "Velozo", como me chamo nos espaços acadêmicos e profissionais. Atualmente:


Estagiário de Desenvolvimento na Avantia , trabalhando com JavaScript, integrações REST e automação na plataforma Sydle One
Cursando Análise e Desenvolvimento de Sistemas na UNIT (2º período)
Residente Tecnológico no Porto Digital
Fundador da DEV LINK , comunidade que conecta pessoas desenvolvedoras em Recife
Fazendo o programa AWS re/Start


Fico ligado em back-end, APIs REST, Cloud e Java. Se quiser trocar uma ideia, os contatos estão todos na seção de contato do site — ou clicaram no botão para copiar e-mail lá, tem um efeito legal.

licença

Sinta-se à vontade para usar esse projeto como referência ou inspiração para seu próprio portfólio. Só peço que não copie o conteúdo pessoal (textos sobre mim, CV, etc.) — o código em si, use como quiser.


<sub> feito linha por linha, sem framework, só pra provar que ainda dá. </sub>
