import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable} from'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StacksService {

  private url = '/cam/api/v1/stacks/?tenantId=bec31954-8d6f-4bfc-bb08-ac1dfd387a71&ace_orgGuid=all'

  constructor(private http: HttpClient) { }

  getDeployedStacks(): Observable<any[]> {
    console.log('retrieving deployed stacks')
    return this.http.get<any[]>(this.url)
  }

  deployStackInstance(templateID: string): Observable<any[]> {
    return this.http.post<any[]>(this.url, {

    })
  }

  // getStackInstance(stackId: string): Observable<any> {
  //   return this.http.
  // }

}
