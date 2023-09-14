import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../backend/src/models/user.model'; // Update this path to the location of your User model
import { Observable, from } from 'rxjs';
import { map, concatMap, mergeMap, mergeAll, toArray } from 'rxjs/operators';
import { Post } from '../../../../backend/src/models/post.model';
import { FeedItem } from './feed-item.model';
import imageUtils from "../../assets/getImages.service";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})

export class FeedComponent implements OnInit{
    @Input() userId : number = 1;
    @Input() postId : number = 1;
    @Output() feedItems : FeedItem[] = [];
    myFeed : FeedItem[] = [];
    feedFollowing : FeedItem[] = [];
    usersFollowing : User[] = [];
    isUserLoggedIn : boolean = false;
    activeTab : string = "myFeed";

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {

      this.userId = Number(this.route.snapshot.paramMap.get('id'));
      this.postId = Number(this.route.snapshot.paramMap.get('post_id'));
      
      this.checkIsUserLoggedIn();
      this.getMyFeed();
    }

    getMyFeed(): void {
      this.feedItems = [] as FeedItem[];
      this.getPostsItems(this.userId).subscribe((feed: FeedItem[]) => {
        this.feedItems = feed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    }

    getFollowingFeed(): void {
      this.feedItems = [] as FeedItem[];
      this.getFollowing(this.userId).pipe(
        mergeMap((users: User[]) => {
          this.usersFollowing = users;
          // Create an array of observables
          const observables: Observable<FeedItem[]>[] = users.map(user => this.getPostsItems(user.id));
          return from(observables);
        }),
        concatMap((obs: Observable<FeedItem[]>) => obs),
        map((feedItems: FeedItem[]) => {
          this.feedItems = [...this.feedItems, ...feedItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        })
      ).subscribe();

    }

    getPostsItems(userId: number): Observable<FeedItem[]> {
      return this.http.get<Post[]>(`/users/${userId}/historic`).pipe(
        mergeMap((posts: Post[]) => {
          return from(posts).pipe(
            mergeMap(post =>
              this.getUserDetails(post.user_id).pipe(
                map(user => ({
                  authorId: post.user_id,
                  postId: post.post_id,
                  game: post.game,
                  authorUsername: user.user,
                  authorName: user.name + ' ' + user.lastName,
                  content: post.title,
                  rate: post.rate,
                  date: post.date,
                  type: 'post'
                }))
              )
            ),
            toArray()
          )
        })
      );
    }

    setActiveTab(tab: string): void {

      this.activeTab = tab;
      if(this.activeTab === "following")
        this.getFollowingFeed();
      else
        this.getMyFeed();
    }

    getUserDetails(userId: number): Observable<User> {
      return this.http.get<User>(`/users/${userId}`);

    }

    getFollowing(userId: number): Observable<User[]> {
        return this.http.get<User[]>(`/users/${userId}/following`);
    }

    openProfile(userId: number) {
        this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/users/${userId}`]);
        });
    }

    starClass(index: number, rating: number): string {
      if (index < rating) {
        return 'yellow';
      } else {
        return 'white';
      }
    }
  
    getStarRange(rating: number): number[] {
      return Array.from({ length: rating }, (_, i) => i + 1);
    }
  

    openPost(userId: number, postId: number) : void {
      this.router.navigate([`/users/${userId}/${postId}`]);

    }

    checkIsUserLoggedIn() {
      this.http.get('/me').subscribe(data => {
        const userLoggedIn = data as User;
        if (userLoggedIn.id === this.userId) {
          this.isUserLoggedIn = true;
        }
      });
    }

  _getProfileImage(userId : number) {
    const prefix = '../../../../'
    return imageUtils.getProfileImage(prefix, userId);
  }

  _getBackgroundImage(userId : number) {
    const prefix = '../../../../'
    return imageUtils.getBackgroundImage(prefix, userId);
  }

}