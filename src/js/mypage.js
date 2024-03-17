import { Card, Footer, Header, setCardWidthHeight } from "./component.js";
import { navigateTo } from "./service.js";

class MyPage {
  #app;
  #username;
  #profileImage;
  #favorites;

  constructor(app) {
    this.#app = app;
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.#username = userInfo ? userInfo.name : "";
    this.#profileImage = userInfo ? userInfo.profileImage : "";
    this.#favorites = [];

    this.setUI();

    this.logout();
    this.leave();
  }

  setUI() {
    let token = localStorage.getItem("token");
    if (!token) {
      alert("사용자 정보가 없습니다! 로그인 페이지로 이동합니다.");
      navigateTo("../pages/signPage.html");
    }

    Header(this.#profileImage, this.#username);
    Footer();

    this.setProfile();
    this.setFavorites();
  }

  setProfile() {
    const profileDiv = this.#app.getElementById("profile");
    profileDiv.innerHTML = `
      <div id="profileImageContainer" style="width: 100%; height: 100%; border-radius: 100%; overflow: hidden;">
        <img src=${
          this.#profileImage
        } id="profileImage" style="width: 100%; height: 100%;" />
      </div>
      <span class="material-symbols-outlined" id="editProfile">edit</span>
    `;

    const editProfileButton = this.#app.getElementById("editProfile");
    const profileImageElement = this.#app.getElementById("profileImage");

    editProfileButton.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const imageSrc = e.target.result;
          profileImageElement.src = imageSrc; // 프로필 이미지 업데이트
          this.#profileImage = imageSrc; // 내부 변수에도 업데이트
          profileDiv.style.padding = 0;

          // 로컬 스토리지에 userInfo 업데이트
          const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
          userInfo.profileImage = imageSrc;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        };

        reader.readAsDataURL(file);
      };

      fileInput.click(); // 파일 선택 창 열기
    });
  }
  setFavorites() {
    const favoritesDiv = this.#app.getElementById("favorites");

    let html = "";
    this.#favorites = JSON.parse(localStorage.getItem("favoriteStores"));
    this.#favorites.map((favorite) => {
      html += Card(
        favorite.contentId,
        favorite.firstimage,
        favorite.title.split("("),
        favorite.addr1.split(" ")[0] + " " + favorite.addr1.split(" ")[1],
        "30%"
      );
      html += `
            <img src="../../assets/images/full_star.svg" alt="star" id="star${favorite.contentid}" />
        `;
      html += "</div>";
    });

    favoritesDiv.innerHTML = html;
    const cards = favoritesDiv.querySelectorAll(".card");

    cards.forEach((card) => {
      setCardWidthHeight(card);
    });

    this.clickStar();
  }

  clickStar() {
    const favoriteStores =
      JSON.parse(localStorage.getItem("favoriteStores")) || [];

    for (let i = 0; i < favoriteStores.length; i++) {
      const storeId = favoriteStores[i].contentid;
      let starIcon = this.#app.getElementById(`star${storeId}`);

      starIcon.addEventListener("click", (event) => {
        const storeId = event.target.id.replace("star", "");

        // 해당 storeId를 가진 아이템을 favoriteStores에서 제거하고 다시 렌더링
        this.removeFavoriteStore(storeId);
      });
    }
  }

  removeFavoriteStore(storeId) {
    // 현재 즐겨찾기 목록 가져오기
    let favoriteStores =
      JSON.parse(localStorage.getItem("favoriteStores")) || [];

    // 해당 storeId를 가진 아이템을 제거
    favoriteStores = favoriteStores.filter(
      (store) => store.contentid !== storeId
    );

    // 로컬 스토리지 업데이트
    localStorage.setItem("favoriteStores", JSON.stringify(favoriteStores));

    // 다시 렌더링
    this.setFavorites();
  }

  logout() {
    this.#app.getElementById("logout").addEventListener("click", () => {
      alert("로그아웃 되셨습니다!");
      localStorage.removeItem("token");
      navigateTo("../pages/signPage.html");
    });
  }

  leave() {
    this.#app.getElementById("leave").addEventListener("click", () => {
      let flag = window.confirm("정말로 회원을 탈퇴 하실거에요?🥲");
      if (flag) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("favoriteStores");
        navigateTo("../pages/signPage.html");
      }
    });
  }
}

new MyPage(document);
