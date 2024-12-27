const express=require('express')
const app =express()
const auth = require('./routes/auth')
const booking = require('./routes/booking')

const PORT=5000;
var cors = require('cors')
app.use(cors())
app.use(express.json())


app.use('/auth',auth)
app.use('/booking',booking)
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
