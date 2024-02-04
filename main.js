require('dotenv').config()
const { allowedDomains, port } = require('./config')
const express = require('express')
const app = express()
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: [allowedDomains]
}))

app.use((req, res, next) => {
    if (process.env.NODE_ENV === "development") {

        console.log("development environment")
    } else {

        console.log("production environment")
    }
    next()
})

app.get('/', (req, res) => {
    console.log('[GET] - /')
    res.status(200).send({ status: 200, message: "[GET] - /" })
})

app.get('/products', async (req, res) => {


    // await prisma.$connect()
    
    // const products = prisma.products
    // console.log(products)
    // console.log('[GET] - /products')
    res.status(200).send({ status: 200, products: await prisma.products.findMany() })
    // res.status(200).send({ status: 200, message: "[GET] - /products" })
})

app.post('/products', async (req, res) => {
    console.log('[POST] - /products')
    
    const product = await prisma.products.upsert({
        where: { name: req.body.name },
        update: {},
        create: {
          name: req.body.name,
          price: req.body.price,
          free_shipping: req.body.free_shipping,
        },
      });

      console.log({ product });

    res.status(200).send(product)
    // res.status(200).send({ status: 200, message: "[POST] - /products" })
})

app.listen(port, () => {
    console.log(`listening on port ${port}...`)
})