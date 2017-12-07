const { courseList } = require('../../data/db')

mockData = [
  {uuid: 1,  name: 'Toto', items: [
    { uuid: 2, name: "Pommes", done : false},
    { uuid: 3, name: "Bananes", done : false}
  ]},
  {uuid: 4 , name: 'Ma liste', items: [
    {uuid: 5 , name : "Chocolat", done : false},
    {uuid: 6 , name : "Madeleines", done : false},
    {uuid: 7 , name : "Culottes", done : false}
  ]}
]

module.exports = {
  up: () => {
    courseList.splice(0)
    //console.log("LENGTH UP " + coursList.length)
    courseList.push.apply(courseList, mockData)
  },

  down: () => {
    courseList.splice(0)
    //console.log("LENGTH DOWN " + coursList.length)
  }
}
