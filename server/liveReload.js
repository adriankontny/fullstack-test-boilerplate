const WebSocket = require('ws')
const chokidar = require('chokidar')
const { join } = require('path')


module.exports = class LiveReload {
  constructor({ server }) {
    this.server = server
    this.wss = new WebSocket.Server({ server: this.server })
    this.watcher = chokidar.watch(join(process.cwd(), 'browser', 'dist'))

    this.watcher.on('change', () => {
      console.info('Reloading browser')
      try {
        this.ws && this.ws.send('reload')
      } catch (e) {
        console.warn(e)
        watcher.close()
      }
    })
  }

  listen() {
    this.wss.on('connection', (ws) => {
      this.ws = ws
    })
  }
}
