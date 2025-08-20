document.addEventListener('DOMContentLoaded', async () => {
  try {
    await liff.init({ liffId: '2007964190-lv3NAx5a' }); // 你的 LIFF ID
    // 未登入就先登入
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();

    // 取得/建立容器，避免 null
    let el = document.getElementById('profile');
    if (!el) {
      el = document.createElement('div');
      el.id = 'profile';
      document.body.appendChild(el);
    }

    el.innerHTML = `
      <p><strong>Display Name:</strong> ${profile.displayName}</p>
      ${profile.pictureUrl ? `<img src="${profile.pictureUrl}" alt="profile" width="100">` : ''}
    `;
  } catch (err) {
    console.error('LIFF init failed', err);
    alert('LIFF 初始化失敗：' + (err?.message || err));
  }
});
