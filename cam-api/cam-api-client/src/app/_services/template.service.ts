import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  

  private url = '/cam/api/v1/templates/?tenantId=bec31954-8d6f-4bfc-bb08-ac1dfd387a71&ace_orgGuid=all'

  constructor(private http: HttpClient) { }

  getTemplates(): Observable<any[]> {

    console.log('retrieving templates')
    // var httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': 'Bearer acb37e0a23357669b0c83cad124b1536507c9a65b9536a848055243962bcf08b5295a9860a4977f041006138f81049ce5de2ef0a913b24b0047f9eab5d816cb4f2f28336e7382968147f60ddf46c8fe2dc33751fec8d3d7f4f4e6053dc338fbf0c6e61c4c157a7a5db378aab3782ca2cfdf12e53c840ef1f9878d743e7f4ed28cef69ce3f1271fa058e928ffd5f33f2ad2cd007e23c271d3d8e17f48ab374f8780993ea152adbfd9ff115b194e27c0d72df6050c52f3237e86f4a4867b8544f339a29506b110af409f718d11680c1155e3da4e69435c06fa269b51d5e09372aa0e934164e9b7525f46621ecce5a953bf86ece7425e21901e61d30939fea789a3abceea31b36398e83cef847af3a46785362636b9d458aca14b11848d5ce8726c042b039b1beea506f6783130432261b39ce7978fbbb543fbe81e93cdda60b423fe01acc6368158e2b5129e901a309e2caf0732c85b1eaa1b7e7898ea5fa0d58790fe9def772c085194f3b6006118b521680c246730bbc4aded739be7a6468100bc654608c99278fd1ab667087c13315cc3f27207798d47467293581dd6229e33f8c91352a80425f4327dfbe95597bbc7b35be3812919303327e38654d2f804173017dfe9b8e1d373c4a987c5bedb76a248f9f1df4929d770ab7f72e94dd7a62c1a33d041d881f58216a8b73359a23e50987cf1ca3680c2fe92d818488155c8a7'
    //   })
    // };

    return this.http.get<any[]>(this.url)
      .pipe(
        catchError(this.handleError)
      )
  }


  private handleError(error: HttpErrorResponse) {
    console.log("found error"
    )
    console.log(error.error.message)
    if (error.error instanceof ErrorEvent) {
      
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //     `Backend returned code ${error.status}, ` +
      //     `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'error:');
  };
}
