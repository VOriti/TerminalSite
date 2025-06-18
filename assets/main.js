    
    const bootScreen = document.getElementById("boot-screen");
    const terminal = document.getElementById("terminal");

    const bootLines = [
      "[ OK ] Initializing BIOS...",
      "[ OK ] Checking system memory...",
      "[ OK ] Mounting virtual drive...",
      "[ OK ] Starting CTI engine...",
      "[ OK ] Loading OritiOS shell...",
      "[ OK ] Boot complete. Welcome.",
      "[ERROR] You are not the Admin, you will be logged in as a limited guest user.",
      "[ALERT] This is Vincenzo Oriti personal webpage for projects etc. <br> If you’ve left your hacker hat at home or just want to set your adventure level to 'easy', just type <b>startx</b> in the console below to load a normal website. Alas, just so you know, not all content will be available in noob-mode"
    ];

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

    const inputDiv = document.getElementById("input");
    
    const outputDiv = document.getElementById("output");
    let history = [];
    let historyIndex = -1;

    
    const commands = {
      help: {
        response:
          "Here are some of the available commands: about, talks, interviews, courses, publications, podcasts, contact, clear, startx",
        autoopen: false,
      },
      about: { response: "EXAMPLE-TEXT", autoopen: false },
      talks: {
        response:
          "<ul><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li></ul>",
        autoopen: false,
      },
      interviews: {
        response:
          "<ul><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li></ul>",
        autoopen: false,
      },
      courses: {
        response:
          "<ul><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li></ul>",
        autoopen: false,
      },
      publications: {
        response:
          "<ul><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li></ul>",
        autoopen: false,
      },
      podcasts: {
        response:
          "<ul><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li><li><a href='https://EXAMPLE-LINK' target='_blank'>example link</a></li></ul>",
        autoopen: false,
      },
      contact: {
        response:
          "<ul><li><a href='https://www.linkedin.com/in/vincenzo-oriti/' target='_blank'>LinkedIn</a></li><li><a href='https://github.com/VOriti' target='_blank'>GitHub</a></li><li><a href='mailto:vincenzo@oriti.net'>Email</a></li></ul>",
        autoopen: false,
      },
      clear: { response: "__CLEAR__", autoopen: false },
      startx: {
        response: "<a href='LinkSito' target='_blank'>go to noob mode</a>",
        autoopen: false,
      },
    };


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

        if (commands[command]) {
          const { response, autoopen } = commands[command];
          if (response === "__CLEAR__") {
            outputDiv.innerHTML = "";
          } else {
            const out = document.createElement("div");
            out.className = "response";
            out.innerHTML = response;
            outputDiv.appendChild(out);
            if (autoopen) {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = response;
              const link = tempDiv.querySelector("a");
              if (link && link.href) {
                window.open(link.href, "_blank");
              }
            }
          }
        } else {
          const err = document.createElement("div");
          err.className = "response text-danger";
          err.innerText = "Command not found: " + command;
          outputDiv.appendChild(err);
        }

        inputDiv.innerText = "";
        <!-- uncomment the line below to make the window scroll until the boot-lines are covered after the first command is inserted -->
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
