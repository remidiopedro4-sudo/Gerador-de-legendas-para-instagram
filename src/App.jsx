import { useState } from 'react';

const clean = (value) => value.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');

function makeCaptions(raw) {
  const idea = clean(raw);
  const lower = idea.charAt(0).toLowerCase() + idea.slice(1);
  return [
    {
      label: 'Identificação',
      text: `Tem dias em que a gente só precisa ouvir isso: ${lower}.\n\nSe essa mensagem fez sentido para você, talvez seja exatamente o lembrete que estava faltando hoje.`
    },
    {
      label: 'Reflexão',
      text: `${idea}.\n\nNem sempre é fácil colocar isso em prática, mas reconhecer já é um começo. Um passo de cada vez, sem comparação e sem desistir do próprio caminho.`
    },
    {
      label: 'Conexão',
      text: `Talvez você também esteja passando por isso: ${lower}.\n\nNão precisa ter tudo resolvido agora. Continue, respeite seu processo e faça o que estiver ao seu alcance hoje.\n\nVocê se identifica?`
    }
  ];
}

export default function App() {
  const [phrase, setPhrase] = useState('');
  const [captions, setCaptions] = useState([]);
  const [copied, setCopied] = useState(-1);
  const [error, setError] = useState('');

  function generate() {
    if (!phrase.trim()) {
      setError('Digite uma frase ou ideia para começar.');
      setCaptions([]);
      return;
    }
    setError('');
    setCopied(-1);
    setCaptions(makeCaptions(phrase));
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
        <span className="top-note">GERADOR DE LEGENDAS</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> SUAS IDEIAS, EM PALAVRAS</div>
        <h1>Uma frase sua.<br /><span>Uma legenda pronta.</span></h1>
        <p className="hero-copy">Escreva sua ideia e transforme em uma legenda que cria identificação com quem lê.</p>
      </section>

      <section className="generator-panel" aria-label="Gerador de legendas">
        <div className="panel-heading">
          <div><span className="step">01</span><h2>Sua ideia começa aqui</h2></div>
          <span className="optional">SEM CATEGORIAS</span>
        </div>
        <label htmlFor="idea">DIGITE SUA FRASE OU IDEIA</label>
        <textarea
          id="idea"
          value={phrase}
          onChange={(event) => { setPhrase(event.target.value); setError(''); }}
          placeholder="Ex.: Nem todo dia você vai estar motivado, mas pode escolher continuar..."
          maxLength={500}
        />
        <div className="input-footer"><span>Use suas próprias palavras. Qualquer assunto funciona.</span><span>{phrase.length}/500</span></div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="generate-button" onClick={generate} type="button">
          GERAR MINHAS LEGENDAS <span aria-hidden="true">↗</span>
        </button>
        <p className="privacy-note"><span className="lock">◇</span> Sua frase é processada nesta página e não precisa de cadastro.</p>
      </section>

      {captions.length > 0 && (
        <section className="results" aria-live="polite">
          <div className="results-heading"><div><span className="step">02</span><h2>Escolha a que combina com você</h2></div><span className="result-count">03 VERSÕES</span></div>
          <div className="caption-grid">
            {captions.map((caption, index) => (
              <article className="caption-card" key={caption.label}>
                <div className="card-top"><span className="card-number">0{index + 1}</span><span className="card-label">{caption.label}</span></div>
                <p className="caption-text">{caption.text}</p>
                <button className={copied === index ? 'copy-button copied' : 'copy-button'} onClick={() => copyCaption(caption.text, index)} type="button">
                  {copied === index ? 'COPIADO ✓' : 'COPIAR LEGENDA ↗'}
                </button>
              </article>
            ))}
          </div>
          <button className="regenerate" onClick={generate} type="button">↻ GERAR NOVAMENTE</button>
        </section>
      )}

      <footer className="footer"><span>LEGENDA © {new Date().getFullYear()}</span><span>MENOS COMPLICAÇÃO. MAIS CONEXÃO.</span></footer>
    </main>
  );
}
