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
  }

  createSearchBar() {
    const searchBarDiv = this.#app.getElementById("searchBar");

    const searchBar = `
      <input class="search-input" placeholder="여행지 이름, 위치 등 검색어를 입력해 주세요." />
      <img height="30px" width="30px" src="../../assets/images/search.svg" />
    `;

    searchBarDiv.innerHTML = searchBar;
  }

  createCards() {
    const cardsDiv = this.#app.getElementById("cards");
    let html = "";

    tripdata.map((data) => {
      html = `
        <div style="width: 20%" id="card${data.id}" class="card" >
          <div class="hover">
            <p>${data.title}</p>
            <p>${data.location}</p>
          </div>
          <img src="../../assets/images/empty_star.svg" alt="star" id="star${data.id}" />
        </div>
      `;

      cardsDiv.innerHTML += html;

      let curCard = document.getElementById(`card${data.id}`);
      curCard.setAttribute(
        "style",
        `width: ${cardsDiv.clientWidth / 5 - 10}px; height: ${cardsDiv.clientWidth / 5 - 10}px; 
        background-image: url(${data.imageUrl}); background-size: cover`
      );
    });

    this.starClick();
  }

  starClick() {
    for (let i = 0; i < tripdata.length; i++) {
      let starIcon = this.#app.getElementById(`star${tripdata[i].id}`);
      starIcon.addEventListener("click", () => {
        starIcon.setAttribute("src", "../../assets/images/full_star.svg");
      });
    }
  }
}

new MainPage(document);
