const server = require('./pinger/ping');
const { servers } = require('./out.json');

const fs = require('fs');

const f = 'N00bBot';

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
          let status = ``;
          if(typeof res.players.sample == 'undefined') {
            status = `no one is playing`;
          } else {
            let online = [];
            for(var i=0; i<res.players.sample.length; i++) {
              online.push(res.players.sample[i].name);
              if(res.players.sample[i].name.includes(f)) {
                fs.appendFile('.txt', `${current.ip} =>\t description: ${res.description.text} \tstatus:${status}\n\n\n\n\n\n\n` ,(err) => { if(err) throw err; });
              }
            }
            online = online.sort().join(', ').replace(/\u00A7[0-9A-FK-OR]|\\n/ig, '');
            status = `**${res.players.online}/${res.players.max}** player(s) online.\n\n${online}`;
          }
          if(res.description.text.includes(`LiveOverflow`)) {
            fs.appendFile('live.txt', `${current.ip}` ,(err) => { if(err) throw err; });
          }
          if(res.description.text.includes(`N00bBot`)) {
            fs.appendFile('noob.txt', `${current.ip}` ,(err) => { if(err) throw err; });
          }
          console.log(`${current.ip} =>\t description: ${res.description.text} \tstatus:${status}\n`);
          fs.appendFile('output.txt', `${current.ip} =>\t description: ${res.description.text}\n` ,(err) => { if(err) throw err; });
        } else {
          console.log(current.ip + "\toffline");
        }
      } catch(e) {
        console.log(e);
      }
    });
  })
})