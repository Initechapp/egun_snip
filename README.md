# eGun Sniper – Chrome Extension

Rozszerzenie do przeglądarki Chrome/Vivaldi umożliwiające automatyczne składanie ofert na końcówce aukcji w serwisie
[eGun.de](https://www.egun.de).

## Instalacja

1. Pobierz lub sklonuj to repozytorium.
2. Otwórz `chrome://extensions` w przeglądarce.
3. Włącz **Tryb deweloperski**.
4. Wybierz **Załaduj rozpakowane** i wskaż folder z tym projektem.
5. Ikona rozszerzenia pojawi się w pasku narzędzi – kliknij aby otworzyć popup i zalogować się.

## Ostrzeżenie bezpieczeństwa

Dane logowania przechowywane są lokalnie i kodowane jedynie w Base64, co **nie stanowi szyfrowania**. Używaj na własne ryzyko i nie instaluj rozszerzenia na niezaufanych komputerach.

## Struktura

```
manifest.json
background.js
content.js
popup.html
popup.js
popup.css
sniperEngine.js
utils.js
storage.js
README.md
```

Rozszerzenie nie korzysta z API eGun – komunikacja odbywa się poprzez zapytania HTTP i scraping HTML.
