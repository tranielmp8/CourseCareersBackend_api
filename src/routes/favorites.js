import express from 'express';
import Database from 'better-sqlite3';

const db = new Database('favorites.db')

const router = express.Router();
// middleware
// router.use((req, res, next) => {
//   console.log('favorites hit')
//   next()
// })


router.get('/', (req, res) => {
  let query = 'SELECT * FROM favorites'
  let sort = req.query.sort;

  if(sort === 'asc') {
     query += ' ORDER BY name ASC'
  }else if (sort === 'desc') {
     query += ' ORDER BY name DESC'
  }

  const favorites = db.prepare(query).all()

  res.json({favorites})
})

// POST
router.post('/', (req, res) => {
  const { name, url } = req.body;

  if(!name) {
    return res.status(400).json({error: "Name required"})
  }
  
  if(!url) {
    return res.status(400).json({error: "URL required"})
  }

  const result = db
  .prepare('INSERT INTO favorites (name, url) VALUES (?, ?)')
  .run(name, url);
  res.status(201).json({id: result.lastInsertRowid})
})

router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const favorite = db.prepare('SELECT * FROM favorites WHERE id = ?').get(id);

    if(!favorite) {
      return res.status(404).json({error: "Favorite not found"});
    }

    res.json({favorite});
    
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      error: 'Something went wrong, try again later'
    })
  }
  
});

//DELETE
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const result = db.prepare('DELETE FROM favorites WHERE id = ?').run(id);
  console.log(result)

  if(!result.changes) {
    return res.status(404).json({error: "Favorite not found"});
  }

  res.sendStatus(200)
})

// PUT OR UPDATE
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, url } = req.body;

  if(!name) {
    return res.status(400).json({error: 'name required'})
  }
  if(!url) {
    return res.status(400).json({error: 'url required'})
  }

  const result = db
  .prepare('UPDATE favorites SET name=?, url=? WHERE id=?')
  .run(name, url, id);

  if(!result.changes) {
    return res.status(404).json({error: "Favorite not found"});
  }
  res.sendStatus(200);
});

// PATCH similar to put but patch is for a portion
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, url } = req.body;

  if(!name && !url) {
    return res.status(400).json({error: 'name or url required'})
  }
  // const favorite = db.prepare('SELECT * FROM favorites WHERE id = ?').get(id);

  // if(!favorite) {
  //   return res.status(404).json({error: 'Favorite not found'})
  // }

  // const newName = name || favorite.name;
  // const newUrl = url || favorite.url;
  const result = db
  .prepare('UPDATE favorites SET name=COALESCE(?, name), url=COALESCE(?, url) WHERE id=?')
  .run(name, url, id);

  // if(!result.changes) {
  //   return res.status(404).json({error: "Favorite not found"});
  // }
  if(!result.changes){
    return res.status(404).json({error: 'Favorite note found'})
  }
  res.sendStatus(200);
});

export default router