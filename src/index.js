const { createServer } = require('restify')
const { AsyncLocalStorage } = require('async_hooks')
const express = require('express')

const context = new AsyncLocalStorage()
const framework = process.argv[2]

let app

switch (framework) {
  default:
    throw new Error(`Unsupported framework ${framework}, must be either "express" or "restify"`)
  case 'express':
    console.log('Using express...')
    app = express()
    break
  case 'restify':
    console.log('Using restify...')
    app = createServer()
    break
}

const middleware = (req, res, next) => {
  context.run({ prop: 'set in middleware'}, () => {
    next()
  })
}

app.use(middleware) // breaks context when using restify

app.get(
  '/', 
  // middleware // doesn't break context when using restify
  (req, res, next) => {
    try {
      if (framework === 'restify') {
        res.send(200)
      } else {
        res.sendStatus(200)
      }
      console.log('CONTEXT', context.getStore())
      next()
    } catch (e) {
      console.log('ERROR', e)
      next(e)
    }
  })

app.listen(10000, async () => {
  console.log('Up and running')
})

