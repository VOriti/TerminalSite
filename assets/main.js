(async function() {
  const bootScreen = document.getElementById("boot-screen");
  const terminal = document.getElementById("terminal");
  const inputDiv = document.getElementById("input");
  const outputDiv = document.getElementById("output");

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
      setTimeout(typeBoot, 400);
    } else {
      terminal.classList.remove("d-none");
      document.getElementById("input").focus();
    }
  }
  setTimeout(typeBoot, 500);

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

      if (command === "clear") {
        outputDiv.innerHTML = "";
      } else if (cmdData) {
        const response = cmdData.response;
        if (response !== "__CLEAR__") {
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
