import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FollowersComponent } from './followers/followers.component';

import { UserComponent } from './profile/components/user/user.component';
import { FeedComponent } from './feed/feed.component';
import { EditComponent } from './profile/components/edit/edit.component';
import { SignupComponent } from './signup/signup.component';

import { HistoricListComponent } from './historic-list/historic-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FindComponent } from './find/find.component';
import { MeComponent } from './me/me.component';
import { PostComponent } from './profile/components/post/post.component';
import { PostDetailComponent } from './profile/components/postDetails/postDetails.component';
import { GameListComponent } from './game-list/game-list.component';

const routes: Routes = [
    {path: 'signup', component: SignupComponent},
    {path: 'users/:id', component: UserComponent,children: [
        { path: '', component: FeedComponent },
        { path: 'post', component: PostComponent},
        { path: 'edit', component: EditComponent },
        { path: 'history', component: HistoricListComponent },
        { path: 'list', component: GameListComponent},
        { path: ':post_id', component: PostDetailComponent},
    ]},
    { path: 'users/:id/followers',component: FollowersComponent},
    { path: 'search',component: FindComponent},
    { path: 'me', component: MeComponent},
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
