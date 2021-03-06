import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Adal6Service } from './adal6.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

/**
 *
 *
 * @export
 * @class Adal6HTTPService
 */
@Injectable()
export class Adal6HTTPService {

  /**
   *
   *
   * @static
   * @param {HttpClient} http
   * @param {Adal6Service} service
   *
   * @memberOf Adal6HTTPService
   */
  static factory(http: HttpClient, service: Adal6Service) {
    return new Adal6HTTPService(http, service);
  }

  /**
   * Creates an instance of Adal6HTTPService.
   * @param {HttpClient} http
   * @param {Adal6Service} service
   *
   * @memberOf Adal6HTTPService
   */
  constructor(
    private http: HttpClient,
    private service: Adal6Service
  ) { }

  /**
   *
   *
   * @param {string} url
   * @param {*} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal6HTTPService
   */
  get(url: string, options: {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    observe: 'response';
    params?: HttpParams | { [param: string]: string | string[]; };
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    return this.sendRequest('get', url, options);
  }

  /**
   *
   *
   * @param {string} url
   * @param {*} body
   * @param {*} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal6HTTPService
   */
  post(url: string, body: any, options: {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    observe: 'response';
    params?: HttpParams | { [param: string]: string | string[]; };
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    options.body = body;
    return this.sendRequest('post', url, options);
  }

  /**
   *
   *
   * @param {string} url
   * @param {*} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal6HTTPService
   */
  delete(url: string, options: {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    observe: 'response';
    params?: HttpParams | { [param: string]: string | string[]; };
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    return this.sendRequest('delete', url, options);
  }

  /**
   *
   *
   * @param {string} url
   * @param {*} body
   * @param {*} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal6HTTPService
   */
  patch(url: string, body: any, options: {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    observe: 'response';
    params?: HttpParams | { [param: string]: string | string[]; };
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    options.body = body;
    return this.sendRequest('patch', url, options);
  }

  /**
   *
   *
   * @param {string} url
   * @param {*} body
   * @param {*} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal6HTTPService
   */
  put(url: string, body: any, options: {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    observe: 'response';
    params?: HttpParams | { [param: string]: string | string[]; };
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    options.body = body;
    return this.sendRequest('put', url, options);
  }

  /**
   *
   *
   * @param {string} url
   * @param {*} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal6HTTPService
   */
  head(url: string, options: {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    observe: 'response';
    params?: HttpParams | { [param: string]: string | string[]; };
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<any> {
    return this.sendRequest('head', url, options);
  }

  /**
   *
   *
   * @private
   * @param {string} method
   * @param {string} url
   * @param {RequestOptionsArgs} options
   * @returns {Observable<string>}
   *
   * @memberOf Adal6HTTPService
   */
  private sendRequest(method: string, url: string, options: {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    observe: 'response';
    params?: HttpParams | { [param: string]: string | string[]; };
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<Object> {

    const resource = this.service.GetResourceForEndpoint(url);
    let authenticatedCall: Observable<Object>;
    if (resource) {
      if (this.service.userInfo.authenticated) {
        authenticatedCall = this.service.acquireToken(resource)
          .mergeMap((token: string) => {
            if (options.headers == null) {
              options.headers = new HttpHeaders();
            }
            options.headers = options.headers.append('Authorization', 'Bearer ' + token);
            return this.http.request(method, url, options)
              .catch(this.handleError);
          });
      } else {
        authenticatedCall = Observable.throw(new Error('User Not Authenticated.'));
      }
    } else {
      authenticatedCall = this.http.request(method, url, options).catch(this.handleError);
    }

    return authenticatedCall;
  }

  /**
   *
   *
   * @private
   * @param {*} error
   * @returns
   *
   * @memberOf Adal6HTTPService
   */
  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    const errMsg = error.message || 'Server error';
    console.error(JSON.stringify(error)); // log to console instead

    return Observable.throw(error);
  }
}
