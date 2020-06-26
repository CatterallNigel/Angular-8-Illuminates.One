export class ImageType {

  constructor() {}

  static imageIsTypeOf(image: string): string {
    if (image.charAt(0) === '/') {
      return 'image/jpeg';
    } else if (image.charAt(0) === 'R') {
      return 'image/gif';
    } else if (image.charAt(0) === 'i') {
      return 'image/png';
    }
  }
}
