import { useState } from 'react';

const variants = [
  {
    label: 'Apresentação',
    plotLead: 'A história acompanha',
    characterLead: 'Entre os personagens principais estão',
    highlightLead: 'Um dos pontos que merece destaque é'
  },
  {
    label: 'Enredo',
    plotLead: 'A trama apresenta',
    characterLead: 'A história também ganha força com personagens como',
    highlightLead: 'Outro detalhe que chama atenção é'
  },
  {
    label: 'Destaques',
    plotLead: 'Ao longo da obra, acompanhamos',
    characterLead: 'Nesse universo, alguns dos personagens centrais são',
    highlightLead: 'O que torna esse anime interessante é'
  }
];

function parseAnimeInput(raw) {
  const fields = {
    name: '',
    characters: '',
    plot: '',
    highlights: ''
  };

  const aliases = {
    'nome': 'name',
    'nome do anime': 'name',
    'anime': 'name',
    'personagens': 'characters',
    'personagens principais': 'characters',
    'personagens principais do anime': 'characters',
    'enredo': 'plot',
    'sinopse': 'plot',
    'historia': 'plot',
    'história': 'plot',
    'destaques': 'highlights',
    'curiosidade': 'highlights',
    'curiosidades': 'highlights',
    'informacao do anime': 'highlights',
    'informação do anime': 'highlights'
  };

  raw.split('\n').forEach((line) => {
    const match = line.match(/^\s*([^:]+)\s*:\s*(.*)$/);
    if (!match) return;
    const key = aliases[match[1].trim().toLocaleLowerCase('pt-BR')];
    if (key && match[2].trim()) {
      fields[key] = match[2].trim();
    }
  });

  return fields;
}

function buildCaption(fields, variant) {
  const paragraphs = [
    fields.name,
    variant.plotLead + ' ' + fields.plot + '.',
    fields.characters
      ? variant.characterLead + ' ' + fields.characters + '.'
      : 'Os personagens dão vida aos acontecimentos e ajudam a construir a jornada apresentada no anime.',
    fields.highlights
      ? variant.highlightLead + ' ' + fields.highlights + '.'
      : 'A obra reúne momentos que ajudam a marcar sua identidade e tornam a experiência interessante para quem acompanha.',
    'Gosta de animes? Siga o perfil para acompanhar mais conteúdos, personagens e histórias do mundo dos animes.'
  ];

  return paragraphs.join('\n\n');
}

function generateCaptions(raw) {
  const fields = parseAnimeInput(raw);
  if (!fields.name || !fields.plot) return null;

  return variants.map((variant) => ({
    label: variant.label,
    text: buildCaption(fields, variant)
  }));
}

export default function App() {
  const [animeInfo, setAnimeInfo] = useState('');
  const [captions, setCaptions] = useState([]);
  const [copied, setCopied] = useState(-1);
  const [error, setError] = useState('');

  function generate() {
    if (!animeInfo.trim()) {
      setError('Preencha as informações do anime antes de gerar.');
      setCaptions([]);
      return;
    }

    const generated = generateCaptions(animeInfo);
    if (!generated) {
      setError('Informe pelo menos o nome do anime e o enredo, usando os campos do exemplo.');
      setCaptions([]);
      return;
    }

    setError('');
    setCopied(-1);
    setCaptions(generated);
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
        <a className="brand" href="/" aria-label="Legenda início"><span className="brand-mark">L.</span><span>LEGENDA ANIME</span></a>
        <span className="top-note">GERADOR DE LEGENDAS PARA PERFIS DE ANIMES</span>
      </header>
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> CONTEÚDO PARA PERFIS DE ANIMES</div>
        <h1>Seu anime merece<br /><span>uma legenda à altura.</span></h1>
        <p className="hero-copy">Informe os dados do anime e gere três versões de legenda para publicar no seu perfil.</p>
      </section>
      <section className="generator-panel" aria-label="Gerador de legendas de animes">
        <div className="panel-heading">
          <div><span className="step">01</span><h2>Informações do anime</h2></div>
          <span className="optional">PREENCHA OS CAMPOS</span>
        </div>
        <label htmlFor="anime-info">DADOS PARA A LEGENDA</label>
        <textarea
          id="anime-info"
          value={animeInfo}
          onChange={(event) => { setAnimeInfo(event.target.value); setError(''); }}
          placeholder={'Nome do anime: Jujutsu Kaisen\nPersonagens principais: Yuji, Megumi e Nobara\nEnredo: escreva um resumo da história\nDestaques: cite algo marcante no anime'}
          maxLength={2000}
        />
        <div className="input-footer"><span>Use informações corretas sobre o anime.</span><span>{animeInfo.length}/2000</span></div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="generate-button" onClick={generate} type="button">GERAR LEGENDAS <span aria-hidden="true">↗</span></button>
      </section>
      {captions.length > 0 && (
        <section className="results" aria-live="polite">
          <div className="results-heading">
            <div><span className="step">02</span><h2>Três versões para seu perfil</h2></div>
            <span className="result-count">5 PARÁGRAFOS CADA</span>
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
      <footer className="footer"><span>LEGENDA ANIME © {new Date().getFullYear()}</span><span>CONTEÚDO PARA QUEM AMA ANIMES.</span></footer>
    </main>
  );
}
