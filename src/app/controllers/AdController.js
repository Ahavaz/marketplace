const { Ad } = require('../models')

class AdController {
  async index (req, res) {
    const filters = {}

    filters.purchasedBy = { $exists: false }

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }

      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i')
    }

    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'],
      sort: '-createdAt'
    })

    return res.json(ads)
  }

  async show (req, res) {
    const ad = await Ad.findById(req.params.id).populate('author')

    return res.json(ad)
  }

  async store (req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId })

    return res.json(ad)
  }

  async update (req, res) {
    const { id } = req.params

    const ad = await Ad.findById(id).exists('purchasedBy', false)

    if (!ad) {
      return res.status(400).json({ error: 'Ad already sold or non existent' })
    }

    if (req.userId !== ad.author.toString()) {
      return res.status(400).json({ error: 'Operation not authorized' })
    }

    const updatedAd = await Ad.findByIdAndUpdate(id, req.body, {
      new: true
    })

    return res.json(updatedAd)
  }

  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)

    return res.send()
  }
}
module.exports = new AdController()
