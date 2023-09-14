
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();
  ngOnInit() {
 
  }

  starClass(index: number): string {
    return index < this.rating ? 'yellow' : 'black';
  }

  setRating(rating: number): void {
    this.rating = rating;
    this.ratingChange.emit(this.rating);    
  }

}

