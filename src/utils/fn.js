import { useScrollLock } from "@vueuse/core";
import { token } from "./fetch";
import { dim, env, user } from "./state";

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value).replace('$', '');
}

export function shuffleArray(array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function formatDateLocale(date) {
  const d = new Date(date);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function setDim(v) {
  dim.value = !!v;
  document.documentElement.style.overflow = !!v ? 'hidden' : '';
};

export async function saveUserSession(u, t) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  document.cookie = `access_token=${t}; domain=${env.domain}; expires=${date.toUTCString()}; path=/;`;
  user.value = u;
  token.value = t;
};

export const parseMarkdown = markdownText => {
  const htmlText = markdownText
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gims, "<span class='bold'>$1</span>")
    .replace(/!\[(.*?)\]\((.*?)\)/gims, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gims, "<a class='link' href='$2' target='_blank'>$1</a>")
    .replace(/\n/gim, "<br />");
  return htmlText;
};