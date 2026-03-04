const FIXED_EXAM_NO = "5211093";
const FIXED_ID_NO   = "B123424288";

const RESULT_DATA = {
  deptName: '電機工程學系甲組',
  seatNo: '5211093',
  name: '許詠鈞',
  identity: '一般生',
  rankMsg: '恭喜！您正取第10名，請於115年3月13日下午13:30~16:10攜帶畢業證書至系所辦理報到。',
  avgScore: '83.3',
  minAccepted: '--',
  minWait: '--',
  subjects: [
    { name: '工程數學', score: '81.5', percent: '40%' },
    { name: '電子學', score: '85.0', percent: '30%' },
    { name: '電磁學', score: '84.0', percent: '30%' }
  ]
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

  setText("deptTitle", RESULT_DATA.deptName);
  setText("outExamNo", examNo);
  setText("outName", RESULT_DATA.name);
  setText("outCat", RESULT_DATA.identity);
  setText("rankMsg", RESULT_DATA.rankMsg);
  setText("avgScore", RESULT_DATA.avgScore);

  const s0 = RESULT_DATA.subjects?.[0] || { score: "--", percent: "--" };
  const s1 = RESULT_DATA.subjects?.[1] || { score: "--", percent: "--" };
  const s2 = RESULT_DATA.subjects?.[2] || { score: "--", percent: "--" };
  setText("s_math", s0.score);
  setText("p_math", s0.percent);
  setText("s_elec", s1.score);
  setText("p_elec", s1.percent);
  setText("s_em", s2.score);
  setText("p_em", s2.percent);
}

document.addEventListener("DOMContentLoaded", ()=>{
  initLogin();
  initResult();
});
