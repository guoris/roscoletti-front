class Socket {
  constructor(url) {
    this.url = url;
    this.listeners = {};

    this.retrys = 0;
    this.maxRetries = 9999;
    this.retryDelay = 3 * 1000;
    this.closeAfter = 30 * 1000;

    this.keepAliveInterval = setInterval(() => {
      this.send('heart');
    }, 50 * 1000);
  }

  connect() {
    if (this.connecting || this.connected) return;
    this.connecting = true;
    this.ws = new WebSocket(this.url);
    this.ws.onclose = (e) => this.events.close(e);
    this.ws.onopen = () => this.events.open();
    this.ws.onerror = (...err) => console.log('ws err', err);
    this.ws.onmessage = (m) => this.events.message(m);
    this.timeout = setTimeout(() => {
      this.events.close();
      this.fire('timeout');
    }, this.closeAfter);
  }

  kill() {
    console.log(`[DEBUG] Socket kill`);
    this.connecting = false;
    this.connected = false;
    this.started = false;
    this.clear();
    this.fire('shutdown');
    if (this.ws && (this.ws.readyState == 3 || this.ws.readyState == 2)) return;
    this.ws?.close();
  }

  disconnect() {
    this.connecting = false;
    this.connected = false;
    this.started = false;
    this.dontReconnect = true;
    this.clear();
    this.fire('disconnect');
    if (this.ws && (this.ws.readyState == 3 || this.ws.readyState == 2)) return;
    this.ws?.close();
  }

  retry() {
    if (this.connected) return;
    this.retrys++;
    if (this.retrys > this.maxRetries) {
      this.kill();
      return;
    }
    this.connect();
    this.fire('retry', this.retrys, this.maxRetries);
  }

  send(op, d) {
    if (!this.connected) return;
    const data = JSON.stringify({ op, ...d });
    this.ws?.send(data);
  }

  load() {
    return new Promise((r) => {
      this.interval = setInterval(() => {
        if (!this.ws || this.ws.readyState == 3 || this.ws.readyState == 2) return r();
        if (this.ws.readyState == 0) return;
        clearInterval(this.interval);
        r(true);
      }, 20);
    });
  }

  clear() {
    this.connecting = false;
    clearTimeout(this.timeout);
  }

  events = {
    open: async () => {
      if (!await this.load()) return;
      console.log('[DEBUG] Socket opened');
      this.clear();
      this.connected = true;
      this.started = true;
      this.retrys = 0;
      this.fire('open');
    },
    close: (e) => {
      this.fire('close');
      console.log('[DEBUG] Socket closed', e);
      this.authed = false;
      this.clear();
      this.connected = false;
      if (this.dontReconnect) return;
      setTimeout(() => {
        this.retry();
      }, this.retryDelay);
    },
    message: ({ data }) => {
      try {
        const { op, ...rest } = JSON.parse(data);
        this.fire(op, rest.data || rest);
      } catch (e) {
        this.fire('message', data);
      }
    }
  };

  functions = {
    open: n => n,
    close: n => n,
    retry: n => n,
    timeout: n => n,
    message: n => n,
    shutdown: n => n,
    message: n => n,
  };

  on(id, fn) {
    if (!this.listeners[id]) return this.listeners[id] = [fn];
    this.listeners[id].push(fn);
  }

  fire(id, ...data) {
    if (!this.listeners[id]) return;
    for (const listener of this.listeners[id]) {
      listener(...data);
    }
  }
}

export { Socket };