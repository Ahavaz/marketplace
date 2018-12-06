const { Ad, Purchase } = require('../models')
const { PurchaseMail } = require('../jobs')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad } = req.body

    const hasPurchase = await Purchase.findOne({ ad, buyer: req.userId })

    if (hasPurchase) {
      return res.status(400).json({ error: 'Purchase intention already sent' })
    }

    const hasAd = await Ad.findById(ad)

    if (!hasAd) {
      return res.status(400).json({ error: 'Ad not found' })
    }

    if (hasAd.purchasedBy) {
      return res.status(400).json({ error: 'Ad already sold' })
    }

    const newPurchase = await Purchase.create({
      ...req.body,
      buyer: req.userId
    })

    const purchase = await Purchase.findById(newPurchase)
      .populate({ path: 'ad', populate: { path: 'author' } })
      .populate('buyer')

    Queue.create(PurchaseMail.key, purchase).save()

    return res.json(purchase)
  }

  async update (req, res) {
    const { id } = req.params

    const purchase = await Purchase.findById(id).populate('ad')

    if (!purchase) {
      return res.status(400).json({ error: 'Purchase intention not found' })
    }

    if (req.userId !== purchase.ad.author.toString()) {
      return res.status(400).json({ error: 'Operation not authorized' })
    }

    if (purchase.ad.purchasedBy) {
      return res.status(400).json({ error: 'Ad already sold' })
    }

    const soldAd = await Ad.findByIdAndUpdate(
      purchase.ad,
      { purchasedBy: id },
      {
        new: true
      }
    )

    return res.json(soldAd)
  }
}

module.exports = new PurchaseController()
