export function navigateTo(page) {
  window.location.href = page;
}

export function searchAPI(keyword, selectedCity, selectedSubLocation) {
  return `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?MobileOS=ETC&MobileApp=%EC%97%AC%ED%96%89&_type=json&arrange=O&keyword=${encodeURIComponent(
    keyword
  )}&areaCode=${selectedCity}&sigunguCode=${selectedSubLocation}&serviceKey=NHmBKryxoTzpzOQijbBqpbyIoX6HsTNr19mTO8DTHDk0VigM%2B2%2B4GDcFCg%2FBAzD1i3NTHd1H44D0gjLo5Elq%2Fw%3D%3D`;
}

export async function requestData(url) {
  let data;
  await fetch(url)
    .then((res) => {
      data = res.json();
    })
    .catch((data = null));
  return data;
}
