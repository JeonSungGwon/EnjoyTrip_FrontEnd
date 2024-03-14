class MainPage {
  #app;

  constructor(app) {
    this.#app = app;

    this.setUI();
  }

  setUI() {
    const myBtnDiv = this.#app.getElementById("myBtn");

    let username = "핑구 성권";
    const myBtn = `
      <img src="../../assets/images/user.svg" />
      <p>${username}</p>
    `;

    myBtnDiv.innerHTML = myBtn;
    myBtnDiv.addEventListener("click", () => {});
  }
}

new MainPage(document);
