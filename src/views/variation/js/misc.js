export const getMandatoryFeatureNames = (constraintsList) => {
    var mandatoryFeatureNames = [];
    for (var i = 0; i < constraintsList.length; i++){
        if(constraintsList[i].atributo == "Mandatory"){
            mandatoryFeatureNames.push(constraintsList[i].id);
        }
    }
    return mandatoryFeatureNames;
}

export const getChildrenNames = (constraintsList, parent) => {
  var mandatoryChildrenNames = [];
  for (var i = 0; i < constraintsList.length; i++){
    if(constraintsList[i].parent == parent){
      mandatoryChildrenNames.push(constraintsList[i].id);
    }
  }
  //console.log(`parent : ${parent} -- mandatoryChildrenNames : ${mandatoryChildrenNames}`);
  return mandatoryChildrenNames;
}

export const getChildren = (constraintsList, parent) => {
  var mandatoryChildrenNames = [];
  for (var i = 0; i < constraintsList.length; i++){
    if(constraintsList[i].parent == parent){
      mandatoryChildrenNames.push(constraintsList[i]);
    }
  }
  return mandatoryChildrenNames;
}

export const getHermanosXOR = (parent, lastSelectedFeature, constraintsList) => {
    var hermanos = [];
    for (var i = 0; i < constraintsList.length; i ++){
      if(
        constraintsList[i].parent == parent &&
        constraintsList[i].atributo == 'XOR' &&
        constraintsList[i].id != lastSelectedFeature
      ){
        hermanos.push(constraintsList[i].id);
      }
    }
    return hermanos;
}

export const getHermanosOR = (parent, lastSelectedFeature, constraintsList) => {
  var hermanos = [];
  for (var i = 0; i < constraintsList.length; i ++){
    if(
      constraintsList[i].parent == parent &&
      constraintsList[i].atributo == 'OR' &&
      constraintsList[i].id != lastSelectedFeature
    ){
      hermanos.push(constraintsList[i].id);
    }
  }
  return hermanos;
}

export const findFeatureParent = (lastSelectedFeature, constraintsList) => {
    for(var i = 0; i < constraintsList.length; i++){
      if(
        constraintsList[i].id == lastSelectedFeature
      ){
        return constraintsList[i].parent;
      }
    }
}      

export const getLastSelectedFeature = (newValue, oldValue) => {
    return newValue.filter(e => !oldValue.find(a => e == a));
}

export const getLastUnselectedFeature = (newValue, oldValue) => {
    return oldValue.filter(e => !newValue.find(a => e == a));
}

export const findRequireFeaturesById = (id, requireFeatures) => {
    var requireFeaturesById = [];
    for(var i = 0; i < requireFeatures.length; i ++) {
      if(requireFeatures[i].origen == id){
        requireFeaturesById.push(requireFeatures[i].destino);
      }
    }
    return requireFeaturesById;
}
  
export const findExcludeFeaturesById = (id, excludeFeatures) => {
    var excludeFeaturesById = [];
    for(var i = 0; i < excludeFeatures.length; i ++) {
      if(excludeFeatures[i].origen == id){
        excludeFeaturesById.push(excludeFeatures[i].destino);
      }
    }
    return excludeFeaturesById;
}