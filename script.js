// NCKU demo static site - script.js
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);

  // ----- Login page captcha -----
  const captchaBox = $("#captchaBox");
  const form = $("#loginForm");

  function makeCaptcha(){
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    if (captchaBox){
      captchaBox.textContent = digits.split("").join(" ");
      captchaBox.dataset.value = digits;
    }
  }

  if (captchaBox){
    makeCaptcha();
    captchaBox.addEventListener("click", makeCaptcha);
  }

  // ----- Login submit -----
  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const account = (data.get("account") || "").toString().trim();
      const captcha = (data.get("captcha") || "").toString().trim();
      const expected = captchaBox?.dataset?.value || "";

      if (!account){
        alert("請輸入帳號");
        return;
      }
      if (captcha !== expected){
        alert("驗證碼錯誤，請重新輸入。");
        makeCaptcha();
        return;
      }

      // store login state
      localStorage.setItem("ncku_demo_login", JSON.stringify({
        account,
        at: Date.now()
      }));
      window.location.href = "./portal.html";
    });

    const forgotBtn = $("#forgotBtn");
    const firstBtn = $("#firstBtn");
    forgotBtn?.addEventListener("click", () => alert("示範版：此功能未串接。"));
    firstBtn?.addEventListener("click", () => alert("示範版：此功能未串接。"));
  }

  // ----- Portal page -----
  const who = $("#who");
  if (who){
    const raw = localStorage.getItem("ncku_demo_login");
    if (!raw){
      window.location.href = "./index.html";
      return;
    }
    try{
      const obj = JSON.parse(raw);
      who.textContent = obj.account || "（未知）";
    }catch{
      who.textContent = "（未知）";
    }
  }

  const logoutBtn = $("#logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("ncku_demo_login");
    window.location.href = "./index.html";
  });

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const sidebar = $("#sidebar");
  if (menuBtn && sidebar){
    menuBtn.addEventListener("click", () => sidebar.classList.toggle("is-open"));
    // close when clicking outside
    document.addEventListener("click", (e) => {
      if (!sidebar.classList.contains("is-open")) return;
      const t = e.target;
      if (t === menuBtn || menuBtn.contains(t) || sidebar.contains(t)) return;
      sidebar.classList.remove("is-open");
    });
  }
})();
