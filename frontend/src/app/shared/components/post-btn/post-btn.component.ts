import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-btn',
  templateUrl: './post-btn.component.html',
  styleUrls: ['./post-btn.component.scss']
})
export class PostBtnComponent {
  private _goToPost: boolean = false;
  title: string = 'Editar';

  @Input()
  set goToPost(value: boolean) {
    this._goToPost = value;
  }

  get goToPost(): boolean {
    return this._goToPost;
  }

}
