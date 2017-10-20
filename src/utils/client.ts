import * as axios from 'axios';

export const client = axios.default.create({
  baseURL: 'http://localhost:2188/api',
});

client.defaults.headers.common['Authorization'] = window.localStorage.getItem('Token');
