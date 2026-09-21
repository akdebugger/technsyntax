/* ==========================================================================
   Tech'nSyntax — AI Chatbot Assistant (Contact Page)
   Direct n8n Webhook Integration, Session Persistence, XSS Boundary
   ========================================================================== */

(function () {
  "use strict";

  const N8N_WEBHOOK_URL = "https://anaskhannothing.app.n8n.cloud/webhook/technsyntax-chat";
  const SESSION_STORAGE_KEY = "technsyntax_chat_session";
  const HISTORY_STORAGE_KEY = "technsyntax_chat_history";
  const MAX_HISTORY = 50;
  const REQUEST_TIMEOUT_MS = 30000;
  const THROTTLE_MS = 1000;

  // DOM container check: silent exit if not on contact page
  const chatContainer = document.getElementById("ai-chat");
  if (!chatContainer) {
    return;
  }

  const chatLog = chatContainer.querySelector(".ai-chat__log");
  const chatInput = chatContainer.querySelector(".ai-chat__textarea");
  const sendBtn = chatContainer.querySelector(".ai-chat__send-btn");
  const charCounter = chatContainer.querySelector(".char-counter");
  const chipsContainer = chatContainer.querySelector(".ai-chat__chips");

  if (!chatLog || !chatInput || !sendBtn) {
    return;
  }

  let inFlight = false;
  let lastSendTime = 0;
  let chatTranscript = [];

  /* --------------------------------------------------------------------------
     1. Session ID Management
     -------------------------------------------------------------------------- */
  function getSessionId() {
    let sId = null;
    try {
      sId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch (e) {
      // Ignore private mode errors
    }

    if (!sId) {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        sId = "ts_" + crypto.randomUUID();
      } else {
        sId = "ts_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      }
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, sId);
      } catch (e) {
        // Ignore
      }
    }
    return sId;
  }

  const sessionId = getSessionId();

  /* --------------------------------------------------------------------------
     2. XSS Sanitization & Whitelist Formatter
     -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatMessageText(rawText) {
    let safe = escapeHtml(rawText);

    // Whitelist: inline `code`
    safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Whitelist: **bold**
    safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Whitelist: bare URLs -> <a target="_blank" rel="noopener noreferrer">
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
    safe = safe.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    // Convert newlines to <br>
    safe = safe.replace(/\r?\n/g, "<br>");

    return safe;
  }

  function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  /* --------------------------------------------------------------------------
     3. DOM Bubble Rendering & Scrolling
     -------------------------------------------------------------------------- */
  function scrollToBottom(force) {
    if (!chatLog) return;
    const distanceFromBottom = chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight;
    if (force || distanceFromBottom <= 80) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }

  function appendMessage(role, text, options = {}) {
    const time = options.time || getFormattedTime();

    const msgEl = document.createElement("div");
    msgEl.className = `chat-msg chat-msg--${role}`;

    const bubbleEl = document.createElement("div");
    bubbleEl.className = "chat-msg__bubble";
    bubbleEl.innerHTML = formatMessageText(text);

    const timeEl = document.createElement("div");
    timeEl.className = "chat-msg__time";
    timeEl.textContent = time;

    bubbleEl.appendChild(timeEl);

    // If options include a retry button
    if (options.isRetryable && options.retryText) {
      const retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "chat-retry-btn";
      retryBtn.innerHTML = `<i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Retry`;
      retryBtn.addEventListener("click", function () {
        msgEl.remove();
        sendMessage(options.retryText);
      });
      bubbleEl.appendChild(retryBtn);
    }

    msgEl.appendChild(bubbleEl);
    chatLog.appendChild(msgEl);

    scrollToBottom(true);

    // Save to transcript
    if (!options.skipSave) {
      chatTranscript.push({ role, text, time });
      if (chatTranscript.length > MAX_HISTORY) {
        chatTranscript.shift();
      }
      try {
        sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(chatTranscript));
      } catch (e) {
        // Ignore
      }
    }

    return msgEl;
  }

  /* --------------------------------------------------------------------------
     4. Typing Indicator Bubble
     -------------------------------------------------------------------------- */
  let typingIndicatorEl = null;

  function showTypingIndicator() {
    if (typingIndicatorEl) return;

    typingIndicatorEl = document.createElement("div");
    typingIndicatorEl.className = "chat-msg chat-msg--bot";
    typingIndicatorEl.innerHTML = `
      <div class="typing-indicator" aria-label="AI is typing...">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatLog.appendChild(typingIndicatorEl);
    scrollToBottom(true);
  }

  function hideTypingIndicator() {
    if (typingIndicatorEl) {
      typingIndicatorEl.remove();
      typingIndicatorEl = null;
    }
  }

  /* --------------------------------------------------------------------------
     5. Tolerant n8n Reply Extractor
     -------------------------------------------------------------------------- */
  function extractReply(data) {
    if (typeof data === "string") {
      return data.trim();
    }

    // Array-wrapped payloads
    if (Array.isArray(data) && data.length > 0) {
      return extractReply(data[0]);
    }

    if (data && typeof data === "object") {
      if (typeof data.output === "string") return data.output.trim();
      if (typeof data.reply === "string") return data.reply.trim();
      if (typeof data.text === "string") return data.text.trim();
      if (typeof data.message === "string") return data.message.trim();
      if (typeof data.answer === "string") return data.answer.trim();
      if (typeof data.response === "string") return data.response.trim();
      if (data.data && typeof data.data.output === "string") return data.data.output.trim();
    }

    console.warn("Tech'nSyntax AI Chatbot: Unrecognized webhook response shape:", data);
    return null;
  }

  /* --------------------------------------------------------------------------
     6. Network Send & Error Handling
     -------------------------------------------------------------------------- */
  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = Date.now();
    if (inFlight || now - lastSendTime < THROTTLE_MS) {
      return;
    }
    lastSendTime = now;

    // Hide suggested chips once first message is sent
    if (chipsContainer) {
      chipsContainer.style.display = "none";
    }

    // Render user message bubble
    appendMessage("user", trimmed);

    // Disable composer during request
    inFlight = true;
    chatInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span class="ai-chat__spinner" aria-hidden="true"></span>';
    showTypingIndicator();

    const controller = new AbortController();
    const timeoutId = setTimeout(function () {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    const payload = {
      message: trimmed.substring(0, 1000),
      sessionId: sessionId,
      page: "contact",
      source: "technsyntax.site",
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      hideTypingIndicator();

      if (!response.ok) {
        appendMessage(
          "bot",
          `Something went wrong on our side (error ${response.status}). Please try again in a moment.`,
          { isRetryable: true, retryText: trimmed }
        );
        return;
      }

      // Read text defensively, then JSON parse
      const rawBody = await response.text();
      let parsedData = null;
      try {
        parsedData = JSON.parse(rawBody);
      } catch (err) {
        parsedData = rawBody;
      }

      const botReply = extractReply(parsedData);
      if (botReply) {
        appendMessage("bot", botReply);
      } else {
        appendMessage(
          "bot",
          "I couldn't reach the assistant just now. Please check your connection and try again, or email info@technsyntax.site.",
          { isRetryable: true, retryText: trimmed }
        );
      }
    } catch (error) {
      clearTimeout(timeoutId);
      hideTypingIndicator();

      if (error.name === "AbortError") {
        appendMessage(
          "bot",
          "That took longer than expected. Try again, or reach us at info@technsyntax.site.",
          { isRetryable: true, retryText: trimmed }
        );
      } else {
        // Network / CORS error
        appendMessage(
          "bot",
          "I couldn't reach the assistant just now. Please check your connection and try again, or email info@technsyntax.site.",
          { isRetryable: true, retryText: trimmed }
        );
      }
    } finally {
      inFlight = false;
      chatInput.disabled = false;
      sendBtn.disabled = false;
      sendBtn.innerHTML = `<i class="fa-solid fa-paper-plane ai-chat__send-icon" aria-hidden="true"></i>`;
      chatInput.value = "";
      updateCharCounter();
      autoGrowTextarea();
      chatInput.focus();
    }
  }

  /* --------------------------------------------------------------------------
     7. Composer Input Handlers
     -------------------------------------------------------------------------- */
  function autoGrowTextarea() {
    chatInput.style.height = "auto";
    const newHeight = Math.min(Math.max(chatInput.scrollHeight, 42), 120);
    chatInput.style.height = newHeight + "px";
  }

  function updateCharCounter() {
    if (!charCounter) return;
    const len = chatInput.value.length;
    charCounter.textContent = `${len}/1000`;
    if (len > 900) {
      charCounter.classList.add("is-warning");
    } else {
      charCounter.classList.remove("is-warning");
    }
  }

  chatInput.addEventListener("input", function () {
    autoGrowTextarea();
    updateCharCounter();
  });

  chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  sendBtn.addEventListener("click", function () {
    sendMessage(chatInput.value);
  });

  /* --------------------------------------------------------------------------
     8. Suggested Question Chips
     -------------------------------------------------------------------------- */
  if (chipsContainer) {
    chipsContainer.querySelectorAll(".chat-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        const questionText = chip.getAttribute("data-question") || chip.textContent.trim();
        sendMessage(questionText);
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Session History Restoration or Initial Greeting
     -------------------------------------------------------------------------- */
  function initHistory() {
    let saved = null;
    try {
      const stored = sessionStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        saved = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore
    }

    if (Array.isArray(saved) && saved.length > 0) {
      chatTranscript = saved;
      chatTranscript.forEach(function (item) {
        appendMessage(item.role, item.text, { time: item.time, skipSave: true });
      });
      // Hide chips if previous conversation exists
      if (chipsContainer) {
        chipsContainer.style.display = "none";
      }
    } else {
      // Render initial greeting
      appendMessage("bot", "Hi! I'm your AI assistant. Ask me anything.");
    }
  }

  initHistory();
})();
