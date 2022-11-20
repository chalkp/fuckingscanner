const server = require('./pinger/ping');
const { servers } = require('./scan.json');

const fs = require('fs');

servers.forEach(current => {
  let p = current.ports.map(a => a.port);
  p.forEach(po => {
    const sv = new server(current.ip, po.port);
    sv.ping(5000, 720, async function (err, res) {
      try {
        if(typeof err === 'undefined' || err === null) {
          console.log(`${current.ip} => description: ${res.description.text}`);
          fs.writeFile('output.txt', `${current.ip} => description: ${res.description.text}` ,(err) => {
            if (err) throw err;
          });
          if(res.description.text.includes("LiveOverflow")) {
            fs.writeFile('found.txt', `${current.ip} => description: ${res.description.text}` ,(err) => {
              if (err) throw err;
            });
          }
        } else {
          console.log(current.ip + " offline");
        }
      } catch(e) {
        console.log(e);
      }
    });
  })
})