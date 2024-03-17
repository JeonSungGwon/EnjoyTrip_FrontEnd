import {
  Card,
  Footer,
  Header,
  setCardWidthHeight,
} from "./component.js";
import {
  navigateTo,
  requestData,
  searchAPI,
  subLocationAPI,
} from "./service.js";
import {
  initializeKakaoMap,
  makeOverListener,
  makeOutListener,
} from "./kakao.js";
import { reviewData } from "../../data/reviewData.js";

class MainPage {
  #app;
  #profileImage;
  #username;
  #location;
  #subLocation;
  #keyword;
  //kakao 맵에 필요한 변수들
  map;
  stores;
  markers;
  clusterer;

  constructor(app) {
    // 변수 초기화
    this.#app = app;
    this.#username = JSON.parse(localStorage.getItem("userInfo")).name;
    this.#profileImage = JSON.parse(
      localStorage.getItem("userInfo")
    ).profileImage;

    this.map = initializeKakaoMap();
    this.stores = "";
    this.markers = [];

    this.clusterer = new kakao.maps.MarkerClusterer({
      map: this.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
      averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
      minLevel: 5, // 클러스터 할 최소 지도 레벨
    });

    // 화면
    this.setUI();

    // event
    this.clickSearchBtn();
    this.clickCard();
    this.selectLocation();
  }

  setUI() {
    let token = localStorage.getItem("token");
    if (!token) {
      alert("사용자 정보가 없습니다! 로그인 페이지로 이동합니다.");
      navigateTo("../pages/signPage.html");
    }

    // UI 세팅
    Header(this.#profileImage, this.#username);
    Footer();
    this.createCards();
  }

  clickSearchBtn() {
    let searchDiv = this.#app.getElementById("search");

    searchDiv.addEventListener("submit", (e) => {
      e.preventDefault();
      this.search();
      this.createCards();
    });
  }

  createCards() {
    const resultDiv = this.#app.getElementById("result");
    let html = "";

    if (this.stores.length === 0) {
      resultDiv.innerHTML = `<h2 style="margin-bottom: 50px">😢 검색 결과가 없습니다.</h2>`;
    } else {
      resultDiv.innerHTML = `
        <h2>😊 검색된 결과 입니다.</h2>
        <div id="cards" class="cards"></div>
      `;

      const cardsDiv = this.#app.getElementById("cards");
      this.stores.forEach((store) => {
        // favoriteStores에 있는지 확인
        const isFavorite = this.isFavoriteStore(store.contentid);
        // 별 이미지 선택
        const starImage = isFavorite ? "full_star.svg" : "empty_star.svg";
        html += Card(
          store.contentid,
          store.firstimage
            ? store.firstimage
            : "../../assets/images/noimage.svg",
          store.title.split("(")[0],
          store.addr1.split(" ")[0] + " " + store.addr1.split(" ")[1],
          "18%"
        );
        html += `
            <img src="../../assets/images/${starImage}" alt="star" id="star${store.contentid}" />
        `;
        html += "</div>";
      });

      cardsDiv.innerHTML = html;
      const cards = cardsDiv.querySelectorAll(".card");

      cards.forEach((card) => {
        setCardWidthHeight(card);

        card.addEventListener("click", (event) => {
          const cardId = event.currentTarget.id.replace("card", "");
          const clickedStore = this.stores.find(
            (store) => store.contentid === cardId
          );
          if (clickedStore) {
            const position = new kakao.maps.LatLng(
              parseFloat(clickedStore.mapy),
              parseFloat(clickedStore.mapx)
            );
            this.map.setCenter(position);
          }
        });
      });

      this.clickStar();
      this.clickCard();
    }
  }

  clickCard() {
    this.stores
      ? this.stores.map((store) => {
          this.#app
            .getElementById(`card${store.contentid}`)
            .addEventListener("dblclick", () => {
              let reviewHTML = "";
              reviewData.map((review) => {
                reviewHTML += `
                  <div style="display: flex; width: 100%">
                    <p style="font-weight: 800; margin: 10px 0; width: 25%;">${review.username}: </p>
                    <p style="margin: 10px 0; width: 75%;">${review.content}</p>
                  </div>
                `;
              });
              let modalHtml = `
                <div class="title">
                  <h1>📌 ${store.title}</h1>
                  <span class="material-symbols-outlined" id="modalClose">close</span>
                </div>
                <p>주소: ${store.addr1 + " " + store.addr2}</p>
                <p>전화 번호: ${store.tel ? store.tel : "(없음)"}</p>
                <hr style="margin: 20px 0;" />
                <h2>✍🏻 이 장소에 등록된 리뷰</h2>
                <div>${reviewHTML}</div>
              `;
              this.#app.getElementById("modalBackground").style.display =
                "flex";
              this.#app.getElementById("modal").innerHTML = modalHtml;

              // 닫기
              document
                .getElementById("modalClose")
                .addEventListener("click", (e) => {
                  e.preventDefault();
                  const modal = document.getElementById("modalBackground");
                  modal.style.display = "none";
                  this.#app.getElementById("modal").innerHTML = "";
                });
            });
        })
      : null;
  }

  clickStar() {
    for (let i = 0; i < this.stores.length; i++) {
      let starIcon = this.#app.getElementById(
        `star${this.stores[i].contentid}`
      );
      starIcon.addEventListener("click", () => {
        const storeId = event.target.id.replace("star", "");
        const clickedStore = this.stores.find(
          (store) => store.contentid === storeId
        );

        // 이미지 교체
        if (
          starIcon.getAttribute("src") === "../../assets/images/full_star.svg"
        ) {
          starIcon.setAttribute("src", "../../assets/images/empty_star.svg");

          const clickedMarker = this.markers.find(
            (marker) => marker.getTitle() === clickedStore.title
          );

          if (clickedMarker !== undefined) {
            // 기존의 마커를 제거합니다.
            this.clusterer.removeMarker(clickedMarker); // 클러스터에서도 제거합니다.
            this.markers = this.markers.filter(
              (marker) => marker !== clickedMarker
            );

            // 새로운 마커를 생성하여 클러스터에 추가합니다.
            const markerPosition = new kakao.maps.LatLng(
              parseFloat(this.stores[i].mapy),
              parseFloat(this.stores[i].mapx)
            );
            const newMarker = new kakao.maps.Marker({
              position: markerPosition,
              title: this.stores[i].title,
            });
            this.markers.push(newMarker);
            this.clusterer.addMarker(newMarker);

            this.removeFromLocalStorage(clickedStore);
          }
        } else {
          starIcon.setAttribute("src", "../../assets/images/full_star.svg");
          // 클릭된 스타에 해당하는 마커를 찾습니다.
          const clickedMarker = this.markers.find(
            (marker) => marker.getTitle() === clickedStore.title
          );

          if (clickedMarker !== undefined) {
            // 기존의 마커를 제거합니다.
            this.clusterer.removeMarker(clickedMarker); // 클러스터에서도 제거합니다.
            this.markers = this.markers.filter(
              (marker) => marker !== clickedMarker
            );

            // 새로운 마커를 생성하여 클러스터에 추가합니다.
            const markerPosition = new kakao.maps.LatLng(
              parseFloat(this.stores[i].mapy),
              parseFloat(this.stores[i].mapx)
            );

            const newMarker = new kakao.maps.Marker({
              position: markerPosition,
              title: this.stores[i].title,
              image: new kakao.maps.MarkerImage(
                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                new kakao.maps.Size(25, 40),
                { offset: new kakao.maps.Point(13, 37) }
              ),
            });
            this.markers.push(newMarker);
            this.clusterer.addMarker(newMarker);

            this.addToLocalStorage(clickedStore);
          }
        }

        //로컬 스토리지 콘솔 찍기
        let favoriteStores =
          JSON.parse(localStorage.getItem("favoriteStores")) || [];
        console.log("즐겨찾기 로컬 스토리지 정보 : ", favoriteStores);
      });
    }
  }

  async fetchSubLocations(areaCode) {
    const apiUrl = subLocationAPI(areaCode);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.response.body.items.item;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  selectLocation() {
    this.#app
      .getElementsByTagName("select")[0]
      .addEventListener("change", (e) => {
        this.#location = e.target.value;
        this.updateSubLocationOptions(this.#location);
      });
  }

  async updateSubLocationOptions() {
    const subLocationSelect = document.getElementById("subLocation");

    subLocationSelect.innerHTML = '<option value="">불러오는 중..</option>';

    if (this.#location) {
      const subLocations = await this.fetchSubLocations(this.#location);
      subLocationSelect.innerHTML =
        '<option value="">시, 군, 구를 선택하세요.</option>';
      subLocations.forEach((location) => {
        // 각 구를 옵션으로 추가
        const option = document.createElement("option");
        option.value = location.code;
        option.textContent = location.name;
        subLocationSelect.appendChild(option);
      });
    }
  }

  // 검색 함수
  search = async () => {
    this.#keyword = this.#app.getElementById("keyword").value;
    this.#subLocation = this.#app.getElementById("subLocation").value;

    // 도시와 소분류가 선택되지 않았을 경우 알림 후 종료
    if (!this.#location) {
      alert("도시와 소분류를 선택하세요.");
      return;
    }

    // API 요청을 위한 URL 생성
    const url = searchAPI(this.#keyword, this.#location, this.#subLocation);
    try {
      const data = await requestData(url);
      console.log(this.#keyword, this.#location, this.#subLocation);
      if (data.response) {
        // 검색 결과가 있을 경우 마커 표시
        this.stores = data.response.body.items.item;
        this.createCards(this.stores);

        // 기존 마커 제거
        this.clusterer.clear();
        this.markers = [];

        this.stores.forEach((store) => {
          const markerPosition = new kakao.maps.LatLng(
            parseFloat(store.mapy),
            parseFloat(store.mapx)
          );
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: store.title,
          });

          const infowindow = new kakao.maps.InfoWindow({
            content:
              '<div style="padding:5px;font-size:12px;">' +
              store.title +
              "</div>",
          });

          this.markers.push(marker);

          kakao.maps.event.addListener(
            marker,
            "mouseover",
            makeOverListener(this.map, marker, infowindow)
          );
          kakao.maps.event.addListener(
            marker,
            "mouseout",
            makeOutListener(infowindow)
          );
        });

        // 클러스터에 마커 추가
        this.clusterer.addMarkers(this.markers);

        // 중심 좌표 변경
        const firstStore = this.stores[0]; // 첫 번째 상점의 좌표를 기준으로 설정

        const center = new kakao.maps.LatLng(
          parseFloat(firstStore.mapy),
          parseFloat(firstStore.mapx)
        );
        this.map.setCenter(center);

        // 콘솔에 데이터 출력
        console.log("검색 결과:", this.stores);
      } else {
        console.log("검색 결과가 없습니다!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  addToLocalStorage(store) {
    let favoriteStores =
      JSON.parse(localStorage.getItem("favoriteStores")) || [];
    favoriteStores.push(store);
    localStorage.setItem("favoriteStores", JSON.stringify(favoriteStores));
  }

  removeFromLocalStorage(store) {
    let favoriteStores =
      JSON.parse(localStorage.getItem("favoriteStores")) || [];
    favoriteStores = favoriteStores.filter(
      (s) => s.contentid !== store.contentid
    );
    localStorage.setItem("favoriteStores", JSON.stringify(favoriteStores));
  }

  isFavoriteStore(contentId) {
    let favoriteStores =
      JSON.parse(localStorage.getItem("favoriteStores")) || [];
    return favoriteStores.some((store) => store.contentid === contentId);
  }
}

new MainPage(document);
