import { tripdata } from "../../const/tripData.js";

class MainPage {
  #app;

  constructor(app) {
    this.#app = app;

    this.setUI();
  }

  setUI() {
    this.createMyPageBtn();
    this.createSearchBar();
    this.createCards();
  }

  createMyPageBtn() {
    const myBtnDiv = this.#app.getElementById("myBtn");

    let username = "핑구성권";
    let profileImage = "../../assets/images/user_white.svg";
    const myBtn = `
      <img src=${profileImage} />
      <p>${username}</p>
    `;
    myBtnDiv.innerHTML = myBtn;

    myBtnDiv.addEventListener("click", () => {});
  }

  createSearchBar() {
    const searchDiv = this.#app.getElementById("search");

    const searchBar = `
      <input class="searchbar" placeholder="여행지 이름, 위치 등 검색어를 입력해 주세요." />
      <img height="30px" width="30px" src="../../assets/images/search.svg" />
    `;

    searchDiv.innerHTML = searchBar;
  }

  createCards() {
    const cardsDiv = this.#app.getElementById("cards");
    let html = "";
    tripdata.map((data) => {
      html += `
        <div id="card${data.id}" class="card">
          <img src=${data.imageUrl} />
          <img src="../../assets/images/empty_star.svg" />
        </div>
      `;
    });

    cardsDiv.innerHTML = html;
  }
}

new MainPage(document);
