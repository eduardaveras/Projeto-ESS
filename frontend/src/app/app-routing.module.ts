import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowersComponent } from './followers/followers.component';
import { UserComponent } from './profile/components/test/user.component';
import { HistoricListComponent } from './historic-list/historic-list.component';

const routes: Routes = [
    { path: 'users/:userId/historic', component: HistoricListComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
