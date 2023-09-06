import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import users from '../../src/database/users';
import { getUser } from '../../src/services/list.service';

const feature = loadFeature('./tests/features/followers_service.feature');
const request = supertest(app);
let followResponse: supertest.Response;

defineFeature(feature, test => {

        test('Returns following list', ({ given, when, then, and }) => {
            given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
                // Verify that the user exists
                userid = parseInt(userid);
                const user = getUser(userid, users);
                // const user = users.find(user => user.id === userid);
                expect(user).not.toBeUndefined();
            });

            and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
                // Verify that the user exists
                userid = parseInt(userid);

                const user = getUser(userid, users);
                expect(user).not.toBeUndefined();
            });

            and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
                // Verify that the user exists
                userid = parseInt(userid);

                const user = getUser(userid, users);
                expect(user).not.toBeUndefined();
            });

            and(/^the list of following of "(\d+)" contains "(\d+)"$/, (userid1, userid2) => {
                // Verify that the user is following the other user
                userid1 = parseInt(userid1);
                userid2 = parseInt(userid2);

                const user = getUser(userid1, users);
                expect(user?.following).toContain(userid2);
            });

            and(/^the list of following of "(\d+)" contains "(\d+)"$/, (userid1, userid2) => {
                // Verify that the user is following the other user
                userid1 = parseInt(userid1);
                userid2 = parseInt(userid2);

                const user = getUser(userid1, users);
                expect(user?.following).toContain(userid2);
            });

            when(/^a GET request is made to "(.*)"/, async (endpoint_) => {
                // Make the request
                followResponse = await request.get(`${endpoint_}`);
            });

            then(/^the system returns a "(\d+)" status$/, (statusCode) => {
                // Verify that the response is correct
                expect(followResponse.status).toEqual(parseInt(statusCode));
            });

            and(/^the response is a list containing user "(\d+)" and user "(\d+)"$/, (userid1, userid2) => {
                // Verify that the response is correct
                userid1 = parseInt(userid1);
                userid2 = parseInt(userid2);

                const user1 = getUser(userid1, users);
                const user2 = getUser(userid2, users);

                expect(followResponse.body).toContainEqual(user1);
                expect(followResponse.body).toContainEqual(user2);
            });
    });

    test('Client follows a user', ({ given, when, then, and }) => {
        let endpoint : string;

        given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);

            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the list of following of the "(\d+)" does not have an user with ID "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is not already following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid1, users);
            expect(user?.following).not.toContain(userid2);
        });

        when(/^a POST request is made to "(.*)"/, async (endpoint_) => {
            // Make the request
            endpoint = endpoint_;
        });

        and(/^the request body is '(.*)'$/, async (body) => {
            let body_json = JSON.parse(body);

            followResponse = await request.post(`${endpoint}`).send(body_json);
        });

        then(/^the system returns a "(\d+)" status and the message "(.*)"$/, (statusCode, message) => {
            // Verify that the response is correct
            expect(followResponse.status).toEqual(parseInt(statusCode));
            expect(followResponse.body.message).toEqual(message);
        });

        and(/^"(\d+)" is added to the list of followers of "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is now following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid2, users);
            expect(user?.followers).toContain(userid1);
        });

        and(/^"(\d+)" is added to the list of following of "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is now following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2)

            const user = getUser(userid2, users);
            expect(user?.following).toContain(userid1);
        });
    });

    test('Client unfollows a user', ({ given, when, then, and }) => {
        let endpoint : string;

        given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);

            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the list of following of the "(\d+)" has an user with ID "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid1, users);
            expect(user?.following).toContain(userid2);
        });

        when(/^a POST request is made to "(.*)"/, async (endpoint_) => {
            // Save the endpoint
            endpoint = endpoint_;
        });

        and(/^the request body is '(.*)'$/, async (body) => {
            // Make the request
            let body_json = JSON.parse(body);

            followResponse = await request.post(`${endpoint}`).send(body_json);
        });

        then(/^the system returns a "(\d+)" status and the message "(.*)"$/, (statusCode, message) => {
            // Verify that the response is correct
            expect(followResponse.status).toEqual(parseInt(statusCode));
            expect(followResponse.body.message).toEqual(message);
        });

        and(/^"(\d+)" is removed from the list of followers of "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is no longer following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid2, users);
            expect(user?.followers).not.toContain(userid1);
        });

        and(/^"(\d+)" is removed from the list of following of "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is no longer following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid2, users);
            expect(user?.following).not.toContain(userid1);
        });
    });


    test('Client follows a user that does not exist', ({ given, when, then, and }) => {
        let endpoint : string;

        given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system does not have an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user does not exist
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).toBeUndefined();
        });

        when(/^a POST request is made to "(.*)"/, async (endpoint_) => {
            // Save the endpoint
            endpoint = endpoint_;
        });

        and(/^the request body is '(.*)'$/, async (body) => {
            // Make the request
            let body_json = JSON.parse(body);

            followResponse = await request.post(`${endpoint}`).send(body_json);
        });

        then(/^the system returns a "(\d+)" status and the message "(.*)"$/, (statusCode, message) => {
            // Verify that the response is correct
            expect(followResponse.status).toEqual(parseInt(statusCode));
            expect(followResponse.body.message).toEqual(message);
        });

    });


    test('Client blocks a user', ({ given, when, then, and }) => {
        let endpoint : string;

        given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);

            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the list of blocked of the "(\d+)" does not have an user with ID "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is not already blocked
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid1, users);
            expect(user?.blocked).not.toContain(userid2);
        });

        when(/^a POST request is made to "(.*)"/, async (endpoint_) => {
            // Save the endpoint
            endpoint = endpoint_;
        });

        and(/^the request body is '(.*)'$/, async (body) => {
            // Make the request
            let body_json = JSON.parse(body);

            followResponse = await request.post(`${endpoint}`).send(body_json);
        });

        then(/^the system returns a "(\d+)" status and the message "(.*)"$/, (statusCode, message) => {
            // Verify that the response is correct
            expect(followResponse.status).toEqual(parseInt(statusCode));
            expect(followResponse.body.message).toEqual(message);
        });

        and(/^"(\d+)" is added to the list of blocked of "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is now blocked
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid2, users);
            expect(user?.blocked).toContain(userid1);
        });
    });

    test('Client unblocks a user', ({ given, when, then, and }) => {
        let endpoint : string;

        given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);

            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the list of blocked of the "(\d+)" has an user with ID "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is blocked
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid1, users);
            expect(user?.blocked).toContain(userid2);
        });

        when(/^a POST request is made to "(.*)"/, async (endpoint_) => {
            // Save the endpoint
            endpoint = endpoint_;
        });

        and(/^the request body is '(.*)'$/, async (body) => {
            // Make the request
            let body_json = JSON.parse(body);

            followResponse = await request.post(`${endpoint}`).send(body_json);
        });

        then(/^the system returns a "(\d+)" status and the message "(.*)"$/, (statusCode, message) => {
            // Verify that the response is correct
            expect(followResponse.status).toEqual(parseInt(statusCode));
            expect(followResponse.body.message).toEqual(message);
        });

        and(/^"(\d+)" is removed from the list of blocked of "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is no longer blocked
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid2, users);
            expect(user?.blocked).not.toContain(userid1);
        });
    });

    test('Client blocks a user that does not exist', ({ given, when, then, and }) => {
        let endpoint : string;

        given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system does not have an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user does not exist
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).toBeUndefined();
        });

        when(/^a POST request is made to "(.*)"/, async (endpoint_) => {
            // Save the endpoint
            endpoint = endpoint_;
        });

        and(/^the request body is '(.*)'$/, async (body) => {
            // Make the request
            let body_json = JSON.parse(body);

            followResponse = await request.post(`${endpoint}`).send(body_json);
        });

        then(/^the system returns a "(\d+)" status and the message "(.*)"$/, (statusCode, message) => {
            // Verify that the response is correct
            expect(followResponse.status).toEqual(parseInt(statusCode));
            expect(followResponse.body.message).toEqual(message);
        });
    });

    test('Returns followers list', ({ given, when, then, and }) => {
        given(/^that the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);
            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);

            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the system has an existing user with ID "(\d+)"$/, (userid) => {
            // Verify that the user exists
            userid = parseInt(userid);

            const user = getUser(userid, users);
            expect(user).not.toBeUndefined();
        });

        and(/^the list of followers of "(\d+)" contains "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid1, users);
            expect(user?.followers).toContain(userid2);
        });

        and(/^the list of followers of "(\d+)" contains "(\d+)"$/, (userid1, userid2) => {
            // Verify that the user is following the other user
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);

            const user = getUser(userid1, users);
            expect(user?.followers).toContain(userid2);
        });

        when(/^a GET request is made to "(.*)"/, async (endpoint_) => {
            // Make the request
            followResponse = await request.get(`${endpoint_}`);
        });

        then(/^the system returns a "(\d+)" status$/, (statusCode) => {
            // Verify that the response is correct
            expect(followResponse.status).toEqual(parseInt(statusCode));
        });

        and(/^the response is a list containing "(\d+)" and "(\d+)"$/, (userid1, userid2) => {
            // Verify that the response is correct
            userid1 = parseInt(userid1);
            userid2 = parseInt(userid2);
            let user1 = users.find(user => user.id === userid1);
            let user2 = users.find(user => user.id === userid2);

            expect(followResponse.body).toContainEqual(user1);
            expect(followResponse.body).toContainEqual(user2);

        });
    });

});

test('Get the number of followers of a user', async() => {
    // Unit test for the getFollowersCount function
    let userid = 2;
    let endpoint = "/api/users/" + String(userid) + "/followers/count";

    let response = await request.get(`${endpoint}`);
    expect(response.status).toEqual(200);
    expect(response.body.followersCount).toEqual(users[userid - 1].followers.length);
});

test('Get the number of following of a user', async() => {
    // Unit test for the getFollowingCount function
    let userid = 2;
    let endpoint = "/api/users/" + String(userid) + "/following/count";

    let response = await request.get(`${endpoint}`);
    expect(response.status).toEqual(200);
    expect(response.body.followingCount).toEqual(users[userid - 1].following.length);
});

test('Get the followers of a user that does not exist', async() => {
    // Unit test for the getFollowersCount function
    let userid = 777;
    let endpoint = "/api/users/" + String(userid) + "/followers";

    let response = await request.get(`${endpoint}`);
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual("User not found");
});
