Feature: Post 
	As: Um usuario da plataforma de compartilhamento de reviews
	I want to: Criar, remover e editar posts
	So that: Possa compartilhar o que penso sobre os meus jogos

Scenario: Criar um post com informações opcionais faltando
	Given o usuário está na página "/post"
	When Preencho o campo de "game" com "Formula 1"
	And Preencho o campo de "category" com "Corrida"
	And Preencho o campo de "title" com "muito massa galera"
	And Preencho o campo de "description" com "joguei com o felipe massa!!"
	And clico em "Postar" - user
    When confirmo a notificação "Post feito com sucesso!"
	Then o usuário foi para a página do seu perfil

Scenario: Fazer uma postagem
	Given o usuário está na página de perfil
	And "Post" está visível - user
	When clico em "Post"
	Then o usuário está na página de postagem