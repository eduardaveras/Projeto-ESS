import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../backend/src/models/user.model'; // Update this path to the location of your User model
import { Observable } from 'rxjs';

@Component({
    selector: 'app-followers',
    templateUrl: './followers.component.html',
    styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {
    followers: User[] = [];
    following: User[] = [];
    followersCount: number = 0;
    followingCount: number = 0;

    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    ngOnInit(): void {
        const userId = this.route.snapshot.paramMap.get('id');

        if (userId) {
            this.getFollowers(Number(userId)).subscribe(data => {
                this.followers = data;
            });

            this.getFollowing(Number(userId)).subscribe(data => {
                this.following = data;
            });

            this.getFollowingCount(Number(userId)).subscribe(response => {
                this.followingCount = response.followingCount; // As per the console output you provided
            });

            this.getFollowersCount(Number(userId)).subscribe(response => {
                this.followersCount = response.followersCount; // Assuming the API returns an object with a "followersCount" property
            });

        }
    }

    getFollowers(userId: number): Observable<User[]> {
        return this.http.get<User[]>(`/users/${userId}/followers`);
    }

    getFollowing(userId: number): Observable<User[]> {
        return this.http.get<User[]>(`/users/${userId}/following`);
    }

    getFollowingCount(userId: number): Observable<{ followingCount: number }> {
        return this.http.get<{ followingCount: number }>(`/users/${userId}/following/count`);
    }

    getFollowersCount(userId: number): Observable<{ followersCount: number }> {
        return this.http.get<{ followersCount: number }>(`/users/${userId}/followers/count`);
    }

    getBlocked(userId: number): Observable<User[]> {
        return this.http.get<User[]>(`/users/${userId}/blocked`);
    }
}
