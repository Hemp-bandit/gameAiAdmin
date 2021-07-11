import axios from 'axios';
import { LISTTYPE } from '@/utile/cosnt';

const token = localStorage.getItem('token');
const entity = axios.create({
  baseURL: 'http://localhost:3003/gameApi',
  timeout: 5000,
  headers: {
    Authorization: token || '',
  },
});

entity.interceptors.response.use(value => {
  const { data } = value;
  if (data.code !== 0) {
    return Promise.reject(new Error(data.msg));
  } else {
    return data;
  }
});

type baseRsp = {
  code: number;
  msg: string;
};
export async function login(params: {
  username: string;
  password: string;
}): Promise<{ token: string }> {
  return await entity.post('/user/login', params);
}

export async function queryGameList(
  offset: number,
  listtype: LISTTYPE,
): Promise<{ data: any[]; total: number }> {
  return await entity.post('/game/queryGameList', {
    size: 10,
    offset,
    listtype,
  });
}

export async function createGame(params: any): Promise<baseRsp> {
  return await entity.post('/game/createGame', params);
}

export async function updateGameInfo(params: any) {
  return await entity.post('/game/updateGameInfo', {gameInfo:params});
}
