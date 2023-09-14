import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from './post.service';
import { Post } from '../../../../../../backend/src/models/post.model'; // Import your Post model

@Component({
  selector: 'app-post-detail',
  templateUrl: './postDetails.component.html',
  styleUrls: ['./postDetails.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: Post = {} as Post;
  userId: number = 0;
  postId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService // Inject your post service here if needed
  ) {}

  starClass(index: number, rating: number): string {
    if (index < rating) {
      return 'yellow';
    } else {
      return 'white';
    }
  }
  
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.postId = +params['post_id'];

      // Use your service to fetch post details by userId and postId
      this.postService.getPostDetails(this.userId, this.postId).subscribe(
        (data) => {
          this.post = data as Post;
        },
        (error) => {
          console.error('Error fetching post details:', error);
        }
      );
    });
  }
}
