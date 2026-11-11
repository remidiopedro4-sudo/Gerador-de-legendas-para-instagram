import { useState } from 'react';

export default function App() {
  const [phrase, setPhrase] = useState('');
  const [captions, setCaptions] = useState([]);
  const [copied, setCopied] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    if (!phrase.trim()) {
      setError('Escreva uma frase ou ideia antes de gerar.');
      setCaptions([]);
      return;
    }

    setLoading(true);
    setError('');
    setCopied(-1);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase: phrase.trim() })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível criar suas legendas. Tente novamente.');
      }

      if (!Array.isArray(data.captions) || data.captions.length !== 3) {
        throw new Error('A resposta veio incompleta. Gere novamente.');
      }

      setCaptions(data.captions);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao gerar. Tente novamente.');
      setCaptions([]);
    } finally {
      setLoading(false);
    }
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
        <span className="top-note">GERADOR INTELIGENTE DE LEGENDAS</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> IDEIAS QUE CRIAM CONEXÃO</div>
        <h1>Não escreva só uma legenda.<br /><span>Faça alguém se identificar.</span></h1>
        <p className="hero-copy">Digite sua ideia. A inteligência artificial entende a mensagem e transforma em palavras que parecem conversar diretamente com quem está lendo.</p>
      </section>

      <section className="generator-panel" aria-label="Gerador de legendas">
        <div className="panel-heading">
          <div><span className="step">01</span><h2>O que você quer transmitir?</h2></div>
          <span className="optional">QUALQUER ASSUNTO</span>
        </div>
        <label htmlFor="idea">SUA FRASE OU IDEIA</label>
        <textarea
          id="idea"
          value={phrase}
          onChange={(event) => { setPhrase(event.target.value); setError(''); }}
          placeholder="Escreva do seu jeito, mesmo que seja uma frase curta ou uma ideia ainda desorganizada..."
          maxLength={1000}
          disabled={loading}
        />
        <div className="input-footer"><span>Não precisa escrever bonito. A ideia é o suficiente.</span><span>{phrase.length}/1000</span></div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="generate-button" onClick={generate} type="button" disabled={loading}>
          {loading ? <><span className="spinner" /> ENTENDENDO SUA IDEIA...</> : <>CRIAR LEGENDAS COM IA <span aria-hidden="true">↗</span></>}
        </button>
        <p className="privacy-note"><span className="lock">◇</span> Três versões originais, cada uma com exatamente 5 parágrafos.</p>
      </section>

      {captions.length > 0 && (
        <section className="results" aria-live="polite">
          <div className="results-heading">
            <div><span className="step">02</span><h2>Três formas de criar conexão</h2></div>
            <span className="result-count">05 PARÁGRAFOS CADA</span>
          </div>
          <div className="caption-grid">
            {captions.map((caption, index) => (
              <article className="caption-card" key={caption.label || index}>
                <div className="card-top"><span className="card-number">0{index + 1}</span><span className="card-label">{caption.label}</span></div>
                <p className="caption-text">{caption.text}</p>
                <div className="paragraph-count">{caption.text.trim().split(/\n\s*\n/).length} PARÁGRAFOS</div>
                <button className={copied === index ? 'copy-button copied' : 'copy-button'} onClick={() => copyCaption(caption.text, index)} type="button">
                  {copied === index ? 'COPIADO ✓' : 'COPIAR LEGENDA ↗'}
                </button>
              </article>
            ))}
          </div>
          <button className="regenerate" onClick={generate} type="button" disabled={loading}>↻ CRIAR NOVAS VERSÕES</button>
        </section>
      )}

      <footer className="footer"><span>LEGENDA © {new Date().getFullYear()}</span><span>PALAVRAS QUE APROXIMAM PESSOAS.</span></footer>
    </main>
  );
}
