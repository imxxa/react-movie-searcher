import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { JssProvider } from 'react-jss'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheets } from '@material-ui/core/styles'
import reload from 'reload'

import App from './components/App'
import configureStore from './redux/store'

const app = express()

const port = 4000

const dev = process.env.NODE_ENV === 'development'

app.use(express.static('public'))

if (dev) {
  reload(app)
    .then(reloadReturned => {
      server.listen(app.get('port'), function () {
        console.log(`Web server listening on port ${app.get('port')}`)
      })
    })
    .catch(err => {
      console.error(
        'Reload could not start, could not start server/sample app',
        err
      )
    })
}

app.use((req, res) => {
  const context = {}

  const sheets = new ServerStyleSheets()

  const html = renderToString(
    sheets.collect(
      <JssProvider>
        <Provider store={configureStore()}>
          <StaticRouter location={req.url} context={context}>
              <App />
          </StaticRouter>
        </Provider>
      </JssProvider>
    )
  )

  const cssString = sheets.toString()

  res.send(`
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <meta http-equiv='X-UA-Compatible' content='ie=edge'>
      <title>Movie searcher</title>
      <link rel='shortcut icon' type='image/png' href='https://cdn.auth0.com/blog/react-js/react.png'/>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
      <link rel='stylesheet' href='/styles/main.css' />
      <style id="ssr-material-ui-styles">${cssString}</style>
    </head>
    <body>
      <div id='root'>${html}</div>
      <script type='text/javascript' src='bundle.js' async></script>
      ${dev ? '<script src="/reload/reload.js" async></script>' : ''}
    </body>
    </html>
  `)
})

app.listen(port, () =>
  console.log(`Web server listening on port http://localhost:${port}`)
)