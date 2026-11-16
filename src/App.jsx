import { useState } from 'react';

const animeCatalog = [
  {
    title: 'Jujutsu Kaisen',
    aliases: ['jujutsu'],
    characters: 'Yuji Itadori, Megumi Fushiguro, Nobara Kugisaki e Satoru Gojo',
    plot: 'Yuji Itadori acaba envolvido no mundo das maldições depois de entrar em contato com um objeto amaldiçoado. Para proteger outras pessoas, ele passa a estudar na Escola Técnica de Jujutsu de Tóquio.',
    highlights: 'as batalhas contra maldições, as técnicas especiais e os conflitos entre feiticeiros'
  },
  {
    title: 'Naruto',
    aliases: ['naruto clássico'],
    characters: 'Naruto Uzumaki, Sasuke Uchiha, Sakura Haruno e Kakashi Hatake',
    plot: 'Naruto é um jovem ninja que sonha em se tornar Hokage e conquistar o respeito da Vila da Folha. Ao lado de seus companheiros, enfrenta missões, rivais e desafios que colocam sua determinação à prova.',
    highlights: 'a jornada de crescimento de Naruto, os laços entre os personagens e as batalhas ninja'
  },
  {
    title: 'One Piece',
    aliases: ['onepiece'],
    characters: 'Monkey D. Luffy, Roronoa Zoro, Nami, Usopp e Sanji',
    plot: 'Monkey D. Luffy parte em uma grande aventura pelos mares para encontrar o lendário tesouro One Piece e se tornar o Rei dos Piratas. Durante a viagem, reúne companheiros e enfrenta diferentes inimigos.',
    highlights: 'a construção do mundo, as aventuras da tripulação e os mistérios espalhados pela história'
  },
  {
    title: 'Demon Slayer',
    aliases: ['kimetsu no yaiba'],
    characters: 'Tanjiro Kamado, Nezuko Kamado, Zenitsu Agatsuma e Inosuke Hashibira',
    plot: 'Depois que sua família é atacada por demônios e sua irmã Nezuko é transformada, Tanjiro entra para o Esquadrão de Caçadores de Demônios em busca de uma forma de ajudá-la.',
    highlights: 'a animação das lutas, as técnicas de respiração e a relação entre Tanjiro e Nezuko'
  },
  {
    title: 'Attack on Titan',
    aliases: ['shingeki no kyojin', 'ataque dos titãs'],
    characters: 'Eren Yeager, Mikasa Ackerman, Armin Arlert e Levi Ackerman',
    plot: 'A humanidade vive protegida por enormes muralhas para escapar dos titãs. Depois de uma tragédia, Eren, Mikasa e Armin entram em uma luta para descobrir a verdade sobre essas criaturas e o mundo em que vivem.',
    highlights: 'os mistérios da história, as reviravoltas e os conflitos sobre liberdade e sobrevivência'
  },
  {
    title: 'Tokyo Ghoul',
    aliases: ['tokyo ghol', 'tokyo ghoul'],
    characters: 'Ken Kaneki, Touka Kirishima, Rize Kamishiro e Kishou Arima',
    plot: 'Ken Kaneki tem sua vida transformada após um encontro que o deixa entre o mundo dos humanos e o dos ghouls, criaturas que precisam consumir carne humana para sobreviver.',
    highlights: 'o conflito de identidade de Kaneki, a tensão entre humanos e ghouls e o clima sombrio'
  },
  {
    title: 'Death Note',
    aliases: ['deathnote'],
    characters: 'Light Yagami, L, Misa Amane e Ryuk',
    plot: 'Light Yagami encontra um caderno capaz de matar qualquer pessoa cujo nome seja escrito nele. Ao usar o caderno para tentar criar um mundo sem criminosos, passa a ser perseguido pelo detetive L.',
    highlights: 'o duelo de inteligência entre Light e L, os planos e as escolhas morais dos personagens'
  },
  {
    title: 'Dragon Ball Z',
    aliases: ['dragon ball', 'dbz'],
    characters: 'Goku, Vegeta, Gohan, Piccolo e Trunks',
    plot: 'Goku e seus aliados enfrentam ameaças cada vez maiores que colocam a Terra e outros mundos em perigo. A história acompanha treinamentos, novas transformações e batalhas decisivas.',
    highlights: 'as lutas marcantes, as transformações e a evolução dos guerreiros'
  },
  {
    title: 'My Hero Academia',
    aliases: ['boku no hero academia', 'bnha'],
    characters: 'Izuku Midoriya, Katsuki Bakugo, Shoto Todoroki e All Might',
    plot: 'Em um mundo onde a maioria das pessoas nasce com poderes especiais, Izuku Midoriya sonha em ser um herói, mesmo tendo nascido sem uma individualidade. Sua vida muda quando recebe uma oportunidade de seguir esse caminho.',
    highlights: 'o desenvolvimento dos alunos, os poderes e os desafios da formação de novos heróis'
  },
  {
    title: 'Chainsaw Man',
    aliases: ['chainsawman'],
    characters: 'Denji, Pochita, Makima, Power e Aki Hayakawa',
    plot: 'Denji vive endividado e trabalha como caçador de demônios ao lado de Pochita. Após um acontecimento decisivo, ele ganha novos poderes e passa a fazer parte de uma organização de caçadores.',
    highlights: 'o estilo visual, os demônios e a mistura de ação com momentos inesperados'
  },
  {
    title: 'Hunter x Hunter',
    aliases: ['hxh'],
    characters: 'Gon Freecss, Killua Zoldyck, Kurapika e Leorio',
    plot: 'Gon parte em uma jornada para se tornar Hunter e encontrar seu pai. No caminho, conhece companheiros, enfrenta provas perigosas e descobre um mundo cheio de desafios.',
    highlights: 'o sistema de Nen, as estratégias nas batalhas e o desenvolvimento dos personagens'
  },
  {
    title: 'Bleach',
    aliases: [],
    characters: 'Ichigo Kurosaki, Rukia Kuchiki, Orihime Inoue e Uryu Ishida',
    plot: 'Ichigo Kurosaki ganha poderes de Shinigami e passa a proteger pessoas de espíritos perigosos conhecidos como Hollows. Sua jornada o leva a enfrentar ameaças de diferentes mundos.',
    highlights: 'as batalhas com espadas, as habilidades dos personagens e os diferentes grupos espirituais'
  },
  {
    title: 'Fullmetal Alchemist: Brotherhood',
    aliases: ['fullmetal alchemist', 'fmab'],
    characters: 'Edward Elric, Alphonse Elric, Winry Rockbell e Roy Mustang',
    plot: 'Os irmãos Edward e Alphonse Elric partem em busca da Pedra Filosofal depois de uma tentativa de alquimia que mudou suas vidas. Durante a jornada, descobrem segredos que envolvem todo o país.',
    highlights: 'o uso da alquimia, a relação entre os irmãos e os temas de consequência e sacrifício'
  },
  {
    title: 'One Punch Man',
    aliases: ['onepunchman'],
    characters: 'Saitama, Genos, King e Tornado do Terror',
    plot: 'Saitama é um herói tão forte que derrota seus inimigos com um único soco. Mesmo com esse poder, ele procura desafios e reconhecimento em um mundo cheio de heróis e monstros.',
    highlights: 'o humor, as lutas exageradas e a forma diferente como a história apresenta os heróis'
  },
  {
    title: 'Spy x Family',
    aliases: ['spy family'],
    characters: 'Loid Forger, Yor Forger, Anya Forger e Bond',
    plot: 'Um espião precisa formar uma família falsa para cumprir uma missão. Sem saber os segredos uns dos outros, Loid, Yor e Anya começam a viver situações que misturam espionagem, ação e vida em família.',
    highlights: 'o humor, os segredos da família Forger e a relação entre os personagens'
  },
  {
    title: 'Haikyuu!!',
    aliases: ['haikyuu'],
    characters: 'Shoyo Hinata, Tobio Kageyama, Kei Tsukishima e Yu Nishinoya',
    plot: 'Shoyo Hinata decide seguir seu sonho de jogar vôlei e entra para o colégio Karasuno. Lá, precisa aprender a trabalhar em equipe e superar adversários cada vez mais fortes.',
    highlights: 'as partidas intensas, o trabalho em equipe e a evolução dos jogadores'
  },
  {
    title: 'Blue Lock',
    aliases: [],
    characters: 'Yoichi Isagi, Meguru Bachira, Rin Itoshi e Seishiro Nagi',
    plot: 'Jovens atacantes participam de um projeto criado para encontrar o maior goleador do Japão. Isagi precisa competir e desenvolver seu próprio estilo para continuar no programa.',
    highlights: 'a competição entre jogadores, as estratégias em campo e a busca pelo melhor atacante'
  },
  {
    title: 'Solo Leveling',
    aliases: ['ore dake level up na ken'],
    characters: 'Sung Jinwoo, Cha Hae-In, Yoo Jinho e Go Gunhee',
    plot: 'Em um mundo onde portais ligam a realidade a masmorras cheias de monstros, Sung Jinwoo é conhecido como um caçador muito fraco. Depois de uma missão perigosa, recebe a capacidade de evoluir por meio de um sistema misterioso.',
    highlights: 'a evolução de Jinwoo, as batalhas nas masmorras e o sistema de níveis'
  },
  {
    title: 'Black Clover',
    aliases: [],
    characters: 'Asta, Yuno, Noelle Silva e Yami Sukehiro',
    plot: 'Em um mundo onde a magia faz parte da vida, Asta nasce sem poderes mágicos, mas sonha em se tornar o Rei Mago. Ao lado de Yuno, segue uma jornada cheia de desafios e disputas.',
    highlights: 'a determinação de Asta, os esquadrões mágicos e as batalhas em equipe'
  },
  {
    title: 'Vinland Saga',
    aliases: [],
    characters: 'Thorfinn, Askeladd, Canute e Thors',
    plot: 'Em meio à era dos vikings, Thorfinn cresce em um cenário de guerras e conflitos. Sua trajetória é marcada por perdas, escolhas difíceis e pela busca de um sentido para sua vida.',
    highlights: 'o desenvolvimento de Thorfinn, o contexto histórico e as reflexões sobre violência e vingança'
  }
];

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function findAnime(input) {
  const query = normalize(input);
  return animeCatalog.find((anime) =>
    [anime.title, ...anime.aliases].some((name) => normalize(name) === query)
  );
}

function generateCaption(anime) {
  return [
    'Nome: ' + anime.title,
    'Personagens principais: ' + anime.characters + '.',
    'Enredo: ' + anime.plot,
    'Destaques: ' + anime.highlights + '.',
    'Siga o perfil para acompanhar mais animes, personagens e histórias.'
  ].join('\\n\\n');
}

export default function App() {
  const [animeName, setAnimeName] = useState('');
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(-1);
  const [error, setError] = useState('');

  function generate() {
    if (!animeName.trim()) {
      setError('Digite o nome de um anime.');
      setCaption('');
      return;
    }

    const anime = findAnime(animeName);
    if (!anime) {
      setError('Esse anime ainda não está no catálogo. Peça para adicionarmos esse título.');
      setCaption([]);
      return;
    }

    setError('');
    setCopied(-1);
    setCaption(generateCaption(anime));
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
        <p className="hero-copy">Digite apenas o nome do anime e receba legendas prontas para publicar no seu perfil.</p>
      </section>
      <section className="generator-panel" aria-label="Gerador de legendas de animes">
        <div className="panel-heading">
          <div><span className="step">01</span><h2>Qual é o anime?</h2></div>
          <span className="optional">APENAS O NOME</span>
        </div>
        <label htmlFor="anime-name">NOME DO ANIME</label>
        <input
          id="anime-name"
          type="text"
          value={animeName}
          onChange={(event) => { setAnimeName(event.target.value); setError(''); }}
          onKeyDown={(event) => { if (event.key === 'Enter') generate(); }}
          placeholder="Ex.: Jujutsu Kaisen"
          maxLength={100}
        />
        <div className="input-footer"><span>O gerador busca as informações no catálogo interno.</span><span>{animeName.length}/100</span></div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="generate-button" onClick={generate} type="button">GERAR LEGENDA <span aria-hidden="true">↗</span></button>
      </section>
      {caption && (
        <section className="results" aria-live="polite">
          <div className="results-heading">
            <div><span className="step">02</span><h2>Sua legenda está pronta</h2></div>
            <span className="result-count">UMA LEGENDA</span>
          </div>
          <div className="caption-grid">
            <article className="caption-card">
              <div className="card-top"><span className="card-number">01</span><span className="card-label">LEGENDA</span></div>
              <p className="caption-text">{caption}</p>
              <div className="paragraph-count">LEGENDA COMPLETA</div>
              <button className={copied === 0 ? 'copy-button copied' : 'copy-button'} onClick={() => copyCaption(caption, 0)} type="button">
                {copied === 0 ? 'COPIADO ✓' : 'COPIAR LEGENDA ↗'}
              </button>
            </article>
          </div>
        </section>
      )}
      <footer className="footer"><span>LEGENDA ANIME © {new Date().getFullYear()}</span><span>CONTEÚDO PARA QUEM AMA ANIMES.</span></footer>
    </main>
  );
}
