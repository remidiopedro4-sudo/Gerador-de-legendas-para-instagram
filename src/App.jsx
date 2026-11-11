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

  const openings = {
    Identificação: [
      'Tem coisa que a gente só entende de verdade quando passa por ela.',
      'Às vezes, uma frase consegue explicar algo que a gente sente, mas não sabe colocar em palavras.',
      'Quem já viveu uma situação parecida provavelmente vai entender o peso dessa mensagem.',
      'Nem sempre é fácil encontrar palavras para descrever certas experiências.'
    ],
    Emocional: [
      'Algumas mensagens fazem a gente parar por um instante e olhar para dentro.',
      'Por trás de uma frase simples, pode existir um sentimento que muita gente guarda em silêncio.',
      'Tem momentos em que tudo o que precisamos é encontrar palavras que façam sentido para o que estamos vivendo.',
      'Nem tudo o que sentimos aparece por fora, e algumas mensagens lembram exatamente disso.'
    ],
    Conversacional: [
      'Pensa comigo: quantas vezes você já se identificou com uma frase assim?',
      'Essa mensagem merece uma reflexão, principalmente quando a gente traz o assunto para a vida real.',
      'É interessante como uma frase pode despertar interpretações diferentes em cada pessoa.',
      'Agora, olha para essa mensagem e pensa em como ela se conecta com o seu dia a dia.'
    ]
  };

  const developments = {
    Identificação: [
      'Na prática, isso aparece em pequenas situações do cotidiano, nas escolhas, nas dúvidas e nas experiências que nem sempre compartilhamos com alguém.',
      'Muitas pessoas passam por isso sem perceber que não estão sozinhas. Cada história é diferente, mas alguns sentimentos são mais comuns do que parecem.',
      'Às vezes, a gente se cobra por não estar no mesmo ritmo dos outros e esquece que cada pessoa enfrenta uma realidade diferente.',
      'É justamente nos detalhes da rotina que essa mensagem ganha significado, porque nem sempre aquilo que parece simples é fácil de viver.'
    ],
    Emocional: [
      'Existem dias leves e outros em que seguir em frente exige mais força do que as pessoas imaginam. E nem todo processo precisa ser explicado para ser verdadeiro.',
      'Cada pessoa carrega experiências que não aparecem em uma foto ou em uma publicação. Por isso, respeitar o próprio momento também é importante.',
      'O que acontece por dentro nem sempre acompanha o que mostramos por fora. Reconhecer isso é uma forma de olhar para si com mais sinceridade.',
      'Nem sempre temos todas as respostas. Às vezes, o primeiro passo é reconhecer o que estamos sentindo e entender o que essa experiência está ensinando.'
    ],
    Conversacional: [
      'No dia a dia, isso pode aparecer de várias maneiras. O contexto muda, as experiências mudam, mas a reflexão continua fazendo sentido.',
      'Cada pessoa pode enxergar essa mensagem de um jeito, dependendo do que já viveu e do momento em que está agora.',
      'Não existe uma única forma de lidar com esse assunto. O importante é perceber como ele aparece nas nossas atitudes e escolhas.',
      'Talvez você concorde, talvez tenha outra visão. E é justamente por isso que vale conversar sobre o assunto.'
    ]
  };

  const reflections = [
    'No fim, não é sobre comparar a sua caminhada com a de alguém, mas entender o que faz sentido para a sua realidade.',
    'O mais importante é transformar essa reflexão em algo que tenha significado na sua própria vida.',
    'Às vezes, mudar a forma de enxergar uma situação já é um começo importante.',
    'Cada experiência deixa um aprendizado, mesmo quando a gente só consegue compreender isso algum tempo depois.'
  ];

  const callsToAction = {
    Identificação: [
      'Se você se identificou, compartilhe esta publicação com alguém que também pode se reconhecer nessa mensagem.',
      'Se essa frase descreve algo que você já viveu, deixe sua experiência nos comentários.',
      'Marque alguém que precisava encontrar essa mensagem hoje.'
    ],
    Emocional: [
      'Guarde esta mensagem para reler quando precisar se lembrar disso.',
      'Se tocou você de alguma forma, compartilhe com alguém especial.',
      'Às vezes, alguém precisa ler exatamente isso. Envie esta publicação.'
    ],
    Conversacional: [
      'E você, como interpreta essa mensagem? Conta nos comentários.',
      'Você concorda com essa reflexão ou enxerga de outra maneira?',
      'Quero saber sua opinião: isso faz sentido na sua vida?'
    ]
  };

  return [
    quoted,
    pick(openings[style]),
    pick(developments[style]),
    pick(reflections),
    pick(callsToAction[style])
  ].join('\n\n');
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
