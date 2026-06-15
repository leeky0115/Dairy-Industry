const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO = 'leeky0115/Dairy-Industry';
const FILE_PATH = 'src/data/dairyData.json';

export async function uploadToGitHub(data) {
  if (!GITHUB_TOKEN) {
    console.error('GitHub Token이 없어요');
    return false;
  }

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  try {
    // 현재 파일 SHA 가져오기
    const getRes = await fetch(apiUrl, { headers });
    const getJson = await getRes.json();
    const sha = getJson.sha;

    // 파일 업데이트
    const content = btoa(unescape(encodeURIComponent(
      JSON.stringify(data, null, 2)
    )));

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `데이터 업데이트: ${new Date().toLocaleDateString('ko-KR')}`,
        content,
        sha
      })
    });

    if (putRes.ok) {
      console.log('GitHub 업로드 성공!');
      return true;
    } else {
      console.error('GitHub 업로드 실패:', await putRes.text());
      return false;
    }
  } catch (err) {
    console.error('GitHub API 오류:', err);
    return false;
  }
}
