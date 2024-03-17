import { navigateTo } from "./service.js";

class SignPage {
  #app;

  // UI Component
  signinDiv;
  signupDiv;
  title;

  constructor(app) {
    this.#app = app;

    this.setUI();

    this.signin();
    this.signup();
  }

  setUI() {
    this.signinDiv = this.#app.getElementById("signin");
    this.signupDiv = this.#app.getElementById("signup");
    this.title = this.#app.getElementById("title_text");

    // 로그인, 회원가입 버튼 가져오기
    const goSignupBtn = this.#app.getElementById("goSignupBtn");
    const signupBtn = this.#app.getElementById("signupBtn");

    // '회원가입' 버튼 클릭 시 회원가입 섹션 보이기
    goSignupBtn.addEventListener("click", () => {
      this.setSignupUI();
    });

    signupBtn.addEventListener("click", () => {
      this, this.setSigninUI();
    });
  }

  setSignupUI() {
    this.signinDiv.style.display = "none";
    this.signupDiv.style.display = "block";
    this.title.style.display = "none";
  }

  setSigninUI() {
    this.signinDiv.style.display = "block";
    this.signupDiv.style.display = "none";
    this.title.style.display = "block";
  }

  signin() {
    let form = this.#app.getElementById("signinForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let id = this.#app.getElementById("inId").value;
      let password = this.#app.getElementById("inPwd").value;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (userInfo.id === id && userInfo.password === password) {
        this.successSignin();
      } else {
        alert("아이디 또는 비밀 번호를 확인하세요.");
      }
    });
  }

  signup() {
    let form = this.#app.getElementById("signupForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let userInfo = {
        name: document.getElementById("upName").value,
        id: document.getElementById("upId").value,
        password: document.getElementById("upPwd").value,
        profileImage : "white_user.svg"
      };

      this.successSignup(userInfo);
    });
  }

  successSignin() {
    alert("로그인 성공!");
    localStorage.setItem("token", "hi");
    navigateTo("../pages/mainPage.html");
  }

  successSignup(userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    alert("회원 가입이 완료 되었습니다!");
    navigateTo("../pages/signPage.html");
  }
}

new SignPage(document);
