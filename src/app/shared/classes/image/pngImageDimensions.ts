import {Logger} from '../utils/logger';

// noinspection JSUnusedGlobalSymbols
export class PNGImageDimensions {

   base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

   constructor() {}

   toInt32(bytes) {
    // noinspection TsLint
     return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  }


   // noinspection JSUnusedGlobalSymbols
  getPngDimensions(dataUri: string ) {
    const type: string = dataUri.substring(0, 22);
    Logger.log('Image type: ' + type);
    if (type !== 'data:image/png;base64,') {
      throw new Error('Unsupported data URI format');
    }

    // 32 base64 characters encode the necessary 24 bytes
    const base64Str: string = dataUri.substr(22, 32);
    return this.getDimensions(this.base64Decode(base64Str));
  }


   getDimensions(data) {
    return {
      width: this.toInt32(data.slice(16, 20)),
      height: this.toInt32(data.slice(20, 24))
    };
  }

   base64Decode(data: string) {
    const result = [];
    let current = 0;
    let c;
    let i;
     // noinspection TsLint
    for (i = 0, c = 0; c = data.charAt(i); i++) {
      if (c === '=') {
        if (i !== data.length - 1 && (i !== data.length - 2 || data.charAt(i + 1) !== '=')) {
          throw new SyntaxError('Unexpected padding character.');
        }

        break;
      }

      const index = this.base64Characters.indexOf(c);

      if (index === -1) {
        throw new SyntaxError('Invalid Base64 character.');
      }
      // noinspection TsLint
      current = (current << 6) | index;

      if (i % 4 === 3) {
        // noinspection TsLint
        result.push(current >> 16, (current & 0xff00) >> 8, current & 0xff);
        current = 0;
      }
    }

    if (i % 4 === 1) {
      throw new SyntaxError('Invalid length for a Base64 string.');
    }

    if (i % 4 === 2) {
      // noinspection TsLint
      result.push(current >> 4);
    } else if (i % 4 === 3) {
      // noinspection TsLint
      current <<= 6;
      // noinspection TsLint
      result.push(current >> 16, (current & 0xff00) >> 8);
    }

    return result;
  }

}
