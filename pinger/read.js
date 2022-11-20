class read {

  constructor(_buffer) {
    this.buffer = _buffer;
    this.offset = 0;
  }
  readint() {
    let v=0, c=0;
    while(1) {
      const b = this.buffer.readUInt8(this.offset++);
      v |= (b&0x7F) << c++*7;
      if((b&0x80) != 128) {
        break;
      }
    }
    return v;
  }
  reads() {
    const len = this.readint(), v=this.buffer.toString('utf-8', this.offset, this.offset + len);
    this.offset += len;
    return v;
  }
  getoffset() {
    return this.offset;
  }
}

module.exports = read;