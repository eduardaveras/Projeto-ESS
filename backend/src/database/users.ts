import { User } from "../models/user.model";

let users: User[] = [
  {
    id: 1,
    user: "usuario1",
    email: "usuario1@example.com",
    password: "senha123",
    name: "Fulano",
    lastName: "Silva",
    pronouns: "ele/dele",
    bio: "Olá! Sou Fulano Silva e estou explorando o mundo da tecnologia.",
    followers: [2, 3],
    following: [],
    blocked: []
  },
  {
    id: 2,
    user: "Bileu",
    email: "aiwjda@email.com",
    password: "senha123",
    name: "Ciclano",
    lastName: "Silva",
    pronouns: "ele/dele",
    bio: "Olá! Sou Ciclano Silva e estou explorando o mundo da tecnologia.",
    followers: [3],
    following: [1],
    blocked: []
  },
  {
    id: 3,
    user: "Balalau",
    email: "aiaisdj@email.com",
    password: "senha123",
    name: "Beltrano",
    lastName: "Silva",
    pronouns: "ele/dele",
    bio: "Olá! Sou Beltrano Silva e estou explorando o mundo da tecnologia.",
    followers: [3],
    following: [2, 1],
    blocked: []
  },
  {
    id: 4,
    user: "Lighthalzen",
    email: "Lighthalzen@gmail.com",
    password: "2173498723191a",
    name: "City of",
    lastName: "Lighthalzen",
    pronouns: "it/it",
    bio: "This is the city of science!",
    followers: [],
    following: [],
    blocked: []
  },
  {
    id: 60,
    user: "Mathbonc",
    email: "Bonc@gmail.com",
    password: "40028922b",
    name: "Matheus",
    lastName: "Boncsidai",
    pronouns: "he/him",
    bio: "Hello There!",
    followers: [],
    following: [],
    blocked: []
  },
  {
    // generate a random person
    id: 5,
    user: "Laricell",
    email: "lari@email.com",
    password: "senha123",
    name: "Larissa",
    lastName: "Silva",
    pronouns: "ela/dela",
    bio: "Olá! Sou Larissa Silva e estou explorando o mundo da tecnologia.",
    followers: [],
    following: [],
    blocked: [2]
  }
]

export default users;