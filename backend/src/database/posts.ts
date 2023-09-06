import { Post } from "../models/post.model";

let posts: Post[] = [
    {
        user_id: 1,
        post_id: 1,
        status: "active",
        date: "2021-01-01",
        category: ["Action", "Adventure"],
        game: "Hollow Knight",
        rate: 5,
        title: "Primeiro Post no forum pessoal!! Hollow Knight",
        description: "Usando essa oportunidade para dar as boas vindas à todos os novos membros que chegarem aqui, vamos fazer um espaço massa pra todo mundo compartilhar e discutir nossa opinião em jogos!! Meu jogo favorito é Hollow Knight!!",
        comments: 2
    },
    {
        user_id: 1,
        post_id: 2,
        status: "active",
        date: "2021-04-01",
        category: ["Action", "Adventure"],
        game: "It takes two",
        rate: 5,
        title: "Jogo massa",
        description: "Po galera joguei com a amada mt massa",
        comments: 5
    },
    {
        user_id: 1,
        post_id: 3,
        status: "deactived",
        date: "2021-09-23",
        category: ["Action", "Adventure"],
        game: "It takes two",
        rate: 2,
        title: "Horrendo",
        description: "Joguei com o amado horrivel",
        comments: 59
    },
    {
        user_id: 1,
        post_id: 4,
        status: "edited",
        date: "2021-02-06",
        category: ["Platform"],
        game: "Celeste",
        rate: 2,
        title: "Terminei o jogo!!!",
        description: "postando aqui pra quando terminar, ate agora esta dificil. Terminei galera jogo muito massa",
        comments: 0
    },
    {
        user_id: 2,
        post_id: 5,
        status: "active",
        date: "2021-01-01",
        category: ["Action", "Adventure"],
        game: "Hollow Knight",
        rate: 5,
        title: "Primeiro Post no forum pessoal!! Hollow Knight",
        description: "Usando essa oportunidade para dar as boas vindas à todos os novos membros que chegarem aqui, vamos fazer um espaço massa pra todo mundo compartilhar e discutir nossa opinião em jogos!! Meu jogo favorito é Hollow Knight!!",
        comments: 2
    },
    {
        user_id: 1,
        post_id: 6,
        status: "active",
        date: "2023-07-05",
        category: ["Adventure", "Puzzle"],
        game: "Unrailed",
        rate: 5,
        title: "Piuiiiiii olha o trem passando",
        description: "Po galera joguei com a amada mt massa",
        comments: 5
    }
];

export default posts;

export const getPosts = (): Post[] => {
    return posts;
}