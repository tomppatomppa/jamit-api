const { Bookmark } = require('../models')

const router = require('express').Router()

router.get('/', async (req, res) => {
  const bookmarks = await Bookmark.findAll({
    where: {
      user_id: req.user.id,
    },
  })
  res.status(200).json(bookmarks)
})

router.get('/:id', async (req, res) => {
  const bookmarks = await Bookmark.findByPk(req.params.id, {
    where: {
      user_id: req.user.id,
    },
  })
  res.status(200).json(bookmarks)
})

router.post('/', async (req, res) => {
  const bookmarkExists = await Bookmark.findOne({
    where: {
      user_id: req.user.id,
      table_reference: req.body.table_reference,
      item_reference: req.body.item_reference,
    },
  })

  if (bookmarkExists) {
    return res.status(200).json('Bookmark already exists')
  }

  await Bookmark.create({ ...req.body, user_id: req.user.id })

  res.status(200).json('Bookmark added')
})

router.delete('/:id', async (req, res) => {
  const bookmark = await Bookmark.findByPk(req.params.id)

  if (!bookmark) {
    return res.status(404).json({ error: 'Bookmark not found' })
  }

  if (bookmark.user_id !== req.user.id) {
    return res.status(403).json({ error: 'No permission' })
  }

  await bookmark.destroy()

  res.status(200).json('Bookmark removed')
})

router.delete('/', async (req, res) => {
  const arrayOfIds = req.query.ids.split(',')
  console.log(arrayOfIds)
  await Bookmark.destroy({
    where: {
      user_id: req.user.id,
      bookmark_reference: arrayOfIds,
    },
  })

  res.status(200).json('Bookmarks removed')
})

module.exports = router
