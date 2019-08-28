export class ImageSnippet {
    pending: boolean = false;
    status: string = 'init';
  
    constructor(public src: string, public file: File) {

    }
  }