Feature: Validar site Sul America

   Scenario Outline: Validar pagina Web Sul America
    Given Open "/"
    When eu estiver na tela principal "https://portal.sulamericaseguros.com.br/"
    Then informar um texto no campo "<busca>"
    And realizar a busca
    And eu estiver na tela de busca "resultado-de-busca"
    And verificar que o resultado possui um "<link>"
    And verificar que "<nao possui>" o link 

    Examples:
    |busca|link|nao possui|
    |Rede Referenciada|Rede Referenciada - Saúde|SulAmérica Odonto|
    |Odonto|SulAmérica Odonto|Rede Referenciada - Saúde|