import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'docType'
})
export class DocTypePipe implements PipeTransform {

  transform(value: string): string {
    const arrDocName = value.split('.');
    const docExtension = arrDocName[arrDocName.length - 1];
    let src: string;
    switch (docExtension) {
      case 'pdf':
        src = 'assets/images/pdf.png';
        break;
      case 'mp3':
        src = 'assets/images/pdf.png';
        break;
      case 'mp4':
        src = 'assets/images/pdf.png';
        break;
      case 'png':
        src = environment.imgUrl + value;
        break;
      case 'jpg':
        src = environment.imgUrl + value;
        break;
      case 'jpeg':
        src = environment.imgUrl + value;
        break;
      default:
        src = 'assets/images/list.png';
    }
    return src;
  }

}
