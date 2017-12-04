const { courseList } = require('../../data/db')

mockData = [
  { id: 1, uuid: 1,  name: 'Toto', items: [
    {id: 1, uuid: 2, name: "Pommes", done : false},
    {id: 2, uuid: 3, name: "Bananes", done : false}
  ]},
  { id: 2, uuid: 2 , name: 'Ma liste', items: [
    {id: 1, uuid: 2 , name : "Chocolat", done : false},
    {id: 2, uuid: 3 , name : "Madeleines", done : false},
    {id: 3, uuid: 4 , name : "Culottes", done : false}
  ]}
]

module.exports = {
  up: () => {
    courseList.splice(0)
    courseList.push.apply(courseList, mockData)
  },

  down: () => {
    courseList.splice(0)
  }
}
