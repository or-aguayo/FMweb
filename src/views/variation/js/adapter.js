export const getFMwebFeatures = (result) => {
    //console.log(result.mxGraphModel.root[0].feature);
    var features = [];
    for (var i = 0; i < result.mxGraphModel.root[0].feature.length; i++){
        //console.log(result.mxGraphModel.root[0].feature[i].mxCell[0].$.fmwebType);
        if(result.mxGraphModel.root[0].feature[i].mxCell[0].$.title == 'New Feature'){
            features.push(
                {
                    //ATTRIBUTE : null,
                    _class : "Feature",
                    //_id : null,
                    _name : result.mxGraphModel.root[0].feature[i].$.name
                }
            );  
        }
    }
    //console.log('features');
    //console.log(features);
    return features;
}

export const getFMwebRelationships = (result) => {
    //console.log(result.mxGraphModel.root[0].relationship);
    var relationships = [];
    for (var i = 0; i < result.mxGraphModel.root[0].relationship.length; i++){
        //console.log(result.mxGraphModel.root[0].relationship[i]);
        relationships.push(
            {
                //ATTRIBUTE : null,
                FROM : {
                    //_class : "Feature",
                    _instance : getNameById(result.mxGraphModel.root[0].relationship[i].mxCell[0].$.source, result)
                },
                TO : {
                    //_class : "Feature",
                    _instance : getNameById(result.mxGraphModel.root[0].relationship[i].mxCell[0].$.target, result)
                },
                _class : result.mxGraphModel.root[0].relationship[i].$.type,
                //_id : null
            }
        );
    }
    //console.log('relationships');
    //console.log(relationships);
    return relationships;
}

export const getNameById = (featureId, result) => {
    for (var i = 0; i < result.mxGraphModel.root[0].feature.length; i++){
        if(result.mxGraphModel.root[0].feature[i].$.id == featureId){
            return result.mxGraphModel.root[0].feature[i].$.name;
        }
    }
    return null;
}

export const getAlternatives = (relationships) => {
    var alternatives = [];
    for(var i = 0; i < relationships.length; i++){
        //console.log(relationships[i]._class);
        if(relationships[i]._class == 'XOR'){
            alternatives.push(
                {
                    _id : i,
                    _relationship : relationships[i]
                }
            );
        }
    }
    return alternatives;
}

export const getOrs = (relationships) => {
    var orList = [];
    for(var i = 0; i < relationships.length; i++){
        if(relationships[i]._class == 'OR'){
            orList.push(
                {
                    _id : i,
                    _relationship : relationships[i]
                }
            );
        }
    }
    return orList;    
}

export const getMandatories = (relationships) => {
    var mandatories = [];
    relationships.forEach((relationship, index) => {
        if(relationship._class == 'Mandatory'){
            mandatories.push(
                {
                    _id : index,
                    _relationship : relationship
                }
            );
        }
    });
    //console.log('mandatories');
    //console.log(mandatories);
    return mandatories;   
}

export const getDifferenceBetweenLists = (list1, list2) => {
    return (list2.filter(({ _instance }) => !list1.find(o => o._instance == _instance)));
}

export const getAlternativeFeaturesPresentsInMandatories = (alternatives, mandatories) => {
    return getAlternativeMandatoryRelation(
        mandatories,
        mergeFROMTOLists(
            getAlternativeFROM(alternatives),
            getAlternativeTO(alternatives)
        )
    ); 
}

export const mergeFROMTOLists = (fromList, toList) => {
    var mergedList = fromList;
    var differenceFROMTO = getDifferenceBetweenLists(fromList, toList);

    if(differenceFROMTO.length > 0){
        for (var i = 0; i < differenceFROMTO.length; i ++){
            mergedList.push(differenceFROMTO[i]);
        }
    }
    return mergedList;
}

export const getAlternativeMandatoryRelation = (mandatories, alternativeList) => {
    var relationated = [];
    for (var i = 0; i < mandatories.length; i++){
        for(var j = 0; j < alternativeList.length; j++){
            if(mandatories[i]._relationship.TO._instance == alternativeList[j]._instance){
                relationated.push(
                    {
                        _alternativeId : alternativeList[j]._id,
                        _mandatoryId : mandatories[i]._id,
                        _instance : mandatories[i]._relationship.TO._instance                    
                    }
                );
            }
        }
    }
    return relationated;
}

export const getOrFeaturesPresentsInMandatories = (ors, mandatories) => {
    return getOrMandatoryRelation(
        mandatories,
        mergeFROMTOLists(
            getOrFROM(ors),
            getOrTO(ors)
        )
    );
}

export const getOrMandatoryRelation = (mandatories, orList) => {
    var relationated = [];
    for (var i = 0; i < mandatories.length; i++){
        for(var j = 0; j < orList.length; j++){
            if(mandatories[i]._relationship.TO._instance == orList[j]._instance){
                relationated.push(
                    {
                        _orId : orList[j]._id,
                        _mandatoryId : mandatories[i]._id,
                        _instance : mandatories[i]._relationship.TO._instance                    
                    }
                );
            }
        }
    }
    return relationated;
}

export const getAlternativeFROM = (alternatives) => {
    var alternativeFROM = [];
    for (var i = 0; i < alternatives.length; i ++){
        alternativeFROM.push(
            {
                _id : alternatives[i]._id,
                _instance : alternatives[i]._relationship.FROM._instance
            }
        );
    }
    //console.log('alternativeFROM');
    //console.log(alternativeFROM);
    return alternativeFROM;
}

export const getAlternativeTO = (alternatives) => {
    var alternativeTO = [];
    for (var i = 0; i < alternatives.length; i ++){
        alternativeTO.push(
            {
                _id : alternatives[i]._id,
                _instance : alternatives[i]._relationship.TO._instance
            }
        );
    }
    //console.log('alternativeTO');
    //console.log(alternativeTO);
    return alternativeTO;
}

export const getOrFROM = (ors) => {
    var orFROM = [];
    for (var i = 0; i < ors.length; i ++){
        orFROM.push(
            {
                _id : ors[i]._id,
                _instance : ors[i]._relationship.FROM._instance
            }
        );
    }
    //console.log('orFROM');
    //console.log(orFROM);
    return orFROM;
}

export const getOrTO = (ors) => {
    var orTO = [];
    for (var i = 0; i < ors.length; i ++){
        orTO.push(
            {
                _id : ors[i]._id,
                _instance : ors[i]._relationship.TO._instance
            }
        );
    }
    //console.log('orTO');
    //console.log(orTO);
    return orTO;
}

export const getMandatoryRelationshipsToDeleteByXOR = (relationships, alternativeFeaturesPresentsInMandatories) => {
    
    //console.log('relationships in getMandatoryRelationshipsToDeleteByXOR');
    //console.log(relationships);
    //console.log('alternativeFeaturesPresentsInMandatories in getMandatoryRelationshipsToDeleteByXOR');
    //console.log(alternativeFeaturesPresentsInMandatories);

    var relationshipsToDelete = [];
    
    for(var i = 0; i < alternativeFeaturesPresentsInMandatories.length; i++){
        //relationships[alternativeFeaturesPresentsInMandatories[i]._mandatoryId]._class = "XOR";
        //relationships.splice(alternativeFeaturesPresentsInMandatories[i]._alternativeId);
        var relationship = relationships[
            alternativeFeaturesPresentsInMandatories[i]._mandatoryId
        ];
        if(!checkListContainsRelationship(relationshipsToDelete, relationship)){
            relationshipsToDelete.push(
                relationships[
                    alternativeFeaturesPresentsInMandatories[i]._mandatoryId
                ]
            );
        }
    }
    //console.log('relationshipsToDelete in getMandatoryRelationshipsToDeleteByXOR');
    //console.log(relationshipsToDelete);
    return relationshipsToDelete;
}

export const getMandatoryRelationshipsToDeleteByOR = (relationships, orFeaturesPresentsInMandatories) => {
    /*
    console.log('relationships in getMandatoryRelationshipsToDeleteByOR');
    console.log(relationships);
    console.log('orFeaturesPresentsInMandatories in getMandatoryRelationshipsToDeleteByOR');
    console.log(orFeaturesPresentsInMandatories);
    */

    var relationshipsToDelete = [];

    for(var i = 0; i < orFeaturesPresentsInMandatories.length; i++){
        //relationships.splice(orFeaturesPresentsInMandatories[i]._orId);
        //relationships[orFeaturesPresentsInMandatories[i]._mandatoryId]._class = "OR";
        var relationship = relationships[
            orFeaturesPresentsInMandatories[i]._mandatoryId
        ];
        if(!checkListContainsRelationship(relationshipsToDelete, relationship)){
            relationshipsToDelete.push(
                relationships[
                    orFeaturesPresentsInMandatories[i]._mandatoryId
                ]
            );
        }
    }
    //console.log('relationshipsToDelete in getMandatoryRelationshipsToDeleteByOR');
    //console.log(relationshipsToDelete);
    return relationshipsToDelete;
}

export const checkListContainsRelationship = (relationshipsToDelete, relationship) => {
    var listContains = false;
    for(var i = 0; i < relationshipsToDelete.length; i++){
        if(
            relationshipsToDelete[i].FROM._instance == relationship.FROM._instance &&
            relationshipsToDelete[i].TO._instance == relationship.TO._instance
        ){
            listContains = true;
        }
    }
    return listContains;
}

export const updateRelationships = (relationships) => {

    var alternatives = getAlternatives(relationships);
    var mandatories = getMandatories(relationships);
    var alternativeFeaturesPresentsInMandatories = getAlternativeFeaturesPresentsInMandatories(alternatives, mandatories);
    
    var mandatoryRelationshipsToDeleteByXOR = getMandatoryRelationshipsToDeleteByXOR(
        relationships,
        alternativeFeaturesPresentsInMandatories
    );

    var ors = getOrs(relationships);
    var orFeaturesPresentsInMandatories = getOrFeaturesPresentsInMandatories(ors, mandatories);

    var mandatoryRelationshipsToDeleteByOR = getMandatoryRelationshipsToDeleteByOR(
        relationships,
        orFeaturesPresentsInMandatories
    );

    var updatedRelationships = removeMandatoryRelationships(relationships, mandatoryRelationshipsToDeleteByXOR);
    updatedRelationships = removeMandatoryRelationships(updatedRelationships, mandatoryRelationshipsToDeleteByOR);

    /*
    console.log('alternatives in updateXors');
    console.log(alternatives);
    console.log('mandatories in updateXors');
    console.log(mandatories);
    console.log('alternativeFeaturesPresentsInMandatories in updateXors');
    console.log(alternativeFeaturesPresentsInMandatories);

    console.log('mandatoryRelationshipsToDeleteByXOR');
    console.log(mandatoryRelationshipsToDeleteByXOR);

    console.log('ors in updateOrs');
    console.log(ors);
    console.log('orFeaturesPresentsInMandatories in updateOrs');
    console.log(orFeaturesPresentsInMandatories);    
    
    console.log('mandatoryRelationshipsToDeleteByOR');
    console.log(mandatoryRelationshipsToDeleteByOR);    
    
    console.log('updatedRelationships');
    console.log(updatedRelationships);
    
    console.log('removedRelationships');
    console.log(getRemovedRelationships(relationships, updatedRelationships));
    */

    return {
        'updatedRelationships' : updatedRelationships,
        'removedRelationships' : getRemovedRelationships(relationships, updatedRelationships)
    };
}

export const removeMandatoryRelationships = (relationships, mandatoryRelationshipsToDelete) => {
    return mandatoryRelationshipsToDelete.length > 0 ? 
        relationships.filter(
            (el) => !mandatoryRelationshipsToDelete.includes(el)
        ) : 
        relationships;
}

export const getRemovedRelationships = (relationships, updatedRelationships) => {
    return relationships.filter(x => !updatedRelationships.includes(x))
}

/*
export const getIdByName = (name, result) => {
    for (var i = 0; i < result.mxGraphModel.root[0].feature.length; i++){
        if(result.mxGraphModel.root[0].feature[i].$.name == name){
            return result.mxGraphModel.root[0].feature[i].$.id;
        }
    }
    return null;    
}
*/

/*
export const getMandatoryFROMInstances = (mandatories) => {
    var mandatoryFROMInstances = [];
    for (var i = 0; i < mandatories.length; i ++){
        mandatoryFROMInstances.push(mandatories[i].FROM._instance);
    }
    return mandatoryFROMInstances;    
}
*/

/*
export const getMandatoryTOInstances = (mandatories) => {
    var mandatoryTOInstances = [];
    for (var i = 0; i < mandatories.length; i ++){
        mandatoryTOInstances.push(mandatories[i].TO._instance);
    }
    return mandatoryTOInstances;
}
*/
