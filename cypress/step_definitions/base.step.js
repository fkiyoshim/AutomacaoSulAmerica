import { Then } from "cypress-cucumber-preprocessor/steps";
const basePage = require('../page_objects/base.page');

Then('Open {string}', page => {
	basePage.openUrl(page);
});

Then('informar um texto no campo {string}', (text) => {
	basePage.pesquisaHome(text);
});

//assert comparando o link corrente do site
Then('eu estiver na tela principal {string}', url => {
	basePage.verifyUrl(url);
});

Then('eu estiver na tela de busca {string}', url => {
	basePage.verifyUrl(url);
});

Then('verificar que o resultado possui um {string}', textoRetornado  => {
	basePage.verifyFocus(textoRetornado);
});

Then('verificar que {string} o link', textoRetornado  => {
	basePage.verifyText(textoRetornado);
});


Then('validar que o link para a pagina pesquisada exista', () => {
	basePage.validarlink();
});

Then('I click on {string} button', button => {
	basePage.clickButton(button);
});

Then('I fill {string} with {string}', (field, text) => {
	basePage.fillField(field,text)
});


Then('realizar a busca', () => {
	basePage.pesquisaHomeClique()
});


Then('I verify the element {string} with text {string}', (element, label) => {
	basePage.verifyLabel(element, label);

}); 