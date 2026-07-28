
# Fyzika II

Webová aplikácia na podporu štúdia predmetu Fyzika II. Projekt kombinuje študijný obsah s interaktívnymi testami a umožňuje používateľovi prechádzať jednotlivé témy prehľadnou formou.

## Použité technológie

- React
- Vite
- Tailwind CSS
- React Router
- MathJax
- Docker
- nginx

## Spustenie projektu lokálne

Najprv je potrebné mať nainštalovaný Node.js a npm.

```bash
cd fyzika-ii-react
npm install
npm run dev
```

Aplikácia bude dostupná na adrese:

```text
http://localhost:3000
```

## Build projektu

```bash
npm run build
```

Výsledné súbory sa vytvoria v priečinku `dist`.

## Spustenie cez Docker

Projekt je možné spustiť aj bez manuálnej inštalácie závislostí. Stačí mať nainštalovaný Docker.

```bash
cd fyzika-ii-react
docker compose up --build
```

Aplikácia bude dostupná na adrese:

```text
http://localhost:8080
```

## Zastavenie Docker kontajnera

```bash
docker compose down
```

## Štruktúra projektu

```text
fyzika-ii-react/
├── public/              statické súbory
├── src/                 zdrojový kód aplikácie
│   ├── components/      znovupoužiteľné komponenty
│   ├── contexts/        kontexty aplikácie
│   ├── pages/           stránky aplikácie
│   ├── App.jsx          hlavná štruktúra aplikácie
│   └── main.jsx         vstupný bod aplikácie
├── Dockerfile           produkčný Docker build
├── docker-compose.yml   jednoduché spustenie cez Docker
├── nginx.conf           konfigurácia nginx servera
├── package.json         skripty a závislosti projektu
└── vite.config.js       konfigurácia Vite
```

## Dostupné npm skripty

```bash
npm run dev       # spustenie vývojového servera
npm run build     # vytvorenie produkčného buildu
npm run preview   # lokálny náhľad produkčného buildu
npm run lint      # kontrola kódu cez ESLint
```

## Nasadenie

Projekt má nastavenú cestu pre GitHub Pages. Pri bežnom deployi na GitHub Pages sa používa cesta `/Fizika2/`. Pri Docker spustení sa používa koreňová cesta `/`, aby aplikácia fungovala na `localhost:8080`.
