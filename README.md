# Legenda — Gerador inteligente de legendas para Instagram

Aplicação React + Vite que usa a OpenAI Responses API para transformar uma frase ou ideia em três legendas originais, cada uma com exatamente cinco parágrafos.

## Executar localmente

```bash
npm install
npm run dev
```

Para testar a função de geração localmente, use a Vercel CLI (`vercel dev`) e configure a variável de ambiente `OPENAI_API_KEY`.

## Configuração na Vercel

No projeto, abra **Settings → Environment Variables** e adicione:

- Nome: `OPENAI_API_KEY`
- Valor: sua chave secreta da API da OpenAI
- Ambientes: Production, Preview e Development, conforme necessário.

Depois, faça um novo deploy. Nunca coloque a chave no código do navegador ou no repositório.

## Build

```bash
npm run build
```

A geração usa a API da OpenAI no servidor, mantendo a chave fora do navegador. O uso da API pode gerar custos conforme a conta e o consumo.
