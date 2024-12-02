import axios from 'axios';

export default async function initAxios() {
  console.log('initAxios!!!');
  let baseUrl = '';
  if (typeof window === 'undefined') {
    // 서버 사이드
    baseUrl = 'http://localhost:3000';
  } else {
    baseUrl = window.location.origin;
  }

  console.log('baseUrl : ', baseUrl);

  axios.defaults.baseURL = baseUrl;
}