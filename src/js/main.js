import { tripdata } from "../../const/tripData.js";

class MainPage {
  #app;

  constructor(app) {
    this.#app = app;

    this.setUI();
    this.clickSearchBtn();
  }

  setUI() {
    this.createMyPageBtn();
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

  clickSearchBtn() {
    let searchBtn = this.#app.getElementById("searchBar").getElementsByTagName("img")[0];
    searchBtn.addEventListener("click", () => {
      this.search();
    });
  }

  // 검색 함수
  search() {
    console.log("검색 요청 합니다.");
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
