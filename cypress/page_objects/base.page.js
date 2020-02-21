const basePage = {
    openUrl: page => {
        cy.visit(page);
    },
    verifyUrl: url => {
        cy.url().should('include', url);
    },
    
    verifyFocus: (acessoLink) => { 
        cy.contains(acessoLink).focus()
        cy.get(pageObjects.getResult(acessoLink))
        .should('have.contain', acessoLink)
        .should('be.visible')
        
  },
    
  verifyText: (acessoLink) => { 
    cy.get(pageObjects.getResult(acessoLink))
    .should('not.have.contain', acessoLink)
    .should('be.visible')
    
},


    clickButton: button => {
        cy.get(pageObjects.getDataTest(button))
        .first()
        .click();
    },

    fillField: (field, text) => {
        cy.get(pageObjects.getDataTest(field))
            .first()
            .focus()
            .type(text);
    },

    pesquisaHome: (text) => {
        cy.get(pageObjects.campoBusca())
            .first()
            .focus()
            .type(text)
            .wait(1000)
         },

    pesquisaHomeClique: () => {
            cy.get(pageObjects.botaoPesquisar())
        .click();
    },

    verifyLabel: (element, label) => {
        cy.get(pageObjects.getDataTest(element)).should('have.contain', label);
    }
};

const pageObjects = {
    getDataTest(id) {
        return `[data-test="${id}"]`;
    },
    campoBusca() {
        return `[data-label="Busca"]`;
    },

    getResult(){
        return `[id="resultados-da-busca"]`;
    
    },

    botaoPesquisar(){
        return ('.bot-overlay');
    }

};

module.exports = basePage;

