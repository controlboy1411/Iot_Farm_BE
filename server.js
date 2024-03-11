require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')

global.XMLHttpRequest = require('xhr2')

const sqlserverConnection = require('./connections/sqlserver')
sqlserverConnection.createConnectionSqlServer()

const bodyParser = require('body-parser')
const port = Number(process.env.PORT || 9030)

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.json({ limit: process.env.SIZE_FILE_LIMIT }))
app.use(bodyParser.urlencoded({ extended: true, limit: process.env.SIZE_FILE_LIMIT }));

app.use(session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

app.use(cors({
    origin: '*',
    methods: 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
    optionsSuccessStatus: 200
}))

const authApi = require('./routers/authentication.router')
const masterDataApi = require('./routers/master-data.router')
const homeApi = require('./routers/home.router')
const dashboardApi = require('./routers/dashboard.router')
const reportApi = require('./routers/report.router')
const userApi = require('./routers/user.router')
const farmApi = require('./routers/farm.router')

app.get('/health-check', (req, res) => {
    res.status(200).json({ code: 200, message: `Service is running on port ${port}` })
})

app.use('/dashboard-api/auth', authApi)
app.use('/dashboard-api/master', masterDataApi)
app.use('/dashboard-api/home', homeApi)
app.use('/dashboard-api/dashboard', dashboardApi)
app.use('/dashboard-api/report', reportApi)
app.use('/dashboard-api/user', userApi)
app.use('/dashboard-api/farm', farmApi)

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})