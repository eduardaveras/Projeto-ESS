import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../../../../../../backend/src/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = 'http://localhost:5001'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch post details by userId and postId
  getPostDetails(userId: number, postId: number): Observable<Post> {
    const url = `${this.baseUrl}/api/users/${userId}/${postId}`;

    return this.http.get<Post>(url).pipe(
      catchError((error) => {
        console.error('Error fetching post details:', error);
        return throwError(error);
      })
    );
  }
}
