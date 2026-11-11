import { useState } from 'react';

const pick = (items) => items[Math.floor(Math.random() * items.length)];

function buildCaption(rawIdea, style) {
  const idea = rawIdea.trim().replace(/[.!?]+$/, '');
  const quoted = "“" + idea + "”";
  const openings = {
    Identificação: [
      "Tem uma coisa sobre " + quoted.toLowerCase() + " que muita gente entende, mas nem sempre consegue colocar em palavras.",
      "Talvez você já tenha se deparado com essa ideia: " + quoted + ". E, de alguma forma, ela faz sentido.",
      "Nem sempre é fácil explicar por que uma ideia chama tanto a nossa atenção. Às vezes, basta ler: " + quoted + "."
    ],
    Emocional: [
      "Algumas ideias ficam na cabeça porque tocam em algo que a gente já sentiu. " + quoted + " é uma delas.",
      "Por trás de " + quoted.toLowerCase() + ", existe uma reflexão que merece mais do que uma leitura rápida.",
      "Tem palavras que fazem a gente parar por alguns segundos. " + quoted + " pode ser uma dessas."
    ],
    Conversacional: [
      "Vamos falar sobre uma coisa: " + quoted + ".",
      "Sabe quando uma frase resume um pensamento que estava difícil de explicar? " + quoted + ".",
      "Olha essa ideia com calma: " + quoted + ". Ela abre uma conversa interessante."
    ]
  };
  const second = [
    "O interessante é olhar além da frase. O que ela significa na prática, nas escolhas pequenas e na maneira como cada pessoa enxerga a própria realidade?",
    "Quando a gente tira essa ideia do papel, percebe que ela pode aparecer em situações comuns, nas conversas, nas decisões e até na forma de interpretar o que acontece.",
    "Não se trata apenas de concordar ou discordar. Vale entender o contexto, observar os detalhes e pensar em como essa mensagem se conecta com a vida real."
  ];
  const third = [
    "E é justamente aí que surgem as dúvidas. Às vezes, existe uma distância entre aquilo que pensamos, aquilo que sentimos e aquilo que conseguimos colocar em prática.",
    "Só que entender uma mensagem não significa que tudo fique simples de uma hora para outra. Cada pessoa tem seu tempo, suas experiências e seu próprio jeito de lidar com isso.",
    "O desafio está em não ficar somente na primeira impressão. Uma reflexão ganha força quando nos faz questionar hábitos, pontos de vista e certezas."
  ];
  const fourth = [
    "Talvez o primeiro passo seja olhar para essa ideia com honestidade, sem buscar uma resposta perfeita. Uma mudança de perspectiva também começa com uma pergunta bem feita.",
    "No fim, o valor dessa reflexão está no que ela desperta em você. Não precisa transformar tudo imediatamente; entender melhor já pode mudar a maneira de enxergar a situação.",
    "Uma boa ideia não precisa de exagero para fazer sentido. Precisa ser compreendida, relacionada à realidade e levada em consideração nas escolhas possíveis."
  ];
  const endings = [
    "Agora me conta: como você enxerga essa ideia?",
    "E você, já tinha pensado por esse lado?",
    "Qual parte dessa reflexão mais conversa com o seu momento?"
  ];
  let p2 = pick(second);
  let p3 = pick(third);
  let p4 = pick(fourth);
  if (style === 'Identificação') {
    p2 = pick([
      "Talvez você reconheça isso em alguma situação que já viveu. Não precisa ser exatamente igual: às vezes, o sentimento por trás da experiência é o que aproxima as pessoas.",
      "É fácil se identificar quando uma mensagem dá nome a algo que parecia confuso. Cada pessoa encontra um significado diferente, de acordo com o que está vivendo."
    ]);
  } else if (style === 'Emocional') {
    p3 = pick([
      "E existe uma parte disso que nem sempre aparece por fora: os pensamentos que guardamos, as expectativas que criamos e as perguntas que continuam mesmo quando o assunto muda.",
      "Às vezes, o que mais pesa não é a situação em si, mas tudo aquilo que ela representa. Reconhecer isso exige atenção e sinceridade consigo mesmo."
    ]);
  } else {
    p4 = pick([
      "Talvez valha fazer um exercício simples: pense em uma situação real em que essa mensagem se aplica. O que você percebe quando olha para ela sem pressa?",
      "Uma forma de levar essa conversa adiante é observar onde essa ideia aparece no seu dia a dia. É nesse ponto que a reflexão deixa de ser abstrata."
    ]);
  }
  return [pick(openings[style]), p2, p3, p4, pick(endings)].join('\n\n');
}

function generateCaptions(idea) {
  return ['Identificação', 'Emocional', 'Conversacional'].map((label) => ({
    label,
    text: buildCaption(idea, label)
  }));
}

export default function App() {
  const [phrase, setPhrase] = useState('');
  const [captions, setCaptions] = useState([]);
  const [copied, setCopied] = useState(-1);
  const [error, setError] = useState('');

  function generate() {
    if (!phrase.trim()) {
      setError('Escreva uma frase ou ideia antes de gerar.');
      setCaptions([]);
      return;
    }
    setError('');
    setCopied(-1);
    setCaptions(generateCaptions(phrase));
  }

  async function copyCaption(text, index) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      window.setTimeout(() => setCopied(-1), 1800);
    } catch {
      setError('Não foi possível copiar automaticamente. Selecione o texto e copie.');
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Legenda início"><span className="brand-mark">L.</span><span>LEGENDA</span></a>
        <span className="top-note">GERADOR DE LEGENDAS PARA INSTAGRAM</span>
      </header>
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> IDEIAS QUE CRIAM CONEXÃO</div>
        <h1>Não escreva só uma legenda.<br /><span>Faça alguém se identificar.</span></h1>
        <p className="hero-copy">Digite sua ideia e receba três versões de legenda para desenvolver sua mensagem e criar uma conversa com quem está lendo.</p>
      </section>
      <section className="generator-panel" aria-label="Gerador de legendas">
        <div className="panel-heading">
          <div><span className="step">01</span><h2>O que você quer transmitir?</h2></div>
          <span className="optional">QUALQUER ASSUNTO</span>
        </div>
        <label htmlFor="idea">SUA FRASE OU IDEIA</label>
        <textarea id="idea" value={phrase} onChange={(event) => { setPhrase(event.target.value); setError(''); }} placeholder="Escreva do seu jeito, mesmo que seja uma frase curta ou uma ideia ainda desorganizada..." maxLength={1000} />
        <div className="input-footer"><span>Não precisa escrever bonito. A ideia é o suficiente.</span><span>{phrase.length}/1000</span></div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="generate-button" onClick={generate} type="button">GERAR LEGENDAS <span aria-hidden="true">↗</span></button>
        <p className="privacy-note"><span className="lock">◇</span> Três versões, cada uma com exatamente 5 parágrafos. Sem cadastro e sem API.</p>
      </section>
      {captions.length > 0 && (
        <section className="results" aria-live="polite">
          <div className="results-heading">
            <div><span className="step">02</span><h2>Três formas de criar conexão</h2></div>
            <span className="result-count">05 PARÁGRAFOS CADA</span>
          </div>
          <div className="caption-grid">
            {captions.map((caption, index) => (
              <article className="caption-card" key={caption.label}>
                <div className="card-top"><span className="card-number">0{index + 1}</span><span className="card-label">{caption.label}</span></div>
                <p className="caption-text">{caption.text}</p>
                <div className="paragraph-count">5 PARÁGRAFOS</div>
                <button className={copied === index ? 'copy-button copied' : 'copy-button'} onClick={() => copyCaption(caption.text, index)} type="button">
                  {copied === index ? 'COPIADO ✓' : 'COPIAR LEGENDA ↗'}
                </button>
              </article>
            ))}
          </div>
          <button className="regenerate" onClick={generate} type="button">↻ CRIAR NOVAS VERSÕES</button>
        </section>
      )}
      <footer className="footer"><span>LEGENDA © {new Date().getFullYear()}</span><span>PALAVRAS QUE APROXIMAM PESSOAS.</span></footer>
    </main>
  );
}
