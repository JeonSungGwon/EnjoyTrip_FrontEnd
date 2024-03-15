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
    const signinSection = this.#app.getElementById("signin");
    const signupSection = this.#app.getElementById("signup");

    // 로그인, 회원가입 버튼 가져오기
    const signupButton = this.#app.getElementById("sign_on");
    const sign_btn = this.#app.getElementById("sign_btn");
    const main_title = this.#app.getElementById("title_text");
    console.log(signupButton);

    // '회원가입' 버튼 클릭 시 회원가입 섹션 보이기
    signupButton.addEventListener("click", () => {
      signinSection.style.display = "none";
      signupSection.style.display = "block";
      main_title.style.display = "none";
    });
    sign_btn.addEventListener("click", () => {
      signinSection.style.display = "block";
      signupSection.style.display = "none";
      main_title.style.display = "block";
    });
  }

  signin() {}

  signup() {
    // 회원가입 로직
  }
}

page = new SignPage(document);
