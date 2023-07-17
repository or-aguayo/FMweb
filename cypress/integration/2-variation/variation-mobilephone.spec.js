import { openDropdownList, selectFeatures, isFeaturesSelected, isFeaturesUnselected } from './variation-cypress-script.js';

describe('variation - mobile phone', () => {
    beforeEach(() =>{
        //Apertura de MCar del Mobile Phone en formato XML.
        cy.visit('http://localhost:8080/#/variation');
        cy.contains('File').click();
        cy.contains('Import XML Model').click();
        cy.get('input[type=file]').attachFile('./mcar/Cel.xml');
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
                //Intento de deselección de las características Mobile Phone, Calls y Screen.                
                cy.contains('Mobile Phone').click();
                cy.contains('Calls').click();
                cy.contains('Screen').click();
                cy.wait(400);
                
                //Verificación de que las características Mobile Phone, Calls y Screen siguen seleccionadas.
                cy.contains('Mobile Phone');
                cy.contains('Calls');
                cy.contains('Screen');
            });         
    });
    
    it('autoselect required features', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de la característica Camera.
        selectFeatures(['Media','Camera']);

        //Verificación de que la característica High Resolution haya sido seleccionada de forma automática.
        isFeaturesSelected(['High Resolution']);
    });
    
    it('auto remove selection of excluded features', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de las características GPS y Basic (en ese orden).
        selectFeatures(['GPS','Screen', 'Basic']);

        //Verificación de que la característica Basic está seleccionada.
        isFeaturesSelected(['Basic']);

        //Verificación de que la característica GPS no está seleccionada.
        isFeaturesUnselected(['GPS']);      
    });

    it('auto remove selection of features and parent when remove selection of required features', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de la característica Camera y deselección de High Resolution.
        selectFeatures(['Media','Camera', 'Screen', 'High Resolution']);
        
        //Verificación de que las características Camera y Media no se encuentren seleccionadas.
        isFeaturesUnselected(['Camera', 'Media']);        
    });

    it('auto select parent features', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de la característica Camera.
        selectFeatures(['Media','Camera']);

        //Verificación de que la característica Media se encuentre seleccionada.
        isFeaturesSelected(['Media']);       
    });

    it('xor relation', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de las características Basic y High Resolution (en ese orden).
        selectFeatures(['Screen','Basic', 'High Resolution']);

        //Verificación de que las características High Resolution y Screen sigan seleccionadas.
        isFeaturesSelected(['Screen', 'High Resolution']);

        //Verificación de que Basic no esté seleccionada.
        isFeaturesUnselected(['Basic']);
    });
    
    it('mandatory features pending to select', () => {
        //Verificación de que las características Calls y Screen tengan características hijas pendientes de seleccionar.
        cy.
            get('div[id="missing-selected-features"]').
            within(() => {
                cy.contains('Calls');
                cy.contains('Screen');
            });

        //Verificación de que no se puede guardar el MConf o exportar el script.
        cy.contains('File').click();
        cy.contains('Save as JSON').invoke('attr', 'class').should('eq', 'el-dropdown-menu__item is-disabled');
        cy.contains('Export Script').invoke('attr', 'class').should('eq', 'el-dropdown-menu__item is-disabled');
        
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();
        
        //Selección de la característica Normal.
        selectFeatures(['Calls', 'Normal']);
        
        //Verificación de que solo Screen tiene hijos pendientes de seleccionar.  
        cy.
            get('div[id="missing-selected-features"]').
            within(() => {
                cy.contains('Calls').should('not.exist');
                cy.contains('Screen');
            });
        
        //Selección de la característica Basic.
        selectFeatures(['Screen', 'Basic']);
         
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

        //Selección de las características Normal y Basic.
        selectFeatures(['Calls','Normal', 'Screen', 'Basic']);
        
        //Guardado del MConf en formato JSON.
        cy.contains('File').click();
        cy.contains('Save as JSON').click();       
    });

    it('save configuration model as script', () => {
        //Apertura de la lista desplegable en la cual se seleccionan las características.
        openDropdownList();

        //Selección de las características Normal y Basic.
        selectFeatures(['Calls','Normal', 'Screen', 'Basic']);
        
        //Guardado del MConf en formato script.    
        cy.contains('File').click();
        cy.contains('Export Script').click();        
    });
});