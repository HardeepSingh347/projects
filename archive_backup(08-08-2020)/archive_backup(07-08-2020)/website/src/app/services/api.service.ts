import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postDataApi(data, postURL) {
    return this.http.post<any>(environment.apiUrl + postURL, data);
  }

  getDataApi(postURL) {
    return this.http.get<any>(environment.apiUrl + postURL);
  }

  patchDataApi(data, postURL) {
    return this.http.patch<any>(environment.apiUrl + postURL, data);
  }

  deleteDataApi(postURL) {
    return this.http.delete<any>(environment.apiUrl + postURL);
  }

  downloadDataApi(postURL) {
    return this.http.get(environment.apiUrl + postURL, {
      responseType: 'blob',
      reportProgress: true,
    });
  }

  uploadDataApi(data, postURL) {
    return this.http
      .post<any>(environment.apiUrl + postURL, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              // console.log({ status: 'progress', message: progress });
              return { status: 'progress', message: progress };
            case HttpEventType.Response:
              // console.log(event.body);
              return event.body;
            default:
              // console.log(`Unhandled event: ${event.type}`);
              return `Unhandled event: ${event.type}`;
          }
        })
      );
  }
}

// uploadDataApi(data, postURL) {
//   return this.http
//     .post<any>(environment.apiUrl + postURL, data, {
//       reportProgress: true,
//       observe: 'events',
//     })
//     .pipe(
//       map((event) => {
//         switch (event.type) {
//           case HttpEventType.UploadProgress:
//             const progress = Math.round((100 * event.loaded) / event.total);
//             console.log({ status: 'progress', message: progress });
//             return { status: 'progress', message: progress };
//           case HttpEventType.Response:
//             console.log(event.body);
//             return event.body;
//           default:
//             console.log(`Unhandled event: ${event.type}`);
//             return `Unhandled event: ${event.type}`;
//         }
//       })
//     );
// }
