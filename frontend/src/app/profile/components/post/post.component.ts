import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../../../../backend/src/models/post.model';
import { User } from '../../../../../../backend/src/models/user.model';
import { StarRatingComponent } from 'src/app/shared/components/star-rating/star-rating.component';
import { catchError } from 'rxjs/operators';
import { toast } from 'react-toastify';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

export class PostComponent implements OnInit {
  userId : User = {} as User;
  post : Post = {} as Post;
  postId : number = 0;
  selectedRating : number = 0; 
  formErrors: { category: string, 
    game: string, 
    rate: string, 
    title: string,
    description: string } = {  category: '', game: '', rate: '', title: '', description: '' };
  userLoggedInId: number = 0;
  isUserLoggedIn: boolean = false;
  saved : boolean = false;
  notSaved: boolean = false;
  disabled = false;
  goToPost : boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private datePipe: DatePipe) {}

  submitForm() {
    if(this.isFormValid()){
      this.post.date = this.datePipe.transform(new Date(), 'dd/MMM')!;
      this.post.rate = this.selectedRating;
      console.log(this.post.rate);
      this.sendRequest();
      console.log("oi");
    }
  }
  
  isFormValid(): boolean{
    // Limpa mensagens de erro antes de realizar a validação
    this.formErrors = {  category: '', game: '', rate: '', title: '', description: ''};
    let isValid : boolean = true;

    // Validação do campo Nome de Usuário (obrigatório)
    if (!this.post.category) {
      this.formErrors['category'] = 'Defina a categoria do seu jogo.';
      isValid = false;
    }

    // Validação do campo E-mail (obrigatório)
    if (!this.post.game) {
      this.formErrors['game'] = 'Sobre qual jogo é sua review?.';
      isValid = false;
    }

    // Validação do campo Senha (obrigatório)
      // if (!this.post.rate) {
      //   this.formErrors['rate'] = 'Dê uma avaliação ao jogo.';
      //   isValid = false;
      // }

    // Validação do campo Nome e Sobrenome (obrigatório)
    if (!this.post.title) {
      this.formErrors['title'] = 'Dê um título ao seu post.';
      isValid = false;
    }

    if (!this.post.description) {
      this.formErrors['description'] = 'Escreva uma descrição para seu post.';
      isValid = false;
    }

    return isValid;
  }

  public goToRoute(route: string) {
    this.router.navigate([route]);
  }

  onRatingChange(rating: number) {
    this.selectedRating = rating + 1;
    console.log(this.selectedRating);
  }

  sendRequest(): void {
    console.log('New Post:', this.post);
    this.http.post('/post', this.post).subscribe(
      (data) => {
        window.alert("Post feito com sucesso!");
        this.router.navigate([`/users/${this.userLoggedInId}`])
      },
      (error) => {
        console.log(error.status);
        console.log(error.message);
  
        if (error.status === 409) {
          if (error.error && error.error.message) {
            const errorMessage = error.error.message;
          }
        }
      }
    );
  }  

  navigateToUserLoggedIn(){
    this.http.get('/me').subscribe(data => {
      const userLoggedIn = data as User;
      this.userLoggedInId = userLoggedIn.id;

      this.router.navigate(['/users/' + this.userLoggedInId]);
    });
  }
      
  checkIsUserLoggedIn() {
    this.http.get('/me').subscribe(data => {
      const userId = data as User;
      this.userLoggedInId = userId.id;
      
    });
  }

  ngOnInit(): void {

    this.checkIsUserLoggedIn();

  }
}