import axios from 'axios';

export default async function initAxios() {
  let baseUrl = '';
  if (typeof window === 'undefined') {
    // 서버 사이드
    baseUrl = 'http://localhost:3000';
  } else {
    baseUrl = window.location.origin;
  }

  axios.defaults.baseURL = baseUrl;
}