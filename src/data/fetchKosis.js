const API_KEY = process.env.REACT_APP_KOSIS_API_KEY;

export async function fetchCowCount() {
  const url = `https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=${API_KEY}&itmId=T10+&objL1=ALL&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=Y&startPrdDe=2019&endPrdDe=2026&orgId=101&tblId=DT_1EO019`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('KOSIS API 호출 오류:', error);
    return null;
  }
}

export async function fetchMilkProduction() {
  const url = `https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=${API_KEY}&itmId=T10+&objL1=ALL&objL2=&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=Y&startPrdDe=2019&endPrdDe=2026&orgId=101&tblId=DT_1EO020`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('KOSIS API 호출 오류:', error);
    return null;
  }
}
