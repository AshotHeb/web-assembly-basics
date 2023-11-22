let types = {
  char: 4,
  int: 4,
  float: 4,
};

let primitives = ["char", "int", "float"];

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

function encodeStruct(name, obj, buffer, offset = 0) {
  let cursor = offset;

  for (const [key, type] of Object.entries(structs[name])) {
    if (primitives.includes(type)) {
      encodeNumber(obj[key] ?? 0, types[type], buffer, cursor);
    } else {
      encodeStruct(type, obj[key] ?? {}, buffer, cursor);
    }

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

const decodeStruct = (name, memory, offset = 0) => {
  const ret = {};
  let cursor = offset;

  for (const [key, type] of Object.entries(structs[name])) {
    if (primitives.includes(type)) {
      ret[key] = decodeNumber(types[type], memory, cursor);
    } else {
      ret[key] = decodeStruct(type, memory, cursor);
    }

    cursor += types[type];
  }
  return ret;
};

const startDecodeStruct = (name, ptr, memory) => {
  return decodeStruct(name, new Uint8Array(memory.buffer, ptr, types[name]));
};

/*  new functions */

function encodeInt(num, n, buffer, offset = 0) {
  for (let i = 0; i < n; i++) {
    buffer[i + offset] = num & 0xff;
    num >>= 8;
  }
}

function encodeElem(
  type,
  obj,
  buffer,
  memory,
  malloc,
  cursor = 0,
  pointer = 0
) {
  if (primitives.includes(type)) {
    if (type !== "float") {
      encodeInt(obj ?? 0, types[type], buffer, cursor);
    } else {
      const floatBuf = new Float32Array(memory.buffer, pointer + cursor);
      floatBuf[0] = obj ?? 0.0;
    }
  } else {
    encodeStruct(type, obj, buffer, memory, malloc, cursor, pointer);
  }
}

function encodeStruct(
  type,
  obj,
  buffer,
  memory,
  malloc,
  cursor = 0,
  pointer = 0
) {
  for (const [name, elemType] of Object.entries(structs[type])) {
    encodeElem(elemType, obj[name], buffer, memory, malloc, cursor, pointer);

    cursor += types[elemType];
  }
}

function encodePointer(type, obj, memory, malloc) {
  if (!obj) return; //NULL

  const ptr = malloc(types[type]);
  const buf = new Uint8Array(memory.buffer, ptr, types[type]);

  encodeElem(type, obj, buf, memory, malloc, 0, ptr);

  return ptr;
}
