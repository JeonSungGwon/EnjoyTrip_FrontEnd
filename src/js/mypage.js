import { Card, Footer, Header, setCardWidthHeight } from "./component.js";

class MyPage {
  #app;
  #username;
  #profileImage;
  #favorites;

  constructor(app) {
    this.#app = app;
    this.#username = "";
    this.#profileImage = "";
    this.#favorites = [];

    this.setUI();
  }

  setUI() {
    this.#username = JSON.parse(localStorage.getItem("userInfo")).name;
    this.#profileImage = "../../assets/images/user_white.svg";

    Header(this.#profileImage, this.#username);
    Footer();

    this.setProfile();
    this.setFavorites();
  }

  setProfile() {
    const profileDiv = this.#app.getElementById("profile");
    profileDiv.innerHTML = `
      <img src=${this.#profileImage} />
      <span class="material-symbols-outlined">edit</span>
      `;
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
      html += "</div>";
      // html += `
      //   <div>
      //     <button>리뷰 등록하기</button>
      //     <button>삭제</button>
      //   </div>
      // `;
    });

    favoritesDiv.innerHTML = html;
    setCardWidthHeight(favoritesDiv, ".card", false);
  }
}

new MyPage(document);
