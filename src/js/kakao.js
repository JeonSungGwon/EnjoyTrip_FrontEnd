// kakao 맵 초기화
export function initializeKakaoMap() {
    const mapContainer = document.getElementById("map"); // 지도를 표시할 div
    const mapOption = {
      center: new kakao.maps.LatLng(36.5991171331, 126.5100351022), // 초기 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    return new kakao.maps.Map(mapContainer, mapOption);
  }
  
  // 인포윈도우를 표시하는 클로저를 만드는 함수
  export function makeOverListener(map, marker, infowindow) {
    return function () {
      infowindow.open(map, marker);
    };
  }
  
  // 인포윈도우를 닫는 클로저를 만드는 함수
  export function makeOutListener(infowindow) {
    return function () {
      infowindow.close();
    };
  }