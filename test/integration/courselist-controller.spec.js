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

    it('should successfully delete courseList', () => {
      return request(app)
        .delete('/course-lists/1')
        .then((res) => {
          res.status.should.equal(200)
          const result = findIndex(db.courseList, { uuid: 1 } )
          result.should.equal(-1)
        })
    })
  })

  describe('When I display courseList (GET)', () => {

    it('should reject with 404 if there is no courseList', () => {
      db.courseList.splice(0)
      return request(app)
        .get('/course-lists')
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

    it('should reject with 404 when the courseList doesn\'t exist', () => {
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
          const result = find(db.courseList[0].items, { name : "Poires" } )
          expect(result).to.be.an('object')
        })
    })
  })

  describe('When I display items from a list', () => {

    it('should reject with a 404 if courseList does not exist', () => {
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

    it('should reject with a 400 if there is no item in the list', () => {
      db.courseList[1].items.splice(0)
      return request(app)
        .get('/course-lists/4')
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'There should have item in this list'
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

    it('should reject with a 404 if courseList does not exist', () => {
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
    it('should reject with a 404 if item does not exist', () => {
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
    it('should reject with a 400 if item is already flagged', () => {
      db.courseList[0].items[1].done = true
      return request(app)
        .post('/course-lists/1/3')
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
        .post('/course-lists/1/2')
        .then((res) => {
          res.status.should.equal(200)
          const result = db.courseList[0].items[0].done
          result.should.equal(true)
        })
    })
  })

})
