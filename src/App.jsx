import { useState } from 'react';

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const stopWords = new Set([
  'a','à','as','às','o','os','um','uma','uns','umas','de','da','das','do','dos','em','no','na','nos','nas',
  'por','para','com','sem','e','ou','que','se','é','ser','estar','foi','são','como','mais','menos','muito',
  'muita','meu','minha','seu','sua','seus','suas','eu','você','vocês','ele','ela','eles','elas','isso','essa',
  'esse','essa','aquela','aquele','quando','onde','porque','mas','também','já','não','sim','ao','aos','ter'
]);

function getKeywords(idea) {
  const words = idea.toLocaleLowerCase('pt-BR').match(/[\p{L}\p{N}]+/gu) || [];
  const meaningful = words.filter((word) => word.length > 2 && !stopWords.has(word));
  return [...new Set(meaningful)].slice(0, 5);
}

function buildCaption(rawIdea, style) {
  const idea = rawIdea.trim().replace(/[.!?]+$/, '');
  const quoted = '“' + idea + '”';
  const keywords = getKeywords(idea);
  const subject = keywords.length ? keywords.slice(0, 3).join(', ') : idea;
  const variations = {
    Identificação: [
      'Quando você pensa em ' + quoted + ', talvez reconheça algo que já viveu. Nem sempre é fácil explicar essa sensação, mas muita gente passa por situações parecidas.',
      'Essa ideia também aparece na vida real quando ' + subject + ' fazem parte das nossas escolhas. É nesse tipo de momento que a mensagem deixa de ser apenas palavras.',
      'Talvez você já tenha tentado lidar com isso do seu jeito. Cada pessoa tem uma experiência diferente, mas encontrar alguém que entende o que sentimos faz diferença.',
      'Por isso, vale olhar para ' + subject + ' com mais atenção e perceber como essa mensagem se conecta com a sua própria história.',
      'Você já passou por algo que fez essa frase ganhar sentido?'
    ],
    Emocional: [
      'Às vezes, ' + quoted + ' toca em algo que a gente sente, mas não costuma dizer em voz alta. Algumas experiências ficam guardadas justamente porque significam mais do que parecem.',
      'Quando ' + subject + ' entram nessa reflexão, podem trazer lembranças, dúvidas e sentimentos que cada pessoa reconhece de uma maneira.',
      'Nem sempre conseguimos mudar uma situação imediatamente. Ainda assim, reconhecer o que ela desperta dentro de nós já é uma forma de começar a entendê-la.',
      'Talvez essa seja a parte mais importante de ' + quoted + ': permitir que você olhe para o que está vivendo com sinceridade, sem se comparar com a jornada de ninguém.',
      'Qual sentimento essa mensagem despertou em você?'
    ],
    Conversacional: [
      'Vamos trazer ' + quoted + ' para o dia a dia. Onde essa ideia aparece na sua rotina, nas suas escolhas ou na maneira como você enxerga as coisas?',
      'Pense em ' + subject + ' por um instante. É possível encontrar exemplos disso em situações simples, até naquelas que normalmente passam despercebidas.',
      'E não precisa existir uma única interpretação. O contexto de cada pessoa muda a forma como uma mensagem é entendida.',
      'O importante é não deixar ' + quoted + ' apenas como uma frase bonita. Vale pensar no que ela significa para você e no que pode ser aplicado à sua realidade.',
      'Quero saber sua opinião: você concorda com essa ideia?'
    ]
  };
  return variations[style].join('\n\n');
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
