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
