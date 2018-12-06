const Mail = require('../services/Mail')

class PurchaseMail {
  get key () {
    return 'PurchaseMail'
  }

  async handle (job, done) {
    const { _id: purchase, ad, buyer, content } = job.data

    await Mail.sendMail({
      from: `"${buyer.name}" <${buyer.email}>`,
      to: ad.author.email,
      subject: `Solicitação de compra: ${ad.title}`,
      template: 'purchase',
      context: { purchase, ad, buyer, content }
    })

    return done()
  }
}

module.exports = new PurchaseMail()
