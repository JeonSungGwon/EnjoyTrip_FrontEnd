import { users } from "../../data/userData";
import { navigateTo } from "./service";

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

    // '회원가입' 버튼 클릭 시 회원가입 섹션 보이기
    signupButton.addEventListener("click", () => {
      signinSection.style.display = "none";
      signupSection.style.display = "block";
      main_title.style.display = "none";
    });
    // sign_btn.addEventListener("click", () => {
    //   signinSection.style.display = "block";
    //   signupSection.style.display = "none";
    //   main_title.style.display = "block";
    // });
  }

  signin() {
    let form = this.#app.getElementById("signinForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#id = this.#app.getElementById("id").value;
      this.#password = this.#app.getElementById("password").value;

      this.findUserInfo();
    });
  }

  signup() {
    let form = this.#app.getElementById("signupForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let id = document.getElementById("");
      this.successSignUp();
    });
  }

  findUserInfo() {
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      if (user.id === this.#id) {
        if (user.password === this.#password) {
          alert("로그인 성공!");
          this.#name = user.name;
          this.successLogin();
        }
        if (user.password !== this.#password) alert("비밀번호가 틀렸습니다.");
        break;
      } 
    }
  }

  successLogin() {
    localStorage.setItem("token", "hi");
    localStorage.setItem("username", this.#name);
    navigateTo("../pages/mainPage.html");
  }

  successSignUp() {
    navigateTo("../pages/signPage.html");
  }
}

page = new SignPage(document);
