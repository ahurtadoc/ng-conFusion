import { Injectable } from '@angular/core';
import {Feedback} from '../shared/feedback';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {baseURL} from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  submitFeedbackForm(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Feedback>(`${baseURL}feedback`, feedback, httpOptions);
  }
}
