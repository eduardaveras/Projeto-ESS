Feature:  User tests

    #?Create scenarios
    Scenario: Creating a new user succesfully
        Given The service has a database containing users
        And The database does not contain a user "usuario1"
        When A POST request is made to "/api/users" route with the request body 
            """
            {"user":"usuario1",
            "email":"usuario1@example.com",
            "password":"senha5778",
            "name":"Fulano",
            "lastName":"Silva",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Fulano Silva e estou explorando o mundo da tecnologia."}
            """
        Then The service should respond with status code "201" with the message "User was successfully registered"

    Scenario: Creating a new user with existing email
        Given The service has a database containing users
        And The database contain the user "usuario2" with email "usuario2@example.com"
        When A POST request is made to "/api/users" route with the request body 
            """
            {"user":"usuario195",
            "email":"usuario2@example.com",
            "password":"senha321",
            "name":"Ciclano",
            "lastName":"Silveira",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Ciclano Silveira e estou explorando o mundo da musica."}
            """
        Then The service should respond with status code "409" with the message "Email arealdy exists"

    Scenario: Creating a new user with existing user
        Given The service has a database containing users
        And The database contain the user "usuario2"
        When A POST request is made to "/api/users" route with the request body
            """
            {"user":"usuario2",
            "email":"usuario2@example.com",
            "password":"senha321",
            "name":"Ciclano",
            "lastName":"Silveira",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Ciclano Silveira e estou explorando o mundo da musica."}
            """
        Then The service should respond with status code "409" with the message "Username arealdy exists"

    Scenario: Creating a new user with missing information
        Given The service has a database containing users
        And The database does not contain a user "usuario3"
        When A POST request is made to "/api/users" route with the request body 
            """
            {"user":"usuario644",
            "email":"",
            "password":"senha345",
            "name":"Beltrano",
            "lastName":"Siqueira",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Beltrano Siqueira e estou explorando o mundo da aviacao."}
            """
        Then The service should respond with status code "400"



    #?Delete scenarios
    Scenario: Deleting a user succesfully
        Given The service has a database containing users
        And The database contains a user with id "1"
        And A user with id "1" is logged in
        When A DELETE request is made to "/api/users/1" route
        Then The service should respond with status code "201" with the message "User was successfully deleted"

    Scenario: Deleting a not logged in user
        Given The service has a database containing users
        And The database contains a user with id "1"
        And A user with id "2" is logged in
        When A DELETE request is made to "/api/users/1" route
        Then The service should respond with status code "401" with the message "Unauthorized"

    Scenario: Deleting a non existing user
        Given The service has a database containing users
        And The database does not contain a user with id "3" 
        And An admin with id "0" is logged in 
        When A DELETE request is made to "/api/users/3" route
        Then The service should respond with status code "404" with the message "User not found"



    #?Edit scenarios
    Scenario: Editing a user profile
        Given The service has a database containing users
        And The database contains a user 
            """
            {"id":1, 
            "user":"usuario165", 
            "email":"usuario1@example.com", 
            "password":"senha9009", 
            "name":"Fulano", 
            "lastName":"Silva", 
            "pronouns":"ele/dele", 
            "bio":"Olá! Sou Fulano Silva e estou explorando o mundo da tecnologia."}
            """
        And A user with id "1" is logged in
        When A PUT request is made to "/api/users/1" route with the request body 
            """
            {"user":"usuarioeditado",
            "name":"Fulano",
            "lastName":"Mudado",
            "bio":"Olá! Sou Fulano Mudado e estou explorando o mundo da tecnologia."}
            """
        Then The service should respond with status code "201" with the message "User was successfully modified"

    Scenario: Editing a not logged in user profile
        Given The service has a database containing users
        And The database contains the user 
            """
            {"id":1,
            "user":"usuario1543",
            "email":"usuario1@example.com",
            "password":"senha1325",
            "name":"Fulano",
            "lastName":"Silva",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Fulano Silva e estou explorando o mundo da tecnologia."}
            """
        And A user with id "2" is logged in
        When A PUT request is made to "/api/users/1" route with the request body
            """
            {"user":"usuarioeditado",
            "name":"Fulano",
            "lastName":"Mudado",
            "bio":"Olá! Sou Fulano Mudado e estou explorando o mundo da tecnologia."}
            """
        Then The service should respond with status code "401" with the message "Unauthorized"

    Scenario: Editing a non existing user profile
        Given The service has a database containing users
        And The database does not contains a user with id "3"
        And An admin with id "0" is logged in
        When A PUT request is made to "/api/users/3" route with the request body
            """
            {"user":"usuarioeditado",
            "name":"Fulano",
            "lastName":"Mudado",
            "bio":"Olá! Sou Fulano Mudado e estou explorando o mundo da tecnologia."}
            """
        Then The service should respond with status code "404" with the message "User not found"



    #?Profile scenarios
    Scenario: Getting user profile
        Given The service has a database containing users
        And The database contains a user 
            """
            {"id":1,
            "user":"usuario1354",
            "email":"usuario1354@example.com",
            "password":"senha357159",
            "name":"Fulano",
            "lastName":"Silva",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Fulano Silva e estou explorando o mundo da tecnologia."}
            """
        And A user with id "1" is logged in
        When A GET request is made to "/api/users/1" route
        Then The service should respond with status code "200"
        And The service returns the object 
            """
            {"id":1,
            "user":"usuario1354",
            "email":"usuario1354@example.com",
            "password":"senha357159",
            "name":"Fulano",
            "lastName":"Silva",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Fulano Silva e estou explorando o mundo da tecnologia."}
            """

    Scenario: Getting a not logged in user profile
        Given The service has a database containing users
        And The database contains the user 
            """
            {"id":1,
            "user":"usuario13456",
            "email":"usuario13456@example.com",
            "password":"senha78564",
            "name":"Fulano",
            "lastName":"Silva",
            "pronouns":"ele/dele",
            "bio":"Olá! Sou Fulano Silva e estou explorando o mundo da tecnologia."}
            """
        And A user with id "2" is logged in
        When A GET request is made to "/api/users/1" route
        Then The service should respond with status code "401" with the message "Unauthorized"

    Scenario: Getting a non existing user profile
        Given The service has a database containing users
        And The database does not contains a user with id "3"
        And An admin with id "0" is logged in 
        When A GET request is made to "/api/users/3" route
        Then The service should respond with status code "404" with the message "User not found"
    
