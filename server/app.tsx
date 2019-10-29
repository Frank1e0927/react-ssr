import App from '../src/index'
import Koa from 'koa'
import React from 'react'
import fs from 'fs'
import koaStatic from 'koa-static'
import path from 'path'
import { renderToString } from 'react-dom/server'
import Router from 'koa-router';

const config = {
  port: 3030
}

const app = new Koa()

app.use(
  koaStatic(path.join(__dirname, '../dist'), {
    maxage: 365 * 24 * 60 * 1000,
    index: 'root'
  })
)

app.use(
  new Router().get(
    '*',
    async (ctx, next) => {
      ctx.response.type = 'html'
      let shtml = ''
      await new Promise((resolve, reject) => {
        fs.readFile(
          path.join(__dirname, '../build.index.html'),
          'utfa8',
          function(err, data) {
            if(err) {
              reject()
              return console.log(err)
            }
            shtml = data
            resolve()
          }
        )
      })
      ctx.response.body = shtml.replace('{{root}}', renderToString(<App />))
    }
  ).routes()
)

app.listen(config.port, function() {
  console.log('listing ')
})