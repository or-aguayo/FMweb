import { getFMwebFeatures, getFMwebRelationships, updateRelationships } from './adapter.js';

var instancesList;

export const configureInstances = (instances) => {
    instancesList = new Array(instances.length);
    for (var i = 0; i < instances.length; i++) {
        instancesList[i] = new Array(4);
        instancesList[i][0] = instances[i]._name;
        //Relaciones require y exclude
        instancesList[i][3] = [];
    }
    //console.log(instancesList);
}

export const buildJson = (result) => {
    var features = getFMwebFeatures(result);
    var relationships = getFMwebRelationships(result);
    var updatedRelationships = updateRelationships(relationships);

    //console.log('updatedRelationships');
    //console.log(updatedRelationships);

    initializeInstances(features, updatedRelationships, relationships);
    
    //console.log("instancesList");
    //console.log(instancesList);
    return instancesList;
}

export const initializeInstances = (features, updatedRelationships, relationships) => {
    configureInstances(features);
    for(var i = 0; i < instancesList.length; i++){
            
        instancesList[i][1] = getRelationshipTypeFromUpdatedRelationships(
            instancesList[i][0],
            updatedRelationships.updatedRelationships
        );
        
        instancesList[i][2] = getParentFromRelationships(
            instancesList[i][0],
            relationships
        );
        
        instancesList[i][3] = getRequireOrExcludeFromUpdatedRelationships(
            instancesList[i][0],
            updatedRelationships.updatedRelationships
        );
    }
}

export const getParentFromRelationships = (featureName, relationships) => {
    for(var i = 0; i < relationships.length; i++){
        if(relationships[i].TO._instance == featureName){
            //console.log(`${featureName} : ${relationships[i].FROM._instance}`);
            return relationships[i].FROM._instance;
        }
    }
    return null;
}

export const getRelationshipTypeFromUpdatedRelationships = (featureName, updatedRelationships) => {
    for(var i = 0; i < updatedRelationships.length; i++){
        if (
            (updatedRelationships[i].TO._instance == featureName) &&
            (updatedRelationships[i]._class == 'Mandatory' || updatedRelationships[i]._class == 'Optional')
        ){
            return updatedRelationships[i]._class;
        }
        else if(
            (
                updatedRelationships[i].TO._instance == featureName ||
                updatedRelationships[i].FROM._instance == featureName
            ) &&
            (updatedRelationships[i]._class == 'OR' || updatedRelationships[i]._class == 'XOR')
        ){
            return updatedRelationships[i]._class;
        }
    }
    return null;
}

export const getRequireOrExcludeFromUpdatedRelationships = (featureName, updatedRelationships) => {
    var requireOrExcludeFeatures = [];
    for(var i = 0; i < updatedRelationships.length; i++){
        if(
            (updatedRelationships[i]._class == 'Requires' && updatedRelationships[i].TO._instance == featureName) ||
            (updatedRelationships[i]._class == 'Excludes' && updatedRelationships[i].TO._instance == featureName)
        ){
            requireOrExcludeFeatures.push(
                [
                    updatedRelationships[i]._class,
                    updatedRelationships[i].FROM._instance
                ]
            );
        }
    }
    //console.log(requireOrExcludeFeatures);
    return requireOrExcludeFeatures;
}