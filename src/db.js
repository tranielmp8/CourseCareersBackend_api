import Database from "better-sqlite3";

const db = new Database('favorites.db')

const createTable = `
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  )
`
db.exec(createTable);

const favorites = [
  {
    id: 0,
    name: 'goog', 
    url: 'https://google.com'
  },
  {
    id: 1,
    name: 'social', 
    url: 'https://instagram.com'
  },
  {
    id: 2,
    name: 'news', 
    url: 'https://yahoo.com'
  }
]

const insertData = db.prepare('INSERT INTO favorites (name, url) values (?,?)');

favorites.forEach((fav) => {
  insertData.run(fav.name, fav.url)
})

db.close();