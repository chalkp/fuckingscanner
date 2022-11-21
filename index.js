const server = require('./pinger/ping');
const { servers } = require('./scan.json');

const fs = require('fs');

fs.writeFile('output.txt', `\n` ,(err) => {
  if (err) throw err;
});

fs.writeFile('found.txt', `\n` ,(err) => {
  if (err) throw err;
});

servers.forEach(current => {
  let p = current.ports.map(a => a.port);
  p.forEach(po => {
    const sv = new server(current.ip, po.port);
    sv.ping(50000, 720, async function (err, res) {
      try {
        if(typeof err === 'undefined' || err === null) {
          console.log(`${current.ip} => description: ${res.description.text}`);
          fs.appendFile('output.txt', `${current.ip} => description: ${res.description.text}\n` ,(err) => {
            if (err) throw err;
          });
          const r1 = res.description.text?.includes("LiveOverflow");
          if(r1) {
            fs.appendFile('found.txt', `${current.ip} => description: ${res.description.text}\n` ,(err) => {
              if (err) throw err;
            });
          }
        } else {
          console.log(current.ip + " offline");
          fs.appendFile('output.txt', `${current.ip} => offline\n` ,(err) => {
            if (err) throw err;
          });
        }
      } catch(e) {
        console.log(e);
      }
    });
  })
})