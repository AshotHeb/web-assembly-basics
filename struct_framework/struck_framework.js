let types = {
  char: 1,
  short: 2,
  int: 4,
  float: 4,
  double: 8,
  long: 8,
};

let structs = {};

function registerStruct(name, structFormat) {
  types[name] = computeStructSize(structFormat);
  structs[name] = structFormat;
}

function computeStructSize(structFormat) {
  let size = 0;

  for (const type of Object.values(structFormat)) {
    size += types[type];
  }

  return size;
}

function encodeNumber(num, n, buffer, offset = 0) {
  for (var i = 0; i < n; i++) {
    buffer[offset + i] = num & 0xff;
    num >>= 8;
  }
}

function encodeStruct(name, obj, buffer) {
  let cursor = 0;

  for (const [key, type] of Object.entries(structs[name])) {
    //ecnode the number
    encodeNumber(obj[key] ?? 0, types[type], buffer, cursor);
    cursor += types[type];
  }
}

function startEncodeStruct(name, obj, memory, malloc) {
  var ptr = malloc(types[name]);
  let buf = new Uint8Array(memory.buffer, ptr, types[name]);

  encodeStruct(name, obj, buf);

  return ptr;
}

/* Decode functions*/

const decodeNumber = (n, memory, offset = 0) => {
  let ret = 0;

  for (var i = 0; i < n; i++) {
    ret << 8;
    ret |= memory[offset + i];
  }

  return ret;
};

const decodeStruct = (name, memory) => {
  const ret = {};
  let cursor = 0;

  for (const [key, type] of Object.entries(structs[name])) {
    ret[key] = decodeNumber(types[type], memory, cursor);
    cursor += types[type];
  }
  return ret;
};

const startDecodeStruct = (name, ptr, memory) => {
  return decodeStruct(name, new Uint8Array(memory.buffer, ptr, types[name]));
};
