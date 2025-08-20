document.addEventListener('DOMContentLoaded', async () => {
  try {
    await liff.init({ liffId: '2007964190-lv3NAx5a' });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 顯示個人資訊
    const profile = await liff.getProfile();
    let el = document.getElementById('profile');
    if (!el) {
      el = document.createElement('div');
      el.id = 'profile';
      document.body.appendChild(el);
    }
    el.innerHTML = `
      <p><strong>Display Name:</strong> ${profile.displayName}</p>
      ${profile.pictureUrl ? `<img src="${profile.pictureUrl}" alt="profile" width="180">` : ''}
    `;

    // 綁定「送出」按鈕
    const input = document.getElementById('msg');
    const btn = document.getElementById('sendBtn');
    btn.addEventListener('click', async () => {
      const text = (input.value || '').trim();
      if (!text) return alert('請先輸入訊息');

      try {
        const ctx = liff.getContext();
        // 如果是從聊天室內開啟（1 對 1、群組或多人）
        if (ctx?.type === 'utou' || ctx?.type === 'group' || ctx?.type === 'room') {
          await liff.sendMessages([{ type: 'text', text }]);
          alert('已送出');
          liff.closeWindow(); // 可選：送出後關閉
          return;
        }

        // 不在聊天室 → 用 shareTargetPicker（需在 LIFF 設定啟用）
        if (liff.isApiAvailable('shareTargetPicker')) {
          const res = await liff.shareTargetPicker([{ type: 'text', text }]);
          if (res) alert('已送出');
          return;
        }

        // 以上都不可用
        alert('請從 LINE 聊天室內開啟，或到 LIFF 設定啟用 shareTargetPicker 後再試');
      } catch (err) {
        console.error(err);
        alert('送出失敗：' + (err?.message || err));
      }
    });
  } catch (err) {
    console.error('LIFF init failed', err);
    alert('LIFF 初始化失敗：' + (err?.message || err));
  }
});
