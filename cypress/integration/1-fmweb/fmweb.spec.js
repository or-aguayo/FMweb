import { 
    createFeature, 
    renameNewFeature,
    removeFeature,
    moveFeature, 
    createEshopAndCatalogo
} from './fmweb-cypress-script.js';

describe('fmWeb - eshop', () => {
    beforeEach(() =>{
        cy.visit('http://localhost:8080/#/fmweb');
    });

    it('fmWeb can be opened', () => {
        //Verificación de acceso a FMweb.
        cy.contains('Feature');
    });

    it('open XML feature model', () => {
        //Apertura de MCar del E-Shop en formato XML.
        cy.contains('File').click();
        cy.contains('Import XML Model').click();
        cy.get('input[type=file]').attachFile('./mcar/Eshop.xml');
        cy.contains('OK').click();
        cy.wait(400);
    });

    it('rename feature', () => {
        //Creación de una nueva característica.
        createFeature(); 

        //Cambio de nombre de la característica recién creada a "E-Shop".
        renameNewFeature('New Feature', 'E-Shop');
    });

    it('rename note', () => {
        //Creación de una nueva nota.
        cy.contains('Note').click();
        
         //Cambio de nombre de la característica recién creada a "Esta es una nota".
        cy.contains('New Note').dblclick();
        cy.get('input').type('Esta es una nota');
        cy.contains('OK').click();
        cy.wait(400);
    });
    
    it('move feature', () => {
        //Creación de una nueva característica.
        createFeature();

        //Desplazamiento de la característica recién creada.
        moveFeature('New Feature', 50, 50);
    });

    it('move note', () => {
        //Creación de una nueva nota.
        cy.contains('Note').click();

        //Desplazamiento de la nota recién creada.
        moveFeature('New Note', 50, 50);
    });

    it('remove feature', () =>{
        //Creación de una nueva característica.
        createFeature();

        //Eliminación de la característica recién creada.
        removeFeature('New Feature');
        cy.wait(400);
    });

    it('remove note', () =>{
        //Creación de una nueva nota.
        cy.contains('Note').click();

        //Eliminación de la nota recién creada.
        cy.contains('New Note').realPress('Delete');
        cy.wait(400);
    });

    it.skip('def01', () => {
        createEshopAndCatalogo();
        cy.
            contains('E-Shop').
            realHover('mouse');
        
        cy.
            get('div[id="graphContainer"]').
            within(() => {
                cy.
                    get('image[x="231"]').
                    first().
                    move({
                        'deltaX': 360,
                        'deltaY': -230 
                    })
            });
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });
    
    it.skip('def02', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst01', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst03', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst04', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst05', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst07', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst08', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst09', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it.skip('cst10', () => {
        //No es posible automatizar esta prueba debido a las limitaciones de mxGraph-Cypress.
    });

    it('save feature model as xml', () => {
        //No es posible implementar una prueba mas compleja debido a las limitaciones de mxGraph-Cypress.
        
        //Apertura de MCar del E-Shop en formato XML.
        cy.contains('File').click();
        cy.contains('Import XML Model').click();
        cy.get('input[type=file]').attachFile('./mcar/Eshop.xml');
        cy.contains('OK').click();

        //Guardado del MCar en formato XML.
        cy.contains('File').click();
        cy.contains('Save as XML').click();
    });

    it('export feature model as json', () => {
        //No es posible implementar una prueba mas compleja debido a las limitaciones de mxGraph-Cypress.
        
        //Apertura de MCar del E-Shop en formato XML.
        cy.contains('File').click();
        cy.contains('Import XML Model').click();
        cy.get('input[type=file]').attachFile('./mcar/Eshop.xml');
        cy.contains('OK').click();
        
        //Exportación del MCar en formato JSON.
        cy.contains('File').click();
        cy.contains('Export as JSON').click();
    });

    it('export feature model as svg', () => {
        //No es posible implementar una prueba mas compleja debido a las limitaciones de mxGraph-Cypress.
        
        //Apertura de MCar del E-Shop en formato XML.
        cy.contains('File').click();
        cy.contains('Import XML Model').click();
        cy.get('input[type=file]').attachFile('./mcar/Eshop.xml');
        cy.contains('OK').click();
        
        //Exportación del MCar en formato SVG.
        cy.contains('File').click();
        cy.contains('Export as SVG').click();
    });
});