class SignPage {
  #app;
  #id;
  #password;
  #name;

  constructor(app) {
    this.#app = app;
    this.#id = "";
    this.#password = "";
    this.#name = "";

    this.setUI();

    this.signin();
    this.signup();
  }

  setUI() {
    // javascript 코드에서 해야되는 모든 UI 처리
    // 로그인, 회원가입 페이지 none 처리
    // 버튼 누르면 이동하고...
  }

  signin() {
    // 로그인 로직
  }

  signup() {
    // 회원가입 로직
  }
}

page = new SignPage(document);
