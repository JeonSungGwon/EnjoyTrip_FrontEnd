import { navigateTo } from "./service.js";

export function Header(profileImage, username) {
  let html = `
    <img class="logo" id="logo" src="../../assets/images/logo.svg" />
    <div id="profileBtn" class="profile-btn" style="cursor: pointer">
        <img src=${profileImage} />
        <p>${username}</p></div>
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

export function Modal(html) {
  let body = document.getElementsByTagName("body")[0].innerHTML;
  let modal = `
        <div class="modal-background" id="modalBackground">
            <div class="modal">${html}</div>
        </div>
    `;

  document.getElementsByTagName("body")[0].innerHTML += modal;
  document.getElementById("modalClose").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementsByTagName("body")[0].innerHTML = body;
  });
}
