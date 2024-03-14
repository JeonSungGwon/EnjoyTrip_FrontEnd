class MyPage {
  #app;

  constructor(app) {
    this.#app = app;

    this.setUI();
  }

  setUI() {}
}

page = new MyPage(document);
