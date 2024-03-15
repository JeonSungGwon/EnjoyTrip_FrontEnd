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
  center: new kakao.maps.LatLng(36.3890161659, 127.35127), // 초기 지도의 중심좌표
  level: 3, // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption);

var clusterer = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  minLevel: 5, // 클러스터 할 최소 지도 레벨
});

// 카카오 맵의 중심 좌표가 변경될 때마다 데이터를 가져오는 함수
function getDataFromAPI() {
  var center = map.getCenter(); // 맵의 중심 좌표를 가져옴
  var url =
    "https://apis.data.go.kr/B551011/KorService1/locationBasedList1?MobileOS=ETC&MobileApp=AppTest&_type=json&mapX=" +
    center.getLng() +
    "&mapY=" +
    center.getLat() +
    "&radius=1000&serviceKey=NHmBKryxoTzpzOQijbBqpbyIoX6HsTNr19mTO8DTHDk0VigM%2B2%2B4GDcFCg%2FBAzD1i3NTHd1H44D0gjLo5Elq%2Fw%3D%3D";

  fetch(url)
    .then((res) => res.json())
    .then((myJson) => {
      var markers = [];
      const stores = myJson.response.body.items.item; // 주어진 데이터에서 item 배열 추출

      console.log(JSON.stringify(myJson, null, 1)); // JSON 데이터 출력

      for (var i = 0; i < stores.length; i++) {
        var store = stores[i]; // 각 매장 정보
        var markerPosition = new kakao.maps.LatLng(parseFloat(store.mapy), parseFloat(store.mapx)); // 위도와 경도

        var marker = new kakao.maps.Marker({
          position: markerPosition,
          title: store.title, // 마커에 표시할 타이틀
        });

        var infowindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:5px;font-size:12px;">' + store.title + "</div>", // 정보창에 표시할 내용
        });

        markers.push(marker);

        kakao.maps.event.addListener(
          marker,
          "mouseover",
          makeOverListener(map, marker, infowindow)
        );
        kakao.maps.event.addListener(marker, "mouseout", makeOutListener(infowindow));
      }

      clusterer.addMarkers(markers); // 클러스터에 마커 추가
    });
}

// 맵의 드래그 이벤트 등록
kakao.maps.event.addListener(map, "dragend", getDataFromAPI);
