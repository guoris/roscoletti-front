import { useMediaQuery } from "@vueuse/core";
import { reactive, ref, watch } from "vue";
import { getMe, token } from "./fetch";
import { Socket } from "./ws";

export const modals = reactive([]);
export const loading = reactive({});

export const waitForMe = reactive({
  initial: true,
  force: false
});

export const dim = ref(false);
/**
 * @type {import('vue').Ref<null | {
 *   id: number,
 *   username: string,
 *   email: string,
 *   twoFactor: {
 *     enabled: string,
 *   },
 *   avatar: string,
 *   balance: number,
 *   role?: string,
 * }>}
 */
export const user = ref(null);
export const isAdmin = ref(false);
export const loggingIn = ref(false);
export const gettingUser = ref(false);
export const isAuthenticated = ref(false);

export const loginModal = ref(false);

export const isMobileResolution = useMediaQuery(`(max-width: 850px)`);

const login = () => new Promise(r => {
  const check = v => {
    if (user.value) isAuthenticated.value = true;
    r();
  };
  if (!gettingUser.value) return check();
  watch(gettingUser, check);
});

export const logout = () => {
  document.cookie = `access_token=null; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/`;
  user.value = null;
};

export const modal = {
  error: m => {
    const id = crypto.randomUUID();

    modals.push({
      error: true,
      message: m,
      id
    });

    setTimeout(() => {
      const index = modals.findIndex(x => x.id == id);
      modals.splice(index, 1);
    }, 8000);
  },
  warn: m => {
    const id = crypto.randomUUID();

    modals.push({
      warn: true,
      message: m,
      id
    });

    setTimeout(() => {
      const index = modals.findIndex(x => x.id == id);
      modals.splice(index, 1);
    }, 10000);
  },
  success: m => {
    const id = crypto.randomUUID();

    modals.push({
      success: true,
      message: m,
      id
    });

    setTimeout(() => {
      const index = modals.findIndex(x => x.id == id);
      modals.splice(index, 1);
    }, 10000);
  },
};

if (!import.meta.env.VITE_DOMAIN && !import.meta.env.DEV) throw new Error('Missing .ENV on production.\n\n\n\n\n\n\n\n\n');
const protocol = import.meta.env.VITE_PROTOCOL || (import.meta.env.DEV ? 'http' : 'https');
const wsProtocol = import.meta.env.VITE_PROTOCOL || (import.meta.env.DEV ? 'ws' : 'wss');
export const env = {
  url: import.meta.env.VITE_DOMAIN ? `${protocol}://${import.meta.env.VITE_DOMAIN}` : import.meta.env.DEV ? `${protocol}://localhost` : null,
  ws: import.meta.env.VITE_DOMAIN ? `${import.meta.env.VITE_API_URL.replace('http', 'ws')}/wss` : import.meta.env.DEV ? `${wsProtocol}://localhost/wss` : null,
  api: import.meta.env.VITE_API_URL || 'http://localhost',
  cdn: import.meta.env.VITE_CDN_URL || 'https://api.baux.ar/images',
  domain: import.meta.env.VITE_DOMAIN || (import.meta.env.DEV ? 'localhost' : null)
};

export const socket = reactive(new Socket(env.ws));

export async function getCookie(n) {
  const name = n + "=";
  let ca = decodeURIComponent(document.cookie).split(";");
  for (let i = 0; i < ca.length; i++) {
    while (ca[i].charAt(0) == " ") ca[i] = ca[i].substring(1);
    if (ca[i].indexOf(name) == 0)
      return ca[i].substring(name.length, ca[i].length);
  }
  return "";
}

export async function fetchUser(t) {
  token.value = t || await getCookie('access_token');
  if (!token.value) return;
  gettingUser.value = true;
  const response = await getMe();
  gettingUser.value = false;
  if (response.error) return user.value = null;
  user.value = response;
}

export async function isAuth() {
  await login();
  if (!isAuthenticated.value) return { path: '/login' };
  return true;
}

export async function isNotAuth() {
  await login();
  return true;
}

export async function isNotAuthOnly() {
  await login();
  if (isAuthenticated.value) return { path: '/' };
  return true;
}

export async function isAdm() {
  await login();
  if (!isAdmin.value) return { path: '/' };
  return true;
}

// (async () => {
//   await fetchUser();
//   if (gettingUser.value) await until(gettingUser).changed();
//   // socket.connect();
//   waitForMe.initial = false;
//   if (user.value) isAuthenticated.value = true;
//   if (user.value?.role == 'admin') isAdmin.value = true;
// })();