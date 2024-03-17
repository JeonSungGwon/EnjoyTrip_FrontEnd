import { navigateTo } from "./service.js";

export function Header(
  profileImage = "../../assets/images/full.svg",
  username
) {
  let html = `
    <img class="logo" id="logo" src="../../assets/images/logo.svg" />
    <div id="profileBtn" class="profile-btn" style="cursor: pointer">
        <img src=${profileImage} style="border-radius: 100%; width: 50px; height: 50px;" />
        <p>${username}</p>
    </div>
  `;

  const header = document.getElementsByTagName("header")[0];
  header.innerHTML = html;

  document.getElementById("logo").addEventListener("click", () => {
    navigateTo("../pages/mainPage.html");
  });

  document.getElementById("profileBtn").addEventListener("click", () => {
    navigateTo("../pages/myPage.html");
  });
}

export function Footer() {
  // 싸피 클릭
  document.getElementById("ssafy").addEventListener("click", () => {
    window.open("https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp");
  });

  // ContactUs 클릭시 모달창 띄움
  document.getElementById("contactus").addEventListener("click", () => {
    let modalHtml = `  
          <div class="title">
            <h1 style="text-align: center; background-color: #4e71a7; color: #fff; padding: 1rem 2rem; margin: 0;">SSAFY 11기 대전 7반 백하람 & 전성권</h1>
            <span class="material-symbols-outlined" id="modalClose">close</span>
          </div>
          <h2>📺 Github</h2>
          <h3>하람(@ramrami-B) | 성권(@JeonSungGwon)</h3>
          <h2>📧 Email</h2>
          <h3>하람 developer.venice@gmail.com</h3>
          <h3>성권 jeonsg9904@gmail.com</h3>
      `;
    document.getElementById("modalBackground").style.display = "flex";
    document.getElementById("modal").innerHTML = modalHtml;

    // 닫기
    document.getElementById("modalClose").addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById("modalBackground");
      modal.style.display = "none";
      document.getElementById("modal").innerHTML = "";
    });
  });
}

export function Card(id, image, title, addr, width) {
  return `
    <div style="width: ${width}; background-image: url(${image});" id="card${id}" class="card" >
        <div class="hover">
            <p style="font-weight: bold; font-size: 18px">${title}</p>
            <div style="display: flex;">
                <span class="material-symbols-outlined">location_on</span>
                <p style="font-size: 16px;">${addr}</p>
            </div>
        </div>
    <!-- 추가할 내용이 있을 수 있으므로(별 같은거) div 닫지 않음 -->
    `;
}

export function setCardWidthHeight(card) {
  let cardWidth = card.clientWidth;
  card.style.height = `${cardWidth}px`;
}

export function Modal(html) {
  let body = document.getElementsByTagName("body")[0].innerHTML;
  let modal = `
        <div class="modal-background" id="modalBackground">
            <div class="modal">${html}</div>
        </div>
    `;

  document.getElementsByTagName("body")[0].innerHTML += modal;
}
