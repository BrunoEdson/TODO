const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/todoapp.db');

let data = []

const getData = ()=>{
  return new Promise((resolve, reject)=>{
  db.serialize(()=>{
      db.all('SELECT * FROM todo', (err, rows)=>{
          if (err)
              reject(err)
          resolve(rows)
      })
  });
  })
}

let promise = getData() // => Promise { <pending> }
.then(results=>{
  results.forEach(element => {
    data.push(element.task)
  });
  return data
})



console.log(data)
module.exports = getData;