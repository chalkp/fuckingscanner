class protocol {

  static vint(val) {
    const b = Buffer.alloc(5);
    let written = 0;
    while(1) {
      if ((val & 0xFFFFFF80) === 0) {
        b.writeUInt8(val, written++);
        break;
      } else {
        b.writeUInt8(val & 0x7F | 0x80, written++);
        val >>>= 7;
      }
    }
    return b.slice(0, written);
  }

  static writeS(val) {
    return Buffer.from(val, 'utf-8');
  }

  static writeUShort(val) {
    return Buffer.from([val>>8, val&0xFF]);
  }

  static concat(chunks) {
    let length = 0;

    for (const chunk of chunks) {
      length += chunk.length;
    }

    const buf = [
      protocol.vint(length),
      ...chunks
    ]

    return Buffer.concat(buf);
  }
}

module.exports = protocol;