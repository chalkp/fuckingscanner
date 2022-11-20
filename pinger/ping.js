const net = require('net')

const protocol = require('./protocol');
const read = require('./read');

class server {

  constructor(ip, port) {
    this.ip = ip;
    this.port = port || 25565;
  }

  ping(timeout, protocolVersion, callback) {
    const socket = net.createConnection({
      host: this.ip,
      port: this.port
    });

    const timeoutTask = setTimeout(() => {
      socket.emit('error', new Error('Sockettimeout'));
    }, timeout);

    const closeSocket = () => {
      socket.destroy();
      clearTimeout(timeoutTask);
    }

    let didFireError = false;

    const handleErr = (err) => {
      closeSocket();
      if(!didFireError) {
        didFireError = true;
        callback(err);
      }
    }
    socket.setNoDelay(true);

    socket.on('connect', () => {
      const handshake = protocol.concat([
        protocol.vint(0),
        protocol.vint(protocolVersion),
        protocol.vint(this.ip.length),
        protocol.writeS(this.ip),
        protocol.writeUShort(this.port),
        protocol.vint(1)
      ]);
      socket.write(handshake);
      const request = protocol.concat([
        protocol.vint(0)
      ]);
      socket.write(request);
    });

    let incomingBuffer = Buffer.alloc(0);

    socket.on('data', data => {
      incomingBuffer = Buffer.concat([incomingBuffer, data]);
      if (incomingBuffer.length < 5) {
        return;
      }
      const bufferReader = new read(incomingBuffer);

      const length = bufferReader.readint()
      if (incomingBuffer.length - bufferReader.getoffset() < length) {
        return;
      }
      const id = bufferReader.readint();

      if (id === 0) {
        const reply = bufferReader.reads();
        try {
          const message = JSON.parse(reply);
          callback(null, message);
          closeSocket();
        } catch (err) {
          handleErr(err);
        }
      } else {
        handleErr(new Error('Received unexpected packet'));
      }
    })

    socket.on('error', handleErr)
  }
}

module.exports = server