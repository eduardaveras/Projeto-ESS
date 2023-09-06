import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../../../backend/src/models/post.model';
import { User } from '../../../../backend/src/models/user.model';
import { Observable } from 'rxjs';
import { initial } from 'cypress/types/lodash';

@Component({
  selector: 'app-historic-list',
  templateUrl: './historic-list.component.html',
  styleUrls: ['./historic-list.component.scss']
})

export class HistoricListComponent implements OnInit {
  show_posts: Post[] = [];
  all_posts: Post[] = [];
  userId: number = 0;
  isDesc: boolean = false;
  selectedCategory: string = 'all';
  availableCategories: string[] = [];

  user : User = {} as User;


  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {

    // Informações do usuário
    this.route.params.subscribe(params => {
      this.userId =+ params['userId']; // O '+' converte a string para um número
      this.getHistoric();
    });

    this.getUserDetails(this.userId).subscribe(data => {
      this.user = data as User;
      console.log(this.user.name);
    });

  }

  // Ordem do histórico (historico total ou filtrado)
  toggleHistoricOrder() {
    this.isDesc = !this.isDesc;
    if (this.selectedCategory === 'all') {
      this.getHistoric();
    } else {
      this.getHistoricByCategory(this.selectedCategory);
    }
  }

  // Obter todos os posts do usuário
  getHistoric() {
    const url = `/users/${this.userId}/historic`;
    const urlWithOrder = this.isDesc ? `${url}?desc=true` : url;

    this.http.get<Post[]>(urlWithOrder).subscribe(posts => {
      this.all_posts = posts;
      this.show_posts = [...this.all_posts];
      this.availableCategories = this.collectCategories(posts);
      //ordenando as categorias
      this.availableCategories.sort();
    });
  }

  // Obter posts do usuário filtrados por categoria
  getHistoricByCategory(category: string) {
    const url_category = `/users/${this.userId}/historic/category/${category}`;
    const urlWithOrder_category = this.isDesc ? `${url_category}?desc=true` : url_category;
    this.selectedCategory = category;
    
    this.http.get<Post[]>(urlWithOrder_category).subscribe(filteredPosts => {
      this.show_posts = filteredPosts;
    });
  }
  
  // Obter todas as categorias dos posts do usuário
  collectCategories(posts: Post[]): string[] {
    const _categories: string[] = [];

    for (const post of posts) {
      for (const category of post.category) {
        if (!_categories.includes(category)) {
          _categories.push(category);
        }
      }
    }

    return _categories;
  }

  // Remover filtro de categoria
  removeCategoryFilter() {
    this.selectedCategory = 'all';
    this.show_posts = [...this.all_posts];
  }

  // Voltando para o perfil do usuário
  public goToHome(): void {
    this.router.navigate(['/users/' + this.userId]);
  }

  //Usuário
  getUserDetails(userId: number) {
    return this.http.get(`/users/${userId}`);
  }
}
