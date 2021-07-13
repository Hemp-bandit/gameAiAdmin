import axios from 'axios';
import { LISTTYPE } from '@/utile/cosnt';
import { ElMessage } from 'element-plus';
import router from '@/router';

const entity = axios.create({
  baseURL: 'http://localhost:3004/gameApi', //'http://weita.online/gameApi',
  timeout: 5000,
});

entity.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  config.headers = {
    Authorization: token || '',
  };
  return config;
});
entity.interceptors.response.use(value => {
  const { data } = value;
  if (data.code !== 0) {
    ElMessage.error(data.msg);
    if (data.code === 403) {
      router.replace('/login');
    } else {
      return Promise.reject(new Error(data.msg));
    }
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
  listtype: LISTTYPE,
): Promise<{ data: any[]; total: number }> {
  return await entity.post('/game/queryGameList', {
    listtype,
  });
}

export async function createGame(params: any): Promise<baseRsp> {
  return await entity.post('/game/createGame', params);
}

export async function updateGameInfo(params: any) {
  return await entity.post('/game/updateGameInfo', { gameInfo: params });
}

export async function searchGame(parm: any) {
  return await entity.post('/game/searchGame', parm);
}

export async function createWord(data: any): Promise<baseRsp> {
  return await entity.post('/game/createWord', { wordInfo: data });
}

export async function updateWord(data: any): Promise<baseRsp> {
  return await entity.post('/game/updateWord', { wordInfo: data });
}

export async function queryMsgList(params: any) {
  return await entity.post('msg/searchMsg', params);
}

export async function updateMsg(params: any): Promise<baseRsp> {
  return await entity.post('/msg/updateMsg', { msg: params });
}
