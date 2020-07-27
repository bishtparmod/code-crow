const config = require('../config/config');
const stripe = require('stripe')(config.stripe.stripe_sk)
const User = require('../models/user.model')
const moment = require('moment')

const pay = async(req, res) => {
    const { email, token, amount } = req.body
    try {
        const customer = await getCustomer(email)
        const source = await getSource(customer.id, token)
        const charge = await createCharge(amount, source.customer)
        if (charge.paid) {
            res.status(200).json(charge)
        } else {
            res.status(500).json(charge.message)
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

const createProduct = async(req, res) => {
    const { name, type, attributes, caption, description } = req.body
    try {
        const product = await stripe.products.create({ name, type, attributes, caption, description })
        res.status(200).json(product)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const updateProduct = async(req, res) => {
    const { name, type, attributes, caption, description, images, url } = req.body
    const obj = Object.values({ name, type, attributes, caption, description, images, url })
        .filter(value => !!(value))
    const productId = req.params.id
    try {
        const product = await stripe.products.update(productId, obj)
        res.status(200).json(product)
    } catch (e) {
        res.status(500).json(e)
    }
}

const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params
        const product = await stripe.products.del(id)
        res.status(200).json(product)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const getProduct = async(req, res) => {
    try {
        const { id } = req.params
        const products = await stripe.products.retrieve(id)
        res.status(200).json(products)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getProducts = async(req, res) => {
    try {
        const products = await stripe.products.list()
        res.status(200).json(products)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createPlan = async(req, res) => {
    try {
        const { amount, product, interval, interval_count, active, trial_period_days } = req.body
        const currency = "usd"
        const nickname = product['name']
        const plan = await stripe.plans.create({ amount, product, interval, currency, interval_count, active, trial_period_days, nickname })
        res.status(200).json(plan)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const updatePlan = async(req, res) => {
    try {
        const { active } = req.body
        const planId = req.params.id
        const plan = await stripe.plans.update(planId, { active })
        res.status(200).json(plan)
    } catch (e) {
        res.status(500).json(e)
    }
}


const deletePlan = async(req, res) => {
    const planId = req.params.id
    try {
        const plan = await stripe.plans.del(planId)
        res.status(200).json(plan)
    } catch (e) {
        console.log(">>STRIPE deletePlan: " + e)
        res.status(500).json(e)
    }
}

const getPlan = async(req, res) => {
    const planId = req.params.id
    try {
        const plan = await stripe.plans.retrieve(planId)
        res.status(200).json(plan)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getPlans = async(req, res) => {
    const { query } = req
    try {
        const plans = await stripe.plans.list(query)
        res.status(200).json(plans)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createRefund = async(req, res) => {
    const { charge, amount, reason } = req.body
    try {
        const refund = await stripe.refunds.create({ charge, amount, reason })
        res.status(200).json(refund)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getRefund = async(req, res) => {
    const refundId = req.params.id
    try {
        const refund = await stripe.refunds.retrieve(refundId)
        res.status(200).json(refund)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getRefunds = async(req, res) => {
    try {
        const refunds = await stripe.refunds.list()
        res.status(200).json(refunds)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createSubscription = async(req, res) => {
    try {
        const { planId, customerId, collection_method } = req.body
        const { id } = req.user
        const check = await getCustomerSubscriptions(customerId, planId)
        if (check.length)
            return res.status(403).json({ message: "You're already subscribed to this plan", subscription: check[0] })

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ plan: planId }],
            collection_method,
            days_until_due: collection_method == 'charge_automatically' ? undefined : 3
        })
        const updateModel = await User.findByIdAndUpdate(id, {
            subscription: { planId, startDate: new Date(), endDate: moment().add('30', 'days'), id: subscription.id }
        }, { new: true }).exec()
        res.status(200).json(subscription)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getSubsription = async(req, res) => {
    const subscriptionId = req.params.id
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        res.status(200).json(subscription)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getSubsriptions = async(req, res) => {
    try {
        const subscriptions = await stripe.subscriptions.list()
        res.status(200).json(subscriptions)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getCustomerSubscriptions = (customer, plan) => new Promise(async(resolve, reject) => {
    try {
        const subscriptions = await stripe.subscriptions.list({ customer, plan })
        const { data } = subscriptions
        resolve(data)
    } catch (e) {
        reject(e)
    }
})

const deleteSubscription = async(req, res) => {
    const subscriptionId = req.params.id
    try {
        const subscription = await stripe.subscriptions.del(subscriptionId)
        res.status(200).json(subscription)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createInvoice = async(req, res) => {

}

const getInvoice = async(req, res) => {
    const invoiceId = req.params.id
    try {
        const invoice = await stripe.invoices.retrieve(invoiceId)
        res.status(200).json(invoice)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getInvoices = async(req, res) => {
    try {
        const invoices = await stripe.invoices.list()
        res.status(200).json(invoices)
    } catch (e) {
        res.status(500).json(e)
    }
}

const payInvoice = async(req, res) => {
    const { source } = req.body
    const invoice = req.params.id
    try {
        const payment = await stripe.invoices.pay(invoice, { source })
        res.status(200).json(payment)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const setDefaultSource = async(req, res) => {
    const { default_source } = req.body
    const customerId = req.params.id
    try {
        const user = await stripe.customers.update(customerId, { default_source })
        res.status(200).json(user)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const getNextInvoices = async(req, res) => {

}

const createCharge = (amount, customer) => {
    return stripe.charges.create({
            amount: parseInt(amount) * 100,
            currency: 'USD',
            customer
        })
        .then(charge => charge)
        .catch(error => error)
}

const $createCharge = async(req, res) => {
    try {
        const { source, amount, description, customer } = req.body
        const charge = await stripe.charges.create({
            amount: parseInt(amount),
            currency: 'usd',
            source,
            description,
            customer
        })
        res.status(200).json(charge)
    } catch (e) {
        console.log("payment error ", e)
        res.status(500).json(e)
    }
}

const getCharges = async(req, res) => {
    try {
        const charges = await stripe.charges.list()
        res.status(200).json(charges)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getCharge = async(req, res) => {
    try {
        const chargeId = req.params.id
        const charge = await stripe.charges.retrieve(chargeId)
        res.status(200).json(charge)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createSource = (customerId, token) => {
    return stripe.customers.createSource(customerId, {
            source: token.id
        })
        .then(source => source)
        .catch(error => error)
}

const getSource = (customerId, token) => {
    return stripe.customers.listSources(
            customerId, {
                object: 'card'
            }
        )
        .then(async sources => {
            if (sources.data.length)
                return filterSources(sources.data, token.card)
            else {
                const source = await createSource(customerId, token)
                return source
            }
        })
        .catch(eror => eror)
}

const filterSources = (sources, card) => {
    return sources.filter(source => source.exp_month == card.exp_month && source.exp_year == card.exp_year && source.last4 == card.last4)[0]
}

const createCustomer = (email) => {
    return stripe.customers.create({
            email
        })
        .then(customer => customer)
        .catch(error => error)
}

const getCustomer = (email) => {
    return stripe.customers.list({
        limit: 1,
        email
    }).then(async customers => {
        if (customers.data.length) {
            return customers.data[0]
        } else {
            const customer = await createCustomer(email.toLowerCase())
            return customer
        }
    })
}

const getCustomerById = async(req, res) => {
    try {
        const customerId = req.params.id
        const customer = await stripe.customers.retrieve(customerId)
        res.status(200).json(customer)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getCustomerByEmail = async(req, res) => {
    try {
        const { email } = req.params
        const customer = await stripe.customers.list({ email })
        res.status(200).json(customer.data[0])
    } catch (e) {
        res.status(500).json(e)
    }
}

const getCustomers = async(req, res) => {
    try {
        const customers = await stripe.customers.list()
        res.status(200).json(customers)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getCustomerCards = async(req, res) => {
    try {
        const customerId = req.params.id
        const sources = await stripe.customers.listSources(customerId, { object: 'card' })
        res.status(200).json(sources)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createCustomerSource = async(req, res) => {
    const customerId = req.params.id
    const { token } = req.body
    try {
        const source = await stripe.customers.createSource(customerId, {
            source: token.id
        })
        res.status(200).json(source)
    } catch (e) {
        res.status(500).json(e)
    }
}

const deleteCustomerSource = async(req, res) => {
    const { id, fk } = req.params

    try {
        const source = await stripe.customers.deleteSource(id, fk)
        res.status(200).json(source)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createSKU = async(req, res) => {
    const { price, product, attributes } = req.body
    try {
        const sku = await stripe.skus.create({ price, product, attributes, currency: 'usd', inventory: { type: 'infinite' } })
        res.status(200).json(sku)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const deleteSKU = async(req, res) => {
    try {
        const { id } = req.params
        const sku = await stripe.skus.del(id)
        res.status(200).json(sku)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

const getSKU = async(req, res) => {
    try {
        const { id } = req.params
        const sku = await stripe.skus.retrieve(id)
        res.status(200).json(sku)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getSKUs = async(req, res) => {
    try {
        const { query } = req
        const skus = await stripe.skus.list(query)
        res.status(200).json(skus)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getProductSKUs = async(req, res) => {
    try {
        const { id } = req.params
        const skus = await stripe.skus.list({ product: id })
        res.status(200).json(skus)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getSetupIntents = async(req, res) => {
    try {
        const { customerId } = req.params
        const setupIntents = await stripe.setupIntents.list({ customer: customerId })
        res.status(200).json(setupIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getSetupIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        console.log("getsetup intent",req.params)
        const setupIntents = await stripe.setupIntents.retrieve(customerId)
        res.status(200).json(setupIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createSetupIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        console.log("setup intent",req.params)
        const setupIntents = await stripe.setupIntents.create({ customer: customerId })
        res.status(200).json(setupIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const updateSetupIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const setupIntents = await stripe.setupIntents.update({ confirm: true, customer: customerId })
        res.status(200).json(setupIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const confirmSetupIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const setupIntents = await stripe.setupIntents.confirm(customerId)
        res.status(200).json(setupIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const cancelSetupIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const setupIntents = await stripe.setupIntents.cancel(customerId)
        res.status(200).json(setupIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getPaymentIntents = async(req, res) => {
    try {
        const { customerId } = req.params
        const paymentIntents = await stripe.paymentIntents.list({ customer: customerId })
        res.status(200).json(paymentIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const getPaymentIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const paymentIntents = await stripe.paymentIntents.retrieve(customerId)
        res.status(200).json(paymentIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const createPaymentIntent = async(req, res) => {
    try {
        const { customerId, amount, currency } = req.params
        const paymentIntents = await stripe.paymentIntents.create(customerId, { amount, currency, confirm: true, customer: customerId, setup_future_usage: 'off_session' })
        res.status(200).json(paymentIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const updatePaymentIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const paymentIntents = await stripe.paymentIntents.update({ confirm: true, customer: customerId })
        res.status(200).json(paymentIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const confirmPaymentIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const paymentIntents = await stripe.paymentIntents.confirm(customerId)
        res.status(200).json(paymentIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const capturePaymentIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const { amount } = req.body;
        const paymentIntents = await stripe.paymentIntents.capture(customerId)
        res.status(200).json(paymentIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

const cancelPaymentIntent = async(req, res) => {
    try {
        const { customerId } = req.params
        const paymentIntents = await stripe.paymentIntents.cancel(customerId)
        res.status(200).json(paymentIntents)
    } catch (e) {
        res.status(500).json(e)
    }
}

module.exports = {
    pay,
    createProduct,
    updateProduct,
    getProduct,
    getProducts,
    deleteProduct,
    createPlan,
    updatePlan,
    getPlan,
    getPlans,
    deletePlan,
    getRefund,
    getRefunds,
    createRefund,
    createSubscription,
    deleteSubscription,
    getSubsription,
    getSubsriptions,
    getCustomers,
    getCustomer,
    getCharge,
    getCharges,
    getCustomerById,
    getInvoices,
    getCustomerCards,
    getCustomerByEmail,
    createCustomerSource,
    getInvoice,
    payInvoice,
    setDefaultSource,
    createCustomer,
    deleteCustomerSource,
    createSKU,
    getSKU,
    deleteSKU,
    getSKUs,
    getProductSKUs,
    $createCharge,

    getSetupIntents,
    getSetupIntent,
    createSetupIntent,
    updateSetupIntent,
    confirmSetupIntent,
    cancelSetupIntent,

    getPaymentIntents,
    getPaymentIntent,
    createPaymentIntent,
    updatePaymentIntent,
    confirmPaymentIntent,
    capturePaymentIntent,
    cancelPaymentIntent
}