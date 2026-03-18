import { ref } from "vue";
import { env } from './state';

export const token = ref("");

class Fetch {
  constructor(url) {
    this.url = url;
    this.options = {};
  }

  get() {
    this.options.method = "GET";
    return this.exec();
  }

  post(content) {
    this.options.method = "POST";
    this.options.headers = this.options.headers || {};
    this.options.headers["Content-Type"] = "application/json";
    if (content) this.options.body = JSON.stringify(content);
    return this.exec();
  }

  patch(content) {
    this.options.method = "PATCH";
    this.options.headers = this.options.headers || {};
    this.options.headers["Content-Type"] = "application/json";
    if (content) this.options.body = JSON.stringify(content);
    return this.exec();
  }

  delete() {
    this.options.method = "DELETE";
    return this.exec();
  }

  bulkDelete(ids) {
    this.options.method = "DELETE";
    this.options.headers = this.options.headers || {};
    this.options.headers["Content-Type"] = "application/json";
    if (ids) this.options.body = JSON.stringify(ids);
    return this.exec();
  }

  auth() {
    this.options.headers = this.options.headers || {};
    this.options.headers["Authorization"] = `Bearer ${token.value}`;
    return this;
  }

  exec() {
    return new Promise((r) =>
      fetch(`${env.api}${this.url}`, this.options)
        .then(async (rawResponse) => {
          const response = await rawResponse.json();
          if (rawResponse.ok) {
            r(response);
          } else {
            r({ error: true, message: response?.message || "" });
          }
        })
        .catch(() => r({ error: true })),
    );
  }
}

const makeFilters = (filters) => (filters?.size ? `&search=${JSON.stringify([...filters].reduce((a, [k, v]) => ({ ...a, [k]: v }), {}))}` : "");
const makeSort = (sort) => (sort?.size ? [...sort].reduce((a, [k, v], i, arr) => (a += `${v == -1 ? "-" : ""}${k}${i + 1 !== arr.length ? "," : ""}`), "&sort=") : "");

// User Endpoints
export const getMe = () => new Fetch(`/user/me`).auth().get();

export const updateMe = (data) => new Fetch(`/user/me`).auth().patch(data);

export const loginUser = (data) => new Fetch(`/user/login`).post(data);

export const registerUser = (data) => new Fetch(`/user/register`).post(data);