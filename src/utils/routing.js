import { useRouter } from "vue-router";
import * as icons from "../icons";
import { isAdm, isAuth, isNotAuth, isNotAuthOnly } from "./state";

const pageModules = import.meta.glob(['/pages/**.vue', '/pages/**/**.vue']);

/**
 * @typedef {Object} RouteConfig
 * @property {any} [featureFlag] Feature flag integration
 * @property {boolean} [onHeader] Show on the main header
 * @property {boolean} [offHeader] Hidden on the main header
 */

/**
 * Manages application routes and their configuration.
 */
export class RouteManager {
  /**
   * Initializes a new RouteManager.
   */
  constructor() {
    /** @type {Map<string, RouteConfig>} */
    this.routes = new Map();
    /** @type {RouteConfig} */
    this.currentRoute = {};
  }

  /**
   * Sets the current route by path.
   * @param {string} path
   * @returns {this}
   */
  set(path) {
    const item = this.routes.get(path);
    this.currentRoute = item || {};
    return this;
  }

  /**
   * Adds a new route.
   * @param {string} path
   * @returns {this}
   */
  add(path) {
    this.wrap();
    if (path == '*') path = '/:pathMatch(.*)*';
    this.currentRoute = { path, permissions: new Map([]) };
    return this;
  }

  /**
   * Sets the route as requiring authentication.
   * @returns {this}
   */
  auth() {
    this.currentRoute.beforeEnter = isAuth;
    this.currentRoute.type = 'auth';
    return this;
  }

  /**
   * Sets the route as requiring no authentication.
   * @returns {this}
   */
  unauth() {
    this.currentRoute.beforeEnter = isNotAuth;
    this.currentRoute.type = 'unauth';
    return this;
  }

  /**
   * Sets the route as accessible only to unauthenticated users.
   * @returns {this}
   */
  unauthOnly() {
    this.currentRoute.beforeEnter = isNotAuthOnly;
    this.currentRoute.type = 'unauthOnly';
    return this;
  }

  /**
   * Sets the route as requiring admin privileges.
   * @returns {this}
   */
  admin() {
    this.currentRoute.beforeEnter = isAdm;
    this.currentRoute.type = 'admin';
    return this;
  }

  /**
   * Configures the current route.
   * @param {Partial<RouteConfig>} obj
   * @returns {this}
   */
  config(obj = {}) {
    Object.assign(this.currentRoute, obj);
    return this;
  }

  /**
   * Saves the current route to the routes map.
   * @returns {this|undefined}
   */
  wrap() {
    if (!Object.keys(this.currentRoute).length) return;
    const { path } = this.currentRoute;
    this.routes.set(path, this.currentRoute);
    return this;
  }

  /**
   * Sets the component for the current route by file name.
   * @param {string} name
   * @returns {this}
   */
  file(name) {
    const fn = name => Object.entries(pageModules).find(([n]) => `/pages/${name}.vue` == n)?.[1];
    this.currentRoute.component = fn(name);
    return this;
  }

  /**
   * Sets the title for the current route.
   * @param {string} content
   * @returns {this}
   */
  title(content) {
    this.currentRoute.title = content;
    return this;
  }

  /**
   * Sets the description for the current route.
   * @param {string} content
   * @returns {this}
   */
  description(content) {
    this.currentRoute.description = content;
    return this;
  }

  /**
   * Sets permissions for the current route.
   * @param {...any} list
   * @returns {this}
   */
  perms(...list) {
    this.currentRoute.permissions = new Map(list.map(x => [x, true]));
    return this;
  }

  /**
   * Sets the icon for the current route.
   * @param {string} name
   * @returns {this}
   */
  icon(name) {
    this.currentRoute.icon = icons[name];
    return this;
  }

  getRoutes() {
    return [...this.routes].map(x => x[1]).filter(x => !x.featureFlag);
  }

  get navigation() {
    return [...this.routes].filter(x => x[1].onHeader).map(x => {
      const { path, title, description, permissions, featureFlag, type, icon } = x[1];
      return { to: path, icon, title, permissions, featureFlag, type, description };
    });
  }
}