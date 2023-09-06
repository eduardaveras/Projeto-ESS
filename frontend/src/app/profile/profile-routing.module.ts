import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/test/user.component'
import { FollowersComponent } from '../followers/followers.component';

const routes: Routes = [
    {path: 'users/:id',component: UserComponent},
    {path: 'users/:id/followers',component: FollowersComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {}
