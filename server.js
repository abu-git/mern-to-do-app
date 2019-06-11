const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require('path')
const cors = require("cors")
const passport = require("passport")
const helmet = require("helmet")

const users = require("./routes/userRoutes")
const tasks = require("./routes/taskRoutes")

const PORT = process.env.PORT || 3001

//Helmet's default security settings are used
app.use(helmet())

//Passport config
require("./config/passport")(passport)

app.use(cors())
app.use(bodyParser.json())

//Bodyparser
//this enables the app to use req.body
app.use(bodyParser.urlencoded({ extended: false }))

//DB config
const db = require("./config/keys").MongoURI

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

//Connect to Mongo
mongoose.set("useFindAndModify", false)
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected...")
  })
  .catch(err => {
    console.log(err)
  })

//Routes
app.use("/users", users)
app.use("/users", tasks)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT)
})

//app is exported so as to access it in test diretory for TDD testing
module.exports = app
