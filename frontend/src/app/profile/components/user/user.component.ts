import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../../../backend/src/models/user.model';
import { catchError } from 'rxjs/operators';
import imageUtils from "../../../../assets/getImages.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  userId : number = 0;
  user : User = {} as User;
  userLoggedInId: number = 0;
  isUserLoggedIn: boolean = false;
  followers : User[] = [];
  following : User[] = [];
  followersCount: number = 0;
  followingCount: number = 0;
  isFollowing: boolean = false;
  followPopUp: boolean = false;
  activeTab: string = 'followers';
  goToEdit: boolean = true;
  goToPost: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.userId =+ params['id']; // O '+' converte a string para um número
    });

    this.checkIsUserLoggedIn();

    this.getUserDetails(this.userId).subscribe(
      (data) => {
        this.user = data as User;
      },
      (error) => {
        console.error('Error loading user details', error);
        this.router.navigate(['/not-found']);
      }
    );

    this.checkIsFollowing();

    this.route.url.subscribe(urlSegments => {
      const currentUrl = this.router.url;
      this.goToEdit = !currentUrl.includes('edit');
      this.goToPost = !currentUrl.includes('post');
    });
  }

  _getProfileImage() {
    const prefix = '../../../../'
    return imageUtils.getProfileImage(prefix, this.userId);
  }

  _getBackgroundImage() {
    const prefix = '../../../../'
    return imageUtils.getBackgroundImage(prefix, this.userId);
  }

  getUserDetails(userId: number) {
    return this.http.get(`/users/${userId}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  public createItem(): void {
    // Implementação do método createItem
  }

  closePopUp() {
    this.followPopUp = false;
  }

  followerButton(): void {
    if(this.followPopUp == true)
      this.followPopUp = false;
    else
      this.followPopUp = true;

    this.activeTab = 'followers';
  }

  followingButton(): void {
    if(this.followPopUp == true)
      this.followPopUp = false;
    else
      this.followPopUp = true;


    this.activeTab = 'following';
  }

  updateFollowersCount(count: number) {
    this.followersCount = count;
  }

  updateFollowingCount(count: number) {
    this.followingCount = count;
  }

  updateFollowersList(followers: User[]) {
    this.followers = followers;
  }

  updateFollowingList(following: User[]) {
    this.following = following;
  }

  followUser() {
    const endpoint = '/users/' + this.userId + '/follow';
    this.http.post(endpoint, {id : this.userLoggedInId}).subscribe(data => {
      this.isFollowing = true;
      this.followersCount++;
    });
  }

  unfollowUser() {
    const endpoint = '/users/' + this.userId + '/unfollow';
    this.http.post(endpoint, {id : this.userLoggedInId}).subscribe(data => {
      this.isFollowing = false;
      this.followersCount--;
    });
  }


  checkIsUserLoggedIn() {
    this.http.get('/me').subscribe(data => {
      const userLoggedIn = data as User;
      this.userLoggedInId = userLoggedIn.id;

      if (userLoggedIn.id === this.userId) {
        this.isUserLoggedIn = true;
      }

    });

  }

  navigateToUserLoggedIn(){
    this.http.get('/me').subscribe(data => {
      const userLoggedIn = data as User;
      this.userLoggedInId = userLoggedIn.id;

      this.router.navigate(['/users/' + this.userLoggedInId]);
    });
  }

  checkIsFollowing() {
    const followers = this.http.get(`/users/${this.userId}/followers`);

    followers.subscribe(data => {
      const followersList = data as User[];
      const userLoggedIn = followersList.find(user => user.id === this.userLoggedInId);

      if (userLoggedIn) {
        this.isFollowing = true;
      }
    });
  }

  editButton(): void {
    if (this.goToEdit && window.confirm('Tem certeza que deseja editar sua conta?')) {
      this.router.navigate([`/users/${this.userId}/edit`]);
      this.goToEdit = false;
    }else if(!this.goToEdit){
      this.router.navigate([`/users/${this.userId}`]);
      this.goToEdit = true;
    }
  }

  postButton(): void {
    if (this.goToPost) {
      this.router.navigate([`/users/${this.userId}/post`]);
      this.goToPost = false;
    }else if(!this.goToPost){
      this.router.navigate([`/users/${this.userId}/post`]);
      this.goToPost = true;
    }
  }

  deleteAccount(): void {
    if (window.confirm('Tem certeza que deseja excluir sua conta?')) {
      this.http.delete(`/users/${this.userId}`).subscribe(
        (response) => {
          console.log('User deleted successfully');
          this.router.navigate([`/`]);
        },
        (error) => {
          console.error('Error updating user details', error);
        }
      );
    }
  }

  public goToRoute(route: string) {
    let route_ = '/users/' + this.userId + route;
    this.goToEdit = true;
    this.router.navigate([route_]);
  }

  public goToHome() {
    this.router.navigate(['/']);
  }

  public goToLoggedProfile() {
    if(this.userLoggedInId == 0){
      this.router.navigate(['/']);
    }else{
      this.router.navigate(['/me']);
    }
  }

}
