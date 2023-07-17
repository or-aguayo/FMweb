export const createFeature = () => {
    cy.contains('Feature').click();
}

export const renameNewFeature = (featureName, newName) => {
    cy.contains(featureName).dblclick();
    cy.get('input').type(newName);
    cy.contains('OK').click();
    cy.wait(400);
}

export const removeFeature = (featureName) => {
    cy.contains(featureName).realPress('Delete');
}

export const moveFeature = (featureName, x, y) => {
    cy.
        contains(featureName).
        move(
            { 
                'deltaX': x, 
                'deltaY': y }
        );
}

export const createEshopAndCatalogo = () => {
    createFeature();
    renameNewFeature('New Feature', 'E-Shop');
    moveFeature('E-Shop', 50, 50);

    createFeature();
    renameNewFeature('New Feature', 'Catálogo');
    moveFeature('Catálogo', 60, 250);
}

export const increaseMinimumCardinality = () => {
    cy.
        get('i[class="el-icon-arrow-up"]').
        first().
        click();
}

export const increaseMaximumCardinality = () => {
    cy.
        get('i[class="el-icon-arrow-up"]').
        last().
        click();
}

export const closeCardinalityModal = () => {
    cy.contains('Confirm').click();
    cy.wait(200);
}