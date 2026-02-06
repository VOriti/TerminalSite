(async function() {
  const bootScreen = document.getElementById("boot-screen");
  const terminal = document.getElementById("terminal");
  const inputDiv = document.getElementById("input");
  const outputDiv = document.getElementById("output");
  const matrixCanvas = document.getElementById("matrix-canvas");
  const ctx = matrixCanvas.getContext("2d");

  let history = [];
  let historyIndex = -1;

  const response = await fetch("assets/data.json");
  const data = await response.json();
  const bootLines = data.bootLines || [];
  const commands = data.commands || {};
  const keywordResponses = data.keywordResponses || {};
  const defaultAutoOpen = data.autoOpen ?? false;

  function openLinkFromResponse(resp) {
    const tmp = document.createElement('div');
    tmp.innerHTML = resp;
    const a = tmp.querySelector('a');
    if (a && a.href) {
      window.open(a.href, '_blank');
    }
  }

  function startMatrix() {
    terminal.classList.add("d-none");
    matrixCanvas.classList.remove("d-none");
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);

    const stop = () => {
      clearInterval(interval);
      matrixCanvas.classList.add("d-none");
      terminal.classList.remove("d-none");
      inputDiv.focus();
      window.removeEventListener("keydown", stop);
      window.removeEventListener("click", stop);
    };

    // Ritardo per evitare che l'Invio premuto per lanciare il comando fermi subito l'animazione
    setTimeout(() => {
      window.addEventListener("keydown", stop);
      window.addEventListener("click", stop);
    }, 500);
  }

  let i = 0;
  function typeBoot() {
    if (i < bootLines.length) {
      const line = bootLines[i];
      let colorClass = "";
      if (line.startsWith("[ OK ]")) {
        colorClass = "text-success";
      } else if (line.startsWith("[ALERT]")) {
        colorClass = "text-warning";
      } else if (line.startsWith("[ERROR]")) {
        colorClass = "text-danger";
      }
      bootScreen.innerHTML += `<span class="${colorClass}">${line}</span><br/>`;
      i++;
      setTimeout(typeBoot, 200);
    } else {
      terminal.classList.remove("d-none");
      document.getElementById("input").focus();
    }
  }

  // Check if we are returning from startx (restore mode)
  const urlParams = new URLSearchParams(window.location.search);
  const isRestoreMode = urlParams.get('restore') === 'true';

  if (isRestoreMode) {
    const savedStateRaw = localStorage.getItem("terminalState");
    if (savedStateRaw) {
      const savedState = JSON.parse(savedStateRaw);
      history = savedState.history || [];
      historyIndex = history.length;
      outputDiv.innerHTML = savedState.output || "";
      terminal.classList.remove("d-none");
      bootScreen.style.display = "none"; // Nasconde esplicitamente il boot screen
      console.log("Sessione ripristinata con successo.");
    } else { 
      console.warn("Parametro restore trovato, ma nessun dato salvato in localStorage.");
      setTimeout(typeBoot, 500); 
    }
  } else {
    console.log("Nuova sessione: pulizia localStorage.");
    localStorage.removeItem("terminalState"); 
    setTimeout(typeBoot, 500);
  }

  inputDiv.focus();
  document.addEventListener("click", () => inputDiv.focus());

  inputDiv.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = inputDiv.innerText.trim();
      if (!command) return;

      history.push(command);
      historyIndex = history.length;

      const line = document.createElement("div");
      line.innerHTML = "<span class='prompt'>guest@oriti.net:~$</span> <span class='typed'>" + command + "</span>";
      outputDiv.appendChild(line);


      const cmdData = commands[command];
      if (cmdData && (cmdData.autoOpen ?? defaultAutoOpen)) {
        openLinkFromResponse(cmdData.response);
      }

      if (cmdData) {
        const response = cmdData.response;
        if (response === "__CLEAR__") {
          outputDiv.innerHTML = "";
          const out = document.createElement("div");
          out.className = "response text-success";
          out.innerText = "Screen cleared.";
          outputDiv.appendChild(out);
        } else if (response === "__HISTORY_CLEAR__") {
          history = [];
          historyIndex = -1;
          const out = document.createElement("div");
          out.className = "response text-success";
          out.innerText = "Command history cleared from memory.";
          outputDiv.appendChild(out);
        } else if (response === "__REBOOT__") {
          const out = document.createElement("div");
          out.className = "response text-warning";
          out.innerText = "Rebooting...";
          outputDiv.appendChild(out);
          inputDiv.parentElement.classList.add("d-none");
          setTimeout(() => window.location.href = window.location.href.split('?')[0], 1000);
        } else if (response === "__MATRIX__") {
          startMatrix();
        } else {
          const out = document.createElement("div");
          out.className = "response";
          out.innerHTML = response;
          outputDiv.appendChild(out);
        }
      } else {
        const keyword = Object.keys(keywordResponses).find(k => command.includes(k));
        if (keyword) {
          const warn = document.createElement("div");
          warn.className = "response text-warning";
          warn.innerHTML = keywordResponses[keyword];
          outputDiv.appendChild(warn);

          const baseCommand = command.replace(keyword, "").trim();
          const baseData = commands[baseCommand];
          if (baseData) {
            if (baseData.autoOpen ?? defaultAutoOpen) {
              openLinkFromResponse(baseData.response);
            }
            if (baseCommand === "clear") {
              outputDiv.innerHTML = "";
            }
            const resp = baseData.response;
            if (resp !== "__CLEAR__") {
              const out = document.createElement("div");
              out.className = "response";
              out.innerHTML = resp;
              outputDiv.appendChild(out);
            }
          } else {
            const err = document.createElement("div");
            err.className = "response text-danger";
            err.innerText = "Command not found: " + command;
            outputDiv.appendChild(err);
          }
        } else {
          const err = document.createElement("div");
          err.className = "response text-danger";
          err.innerText = "Command not found: " + command;
          outputDiv.appendChild(err);
        }
      }

      inputDiv.innerText = "";
      
      // Save state to localStorage for restoration
      localStorage.setItem("terminalState", JSON.stringify({
        history: history,
        output: outputDiv.innerHTML
      }));

      // window.scrollTo(0, document.body.scrollHeight);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        inputDiv.innerText = history[historyIndex];
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputDiv.innerText = history[historyIndex];
      } else {
        inputDiv.innerText = "";
      }
    }
  });
})();
