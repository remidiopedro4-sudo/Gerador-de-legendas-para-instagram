const instructions = `
Você é uma estrategista de conteúdo e redatora especialista em conexão humana para redes sociais, escrevendo em português brasileiro natural.

Sua tarefa é transformar a ideia do usuário em TRÊS legendas diferentes, fortes e memoráveis. A prioridade absoluta é fazer o leitor se reconhecer na mensagem — sentir que aquilo descreve algo que ele vive, pensa ou sente.

REGRAS OBRIGATÓRIAS:
- Cada legenda deve ter EXATAMENTE 5 parágrafos, separados por uma linha em branco.
- Cada parágrafo deve desenvolver uma etapa da mensagem, sem parecer uma fórmula engessada.
- Parágrafo 1: comece com uma observação, situação ou pensamento que prenda a atenção e gere reconhecimento imediato.
- Parágrafo 2: aprofunde a situação com detalhes humanos e específicos, sem inventar fatos sobre o leitor.
- Parágrafo 3: mostre a tensão, dúvida, contradição ou sentimento por trás da ideia.
- Parágrafo 4: apresente uma reflexão ou perspectiva que faça sentido e entregue valor real.
- Parágrafo 5: encerre com uma frase marcante e, quando couber, uma pergunta natural que convide a pessoa a comentar ou refletir.
- As três versões precisam ter abordagens realmente diferentes: uma de identificação, uma emocional/reflexiva e uma conversacional/direta.
- Escreva como uma pessoa inteligente conversando com outra pessoa, não como um robô, palestrante ou vendedor.
- Use frases simples, ritmo natural, vocabulário cotidiano e boa profundidade emocional.
- Seja específico à ideia recebida. Não use frases genéricas que poderiam servir para qualquer assunto.
- Não repita a frase original apenas para aumentar o texto: desenvolva o significado dela.
- Não force positividade, não dê sermão, não dramatize e não prometa resultados.
- Não invente histórias pessoais, experiências do autor, dados ou acontecimentos.
- Evite clichês e aberturas batidas como "nos dias de hoje", "a vida é feita de escolhas", "você já parou para pensar" e "nunca desista".
- Não adicione título, hashtags, emojis ou explicações fora das legendas.
- Preserve a intenção original do usuário, mesmo quando o assunto não for motivacional.
- Cada legenda deve ter extensão suficiente para cinco parágrafos consistentes, sem enrolação.
`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'A inteligência artificial ainda não foi conectada. Adicione a variável OPENAI_API_KEY nas configurações do projeto na Vercel.'
    });
  }

  const phrase = typeof req.body?.phrase === 'string' ? req.body.phrase.trim() : '';
  if (!phrase) return res.status(400).json({ error: 'Digite uma frase ou ideia.' });
  if (phrase.length > 1000) return res.status(400).json({ error: 'Sua ideia deve ter no máximo 1.000 caracteres.' });

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5.5',
        instructions,
        input: `Crie as três legendas a partir desta ideia do usuário. Não mude o assunto central:\n\n${phrase}`,
        max_output_tokens: 2600,
        text: {
          format: {
            type: 'json_schema',
            name: 'instagram_captions',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                captions: {
                  type: 'array',
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: 'object',
                    properties: {
                      label: { type: 'string', enum: ['Identificação', 'Emocional', 'Conversacional'] },
                      text: { type: 'string' }
                    },
                    required: ['label', 'text'],
                    additionalProperties: false
                  }
                }
              },
              required: ['captions'],
              additionalProperties: false
            }
          }
        }
      })
    });

    const result = await aiResponse.json();
    if (!aiResponse.ok) {
      console.error('OpenAI API error:', result.error?.message || aiResponse.status);
      if (aiResponse.status === 401) return res.status(502).json({ error: 'A chave da inteligência artificial está inválida. Confira OPENAI_API_KEY na Vercel.' });
      if (aiResponse.status === 429) return res.status(429).json({ error: 'A IA está temporariamente ocupada ou sem saldo disponível. Tente novamente em instantes.' });
      return res.status(502).json({ error: 'A inteligência artificial não conseguiu responder agora. Tente novamente.' });
    }

    const outputText = result.output
      ?.flatMap((item) => item.content || [])
      .find((item) => item.type === 'output_text')?.text;

    if (!outputText) throw new Error('A resposta da IA veio vazia.');

    const parsed = JSON.parse(outputText);
    const captions = parsed.captions;

    if (!Array.isArray(captions) || captions.length !== 3) {
      throw new Error('A IA não retornou as três versões esperadas.');
    }

    const normalized = captions.map((caption, index) => {
      const paragraphs = String(caption.text || '').trim().split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
      if (paragraphs.length !== 5) throw new Error(`A versão ${index + 1} não contém exatamente cinco parágrafos.`);
      return { label: caption.label, text: paragraphs.join('\n\n') };
    });

    return res.status(200).json({ captions: normalized });
  } catch (error) {
    console.error('Caption generation error:', error);
    return res.status(502).json({ error: 'Não foi possível montar as legendas agora. Tente gerar novamente.' });
  }
}
