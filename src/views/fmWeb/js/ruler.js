import { filterTarget, compareVertex, fuseArrays, findInArray, getDescendants, getAncestors, getRelationships, getSources,  } from './misc.js';
import { mxUtils as MxUtils, } from "mxgraph/javascript/mxClient";

export const def01 = (minCardinality, that, edge) => {
  if (!(minCardinality > 0)) {
    that.graph.removeCells([edge]);
    MxUtils.alert(
      "DEF01. Can't create Mandatory. Minimum cardinality must be greater than 0"
    );
  }
}

export const def02 = (minCardinality, that, edge) => {
  if (!(minCardinality == 0)) {
    that.graph.removeCells([edge]);
    MxUtils.alert(
      "DEF02. Can't create Optional. Minimum cardinality must be equal to 0"
    );
    that.graph.clearSelection();
    //that.relationSelected = false;
  }    
}

export const cst01 = (that, edge) => {
  that.graph.removeCells([edge]);
  MxUtils.alert(
  "CST01. Cant't create " +
      that.relationType +
      ". Minimum Cardinality < 0 or Minimum Cardinality > Maximum Cardinality"
  ); 
}

export const cst03 = (that, edge) => {
    let descendantsArray = new Array();
    descendantsArray = getDescendants(edge.target, descendantsArray, that);
    if (findInArray(descendantsArray, edge.source)) {
        MxUtils.alert("CST03. A Feature can't be the parent of an ancestor.");
        that.graph.removeCells([edge]);
    }
}

export const cst04 = (allCells, target, source, edge, that) => {
    var vertexNeeded = getVertexNeededInCst04And07(allCells, target, source, that);
    if (!compareVertex(vertexNeeded.a, vertexNeeded.b)) {
      that.graph.removeCells([edge]);
      MxUtils.alert(
        "CST04. Can't create " +
          that.relationType +
          ". Only between brothers"
      );
    }
}

export const getVertexNeededInCst04And07 = (allCells, target, source, that) =>{
  let rel = fuseArrays(
    getRelationships("Mandatory", allCells),
    getRelationships("Optional", allCells)
  );
  let a = filterTarget(target, rel, that);
  let b = filterTarget(source, rel, that);
  a = getSources(a, that);
  b = getSources(b, that);
  return {'a': a, 'b': b};
}

export const cst05 = (allCells, target, source, edge, that) => {
    var vertexNeeded = getVertexNeededInCst05(allCells, target, source, that);
    if (!compareVertex(vertexNeeded.a, vertexNeeded.b)) {
      that.graph.removeCells([edge]);
      MxUtils.alert(
        "CST05. Can't create " +
          that.relationType +
          ". Only between Mandatory Features"
      );
    }        
}

export const getVertexNeededInCst05 = (allCells, target, source, that) =>{
  var rel = getRelationships("Mandatory", allCells);
  var a = filterTarget(target, rel, that);
  var b = filterTarget(source, rel, that);
  a = getSources(a, that);
  b = getSources(b, that);
  return {'a': a, 'b': b};
}

export const cst07 = (allCells, target, source, edge, that) => {
  var vertexNeeded = getVertexNeededInCst04And07(allCells, target, source, that);
  if (compareVertex(vertexNeeded.a, vertexNeeded.b)) {
    that.graph.removeCells([edge]);
    MxUtils.alert(
      "CST07. Can't create " + that.relationType + " between brothers"
    );
  }
}

export const cst08 = (source, target, edge, that) => {
    let descendantsArray = new Array();
    descendantsArray = getDescendants(target, descendantsArray, that);
    if (findInArray(descendantsArray, source)) {
      MxUtils.alert(
        "CST08. A feature can't be excluded by a descendant."
      );
      that.graph.removeCells([edge]);
    }
}

export const cst09 = (allCells, target, source, edge, that) => {
    var allExcludes = getRelationships("Excludes", allCells);
    for (let index = 0; index < allExcludes.length; index++) {
      const element = allExcludes[index];
      if (!(element.target == target)) {
        allExcludes.splice(index, 1);
      }
    }

    let ancestorsArray = new Array();
    ancestorsArray = getAncestors(source, ancestorsArray, that);

    if (allExcludes.length > 0) {
      for (let i = 0; i < allExcludes.length; i++) {
        const exclude = allExcludes[i];
        for (let j = 0; j < ancestorsArray.length; j++) {
          const ancestor = ancestorsArray[j];
          if (exclude.source == ancestor) {
            MxUtils.alert(
              "CST09. Can't requiere this feature as it's been excluded by an ancestor."
            );
            that.graph.removeCells([edge]);
          }
        }
      }
    }
    return ancestorsArray;
}

export const cst10 = (allCells, target, edge, that, ancestorsArray) => {
  var allAlternative = getRelationships("XOR", allCells);
  var descendants = new Array();
  if (allAlternative.length > 0) {
    for (let i = 0; i < allAlternative.length; i++) {
      const auxAlt = allAlternative[i];
      for (let j = 0; j < ancestorsArray.length; j++) {
        const ancestor = ancestorsArray[j];
        
        
        
        if (ancestor == auxAlt.source) {
          if ((auxAlt.target = target)) {
            messageInCst10(that, edge);
          } else {
            descendants = getDescendants(auxAlt.target, that);
            if (findInArray(descendants, target)) {
              messageInCst10(that, edge);
            }
          }
        } else if (ancestor == auxAlt.target) {
          if (auxAlt.source == target) {
            messageInCst10(that, edge);
          } else {
            descendants = getDescendants(auxAlt.source, that);
            if (findInArray(descendants, target)) {
              messageInCst10(that, edge);
            }
          }
        }
      }
    }
  }
}

export const messageInCst10 = (that, edge) => {
  MxUtils.alert(
    "CST10. Can't requiere this feature as it's been excluded by an ancestor in a alternative relationship."
  );
  that.graph.removeCells([edge]);
}

export const applyRules = (that, evt) => {
  let edge = evt.getProperty("cell");
  let target = that.graph.getModel().getTerminal(edge, false);
  let source = that.graph.getModel().getTerminal(edge, true);
  let allCells = that.graph.getDefaultParent().children;

  console.log(that.relationType)

  //DEF01, DEF02, CST01
  if (that.relationType == "Mandatory" || that.relationType == "Optional") {
    that.dialogFormVisible = true;
  }

  //CST04, CST05
  if (that.relationType == "OR" || that.relationType == "XOR") {
    //CST04
    cst04(allCells, target, source, edge, that);
    //CST05
    cst05(allCells, target, source, edge, that);
  }

  //CST07, CST08
  if (that.relationType == "Requires" || that.relationType == "Excludes") {
    //CST07
    cst07(allCells, target, source, edge, that);
    //CST08
    if (that.relationType == "Excludes") {
      cst08(source, target, edge, that);
    }

    //CST09 y CST10
    if (that.relationType == "Requires") {
      //CST09
      let ancestorsArray = cst09(allCells, target, source, edge, that);
      //CST10
      cst10(allCells, target, edge, that, ancestorsArray);
    }
  }
  that.validateModel();
}