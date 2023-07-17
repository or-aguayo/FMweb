import {  mxGraphModel as mxGraphModel, } from 'mxgraph/javascript/mxClient';

export const getDescendants = (cell, descendantsArray, that) => {
  //Gets all descendants of a given cell
  let outgoing = mxGraphModel.prototype.getOutgoingEdges(cell);
  for (let index = 0; index < outgoing.length; index++) {
    const element = outgoing[index];
    //console.log(element.value.getAttribute("type", ""));
    
    if (
      !(element.value.getAttribute("type", "").localeCompare("Optional") == 0) &&
      !(element.value.getAttribute("type", "").localeCompare("Mandatory") == 0)
    ){
      //console.log("delete element");
      outgoing.splice(index, 1);
    }
  }
  let descendants = getTargets(outgoing, that);
  //fix element amounts in descendants by deleting if it exists in descendantsArray

  for (let index = 0; index < descendants.length; index++) {
    const element = descendants[index];
    if (findInArray(descendantsArray, element)) {
      descendants.splice(index, 1);
    }
  }

  //console.log(descendantsArray);
  if (descendants.length > 0) {
    descendantsArray = fuseArrays(descendantsArray, descendants);
    for (let i = 0; i < descendants.length; i++) {
      descendantsArray = getDescendants(
        descendants[i],
        descendantsArray,
        that
      );
    }
  }
  return descendantsArray;
}
/**
 * Gets all the ancestors of a given cell
 * Returns and array of all the ancestors
 */
export const getAncestors = (cell, ancestorsArray, that) => {
  //Gets all ancestors of a given cell
  let incoming = mxGraphModel.prototype.getIncomingEdges(cell);
  for (let index = 0; index < incoming.length; index++) {
    const element = incoming[index];
    //console.log(element.value.getAttribute("type", ""));

    if(
      !(element.value.getAttribute("type", "").localeCompare("Optional") == 0) &&
      !(element.value.getAttribute("type", "").localeCompare("Mandatory") == 0)
    ){
      //console.log("delete element");
      incoming.splice(index, 1);
    }
  }

  let ancestors = getSources(incoming, that);
  //console.log(ancestors.length);
  for (let index = 0; index < ancestors.length; index++) {
    const element = ancestors[index];
    //console.log(findInArray(ancestorsArray, element));
    if (findInArray(ancestorsArray, element)) {
      ancestors.splice(index, 1);
    }
  }
  //console.log(ancestors.length);

  if (ancestors.length > 0) {
    ancestorsArray = fuseArrays(ancestorsArray, ancestors);
    for (let i = 0; i < ancestors.length; i++) {
      ancestorsArray = getAncestors(ancestors[i], ancestorsArray, that);
    }
  }

  return ancestorsArray;
}
/**
 * Gets all the relationships that are of the same type
 * Returns an array with all the cells that represent the given type of relationship
 */
export const getRelationships = (relationshipType, allCells) => {
  //Gets all relationships of the given type
  let edges = new Array();
  for (let i = 0; i < allCells.length; i++) {
    if (!allCells[i].isVertex()) {
      if (allCells[i].value.getAttribute("type", "") == relationshipType) {
        edges.push(allCells[i]);
      }
    }
  }
  return edges;
}

export const filterSource = (sourceVertex, arrayEdges, that) => {
  //Gets all edges in arrayEdges where sourceVertex is the source
  let finalArray = new Array();
  for (let i = 0; i < arrayEdges; i++) {
    if (
      that.graph.getModel().getTerminal(arrayEdges[i], true) == sourceVertex
    ) {
      finalArray.push(arrayEdges[i]);
    }
  }
  return finalArray;
}

export const filterTarget = (targetVertex, arrayEdges, that) => {
  //Gets all edges in arrayEdges where targetVertex is the target
  let finalArray = new Array();
  //console.log('arrayEdges en filterTarget');
  //console.log;(arrayEdges)
  for (let i = 0; i < arrayEdges.length; i++) {
    if (
      that.graph.getModel().getTerminal(arrayEdges[i], false) == targetVertex
    ) {
      finalArray.push(arrayEdges[i]);
    }
  }
  //console.log('finalArray en filterTarget');
  //console.log;(finalArray);
  return finalArray;
}

export const getSources = (arrayEdges, that) => {
  //Gets all the sources from the edges in arrayEdges
  let arraySources = new Array();
  //console.log('arrayEdges en getSources');
  //console.log;(arrayEdges)
  for (let i = 0; i < arrayEdges.length; i++) {
    arraySources.push(
      that.graph.getModel().getTerminal(arrayEdges[i], true)
    );
  }
  //console.log('arraySources en getSources');
  //console.log;(arraySources);
  return arraySources;
}

export const getTargets = (arrayEdges, that) => {
  //Gets all the targets from the edges in arrayEdges
  let arrayTargets = new Array();
  for (let i = 0; i < arrayEdges.length; i++) {
    arrayTargets.push(
      that.graph.getModel().getTerminal(arrayEdges[i], false)
    );
  }
  return arrayTargets;
}

export const compareVertex = (arrayVertexA, arrayVertexB) => {
  //Compares if there is any coincidence from the vertex in arrayA and arrayB. true = any coincidences found
  for (let i = 0; i < arrayVertexA.length; i++) {
    for (let j = 0; j < arrayVertexB.length; j++) {
      if (arrayVertexA[i] == arrayVertexB[j]) {
        return true;
      }
    }
  }
  return false;
}

export const findInArray = (arrayVertex, vertex) => {
  //Looks if vertex is present in arrayVertex. true = vertex found
  for (let i = 0; i < arrayVertex.length; i++) {
    if (arrayVertex[i] == vertex) {
      return true;
    }
  }
  return false;
}

export const fuseArrays = (arrayA, arrayB) => {
  //Fuses arrayA and arrayB getting rid of all duplicates
  let finalArray = new Array();
  for (let i = 0; i < arrayA.length; i++) {
    if (!finalArray.includes(arrayA[i])) {
      finalArray.push(arrayA[i]);
    }
  }
  for (let i = 0; i < arrayB.length; i++) {
    if (!finalArray.includes(arrayB[i])) {
      finalArray.push(arrayB[i]);
    }
  }
  return finalArray;
}

export const convertXMLToJSON = (xmlObject) => {
  // Create the return object
  var obj = {};

  if ( xmlObject.nodeType == 1 ) { // element
    // do attributes
    if ( xmlObject.attributes.length > 0 ) {
      obj["@attributes"] = {};
      for ( var j = 0; j < xmlObject.attributes.length; j++ ) {
        var attribute = xmlObject.attributes.item( j );
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if ( xmlObject.nodeType == 3 ) { // text
    obj = xmlObject.nodeValue;
  }

  // do children
  if ( xmlObject.hasChildNodes() ) {
    for( var i = 0; i < xmlObject.childNodes.length; i++ ) {
      var item = xmlObject.childNodes.item(i);
      var nodeName = item.nodeName;
      if ( typeof(obj[nodeName] ) == "undefined" ) {
        obj[nodeName] = convertXMLToJSON( item );
      } else {
        if ( typeof( obj[nodeName].push ) == "undefined" ) {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push( old );
        }
        obj[nodeName].push( convertXMLToJSON( item ) );
      }
    }
  }
  return obj;
}