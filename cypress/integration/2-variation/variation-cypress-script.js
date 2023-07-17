export const openDropdownList = () => {
    cy.get('svg[class="vue-treeselect__control-arrow"]').click();
    cy.get('svg[class="vue-treeselect__option-arrow"]').click();
}

export const selectFeatures = (features) => {
    cy.
        get('div[class="vue-treeselect__list"]').
        within(() => {
            for(var i = 0; i < features.length; i++){
                cy.contains(features[i]).click();
            }
        });  
}

export const isFeaturesSelected = (features) => {
    cy.
        get('div[class="vue-treeselect__multi-value"]').
        within(() => {
            cy.wait(200);
            for(var i = 0; i < features.length; i++){
                cy.contains(features[i]);
            }
        });    
}

export const isFeaturesUnselected = (features) => {
    cy.
        get('div[class="vue-treeselect__multi-value"]').
        within(() => {
            cy.wait(200);
            for(var i = 0; i < features.length; i++){
                cy.contains(features[i]).should('not.exist');
            }
        });    
}
