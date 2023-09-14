import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';

import { ButtonComponent } from './components/button/button.component';
import { MatListModule } from '@angular/material/list';

import { DataCyDirective } from './directives/data-cy.directive';
import { EditBtnComponent } from './components/editBtn/editBtn.component';
import { FollowBtnComponent } from './components/follow-btn/follow-btn.component';
import { PostBtnComponent } from './components/post-btn/post-btn.component';
import { UnfollowBtnComponent } from './components/unfollow-btn/unfollow-btn.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';

@NgModule({
    declarations: [DataCyDirective, ButtonComponent, EditBtnComponent, FollowBtnComponent, PostBtnComponent, UnfollowBtnComponent, StarRatingComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatListModule,
    ],
    exports: [
        DataCyDirective,
        MatInputModule,
        MatCardModule,
        ButtonComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatListModule,
        EditBtnComponent,
        FollowBtnComponent,
        PostBtnComponent,
        UnfollowBtnComponent,
        StarRatingComponent
    ],
    providers: [
        // TODO: Add services here
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptor,
            multi: true,
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
