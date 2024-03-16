export function Header(profileImage, username) {
  let html = `
    <img class="logo" src="../../assets/images/logo.svg" />
    <div id="profileBtn" class="profile-btn" style="cursor: pointer">
        <img src=${profileImage} />
        <p>${username}</p></div>
    </div>
  `;

  const header = document.getElementsByTagName("header")[0];
  header.innerHTML = html;

  const profileBtn = document.getElementById("profileBtn");
  profileBtn.addEventListener("click", () => {
    navigateTo("../pages/myPage.html");
  });
}
