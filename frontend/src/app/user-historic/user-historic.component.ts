import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-user-historic',
  templateUrl: './user-historic.component.html',
  styleUrls: ['./user-historic.component.scss']
})

export class UserHistoricComponent implements OnInit {
  reviews: any[] = [];
  userId: number = 0;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id_user'];

    // this.http.get<any[]>(`http://localhost:5001/users/${this.userId}/historic`)
    this.fetchReviews();
  }

  fetchReviews(): void {
    const url = `/users/${this.userId}/historic`;

    this.httpClient.get<any[]>(url).subscribe(
      (reviews: any[]) => {
        this.reviews = reviews;
        console.log(reviews);
      });
  }
}
