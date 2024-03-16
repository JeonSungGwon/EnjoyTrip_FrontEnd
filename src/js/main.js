import { Header } from "./component.js";
import { navigateTo, requestData, searchAPI } from "./service.js";

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

          console.log(clickedMarker);
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
          }
        } else {
          starIcon.setAttribute("src", "../../assets/images/full_star.svg");
          // 클릭된 스타에 해당하는 마커를 찾습니다.
          const clickedMarker = this.markers.find(
            (marker) => marker.getTitle() === clickedStore.title
          );

          console.log(clickedMarker);
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
            console.log(markerPosition, "adkasdkajdkasjdkasd");
            const newMarker = new kakao.maps.Marker({
              position: markerPosition,
              title: this.stores[i].title,
              image: new kakao.maps.MarkerImage(
                "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                new kakao.maps.Size(30, 30),
                { offset: new kakao.maps.Point(15, 25) }
              ),
            });
            this.markers.push(newMarker);
            this.clusterer.addMarker(newMarker);
          }
        }
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
      console.log(data, "api 요청 결과");
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
        console.log(center);
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
}

// service.js
document.addEventListener("DOMContentLoaded", function () {
  const citySelect = document.getElementById("city");

  // API 호출 및 데이터 가져오는 함수
  async function fetchSubLocations(areaCode) {
    const apiUrl = `https://apis.data.go.kr/B551011/KorService1/areaCode1?numOfRows=100&MobileOS=ETC&MobileApp=%EC%97%AC%ED%96%89&areaCode=${areaCode}&_type=json&serviceKey=NHmBKryxoTzpzOQijbBqpbyIoX6HsTNr19mTO8DTHDk0VigM%2B2%2B4GDcFCg%2FBAzD1i3NTHd1H44D0gjLo5Elq%2Fw%3D%3D`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.response.body.items.item;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  // 셀렉트 박스 업데이트 함수
  async function updateSubLocationOptions() {
    const selectedCity = citySelect.value;
    const subLocationSelect = document.getElementById("subLocation");
    console.log(subLocationSelect);

    // 이전에 선택된 구 제거
    subLocationSelect.innerHTML = '<option value="">소분류</option>';

    if (selectedCity) {
      const subLocations = await fetchSubLocations(selectedCity);
      subLocations.forEach((location) => {
        // 각 구를 옵션으로 추가
        const option = document.createElement("option");
        option.value = location.code;
        option.textContent = location.name;
        subLocationSelect.appendChild(option);
      });
    }
  }

  // 도시 선택 변경시 이벤트 리스너
  citySelect.addEventListener("change", updateSubLocationOptions);

  // 초기화
  updateSubLocationOptions();
});

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(map, marker, infowindow) {
  return function () {
    infowindow.open(map, marker);
  };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

var mapContainer = document.getElementById("map"); // 지도를 표시할 div
var mapOption = {
  center: new kakao.maps.LatLng(36.5991171331, 126.5100351022), // 초기 지도의 중심좌표
  level: 3, // 지도의 확대 레벨
};
var map = new kakao.maps.Map(mapContainer, mapOption);
var markers = [];
// 카카오 맵의 중심 좌표가 변경될 때마다 데이터를 가져오는 함수
// function getDataFromAPI() {
//   var center = map.getCenter(); // 맵의 중심 좌표를 가져옴
//   var url =
//     "https://apis.data.go.kr/B551011/KorService1/locationBasedList1?MobileOS=ETC&MobileApp=AppTest&_type=json&mapX=" +
//     center.getLng() +
//     "&mapY=" +
//     center.getLat() +
//     "&radius=1000&serviceKey=NHmBKryxoTzpzOQijbBqpbyIoX6HsTNr19mTO8DTHDk0VigM%2B2%2B4GDcFCg%2FBAzD1i3NTHd1H44D0gjLo5Elq%2Fw%3D%3D";

//   fetch(url)
//     .then((res) => res.json())
//     .then((myJson) => {
//       var markers = [];
//       this.stores = myJson.response.body.items.item; // 주어진 데이터에서 item 배열 추출

//       console.log(JSON.stringify(myJson, null, 1)); // JSON 데이터 출력

//       for (var i = 0; i < this.stores.length; i++) {
//         var store = this.stores[i]; // 각 매장 정보
//         var markerPosition = new kakao.maps.LatLng(
//           parseFloat(store.mapy),
//           parseFloat(store.mapx)
//         ); // 위도와 경도

//         var marker = new kakao.maps.Marker({
//           position: markerPosition,
//           title: store.title, // 마커에 표시할 타이틀
//         });

//         var infowindow = new kakao.maps.InfoWindow({
//           content:
//             '<div style="padding:5px;font-size:12px;">' +
//             store.title +
//             "</div>", // 정보창에 표시할 내용
//         });

//         markers.push(marker);

//         kakao.maps.event.addListener(
//           marker,
//           "mouseover",
//           makeOverListener(map, marker, infowindow)
//         );
//         kakao.maps.event.addListener(
//           marker,
//           "mouseout",
//           makeOutListener(infowindow)
//         );
//       }

//       clusterer.addMarkers(markers); // 클러스터에 마커 추가
//     });
// }
new MainPage(document, map, markers);

// 맵의 드래그 이벤트 등록
//kakao.maps.event.addListener(map, "dragend", getDataFromAPI);
