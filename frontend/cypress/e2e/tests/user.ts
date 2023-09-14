import {Before, Given, When, Then, After} from '@badeball/cypress-cucumber-preprocessor';

describe('User features', () => {
  let userLoggedInId: string;

  Before(() => {
    cy.visit('/me').then(() => {
      cy.wait(500).then(() => {
        cy.url().then((url) => {
          const regex = /\/users\/(\d+)/;
          const match = url.match(regex);
      
          if (match && match.length > 1) {
            userLoggedInId = match[1];
          } else {
            throw new Error(url);
          }
        });
      });
    }); 
  });

  After(()=>{
    cy.request({
        method: 'PUT',
        url: 'http://localhost:5001/api/me',
        body: {
            id: 1
        }
    });
  });
  
  Given('{string} está visível - user', (button: string) => {
      cy.contains(button).should('be.visible');
    });    
    
  When('clico em {string} - user', (button: string) => {
    let confirmMessage: string;

    switch (button) {
      case 'Salvar':
        cy.get('button.purple').click();
        break;
      case 'Cadastrar':
          cy.contains('Cadastrar').click();
        // atualiza o valor do id
        cy.visit('/me').then(() => {
          cy.wait(500).then(() => {
            cy.url().then((url) => {
              const regex = /\/users\/(\d+)/;
              const match = url.match(regex);
          
              if (match && match.length > 1) {
                  userLoggedInId = match[1];
              } else {
                throw new Error('Página inválida');
              }
            });
          });
        }); 
        break;
        default:
            throw new Error(`Botão não reconhecido: ${button}`);
        }
    });  

    When('clico em {string} e aparece uma notificação com a menssagem {string}', (button: string, message: string) => {
    cy.window().then((win) => {
        cy.stub(win, 'confirm').as('windowConfirmStub');
        
        switch (button) {
            case 'Editar':
                cy.get('app-edit-btn.editbtn').click();
                break;
        case 'Excluir':
            cy.get('app-button.postbtn').click();
            break;
            default:
                throw new Error(`Botão não reconhecido: ${button}`);
            }
        });
        
        cy.get('@windowConfirmStub').should('have.been.calledOnce');
    cy.get('@windowConfirmStub').should('have.been.calledWith', message);
  });

  
  
  When('Confirmo a notificação {string}', (message: string)=>{
    cy.on('window:confirm', () => {
        return true; // Confirma a notificação
    });

    if(message.includes('editar')){
        cy.visit('/users/1/edit');
    }else if(message.includes('excluir')){
        cy.visit('/');
    }else{
      cy.log("Notificação não reconhecida");
    }
});

Then('o usuário foi para a página {string}', (expectedPage: string) => {
    cy.url().should('include', expectedPage);
  });
  
  When('o campo {string} é editado para a string {string}', (fieldName: string, newValue: string) => {
      cy.get(`mat-form-field:has(mat-label:contains("${fieldName}")) input`)
      .clear() 
      .type(newValue) 
      .blur(); 
    });
    
    Then('o campo {string} contém a string {string}', (fieldName: string, expectedValue: string) => {
    cy.get(`mat-form-field:has(mat-label:contains("${fieldName}")) input`)
    .should('have.value', expectedValue);
});

When('Preencho o campo de {string} com {string}', (fieldName: string, value: string) => {
    cy.get(`#${fieldName}`).type(value); // Usamos o ID do campo para selecioná-lo
});

Then('o usuário foi para a página do seu perfil', () => {
    cy.url().then((url) => {
        // Use uma expressão regular para extrair o valor de :id
        const regex = /\/users\/(\d+)/;
        const match = url.match(regex);
        
        if (match && match.length > 1) {
        const idFromUrl = match[1];  
        if(expect(idFromUrl).to.equal(userLoggedInId)){
            cy.request({
                method: 'DELETE',
                url: 'http://localhost:5001/api/users/' + userLoggedInId,
                body: {
                    id: userLoggedInId
                }
            });
        }
      } else {
          throw new Error("URL Inválida");
        }
    });
  });

  Given('o usuário está na página de perfil', () => {
      const page = `/users/${userLoggedInId}`;
      cy.visit(page);
    });
    
    Given('o usuário está na página de edição', () => {
        const page = `/users/${userLoggedInId}/edit`;
        cy.visit(page);
    });
});