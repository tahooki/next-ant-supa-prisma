import axios from 'axios';
import { headers } from 'next/headers';

export default async function initAxios() {
  let baseUrl = '';
  if (typeof window === 'undefined') {
    // 서버 사이드
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    baseUrl = `${protocol}://${host}`;
  }

  axios.defaults.baseURL = baseUrl;
}
