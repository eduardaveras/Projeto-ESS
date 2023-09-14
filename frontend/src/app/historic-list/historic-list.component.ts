import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../../../backend/src/models/post.model';
  
@Component({
  selector: 'app-historic-list',
  templateUrl: './historic-list.component.html',
  styleUrls: ['./historic-list.component.scss']
})

export class HistoricListComponent implements OnInit {
  userId: number = 1;
  postId: number = 1;
  post: Post = {} as Post;
  show_posts: Post[] = [];
  all_posts: Post[] = [];
  isDesc: boolean = false;
  selectedCategory: string = 'all';
  availableCategories: string[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.postId = Number(this.route.snapshot.paramMap.get('post_id'));

    if (this.route.parent) {
      this.route.parent.params.subscribe(params => {
        this.userId = params['id'];
        this.getHistoric();
      });
    }
  }

  // Ordem do histórico
  HistoryOrder() {
    this.isDesc = !this.isDesc;
    //console.log(this.selectedCategory)
    if (this.selectedCategory === 'all')
      this.getHistoric();
    else
      this.getHistoryByCategory(this.selectedCategory);
  }

  starClass(index: number, rating: number): string {
    if (index < rating) {
      return 'yellow';
    } else {
      return 'white';
    }
  }

  // Obter todas as categorias dos posts do usuário
  collectCategories() {
    const categories: string[] = [];

    for (const post of this.all_posts) {
      for (const category of post.category) {
        if (!categories.includes(category)) {
          categories.push(category);
        }
      }
    }

    this.availableCategories = categories;
    this.availableCategories.sort();
  }

  // Obter todos os posts do usuário
  getHistoric() {
    const url = `/users/${this.userId}/historic`;
    const urlWithOrder = this.isDesc ? `${url}?desc=true` : url;

    this.http.get<Post[]>(urlWithOrder).subscribe(posts => {
      this.all_posts = posts;
      this.show_posts = [...this.all_posts];
      this.collectCategories();
    });
  }

  // Obter posts do usuário filtrados por categoria
  getHistoryByCategory(category: string) {
    this.selectedCategory = category;

    const url = `/users/${this.userId}/historic/category/${category}`;
    const urlWithOrder = this.isDesc ? `${url}?desc=true` : url;

    this.http.get<Post[]>(urlWithOrder).subscribe(posts => {
      this.all_posts = posts;
      this.show_posts = [...this.all_posts];
    });
  }

  showAll() {
    this.selectedCategory = 'all';
    this.getHistoric();
  }

  // Mudar para a rota dos posts
  openPost(userId: number, postId: number) : void {
    this.router.navigate([`/users/${userId}/${postId}`]);
  }

}
