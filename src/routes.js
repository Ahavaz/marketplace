const express = require('express')
const validate = require('express-validation')
const handle = require('express-async-handler')
const authMiddleware = require('./app/middlewares/auth')
const {
  UserPost,
  SessionPost,
  AdPost,
  AdPut,
  PurchasePost
} = require('./app/validators')
const {
  UserController,
  SessionController,
  AdController,
  PurchaseController
} = require('./app/controllers')

const routes = express.Router()

routes.post('/users', validate(UserPost), handle(UserController.store))
routes.post('/sessions', validate(SessionPost), handle(SessionController.store))

routes.use(authMiddleware)

// Ads
routes.get('/ads', handle(AdController.index))
routes.get('/ads/:id', handle(AdController.show))
routes.post('/ads', validate(AdPost), handle(AdController.store))
routes.put('/ads/:id', validate(AdPut), handle(AdController.update))
routes.delete('/ads/:id', handle(AdController.destroy))

// Purchases
routes.post(
  '/purchases',
  validate(PurchasePost),
  handle(PurchaseController.store)
)
routes.put('/purchases/:id', handle(PurchaseController.update))

module.exports = routes
