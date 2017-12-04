const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const { find, findIndex } = require('lodash')
const _ = require('lodash')
const db = require('../data/db')
const courseListCollection = db.courseList

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

router.post('/', (req, res, next) => {

  console.log('UUID : ' + generateUUID())
  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  }

  const name = req.body.name

  // Check for name uniqueness
  const result = find(courseListCollection, { name })
  if (result) {
    return next(new BadRequestError('VALIDATION', 'Name should be unique'))
  }

  const newCourseList = {
    id: courseListCollection.length + 1,
    uuid : generateUUID(),
    name,
    items: [],
  }

  courseListCollection.push(newCourseList)

  res.json({
    data: newCourseList
  })
})

// AJOUTER UN ITEM
router.post('/:id', (req, res, next) => {

  const itemsList = courseListCollection[req.params.id - 1].items
  const newItem = req.body.items
  const resultItem = find(itemsList, {name : newItem});

  if (newItem === "" || newItem === null) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  } else if (resultItem) {
    return next(new BadRequestError('VALIDATION', 'Name should be unique'))
  } else {
    itemsList.push(
      {
        id: itemsList.length + 1,
        uuid : generateUUID(),
        name : newItem,
        done : false,
      }
    )
  }

  res.json({})
})

// AFFICHER LES ITEMS D'UNE LISTE

router.get('/:id', (req, res, next) => {
  /*const resultIdx = _.findIndex(courseListCollection, { id: req.params.id })
  if (resultIdx === -1){
    return next(new NotFoundError())
  }*/

  res.json({
    data: courseListCollection[req.params.id - 1].items
  })
})

// FLAG ITEMS

router.post('/:id/:idItem', (req, res, next) => {


  /*const resultIdx = findIndex(courseListCollection, { id: req.params.id })
  let resultIdxItem;

  if (resultIdx === -1) {
    return next(new NotFoundError())
  } else {
    resultIdxItem = findIndex(courseListCollection[req.params.id - 1].items, { id: req.params.idItem })
  }*/

  const itemsList = courseListCollection[req.params.id - 1].items

  /*if (resultIdxItem === - 1) {
    return next(new NotFoundError())
  } else */
  if (itemsList[req.params.idItem].done) {
    return next(new BadRequestError('VALIDATION', 'Item is already flagged'))
  } else {
    itemsList[req.params.idItem - 1].done = true
  }

  res.json({})
})

// SUPPRIMER LISTE
router.delete('/:id', (req, res, next) => {
  // let idURL = { id: req.params.id }
  const pageId = req.params.id
  const resultIdx = findIndex(courseListCollection, { id: pageId })
  // console.log("ID : " + req.params.id)

  if (resultIdx === -1) {
    return next(new NotFoundError())
  }
  else {
    courseListCollection.splice(resultIdx, 1)
  }

  res.json({})
})

router.get('/', (req, res, next) => {

  const resultLength = courseListCollection.length
  console.log("LENGTH : " + resultLength)
  if (resultLength === 0) {
    return next(new NotFoundError())
  }

  res.json({
    data: courseListCollection
  })
})



module.exports = router
