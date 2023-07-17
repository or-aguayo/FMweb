export const addElementToGraph = (toolItem, x, y, elementName, graph) => {
    const { width, height } = toolItem;
    const styleObj = toolItem["style"];
    const style = Object.keys(styleObj)
      .map((attr) => `${attr}=${styleObj[attr]}`)
      .join(";");
    const parent = graph.getDefaultParent();

    let newElement = document.createElement("Feature");
    newElement.setAttribute("name", elementName);
    
    graph.getModel().beginUpdate();
    try {
      createVertex(graph, elementName, parent, newElement, x, y, width, height, style);
      //TODO add feature to meta model
    } finally {
      graph.getModel().endUpdate();
    }

    /*
    let auxElement = (isFeature(elementName) ? new Feature(elementName, "", null, null) : new Note(elementName));
    if (isFeature(elementName) && arrayFeatures.length == 0){
        featureModel.root = auxElement;
    }
    */
    isFeature(elementName) ? getBlur('featureBtn') : getBlur('noteBtn');
}

export const createVertex = (graph, elementName, parent, newElement, x, y, width, height, style) => {
  var vertex = graph.insertVertex(
    isFeature(elementName) ? parent : null,
    null,
    newElement,
    x,
    y,
    width,
    height,
    style
  );
  vertex.title = elementName;
  
  if(!isFeature(elementName)){
    vertex.connectable = false;
    //vertex.fmwebType = 'note';
  }
  else{
    //vertex.fmwebType = 'feature';
  }
  return vertex;
}

export const isFeature = (elementName) => {
  return elementName == "New Feature";
}

/**
 * Add cell from the data in the toolbar array
 */
export const addCell = (toolItem, x, y, graph) => {
  addElementToGraph(toolItem, x, y, "New Feature", graph);
}

export const addNote = (toolItem, x, y, graph) => {
  addElementToGraph(toolItem, x, y, "New Note", graph);
}

export const getBlur = (elementId) => {
  document.getElementById(elementId).blur();
}