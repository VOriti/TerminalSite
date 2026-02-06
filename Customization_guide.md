# Guida alla Personalizzazione di TerminalSite <a name="it"></a>

*([English version below](#en))*

# Struttura del progetto

TerminalSite è composto da pochi file essenziali, facilmente modificabili:

- `index.html`: struttura della pagina principale.
- `assets/main.js`: gestione logica del terminale.
- `assets/data.json`: testi mostrati (messaggi iniziali, comandi, risposte).
- `assets/style.css`: colori e stili grafici.
- `docs/`: cartella dove caricare i file scaricabili (curriculum, attestati, ecc.)
- `robots.txt` e `sitemap.xml`: indicazioni per i motori di ricerca.
- `startx.html`: versione GUI del sito.
- `README.md`, `CREDITS`, `LICENSE`: informazioni aggiuntive sul progetto.

# Modifica questi file

Per modificare questi file è sufficiente usare un qualsiasi editor di testo.

## Cambiare il nome utente nel prompt

La stringa `guest@oriti.net:~$` appare in tre posizioni:

- Titolo della pagina (`index.html`):

  ```html
  <title>guest@oriti.net:~$</title>
  ```

- Prompt iniziale (`index.html`):

  ```html
  <span class="prompt">guest@oriti.net:~$</span>
  ```

- Prompt JavaScript (`assets/main.js`):

  ```javascript
  line.innerHTML = "<span class='prompt'>guest@oriti.net:~$</span> <span class='typed'>" + command + "</span>";
  ```

Sostituisci `guest@oriti.net` con il tuo nome utente desiderato.

## Personalizzare i messaggi di avvio

I messaggi iniziali mostrati durante l’avvio si trovano in `assets/data.json` nell’array `bootLines`:

```json
"bootLines": [
  "[ OK ] Initializing BIOS...",
  "[ OK ] Checking system memory...",
  "[ OK ] Mounting virtual drive...",
  "[ OK ] Starting CTI engine...",
  "[ OK ] Loading PietroOS shell...",
  "[ OK ] Boot complete. Welcome.",
  "[ALERT] This is Vincenzo Oriti personal webpage for projects etc. <br> If you’ve left your hacker hat at home or just want to set your adventure level to 'easy', just type <b>startx</b> to load a normal website. Alas, just so you know, not all content will be available in noob-mode"
]
```

Puoi modificare, aggiungere o eliminare queste frasi.

## Gestire e personalizzare i comandi

I comandi e le relative risposte si trovano sempre in `assets/data.json` nell'oggetto `commands`:

```json
"commands": {
  "help": {"response": "Here are some commands: about, contact, clear, startx"},
  "contact": {"response": "<ul><li><a href='URL'>LinkedIn</a></li>...</ul>"},
  "startx": {"response": "<a href='LinkSito' target='_blank'>go to noob mode</a>"}
}
```

- Modifica le stringhe `response` per cambiare le risposte ai comandi esistenti.
- Aggiungi nuovi comandi seguendo lo schema:
  ```json
  "nuovoComando": {"response": "testo"}
  ```
- Aggiorna gli URL di `startx` sostituendo `LinkSito`.

## Aggiornare i link per motori di ricerca

- Nel file `robots.txt` modifica la riga sitemap:

  ```
  Sitemap: https://tuodominio.com/sitemap.xml
  ```

- In `sitemap.xml` cambia l’URL principale:

  ```xml
  <loc>https://tuodominio.com/</loc>
  ```

## Personalizzare l’aspetto

Le impostazioni grafiche sono definite in `assets/style.css`. Ad esempio:

```css
html, body {
  background-color: #000;
  font-family: 'Fira Code', monospace;
  color: #c7fdb5;
  font-size: 16px;
}
.prompt { color: #6fff57; }
.input { color: #ffffff; caret-color: #00ff00; }
```

Modifica colori e font secondo le tue preferenze.

## Visualizzare localmente il sito

Per visualizzare correttamente il sito è necessario avviare un piccolo server HTTP.
Ecco un esempio utilizzando Python 3:

```bash
python3 -m http.server
```

Una volta avviato, apri il browser all'indirizzo `http://localhost:8000`.

---

# TerminalSite Customization Guide <a name="en"></a>

*([Versione italiana sopra](#it))*

# Project Structure

TerminalSite includes a few essential files, easily customizable:

- `index.html`: main page structure.
- `assets/main.js`: terminal logic.
- `assets/data.json`: displayed texts (boot messages, commands, responses).
- `assets/style.css`: colors and visual styles.
- `docs/`: folder for downloadable files (resume, certificates, etc.).
- `robots.txt` and `sitemap.xml`: search engine guidelines.
- `startx.html`: GUI version of the site.
- `README.md`, `CREDITS`, `LICENSE`: additional project information.

# Modify 

You can modify these files using any text editor.

## Change Username in the Prompt

The string `guest@oriti.net:~$` appears in three places:

- Page title (`index.html`):

  ```html
  <title>guest@oriti.net:~$</title>
  ```

- Initial prompt (`index.html`):

  ```html
  <span class="prompt">guest@oriti.net:~$</span>
  ```

- JavaScript prompt (`assets/main.js`):

  ```javascript
  line.innerHTML = "<span class='prompt'>guest@oriti.net:~$</span> <span class='typed'>" + command + "</span>";
  ```

Replace `guest@oriti.net` with your desired username.

## Customize Boot Messages

Startup messages are in the `bootLines` array in `assets/data.json`:

```json
"bootLines": [
  "[ OK ] Initializing BIOS...",
  "[ OK ] Checking system memory...",
  "[ OK ] Mounting virtual drive...",
  "[ OK ] Starting CTI engine...",
  "[ OK ] Loading PietroOS shell...",
  "[ OK ] Boot complete. Welcome.",
  "[ALERT] This is Vincenzo Oriti personal webpage for projects etc. <br> If you’ve left your hacker hat at home or just want to set your adventure level to 'easy', just type <b>startx</b> to load a normal website. Alas, just so you know, not all content will be available in noob-mode"
]
```

Modify, add, or delete these lines.

## Manage and Customize Commands

Commands and their responses are located in `assets/data.json` under `commands`:

```json
"commands": {
  "help": {"response": "Here are some commands: about, contact, clear, startx"},
  "contact": {"response": "<ul><li><a href='URL'>LinkedIn</a></li>...</ul>"},
  "startx": {"response": "<a href='LinkSito' target='_blank'>go to noob mode</a>"}
}
```

- Modify existing responses by changing the `response` strings.
- Add new commands using:
  ```json
  "newCommand": {"response": "text"}
  ```
- Update URLs in `startx` by replacing `LinkSito`.

## Update Search Engine URLs

- In `robots.txt`, change the sitemap line:

  ```
  Sitemap: https://yourdomain.com/sitemap.xml
  ```

- In `sitemap.xml`, update the main URL:

  ```xml
  <loc>https://yourdomain.com/</loc>
  ```

## Customize Appearance

Edit colors and fonts in `assets/style.css`. For example:

```css
html, body { background-color: #000; font-family: 'Fira Code'; color: #c7fdb5; }
.prompt { color: #6fff57; }
.input { color: #ffffff; caret-color: #00ff00; }
```

## Viewing Locally

To preview the site, you need to run a small HTTP server first.
Here is an example using Python 3:

```bash
python3 -m http.server
```

After starting the server, open your browser at `http://localhost:8000`.
