const FIXED_EXAM_NO = "5211093";
const FIXED_ID_NO   = "B123424288";

const RESULT_DATA = {
  name: "許詠鈞",
  dept: "電機與通信工程研究所甲組",
  category: "一般生",
  rankMsg: "您正取第28名。",
  avgScore: "--",
  minAdmit: "--",
  minWait: "--",
  subjects: {
    math: { score: "--", weighted: "--", percent: "--" },
    elec: { score: "--", weighted: "--", percent: "--" },
    em:   { score: "--", weighted: "--", percent: "--" },
  },
  reviewPdf: "review.pdf",
};

function randCaptcha(){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for(let i=0;i<4;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}
function setText(id, v){ const el=document.getElementById(id); if(el) el.textContent=v; }
function setHref(id, v){ const el=document.getElementById(id); if(el) el.setAttribute("href", v); }

function initLogin(){
  const captchaText = document.getElementById("captchaText");
  const form = document.getElementById("loginForm");
  const resetBtn = document.getElementById("resetBtn");
  const err = document.getElementById("error");
  if(!captchaText || !form) return;

  let currentCaptcha = randCaptcha();
  captchaText.textContent = currentCaptcha;

  const clearErr = ()=>{ if(err) err.textContent=""; };

  resetBtn?.addEventListener("click", ()=>{
    document.getElementById("examNo").value="";
    document.getElementById("idNo").value="";
    document.getElementById("captchaInput").value="";
    currentCaptcha = randCaptcha();
    captchaText.textContent = currentCaptcha;
    clearErr();
  });

  captchaText.addEventListener("click", ()=>{
    currentCaptcha = randCaptcha();
    captchaText.textContent = currentCaptcha;
    clearErr();
  });

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    clearErr();
    const examNo = document.getElementById("examNo").value.trim();
    const idNo = document.getElementById("idNo").value.trim().toUpperCase();
    const cap = document.getElementById("captchaInput").value.trim().toUpperCase();

    if(!examNo || !idNo || !cap){
      err.textContent="請完整輸入資料與驗證碼。";
      return;
    }
    if(cap !== currentCaptcha){
      err.textContent="驗證碼錯誤，請重新輸入。";
      currentCaptcha = randCaptcha();
      captchaText.textContent = currentCaptcha;
      return;
    }
    if(examNo !== FIXED_EXAM_NO || idNo !== FIXED_ID_NO){
      err.textContent="查無資料，請確認准考證號碼與身分證字號。";
      currentCaptcha = randCaptcha();
      captchaText.textContent = currentCaptcha;
      return;
    }
    sessionStorage.setItem("ncku_exam_no", examNo);
    window.location.href="result.html";
  });
}

function initResult(){
  if(!document.body.classList.contains("page-result")) return;
  const examNo = sessionStorage.getItem("ncku_exam_no") || FIXED_EXAM_NO;

  setText("deptTitle", RESULT_DATA.dept);
  setText("outExamNo", examNo);
  setText("outName", RESULT_DATA.name);
  setText("outCat", RESULT_DATA.category);
  setText("rankMsg", RESULT_DATA.rankMsg);
  setText("avgScore", RESULT_DATA.avgScore);
  setText("minAdmit", RESULT_DATA.minAdmit);
  setText("minWait", RESULT_DATA.minWait);

  setText("s_math", RESULT_DATA.subjects.math.score);
  setText("p_math", RESULT_DATA.subjects.math.percent);

  setText("s_elec", RESULT_DATA.subjects.elec.score);
  setText("p_elec", RESULT_DATA.subjects.elec.percent);

  setText("s_em", RESULT_DATA.subjects.em.score);
  setText("p_em", RESULT_DATA.subjects.em.percent);

  setHref("reviewLink", RESULT_DATA.reviewPdf);
}

document.addEventListener("DOMContentLoaded", ()=>{
  initLogin();
  initResult();
});
