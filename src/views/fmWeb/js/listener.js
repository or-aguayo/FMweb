import {
    mxEvent as MxEvent,
    mxUtils as MxUtils,
    mxRectangle as MxRectangle,
    mxKeyHandler as MxKeyHandler,
} from "mxgraph/javascript/mxClient";

export const initializeKeyHandler = (that, graph) => {
  var keyHandler = new MxKeyHandler(graph);
  //on del key press delete selected cells
  keyHandler.bindKey(46, function (evt) {
    evt;
    if (that.graph.isEnabled()) {
      that.graph.removeCells();
      that.validateModel();
    }
  });

  keyHandler.bindKey(8, function (evt) {
    evt;
    if (that.graph.isEnabled()) {
      that.graph.removeCells();
      that.validateModel();
    }
  });
}

export const initializeListeners = (that, other) => {
  other.graph.addListener(MxEvent.DOUBLE_CLICK, (graph, evt) => {
    const cell = other.R.pathOr([], ["properties", "cell"], evt);
    displayCellRenameModal(cell, other);
  });

  var iconTolerance = 20;
  
  other.graph.addMouseListener({
    currentState: null,
    //currentIconSet: null,
    
    //Ocurre cuando se hace click en un feature.
    mouseDown: function (sender, me) {
      sender;
      me;
    },
    mouseMove: function (sender, me) {
      sender;
      
      if (
        other.currentState != null &&
        (me.getState() == other.currentState || me.getState() == null)
      ) {
        var tol = iconTolerance;
        var tmp = new MxRectangle(
          me.getGraphX() - tol,
          me.getGraphY() - tol,
          2 * tol,
          2 * tol
        );
        if (MxUtils.intersects(tmp, other.currentState)) {
          return;
        }
      }
      
      tmp = that.graph.view.getState(me.getCell());

      // Ignores everything but vertices
      if (
        that.graph.isMouseDown ||
        (tmp != null && !that.graph.getModel().isVertex(tmp.cell))
      ) {
        tmp = null;
      }
    },
    mouseUp: function (sender, me) {
      sender;
      me;
    },
  });
}

export const displayCellRenameModal = (cell, other) => {
  if (cell.vertex) {
    //console.log(mxGraphModel.prototype.getOutgoingEdges(cell));
    other.
      $prompt("", "Rename", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputPattern:  /^[A-Za-z0-9ÁáÉéÍíÓóÚú -]*[A-Za-z0-9ÁáÉéÍíÓóÚú][A-Za-z0-9ÁáÉéÍíÓóÚú -]*$/,
        inputErrorMessage: "Invalid Name",
      }).
      then(({ value }) => {
        let cell = other.graph.getSelectionCell();
        other.graph.getModel().beginUpdate();
        try {
          initializeCell(cell, value, other);
        } 
        finally {
          other.graph.getModel().endUpdate();
        }
        other.validateModel();
      })
      .catch(() => {
        other.$message({
          type: "info",
          message: "Input canceled",
        });
      });
  }
}

export const initializeCell = (cell, value, other) => {
  //console.log(value);
  cell.setAttribute("name", value);
  var preferred = other.graph.getPreferredSizeForCell(cell);
  other.graph.updateCellSize(cell, true);
  var current = cell.getGeometry();
  var width = 150;
  var height = 50;
  current.width = preferred.width > width ? preferred.width : width;
  current.height = preferred.height > height ? preferred.height : height;
}