// ⚡ 初始化 LIFF
document.addEventListener("DOMContentLoaded", async () => {
  await liff.init({ liffId: "YOUR_LIFF_ID" }); // <-- 換成你自己的 LIFF ID

  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("messageInput");
  const messages = document.getElementById("messages");

  function addMessage(text, sender = "user") {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
      addMessage(text, "user");
      input.value = "";

      // 模擬回覆
      setTimeout(() => {
        addMessage("你說了: " + text, "bot");
      }, 500);
    }
  });
});
