import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Capacitor utilities setup
 * @returns {void}
 */
export const nativeSetup = async () => {
  Keyboard.setResizeMode({ mode: "none" });

  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#0f0f11' });
  StatusBar.setOverlaysWebView({ overlay: true });

  NavigationBar.setNavigationBarColor({ color: NavigationBarColor.TRANSPARENT, darkButtons: false });

  if (window.AndroidNotch) {
    const style = document.documentElement.style;
    window.AndroidNotch.getInsetTop(px => {
      style.setProperty('--ion-safe-area-top', (px + 5) + 'px');
    }, (err) => console.error('Failed to get insets top:', err));
  }
  // await requestPushPermissions();
  PushNotifications.addListener('registration', token => {
    saveToken(token.value);
  });

  Keyboard.addListener('keyboardDidShow', info => {
    const style = document.documentElement.style;
    style.setProperty('--keyboard-area', info.keyboardHeight + 'px');
  });

  Keyboard.addListener('keyboardDidHide', () => {
    const style = document.documentElement.style;
    style.setProperty('--keyboard-area', '0px');
  });
};

/**
 * Check if running on a native mobile platform.
 * @returns {boolean}
 */
export function isNative() {
  return Capacitor.isNativePlatform();
}

/**
 * Listen for app state changes (active/inactive).
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function onAppStateChange(callback) {
  const handler = App.addListener('appStateChange', callback);
  return () => handler.remove();
}

/**
 * Get current network status.
 * @returns {Promise<object>}
 */
export async function getNetworkStatus() {
  return await Network.getStatus();
}

/**
 * Listen for network status changes.
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function onNetworkStatusChange(callback) {
  const handler = Network.addListener('networkStatusChange', callback);
  return () => handler.remove();
}