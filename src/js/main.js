import { Header } from "./component.js";
import { navigateTo, requestData, searchAPI } from "./service.js";
import { initializeKakaoMap, makeOverListener, makeOutListener } from "./kakao.js";

class MainPage {
  #app;
  #map;
  #profileImage;
  #username;
  stores;
  markers;
  clusterer;

  constructor(app, map, markers) {
    // 변수 초기화
    this.#app = app;
    this.#map = map; // map 객체를 전달받음
    this.#username = "";
    this.#profileImage = "";
    this.stores = "";
    this.markers = markers;
    this.clusterer = new kakao.maps.MarkerClusterer({
      map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
      averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
      minLevel: 5, // 클러스터 할 최소 지도 레벨
    });

    // 화면
    this.setUI();
    // event
    this.clickSearchBtn();
  }

  setUI() {
    let token = localStorage.getItem("token");
    if (!token) {
      alert("사용자 정보가 없습니다! 로그인 페이지로 이동합니다.");
      navigateTo("../pages/signPage.html");
    }

    this.#username = JSON.parse(localStorage.getItem("userInfo")).name;
    this.#profileImage = "../../assets/images/user_white.svg";

    Header(this.#profileImage, this.#username);

    this.createCards();
  }

  clickSearchBtn() {
    let searchDiv = this.#app.getElementById("search");

    searchDiv.addEventListener("submit", (e) => {
      e.preventDefault();
      this.search();
    });
  }

  createCards() {
    const cardsDiv = this.#app.getElementById("cards");
    let html = "";

    if (this.stores.length === 0) {
      html = "<p>검색 결과가 없습니다😢</p>";
    } else {
      let storeLength = this.stores.length;
      this.stores.forEach((store) => {
        html += `
          <div style="width: ${
            storeLength < 5 ? 100 / storeLength - 2 : 18
          }%; background-image: url(${
          store.firstimage
            ? store.firstimage
            : "../../assets/images/noimage.svg"
        });" id="card${store.contentid}" class="card" >
            <div class="hover">
              <p style="font-weight: bold; font-size: 18px">${
                store.title.split("(")[0]
              }</p>
              <div style="display: flex;">
                <span class="material-symbols-outlined">location_on</span>
                <p style="font-size: 16px;">${
                  store.addr1.split(" ")[0] + " " + store.addr1.split(" ")[1]
                }</p>
              </div>
            </div>
            <img src="../../assets/images/empty_star.svg" alt="star" id="star${
              store.contentid
            }" />
          </div>
        `;
      });
      cardsDiv.innerHTML = html;

      this.setCardWidthHeight(cardsDiv);
      this.clickStar();
    }
  }

  setCardWidthHeight(cardsDiv) {
    const cards = cardsDiv.querySelectorAll(".card");
    cards.forEach((card) => {
      let cardWidth = card.clientWidth;
      card.style.height = `${cardWidth}px`;

      // 카드 클릭 이벤트 추가
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
          map.setCenter(position);
        }
      });
    });
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
        let favoriteStores = JSON.parse(localStorage.getItem("favoriteStores")) || [];
        console.log("즐겨찾기 로컬 스토리지 정보 : ",favoriteStores);

      });
    }
  }

  // 검색 함수
  search = async () => {
    const keyword = document
      .getElementById("searchBar")
      .getElementsByTagName("input")[0].value;
    const selectedCity = document.getElementById("city").value;
    const selectedSubLocation = document.getElementById("subLocation").value;

    // 도시와 소분류가 선택되지 않았을 경우 알림 후 종료
    if (!selectedCity || !selectedSubLocation) {
      alert("도시와 소분류를 선택하세요.");
      return;
    }

    // API 요청을 위한 URL 생성
    const url = searchAPI(keyword, selectedCity, selectedSubLocation);
    try {
      const data = await requestData(url);

      if (data) {
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
            makeOverListener(map, marker, infowindow)
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
        map.setCenter(center);

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
    let favoriteStores = JSON.parse(localStorage.getItem("favoriteStores")) || [];
    favoriteStores.push(store);
    localStorage.setItem("favoriteStores", JSON.stringify(favoriteStores));
    
  }

  removeFromLocalStorage(store) {
      let favoriteStores = JSON.parse(localStorage.getItem("favoriteStores")) || [];
      favoriteStores = favoriteStores.filter((s) => s.contentid !== store.contentid);
      localStorage.setItem("favoriteStores", JSON.stringify(favoriteStores));
  }
}



var map = initializeKakaoMap();
var markers = [];

new MainPage(document, map, markers);

