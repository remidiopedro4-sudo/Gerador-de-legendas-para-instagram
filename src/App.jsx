import { useState } from 'react';

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const stopWords = new Set([
  'a','à','as','às','o','os','um','uma','uns','umas','de','da','das','do','dos','em','no','na','nos','nas',
  'por','para','com','sem','e','ou','que','se','é','ser','estar','foi','são','como','mais','menos','muito',
  'muita','meu','minha','seu','sua','seus','suas','eu','você','vocês','ele','ela','eles','elas','isso','essa',
  'esse','aquela','aquele','quando','onde','porque','mas','também','já','não','sim','ao','aos','ter'
]);

function getKeywords(phrase) {
  const words = phrase.toLocaleLowerCase('pt-BR').match(/[\\p{L}\\p{N}]+/gu) || [];
  return [...new Set(words.filter((word) => word.length > 2 && !stopWords.has(word)))].slice(0, 5);
}

function buildCaption(rawPhrase, style) {
  const phrase = rawPhrase.trim().replace(/[.!?]+$/, '');
  const quoted = '“' + phrase + '”';
  const keywords = getKeywords(phrase);
  const subject = keywords.slice(0, 3).join(', ');
  const focus = subject || phrase;

  const captions = {
    Identificação: [
      quoted,
      'Quem já viveu algo parecido sabe que essa mensagem vai além das palavras. Existem momentos em que a gente se reconhece exatamente no que está escrito.',
      'Na rotina, ' + focus + ' podem aparecer de formas diferentes para cada pessoa. Mesmo assim, certos sentimentos e experiências acabam aproximando histórias.',
      'Talvez você também esteja passando por uma fase que faz essa frase ter ainda mais sentido. Cada um tem seu próprio caminho, seu tempo e suas batalhas.',
      'Se essa mensagem falou com você, compartilhe com alguém que também precisa ler isso.'
    ],
    Emocional: [
      quoted,
      'Tem frases que fazem a gente parar por alguns segundos, porque traduzem sentimentos que nem sempre conseguimos explicar.',
      'Quando pensamos em ' + focus + ', também lembramos de tudo o que acontece nos bastidores: os dias difíceis, as dúvidas e os pequenos passos que quase ninguém percebe.',
      'Nem sempre as pessoas sabem o que estamos enfrentando. Por isso, reconhecer a própria caminhada e respeitar o próprio processo também importa.',
      'Guarde essa mensagem para reler quando precisar. Às vezes, é exatamente disso que a gente precisa.'
    ],
    Conversacional: [
      quoted,
      'Mas como isso aparece na vida real? Muitas vezes, nos detalhes da rotina, nas escolhas que fazemos e na forma como reagimos ao que acontece.',
      'O assunto ' + focus + ' pode ser visto de diferentes maneiras, porque cada pessoa carrega experiências e pontos de vista próprios.',
      'Vale olhar para essa mensagem e pensar em como ela se encaixa no seu momento atual. Não precisa concordar com tudo, o importante é refletir.',
      'E você, como enxerga essa frase? Conta nos comentários.'
    ]
  };

  return captions[style].join('\\n\\n');
}

function generateCaptions(phrase) {
  return ['Identificação', 'Emocional', 'Conversacional'].map((label) => ({
    label,
    text: buildCaption(phrase, label)
  }));
}

export default function App() {
  const [phrase, setPhrase] = useState('');
  const [captions, setCaptions] = useState([]);
  const [copied, setCopied] = useState(-1);
  const [error, setError] = useState('');

  function generate() {
    if (!phrase.trim()) {
      setError('Digite uma frase antes de gerar.');
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
        <div className="eyebrow"><span className="eyebrow-line" /> FRASES QUE CRIAM CONEXÃO</div>
        <h1>Não escreva só uma legenda.<br /><span>Faça alguém se identificar.</span></h1>
        <p className="hero-copy">Digite uma frase e receba três legendas prontas para publicar nas redes sociais, com textos conectados à mensagem original.</p>
      </section>
      <section className="generator-panel" aria-label="Gerador de legendas">
        <div className="panel-heading">
          <div><span className="step">01</span><h2>Qual frase você quer transformar em legenda?</h2></div>
          <span className="optional">QUALQUER ASSUNTO</span>
        </div>
        <label htmlFor="idea">SUA FRASE</label>
        <textarea id="idea" value={phrase} onChange={(event) => { setPhrase(event.target.value); setError(''); }} placeholder="Cole ou escreva a frase que será usada na sua publicação..." maxLength={1000} />
        <div className="input-footer"><span>Use a frase que deseja publicar nas suas redes sociais.</span><span>{phrase.length}/1000</span></div>
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
