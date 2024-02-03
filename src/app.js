import express from 'express';
import Database from 'better-sqlite3';
import favorites from '../src/routes/favorites.js'

const db = new Database('favorites.db')

const app = express();
const port = 3000;

//middleware
app.use(express.json()); //

// app.use((req, res, next) => {
//   console.log('hit 1');
//   next()
// })
// app.use((req, res, next) => {
//   console.log('hit 2');
//   next()
// })

// const authenticate = (req, res, next) => {
//   console.log('Pre-Processing');
//   next()
// }

//routes
app.use('/favorites', favorites)

//error handling
app.use((err, req, res, next) => {
  console.log(err);
  if(err.name === 'sqliteError'){
    console.log("db error hit!")
  }
  next(err)
})


app.listen(port, () => {
  console.log(`listening on http://localhost:${port}...`)
})