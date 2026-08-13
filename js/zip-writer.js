const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function dosDateTime(d) {
  const time = ((d.getHours() & 0x1F) << 11) | ((d.getMinutes() & 0x3F) << 5) | ((d.getSeconds() >> 1) & 0x1F);
  const date = (((d.getFullYear() - 1980) & 0x7F) << 9) | (((d.getMonth() + 1) & 0xF) << 5) | (d.getDate() & 0x1F);
  return { time, date };
}

function writeUint32LE(arr, offset, value) {
  arr[offset] = value & 0xFF;
  arr[offset + 1] = (value >>> 8) & 0xFF;
  arr[offset + 2] = (value >>> 16) & 0xFF;
  arr[offset + 3] = (value >>> 24) & 0xFF;
}

function writeUint16LE(arr, offset, value) {
  arr[offset] = value & 0xFF;
  arr[offset + 1] = (value >>> 8) & 0xFF;
}

export function createZip(files) {
  const encoder = new TextEncoder();
  const { time, date } = dosDateTime(new Date());
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = typeof file.content === 'string' ? encoder.encode(file.content) : new Uint8Array(file.content);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    const localHeader = new Uint8Array(30 + nameBytes.length);
    writeUint32LE(localHeader, 0, 0x04034b50);
    writeUint16LE(localHeader, 4, 20);
    writeUint16LE(localHeader, 6, 0x0800);
    writeUint16LE(localHeader, 8, 0);
    writeUint16LE(localHeader, 10, time);
    writeUint16LE(localHeader, 12, date);
    writeUint32LE(localHeader, 14, crc);
    writeUint32LE(localHeader, 18, size);
    writeUint32LE(localHeader, 22, size);
    writeUint16LE(localHeader, 26, nameBytes.length);
    writeUint16LE(localHeader, 28, 0);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    writeUint32LE(centralHeader, 0, 0x02014b50);
    writeUint16LE(centralHeader, 4, 20);
    writeUint16LE(centralHeader, 6, 20);
    writeUint16LE(centralHeader, 8, 0x0800);
    writeUint16LE(centralHeader, 10, 0);
    writeUint16LE(centralHeader, 12, time);
    writeUint16LE(centralHeader, 14, date);
    writeUint32LE(centralHeader, 16, crc);
    writeUint32LE(centralHeader, 20, size);
    writeUint32LE(centralHeader, 24, size);
    writeUint16LE(centralHeader, 28, nameBytes.length);
    writeUint16LE(centralHeader, 30, 0);
    writeUint16LE(centralHeader, 32, 0);
    writeUint16LE(centralHeader, 34, 0);
    writeUint16LE(centralHeader, 36, 0);
    writeUint32LE(centralHeader, 38, 0);
    writeUint32LE(centralHeader, 42, offset);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);

    offset += localHeader.length + dataBytes.length;
  }

  const centralStart = offset;
  let centralSize = 0;
  for (const part of centralParts) centralSize += part.length;

  const endRecord = new Uint8Array(22);
  writeUint32LE(endRecord, 0, 0x06054b50);
  writeUint16LE(endRecord, 4, 0);
  writeUint16LE(endRecord, 6, 0);
  writeUint16LE(endRecord, 8, files.length);
  writeUint16LE(endRecord, 10, files.length);
  writeUint32LE(endRecord, 12, centralSize);
  writeUint32LE(endRecord, 16, centralStart);
  writeUint16LE(endRecord, 20, 0);

  const totalSize = offset + centralSize + endRecord.length;
  const out = new Uint8Array(totalSize);
  let pos = 0;
  for (const part of localParts) { out.set(part, pos); pos += part.length; }
  for (const part of centralParts) { out.set(part, pos); pos += part.length; }
  out.set(endRecord, pos);

  return out;
}