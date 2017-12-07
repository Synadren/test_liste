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


// CREATE NEW COURSELIST
router.post('/', (req, res, next) => {

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
    // id: courseListCollection.length + 1,
    uuid : generateUUID(),
    name,
    items: [],
  }

  courseListCollection.push(newCourseList)

  res.json({
    data: newCourseList
  })
})


// ADD AN ITEM
router.post('/:uuid', (req, res, next) => {

  const resultIdx = findIndex(courseListCollection, { uuid: +req.params.uuid })
  if (resultIdx === -1){
    return next(new NotFoundError())
  }

  const itemsList = courseListCollection[resultIdx].items
  const newItem = req.body.items
  const resultItem = find(itemsList, {name : newItem});

  if (!newItem) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  } else if (resultItem) {
    return next(new BadRequestError('VALIDATION', 'Name should be unique'))
  } else {
    itemsList.push(
      {
        // id: itemsList.length + 1,
        uuid : generateUUID(),
        name : newItem,
        done : false,
      }
    )
  }

  res.json({})
})


// DISPLAY ITEMS
router.get('/:uuid', (req, res, next) => {

  const resultIdx = findIndex(courseListCollection, { uuid: +req.params.uuid })
  if (resultIdx === -1){
    return next(new NotFoundError())
  } else if (courseListCollection[resultIdx].items.length === 0) {
    return next(new BadRequestError('VALIDATION', 'There should have item in this list'))
  }

  console.log("TITRE " + courseListCollection[resultIdx].items)

  res.json({
    data: courseListCollection[resultIdx].items
  })
})


// FLAG ITEMS
router.post('/:uuid/:uuidItem', (req, res, next) => {

  const resultIdx = findIndex(courseListCollection, { uuid: +req.params.uuid })
  let resultIdxItem;

  if (resultIdx === -1) {
    return next(new NotFoundError())
  } else {
    resultIdxItem = findIndex(courseListCollection[resultIdx].items, { uuid: +req.params.uuidItem })
    if (resultIdxItem === - 1) {
      return next(new NotFoundError())
    }
  }

  const itemsList = courseListCollection[resultIdx].items

  if (itemsList[resultIdxItem].done) {
    return next(new BadRequestError('VALIDATION', 'Item is already flagged'))
  } else {
    itemsList[resultIdxItem].done = true
  }

  res.json({})
})


// DELETE LIST
router.delete('/:uuid', (req, res, next) => {

  const resultIdx = findIndex(courseListCollection, { uuid: +req.params.uuid })

  if (resultIdx === -1) {
    return next(new NotFoundError())
  }
  else {
    courseListCollection.splice(resultIdx, 1)
  }

  res.json({})
})


// DISPLAY LIST
router.get('/', (req, res, next) => {

  const resultLength = courseListCollection.length
  if (resultLength === 0) {
    return next(new NotFoundError())
  }

  res.json({
    data: courseListCollection
  })
})



module.exports = router
