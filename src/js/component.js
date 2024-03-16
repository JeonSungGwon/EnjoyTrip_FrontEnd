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

export function Footer() {
  let footer = `
    <p>SSAFY</p>
    <p>ContactUs</p>
    `;

  document.getElementsByTagName("footer")[0].innerHTML = footer;
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

export function setCardWidthHeight(div, selector, isEvent) {
  const cards = div.querySelectorAll(selector);
  cards.forEach((card) => {
    let cardWidth = card.clientWidth;
    card.style.height = `${cardWidth}px`;

    // 이벤트
    isEvent
      ? card.addEventListener("click", (event) => {
          const cardId = event.currentTarget.id.replace("card", "");
          const clickedStore = this.stores.find(
            (store) => store.contentid === cardId
          );
          if (clickedStore) {
            const position = new kakao.maps.LatLng(
              parseFloat(clickedStore.mapy),
              parseFloat(clickedStore.mapx)
            );
            map.setCenter(position);
          }
        })
      : null;
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
