# Music Tracker (app)

Aplicativo que registra as músicas que você ouve e mostra as suas favoritas. Ele usa a [Music Tracker API](https://github.com/cofeezz/MusicTrackerApi), que já está no ar, então não precisa de servidor próprio.

Feito com React Native e Expo, em JavaScript (`.js` e `.jsx`).

## O que o app faz

- **Criar conta e entrar.** Ao entrar, o app pega uma chave de acesso na API e usa nas próximas chamadas. Ao sair, a chave é revogada.
- **Escutar.** Você busca uma música pelo nome ou cadastra uma nova (artista, música e gênero) e registra quanto tempo ouviu.
- **Ranking.** Mostra as suas faixas mais ouvidas, de sempre ou do mês, com posição, número de vezes e minutos.

## Como rodar

Você precisa do [Node.js](https://nodejs.org) (versão 20 ou mais nova).

```bash
npm install
npx expo start
```

Depois, escolha como abrir:

- **No celular:** instale o app **Expo Go** (Android ou iPhone), deixe o celular na mesma rede Wi-Fi do computador e leia o QR code que aparece no terminal.
- **No navegador:** pressione `w` no terminal, ou rode `npm run web`.

## Servidor da API

O endereço da API fica em `src/config.js`:

```js
export const API_URL = 'https://musictrackerapi-hgj1.onrender.com';
```

Para usar uma API local, troque pelo endereço dela. No celular, use o IP do computador na rede (por exemplo `http://192.168.0.10:8080`), e não `localhost`.

Duas coisas para saber sobre o servidor gratuito:

- Ele dorme depois de 15 minutos sem uso. A primeira ação depois disso pode levar cerca de 1 minuto.
- Os dados ficam em memória. Se o servidor reiniciar, as contas somem. O app avisa e pede para entrar de novo.

## Como o projeto está organizado

```
App.js                  controla a sessão, as abas e as chamadas à API
src/config.js           endereço da API
src/api.js              todas as chamadas à API em um só lugar
src/theme.js            cores, espaçamentos e bordas
src/components/         seções e peças de tela
  AuthSection.jsx       entrar / criar conta
  ListenSection.jsx     buscar, cadastrar e registrar uma escuta
  RankingSection.jsx    ranking pessoal
  Section.jsx, Header.jsx, TabBar.jsx, Button.jsx, TextField.jsx,
  Chips.jsx, Message.jsx, TrackItem.jsx, RankingItem.jsx
```

Cada seção é um componente que recebe o conteúdo por props (`title`, `subtitle`, listas e funções). A estilização usa `StyleSheet` e Flexbox, sem bibliotecas de interface.

## Limitações atuais

- A sessão fica só em memória: ao fechar o app, é preciso entrar de novo.
- O cadastro de música cria um artista novo a cada vez, então o mesmo artista pode aparecer repetido.
- A captura automática das músicas tocadas no celular ainda não existe. Por enquanto o registro é manual.
