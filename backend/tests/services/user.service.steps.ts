import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import { di } from '../../src/di';
import {createUser} from '../../src/routes/utils';
import { User } from "../../src/models/user.model";
import TestRepository from '../../src/repositories/test.repository'
import users from '../../src/database/users';
import * as Utils from "../utils/test_utils";

const feature = loadFeature('tests/features/user_test.feature');
const request = supertest(app);

defineFeature(feature, (test) => {
    let response: supertest.Response;
    
    test('Creating a new user succesfully', ({ given, and, when, then }) => {
        let userName : string;
        given('The service has a database containing users', () => {

        });

        and(/^The database does not contain a user "(.*)"$/, async (username) => {
            userName = username;
            if(users.find(user => user.user === username)){
                await users.splice(users.findIndex(user => user.user === username),1);
            }
        });

        when(/^A POST request is made to "(.*)" route with the request body$/, async (endpoint, requestBody) => {
            response = await request.post(`${endpoint}`).send(JSON.parse(requestBody));
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));  
            const user  = users.find(user => user.user === userName);
            expect(user).toBeDefined();
            if(user != undefined){
                expect(user.id).not.toBeNaN();
            }     
        });
        
    });

    test('Deleting a non existing user', ({ given, and, when, then }) => {
        let loggedID:number;
        let userID : number;

        given('The service has a database containing users', () => {

        });

        and(/^The database does not contain a user with id "(.*)"$/, async (id) => {
            userID = parseInt(id);
            const userIndex = users.findIndex(user => user.id === userID);
            if(userIndex !== -1){
                users.splice(userIndex,1);
            }
        });

        and(/^An admin with id "(.*)" is logged in$/, async (id) => {
            //Loggin in with id "id"
            loggedID = parseInt(id);
        });

        when(/^A DELETE request is made to "(.*)" route$/, async (endpoint) => {
            response = await request.delete(`${endpoint}`).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(users.find(user => user.id === userID)).toBeUndefined();
        });
    });

    test('Getting a not logged in user profile', ({ given, and, when, then }) => {
        let testUser : any;
        let loggedID:number;
        given('The service has a database containing users', () => {

        });

        and('The database contains the user', async(docString) => {
            testUser = JSON.parse(docString); 


            //Deleting any users with same id
            while(users.find(user => user.id === testUser.id)){
                users.splice(users.findIndex(user => user.id === testUser.id));
            }

            //Ensuring the user exists
            users.push(testUser);
        });

        and(/^A user with id "(.*)" is logged in$/, (id) => {
            loggedID = parseInt(id);
        });

        when(/^A GET request is made to "(.*)" route$/, async (endpoint) => {
            response = await request.get(`${endpoint}`).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
        });
    });

    // ------------- OTHER TESTS ------------------------ //

    test('Creating a new user with existing email', ({ given, and, when, then }) => {
        let testUser : any;

        given('The service has a database containing users', () => {

        });

        and(/^The database contain the user "(.*)" with email "(.*)"$/, async (username, email) => {
            let userID = await Utils.getRandomInt(1,1000);
            while(users.some((users:any) => users.id === userID)){
                userID = await Utils.getRandomInt(1,1000);
            }

            //Checks if the given user exists (so it doesn't enters the "user already exists")
            if(users.find(user => user.user === username)){
                users.splice(users.findIndex(user => user.user === username),1);
            }

            //Ensuring the email exists
            if(!users.find(user => user.email === email)){
                testUser = createUser(userID,username,email,'1','a','b');
                users.push(testUser);
            }
        });

        when(/^A POST request is made to "(.*)" route with the request body$/, async(endpoint, requestBody) => {
            response = await request.post(`${endpoint}`).send(JSON.parse(requestBody));
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(response.body).toStrictEqual({"message":"Email arealdy exists"});
        });
    });

    test('Creating a new user with existing user', ({ given, and, when, then }) => {
        let testUser : any;
        given('The service has a database containing users', () => {

        });

        and(/^The database contain the user "(.*)"$/, async(username) => {
            //Ensuring a user already exists
            if(!users.find(user => user.user === username)){
                let userID = await Utils.getRandomInt(1,1000);
                while(users.some((users:any) => users.id === userID)){
                    userID = await Utils.getRandomInt(1,1000);
                }
                let email = 'test_mail@email.com';

                testUser = createUser(userID,username,email,'1','a','b');
                users.push(testUser);
            }
        });

        when(/^A POST request is made to "(.*)" route with the request body$/, async (endpoint, requestBody) => {
            response = await request.post(`${endpoint}`).send(JSON.parse(requestBody));
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(response.body).toStrictEqual({"message":"Username arealdy exists"});
        });
    });

    test('Creating a new user with missing information', ({ given, and, when, then }) => {
        given('The service has a database containing users', () => {

        });

        and(/^The database does not contain a user "(.*)"$/, (username) => {
            if(users.find(user => user.user === username)){
                users.splice(users.findIndex(user => user.user === username),1);
            }
        });

        when(/^A POST request is made to "(.*)" route with the request body$/, async (endpoint, requestBody) => {
            response = await request.post(`${endpoint}`).send(JSON.parse(requestBody));
        });

        then(/^The service should respond with status code "(.*)"$/, (statusCode) => {
            expect(response.status).toBe(parseInt(statusCode,10));
        });
    });

    test('Deleting a user succesfully', ({ given, and, when, then }) => {
        let testUser : any;
        let loggedID : number;
        let userID : number;
        given('The service has a database containing users', () => {

        });

        and(/^The database contains a user with id "(.*)"$/, (id) => {
            userID = parseInt(id);
            //Ensuring a user exists
            if(!users.find(user => user.id === userID)){
                let username = "test_user";
                let email = 'test_mail@test_email.com';

                //Ensuring any other users have testing email
                while(users.find(user => user.email === email)){
                    users.splice(users.findIndex(user => user.email === email),1);
                }
                testUser = createUser(parseInt(id),username,email,'1','a','b');
                users.push(testUser);
            }
        });

        and(/^A user with id "(.*)" is logged in$/,(id) => {
            loggedID = parseInt(id);
        });

        when(/^A DELETE request is made to "(.*)" route$/, async (endpoint) => {
            response = await request.delete(`${endpoint}`).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(users.find(user => user.id === userID)).toBeUndefined();
        });
    });

    test('Deleting a not logged in user', ({ given, and, when, then }) => {
        let testUser : any;
        let loggedID : number;
        given('The service has a database containing users', () => {

        });

        and(/^The database contains a user with id "(.*)"$/, (id) => {
            let userID = parseInt(id);

            if(!users.find(user => user.id === userID)){
                let username = "test_user"
                let email = 'test_mail@email.com';
                if(users.find(user => user.email === email)){
                    users.splice(users.findIndex(user => user.email === email),1);
                }
                testUser = createUser(userID,username,email,'1','a','b');
                users.push(testUser);
            }
        });

        and(/^A user with id "(.*)" is logged in$/, (id) => {
            loggedID = parseInt(id);
        }); 

        when(/^A DELETE request is made to "(.*)" route$/, async (endpoint) => {
            response = await request.delete(`${endpoint}`).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(message).toBe('Unauthorized');
        });
    });

    test('Editing a user profile', ({ given, and, when, then }) => {
        let testUser : any;
        let loggedID : number;
        given('The service has a database containing users', () => {

        });

        and('The database contains a user', (docString) => {
            testUser = JSON.parse(docString);


            //Deleting any users with same info
            while(users.find(user => user.id === testUser.id) ||
                    users.find(user => user.user === testUser.user) ||
                    users.find(user => user.user === testUser.user)){
                users.splice(users.findIndex(user => user.id === testUser.id),1);
                users.splice(users.findIndex(user => user.user === testUser.user),1);
                users.splice(users.findIndex(user => user.user === testUser.user),1);
            }

            //Ensuring the user exists
            users.push(testUser);
        });

        and(/^A user with id "(.*)" is logged in$/, (id) => {
            loggedID = parseInt(id);
        });

        when(/^A PUT request is made to "(.*)" route with the request body$/, async (endpoint, requestBody) => {
            response = await request.put(`${endpoint}`).send(JSON.parse(requestBody)).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(message).toBe('User was successfully modified');
        });
    });

    test('Editing a not logged in user profile', ({ given, and, when, then }) => {
        let testUser : any;
        let loggedID : number;
        given('The service has a database containing users', () => {

        });

        and('The database contains the user', (docString) => {
            testUser = parseInt(docString);

            //Deleting any users with same id
            while(users.find(user => user.id === testUser.id)){
                users.splice(users.findIndex(user => user.id === testUser.id));
            }

            //Ensuring the user exists
            users.push(testUser);  
        });

        and(/^A user with id "(.*)" is logged in$/, (id) => {
            loggedID = parseInt(id);
        });

        when(/^A PUT request is made to "(.*)" route with the request body$/, async (endpoint, requestBody) => {
            response = await request.put(`${endpoint}`).send(JSON.parse(requestBody)).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(message).toBe('Unauthorized');
        });
    });

    test('Editing a non existing user profile', ({ given, and, when, then }) => {
        let userID : any;
        let loggedID : number;
        given('The service has a database containing users', () => {

        });

        and(/^The database does not contains a user with id "(.*)"$/, (id) => {
            userID = parseInt(id);

            //Deleting any users with same id
            while(users.find(user => user.id === userID)){
                users.splice(users.findIndex(user => user.id === userID));
            }
        });

        and(/^An admin with id "(.*)" is logged in$/, (id) => {
            loggedID = parseInt(id);
        });

        when(/^A PUT request is made to "(.*)" route with the request body$/, async (endpoint, requestBody) => {
            response = await request.put(`${endpoint}`).send(JSON.parse(requestBody)).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(message).toBe('User not found');
        });
    });

    test('Getting user profile', ({ given, and, when, then }) => {
        let testUser : any;
        let loggedID : number;
        given('The service has a database containing users', () => {

        });

        and('The database contains a user', async (docString) => {
            testUser = JSON.parse(docString); 

            //Deleting any users with same id
            while(users.find(user => user.id === testUser.id)){
                users.splice(users.findIndex(user => user.id === testUser.id));
            }

            //Ensuring the user exists
            users.push(testUser); 
        });

        and(/^A user with id "(.*)" is logged in$/, (id) => {
            loggedID = parseInt(id);
        });

        when(/^A GET request is made to "(.*)" route$/, async (endpoint) => {
            response = await request.get(`${endpoint}`).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)"$/, (statusCode) => {
            expect(response.status).toBe(parseInt(statusCode,10));
        });

        and('The service returns the object', (docString) => {
            expect(response.body).toStrictEqual(testUser);
        });
    });

    test('Getting a non existing user profile', ({ given, and, when, then }) => {
        let userID : any;
        let loggedID : number;
        given('The service has a database containing users', () => {

        });

        and(/^The database does not contains a user with id "(.*)"$/, (id) => {
            userID = parseInt(id); 

            //Deleting any users with same id
            while(users.find(user => user.id === userID)){
                users.splice(users.findIndex(user => user.id === userID));
            }     
        });

        and(/^An admin with id "(.*)" is logged in$/, (id) => {
            loggedID = parseInt(id);
        });

        when(/^A GET request is made to "(.*)" route$/, async (endpoint) => {
            response = await request.get(`${endpoint}`).query({loggedID : loggedID});
        });

        then(/^The service should respond with status code "(.*)" with the message "(.*)"$/, (statusCode, message) => {
            expect(response.status).toBe(parseInt(statusCode,10));
            expect(message).toBe('User not found');
            expect(users.find(user => user.id === userID)).toBeUndefined();
        });
    });
});