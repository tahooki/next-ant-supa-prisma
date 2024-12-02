import axios from 'axios';
import { headers } from 'next/headers';

export default async function initAxios() {
  console.log('initAxios!!!');
  let baseUrl = '';
  if (typeof window === 'undefined') {
    // 서버 사이드
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    baseUrl = `${protocol}://${host}`;
  } else {
    baseUrl = window.location.origin;
  }

  console.log('baseUrl : ', baseUrl);

  axios.defaults.baseURL = baseUrl;
}