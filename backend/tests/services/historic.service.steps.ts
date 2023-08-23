import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';

import Posts, { getPosts } from '../../src/database/posts';

const feature = loadFeature('./tests/features/historico_service.feature');
const request = supertest(app);

defineFeature(feature, test => {

    // Cenário de sucesso para filtrar por categoria

    test('Filtering posts by category', ({ given, when, then, and }) => {

        let response: supertest.Response;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)" and category: '(.*)'$/ ,
            (arg0, arg1, arg2) => {

            const categories = JSON.parse(arg2);

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1) &&
                categories.every((category: string) => post.category.includes(category))
            )).toBeDefined();

        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)" and category: '(.*)'$/ ,
            (arg0, arg1, arg2) => {

            const categories = JSON.parse(arg2);

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1) &&
                categories.every((category: string) => post.category.includes(category))
            )).toBeDefined();

        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)" and category: '(.*)'$/ ,
            (arg0, arg1, arg2) => {

            const categories = JSON.parse(arg2);

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1) &&
                categories.every((category: string) => post.category.includes(category))
            )).toBeDefined();

        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)" and category: '(.*)'$/ ,
            (arg0, arg1, arg2) => {

            const categories = JSON.parse(arg2);

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1) &&
                categories.every((category: string) => post.category.includes(category))
            )).toBeDefined();

        });

        when(/^A "GET" request is made to "(.*)" route$/, async (route: string) => {
            //Fazendo uma requisição GET para a rota passada
            response = await request.get(route);
        });

        then(/^The service should return a list of post of the user with id: "(.*)" containing the category "(.*)"$/,
            (arg0, arg1) => {
                expect(response.body[0].user_id).toEqual(parseInt(arg0));
                expect(response.body[0].category).toContain(arg1);
        });

        and(/^The list of posts should contain the post with id: "(.*)" and category: '(.*)'$/,
            (arg0, arg1) => {
                //console.log(response.body[0])
                expect(response.body[0].post_id).toBe(parseInt(arg0));
                JSON.parse(arg1).forEach((category: string) => {
                    //console.log(category);
                expect(response.body[0].category).toContain(category);
                });
        });

        and(/^The service should respond with status code "(.*)"$/,
            (arg0) => {
                expect(response.status).toBe(parseInt(arg0));
        });

    });

    // Cenário de erro para filtrar por categoria

    test('Filtering posts by category that does not exist', ({ given, when, then, and }) => {

        let response: supertest.Response;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database does not contain a post with category "(.*)"$/ , (arg0) => {
            //Checando se a base de dados de posts não contem uma post com a categoria passada
            expect(Posts.find(post => post.category.includes(arg0))).toBeUndefined();
        });

        when(/^A "GET" request is made to "(.*)" route$/, async (route: string) => {
            //Fazendo uma requisição GET para a rota passada
            response = await request.get(route);
        });

        then(/^The service should respond with status code "(.*)"$/, (arg0) => {
            expect(response.status).toBe(parseInt(arg0));
        });

        and(/^The respose should contain the message "(.*)"$/, (arg0) => {
            //console.log(response.body.error);
            expect(response.body.error).toBe(arg0);
        });   
        
    });

    // Cenário de sucesso para obter todas as reviews de um usuário

    test('Get all posts of the user', ({ given, when, then, and }) => {

        let response: supertest.Response;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)"$/ ,
            (arg0, arg1) => {

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1)
            )).toBeDefined();

        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)"$/ ,
            (arg0, arg1) => {

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1)
            )).toBeDefined();

        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)"$/ ,
            (arg0, arg1) => {

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1)
            )).toBeDefined();

        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)"$/ ,
            (arg0, arg1) => {

            //Checando se a base de dados de posts contem uma post com os dados passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1)
            )).toBeDefined();

        });

        when(/^A "GET" request is made to "(.*)" route$/, async (route: string) => {
            //Fazendo uma requisição GET para a rota passada
            response = await request.get(route);
        });

        then(/^The service should respond with a list of post of the user with id: "(.*)"$/, (arg0) => {
            //console.log(response.body[0]);
            expect(response.body[0].user_id).toEqual(parseInt(arg0));
            
            //checando a ordem
            const isOrdered = response.body.every((post: typeof Posts[0], index: number, array: typeof Posts[0][]) => {
                return index === 0 || new Date(post.date).getTime() >= new Date(array[index - 1].date).getTime();
            });
                
            expect(isOrdered).toBe(false);
        });

        and(/^The list of posts should contain the post with id: "(.*)", "(.*)", "(.*)" and "(.*)"$/, (arg0, arg1, arg2, arg3) => {
            expect(response.body[0].post_id).toBe(parseInt(arg0));
            expect(response.body[1].post_id).toBe(parseInt(arg1));
            expect(response.body[2].post_id).toBe(parseInt(arg2));
            expect(response.body[3].post_id).toBe(parseInt(arg3));


        });

        and(/^The service should respond with status code "(.*)"$/, (arg0) => {
            expect(response.status).toBe(parseInt(arg0));
        });

    });

    // Cenário de erro para obter todas os posts de um usuário

    test('Get all posts of the user that does not exist', ({ given, when, then, and }) => {

        let response: supertest.Response;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database does not contain any post with user_id: "(.*)"$/ , (arg0) => {
            //Checando se a base de dados de reviews não contem uma review com o id do usuário passado
            expect(Posts.find(post => post.user_id === parseInt(arg0))).toBeUndefined();
        });

        when(/^A "GET" request is made to "(.*)" route$/, async (route: string) => {
            //Fazendo uma requisição GET para a rota passada
            response = await request.get(route);
        });

        then(/^The service should respond with status code "(.*)"$/, (arg0) => {
            expect(response.status).toBe(parseInt(arg0));
        });

        and(/^The response should contain the message "(.*)"$/, (arg0) => {
            //console.log(response.body.error);
            expect(response.body.error).toBe(arg0);
        });

    });

    // Cenário de sucesso para editar um post

    test('Edit a post', ({ given, when, then, and }) => {

        let response: supertest.Response;
        let past_post: typeof Posts[0] | undefined;
        let endpoint: string;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database contains a post with id: "(.*)", user_id: "(.*)" and rate: "(.*)"$/ , (arg0, arg1, arg2) => {
            //Checando se a base de dados de posts contem uma post com os dados passados
            past_post = Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1) &&
                post.rate === parseInt(arg2)
                );
                
            //Salvando a post que será editada
            expect(past_post).toBeDefined();
            //console.log(past_review);
        });

        and(/^The user with id: "(.*)" is logged in$/ , (arg0) => {
            //Checando se o usuário com o id passado esta logado
            // nessa implementação todos os usuários que tem o id 1 estão logados
            expect(parseInt(arg0)).toBe(1);
        });

        when(/^A "PUT" request is made to "(.*)" route$/, async (route: string) => {
            //Fazendo uma requisição PUT para a rota passada
            endpoint = route;
        });

        and(/^The request contains a JSON body with updated post rate: "(.*)"$/ , async (arg0) => {
            //Checando se o corpo da requisição contem o rate passado
            response = await request.put(endpoint).send({rate: parseInt(arg0)});
            //console.log(response.body);

        });

        then(/^The service should respond with the updated post$/ , () => {
            //Checando se o corpo da resposta contem o review editado
            //console.log(response.body);
            expect(response.body.rate).not.toBe(past_post?.rate);                                     

        });

        and(/^The updated post should contain rate: "(.*)"$/ , (arg0) => {
            //Checando se o rating da review foi alterado
            expect(response.body.rate).toBe(parseInt(arg0));
        });

        and(/^The service should respond with status code "(.*)"$/ , (arg0) => {
            //Checando se o status code da resposta é o esperado
            expect(response.status).toBe(parseInt(arg0));
        });

    });

    // Cenário de erro para editar um post que não existe

    test('Edit a post that does no exist', ({ given, when, then, and }) => {

        let response: supertest.Response;
        let endpoint: string;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database does not contain a post with id: "(.*)"$/ , (arg0) => {
            //Checando se a base de dados de reviews não contem uma review com o id passado
            expect(Posts.find(post => post.post_id === parseInt(arg0))).toBeUndefined();
        });

        and(/^A user with id: "(.*)" is logged in$/ , (arg0) => {
            //Checando se o usuário com o id passado esta logado
            // nessa implementação todos os usuários que tem o id 1 estão logados
            expect(parseInt(arg0)).toBe(1);
        });

        when(/^A "PUT" request is made to "(.*)" route$/, (route: string) => {
            //Fazendo uma requisição PUT para a rota passada
            endpoint = route;
        });

        and(/^The request contains a JSON body with updated post data title: "(.*)"$/ , async (arg0) => {
            //Checando se o corpo da requisição contem o nome passado
            response = await request.put(endpoint).send({name: arg0});
            //console.log(response);
        });

        then(/^The service should respond with status code "(.*)"$/ , (arg0) => {
            //Checando se o status code da resposta é o esperado
            expect(response.status).toBe(parseInt(arg0));
        });

        and(/^The response should contain an error message "(.*)"$/ , (arg0) => {
            //Checando se a resposta contem a mensagem de erro esperada
            expect(response.body.error).toBe(arg0);
        });

    });

    // Cenário de erro para editar sem estar logado

    test('Edit a post without being logged in', ({ given, when, then, and }) => {

        let response: supertest.Response;
        let endpoint: string;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database contain a post with id: "(.*)" and user_id: "(.*)"$/ , (arg0, arg1) => {
            //Checando se a base de dados de reviews contem uma review com o id e author_id passados
            //console.log(posts);

            let temp = Posts.find(post =>
                post.post_id === parseInt(arg0) &&
                post.user_id === parseInt(arg1)
                );
            //console.log(temp);

            expect(temp).toBeDefined();   
        });

        and(/^The user with id: "(.*)" is not logged in$/ , (arg0) => {
            //Checando se o usuário com o id passado não esta logado
            // nessa implementação todos os usuários que tem o id 1 estão logados
            expect(parseInt(arg0)).not.toBe(1);
        });

        when(/^A "PUT" request is made to "(.*)" route$/, (route: string) => {
            //Fazendo uma requisição PUT para a rota passada
            endpoint = route;
        });

        and(/^The request contains a JSON body with updated post data title: "(.*)"$/ , async (arg0) => {
            //Checando se o corpo da requisição contem o nome passado
            response = await request.put(endpoint).send({name: arg0});
            //console.log(response);
        });

        then(/^The service should respond with status code "(.*)"$/ , (arg0) => {
            //Checando se o status code da resposta é o esperado
            expect(response.status).toBe(parseInt(arg0));
        });

        
        and(/^The response should contain an error message "(.*)"$/ , (arg0) => {
            //Checando se a resposta contem a mensagem de erro esperada
            expect(response.body.error).toBe(arg0);
        });

    });

    // Cenário de sucesso para deletar um post

    test('Delete a post', ({ given, when, then, and }) => {

        let response: supertest.Response;
        let endpoint: string;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database contains a post with id: "(.*)" and user_id: "(.*)"$/ , (arg0, arg1) => {
            //Checando se a base de dados de posts contem um post com o id e author_id passados
            expect(Posts.find(post =>
                post.post_id === parseInt(arg1) &&
                post.user_id === parseInt(arg0)
                )).toBeDefined();
        });

        and(/^The user with id: "(.*)" is logged in$/ , (arg0) => {
            //Checando se o usuário com o id passado esta logado
            // nessa implementação todos os usuários que tem o id 1 estão logados
            expect(parseInt(arg0)).toBe(1);
        });

        when(/^A "DELETE" request is made to "(.*)" route$/, async (route: string) => {
            //Fazendo uma requisição DELETE para a rota passada
            response = await request.delete(route);
            //console.log(response.body);
        });

        then(/^The service should respond with status code "(.*)"$/ , (arg0) => {
            //Checando se o status code da resposta é o esperado
            expect(response.status).toBe(parseInt(arg0));
        });

        and(/^The response should contain a message "(.*)"$/ , (arg0) => {
            //Checando se a resposta contem a mensagem de sucesso esperada
            expect(response.body.message).toBe(arg0);
        });

    });

    // Cenário de erro para deletar um post que não existe

    test('Delete a post that does not exist', ({ given, when, then, and }) => {

        let response: supertest.Response;

        given('The service has a database containing posts', async () => {
            //Checando se a base de dados de posts não esta vazia
            expect(getPosts().length).not.toBe(0);
        });

        and(/^The database does not contain a post with id: "(.*)"$/ , (arg0) => {
            //Checando se a base de dados de reviews não contem uma review com o id passado
            expect(Posts.find(post => post.post_id === parseInt(arg0))).toBeUndefined();
        });

        and(/^The user with id: "(.*)" is logged in$/ , (arg0) => {
            //Checando se o usuário com o id passado esta logado
            // nessa implementação todos os usuários que tem o id 1 estão logados
            expect(parseInt(arg0)).toBe(1);
        });

        when(/^A "DELETE" request is made to "(.*)" route$/, async (route: string) => {
            //Fazendo uma requisição DELETE para a rota passada
            response = await request.delete(route);
            //console.log(response.body);
        });

        then(/^The service should respond with status code "(.*)"$/ , (arg0) => {
            //Checando se o status code da resposta é o esperado
            expect(response.status).toBe(parseInt(arg0));
        });

        and(/^The response should contain an error message "(.*)"$/ , (arg0) => {
            //Checando se a resposta contem a mensagem de erro esperada
            expect(response.body.error).toBe(arg0);
        });

    });


});
