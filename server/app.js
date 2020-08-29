const http = require('http')
const express = require('express')
const loadManifest = require('./loadManifest')
const sqlite3 = require('sqlite3')
const LiveReload = require('./liveReload')

function renderIndexHtml() {
  const manifest = loadManifest()
  const scripts = Object.values(manifest).filter(url => url.match(/\.js$/))

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>TODOs</title>
  </head>
  <body>
    <main></main>
    ${scripts.map(url => `<script type="text/javascript" src="/dist/${url}"></script>`).join('\n')}
  </body>
</html>
  `
}

module.exports = function () {
  const app = express()

  app.get('/api/todos/:user', (req, res) => {
    const db = new sqlite3.Database(process.env.DB || process.cwd() + '/app.db')

    db.all(`SELECT * FROM todos WHERE user = ?`, req.params.user, (_, rows) => {
      if (rows.length) {
        res.json(rows)
      } else {
        res.status(404).send(`Could not find ${req.params.user}'s TODOs`)
      }
      db.close()
    })
  })

  app.use('/dist/', express.static(
    `${process.cwd()}/browser/dist/`,
    { maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0 }
  ))

  app.get('/*', (req, res) => {
    res.type('html')
    res.send(renderIndexHtml())
  })

  return app
}

if (!module.parent) {
  const port = process.env.PORT || 5000
  const app = module.exports()
  const server = http.createServer(app)

  new LiveReload({ server }).listen()

  server.listen(port, () => {
    console.info(`listening on http://localhost:${port}`)
  })
}
