import { openDropdownList, selectFeatures, isFeaturesSelected, isFeaturesUnselected } from './variation-cypress-script.js';

describe('variation - eshop', () => {
    beforeEach(() =>{
        //Apertura de MCar del E-Shop en formato XML.
        cy.visit('http://localhost:8080/#/variation');
        cy.contains('File').click();
        cy.contains('Import XML Model').click();
        cy.get('input[type=file]').attachFile('./mcar/Eshop.xml');
        cy.contains('OK').click();
        cy.wait(400);
    });
    
    it('variation can be opened', () => {
        //Verificación de acceso a Vari::Ation.
        cy.contains('Features Selection');
    });
    
    it('mandatory and root feature pre charge disabled', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        cy.
            get('div[class="vue-treeselect__multi-value"]').
            within(() => {
                //Intento de deselección de las características Catálogo y E-Shop. 
                cy.contains('Catálogo').click();
                cy.contains('E-Shop').click();
                cy.wait(400);

                //Verificación de que las características Catálogo y E-Shop siguen seleccionadas.
                cy.contains('Catálogo');
                cy.contains('E-Shop');
            });         
    });
    
    it('auto select required features', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de la característica CRUD Categorías.
        selectFeatures(['Administración','Página','CRUD Categorías']);

        //Verificación de que Categorías haya sido seleccionada de forma automática.
        isFeaturesSelected(['Categorías']);
    });
    
    it.skip('auto remove selection of excluded features', () => {
        //No aplica en este MCar.      
    });

    it('auto remove selection of features and parent when remove selection of required features', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de la característica CRUD Categorías y deselección de Categorías.
        selectFeatures(['Administración','Página','CRUD Categorías','Catálogo','Categorías']);

        //Verificación de que las características Administración, Página y CRUD Categorías no se encuentren seleccionadas.
        isFeaturesUnselected(['Administración','Página','CRUD Categorías']);        
    });

    it('auto select parent features', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de la característica CRUD Usuarios.        
        selectFeatures(['Administración','CRUD Usuarios']);

        //Verificación de que la característica Administración se encuentre seleccionada.
        isFeaturesSelected(['Administración']);       
    });

    it('xor relation', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de las características Básico y Avanzado (en ese orden).
        selectFeatures(['Buscador','Básico', 'Avanzado']);

        //Verificación de que las características Buscador y Avanzado sigan seleccionadas.
        isFeaturesSelected(['Buscador', 'Avanzado']);

        //Verificación de que la característica Básico no esté seleccionada.        
        isFeaturesUnselected(['Básico']);
    });
    
    it('mandatory features pending to select', () => {
        //Verificación de que la característica Catálogo tenga características hijas pendientes de seleccionar.        
        cy.
            get('div[id="missing-selected-features"]').
            within(() => {
                cy.contains('Catálogo');
            });

        //Verificación de que no se puede guardar el MConf o exportar el script.
        cy.contains('File').click();
        cy.contains('Save as JSON').invoke('attr', 'class').should('eq', 'el-dropdown-menu__item is-disabled');
        cy.contains('Export Script').invoke('attr', 'class').should('eq', 'el-dropdown-menu__item is-disabled');

        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de la característica General.
        selectFeatures(['Catálogo', 'General']);
        
        //Verificación de que no haya características Mandatory con características hijas pendientes de seleccionar.  
        cy.
            get('div[id="missing-selected-features"]').
            should('not.exist');
        
        //Verificación de que se puede guardar el MConf o exportar el script.
        cy.contains('File').click();
        cy.contains('Save as JSON').should('not.be.disabled');
        cy.contains('Export Script').should('not.be.disabled');
    });
    
    it('save configuration model as JSON', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de las características General y Categorías.        
        selectFeatures(['Catálogo','General', 'Categorías']);

        //Guardado del MConf en formato JSON.
        cy.contains('File').click();
        cy.contains('Save as JSON').click();       
    });

    it('save configuration model as script', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de las características General y Categorías.        
        selectFeatures(['Catálogo','General', 'Categorías']);

        //Guardado del MConf en formato script.        
        cy.contains('File').click();
        cy.contains('Export Script').click();        
    });
});