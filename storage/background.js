import './sw-omnibox.js';
import './sw-tips.js';

const STORAGE_KEY = "clickCounter";
let clickCount = 0;

// 데이터 저장하기
function saveClickCount() {
  chrome.storage.local.set({ [STORAGE_KEY]: clickCount }, () => {
    console.log("클릭 수가 저장되었습니다:", clickCount);
  });
}

// 데이터 불러오기
async function loadClickCount() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      clickCount = result[STORAGE_KEY] || 0;
      console.log("저장된 클릭 수를 불러왔습니다:", clickCount);
      resolve(clickCount);
    });
  });
}

// 탭이 클릭될 때마다 카운트 증가하고 저장
chrome.tabs.onActivated.addListener(() => {
  clickCount++;
  console.log("현재 클릭 수:", clickCount);
  saveClickCount(); // 클릭할 때마다 저장
});

// 브라우저가 시작될 때 이전 데이터 로드
chrome.runtime.onStartup.addListener(async () => {
  await loadClickCount();
  console.log("브라우저 시작. 이전 클릭 수:", clickCount);
});

// 확장 프로그램이 설치되거나 업데이트될 때도 데이터 로드
chrome.runtime.onInstalled.addListener(async () => {
  await loadClickCount();
  console.log("확장프로그램 설치/업데이트. 이전 클릭 수:", clickCount);
});
