const { courseList } = require('../../data/db')

/*mockData = [
  {uuid: 1,  name: 'Toto', items: [
    { uuid: 2, name: "Pommes", done : false},
    { uuid: 3, name: "Bananes", done : false}
  ]},
  {uuid: 4 , name: 'Ma liste', items: [
    {uuid: 5 , name : "Chocolat", done : false},
    {uuid: 6 , name : "Madeleines", done : false},
    {uuid: 7 , name : "Culottes", done : false}
  ]}
] */

module.exports = {

  up: () => {
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
    courseList.splice(0)
    courseList.push.apply(courseList, mockData)
  },

  down: () => {
    courseList.splice(0)
  }
}
