document.addEventListener('DOMContentLoaded', async () => {
  try {
    await liff.init({ liffId: '2007964190-lv3NAx5a' }); // 換成你真實的 LIFF ID
    console.log('LIFF init success');

    // 如果還沒登入就跳 LINE 登入
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 取得使用者資訊
    const profile = await liff.getProfile();
    console.log('Profile:', profile);

    // 顯示在畫面上
    document.getElementById('profile').innerHTML = `
      <p><strong>Display Name:</strong> ${profile.displayName}</p>
      <img src="${profile.pictureUrl}" alt="profile picture" width="100">
    `;
  } catch (err) {
    console.error('LIFF init failed', err);
    alert('LIFF 初始化失敗：' + err.message);
  }
});
