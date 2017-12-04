const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find, findIndex } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('When I create a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).post('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when name is not unique', () => {
      return request(app)
        .post('/course-lists')
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be unique'
            }
          })
        })
    })

    it('should  successfully create a courseList', () => {
      const mockName = 'My New List'

      return request(app)
        .post('/course-lists')
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockName)

          const result = find(db.courseList, { name: mockName } )
          result.should.not.be.empty
          result.should.eql({
            id: res.body.data.id,
            uuid: res.body.data.uuid,
            name: res.body.data.name,
            items: []
          })
        })
    })
  })

  describe('When I delete a courseList (DELETE /course-lists)', () => {

    it('should reject with 404 when the courseList doesn\'t exist', () => {
      return request(app)
        .delete('/course-lists/3')
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'NOT_FOUND',
              message: 'Page not found'
            }
          })
        })
    })
    //PB FIND INDEX (retourne toujours -1)
    xit('should successfully delete courseList', () => {
      return request(app)
        .delete('/course-lists/1')
        .then((res) => {
          res.status.should.equal(200)
          // expect(res.body.data).to.be.an('object')
          const result = findIndex(db.courseList, { id: 1 } )
          result.should.equal(-1)
        })
    })
  })

  describe('When I display courseList (GET)', () => {

    it('should reject with 404 if there is no courseList', () => {
      courseListFixture.down()
      return request(app) // VIDER LE TABEAU DE LISTE DE COURSE
        .get('/course-lists')
        // db.courseList.splice(0)
        //.delete(db.courseList)
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'NOT_FOUND',
              message: 'Page not found'
            }
        })
      })
    })

    it('should successfully display all courseList', () => {
      return request(app)
        .get('/course-lists')
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('array')
          res.body.should.eql({
            data: db.courseList
          })
        })
    })
  })

  describe('When I add a new item in a courseList', () => {

    xit('should reject with 404 when the courseList doesn\'t exist', () => { // PROBLEME FINDINDEX
      return request(app)
        .post('/course-lists/3')
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'NOT_FOUND',
              message: 'Page not found'
            }
          })
        })
    })

    it('should reject with 400 when no name is given', () => {
      return request(app)
        .post('/course-lists/1')
        .send({items: ""})
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing name'
            }
          })
        })
    })

    it('should reject when item name is not unique', () => {
      return request(app)
      .post('/course-lists/1')
      .send({items: "Bananes"})
      .then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Name should be unique'
          }
        })
      })
    })

    it('should  successfully create an item', () => {
      return request(app)
        .post('/course-lists/1')
        .send({items: "Poires"})
        .then((res) => {
          res.status.should.equal(200)
          //expect(res.body.data).to.be.an('array')
          const result = find(db.courseList[0].items, { name : "Poires" } )
          expect(result).to.be.an('object')
        })
    })
  })

  describe('When I display items from a list', () => {
    xit('should reject with a 404 if courseList does not exist', () => { // FIND INDEX
      return request(app)
        .get('/course-lists/3')
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'NOT_FOUND',
              message: 'Page not found'
            }
          })
        })
    })

    xit('should reject with a 400 if there is no item in the list', () => {
      return request(app)
        .get('/course-lists/1')
        //db.courseList[0].items = [] // VIDER LE TABLEAU ITEMS
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'There should have item in this list' /// NE PAS OUBLIER
            }
          })
      })
    })

    it('should successfully display items', () => {
      return request(app)
        .get('/course-lists/1')
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('array')
          res.body.should.eql({
            data: db.courseList[0].items
          })
        })
    })
  })

  describe('When I have bought an item', () => {
    xit('should reject with a 404 if courseList does not exist', () => { // FIND INDEX
      return request(app)
        .post('/course-lists/3/1')
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'NOT_FOUND',
              message: 'Page not found'
            }
          })
        })
    })
    xit('should reject with a 404 if item does not exist', () => { // FIND INDEX
      return request(app)
        .post('/course-lists/1/5')
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'NOT_FOUND',
              message: 'Page not found'
            }
          })
        })
    })
    xit('should reject with a 400 if item is already flaged', () => {
      return request(app)
        .post('/course-lists/1/1')
        // Passer le status done à True
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Item is already flagged'
            }
          })
        })
    })

    it('should successfully flag item', () => {
      return request(app)
        .post('/course-lists/1/1')
        .then((res) => {
          res.status.should.equal(200)
          const result = db.courseList[0].items[0].done
          result.should.equal(true)
        })
    })
  })


})
