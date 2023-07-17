/*
import {
  mxUtils,
  mxEvent,
} from 'mxgraph/javascript/mxClient'
*/
//const outputIcon = './icon/output.png'
//const inputIcon = './icon/input.png'
//Imports the icons from the assets icon folder

const featureIcon = './icon/feature.png';
const noteIcon = './icon/note.png';

//const relationIcon = './icon/link.png'
const optionalIcon = './icon/Optional.png';
const mandatoryIcon = './icon/Mandatory.png';
const alternativeIcon = './icon/Alternative.png';
const orIcon = './icon/Or.png';
const requiresIcon = './icon/Requires.png';
const excludesIcon = './icon/Excludes.svg';



/**
 * Array of toolbar elemnts, follow the structure:
 *  {
 *  icon:
 *  title:
 *  width:
 *  height:
 *  style:  {}
 *  }
 */
export const toolbarItems = [
  {
    icon: featureIcon,
    title: 'Feature',
    width: 150,
    height: 50,
    style: {
      fillColor: 'transparent',
      strokeColor: '#000000',
      strokeWidth: '1',
      cursor: 'pointer',
      textAlign: "center",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid black",
    }
  },
  {
    icon: noteIcon,
    title: 'Note',
    width: 150,
    height: 50,
    style: {
      fillColor: 'yellow',
      strokeColor: '#000000',
      strokeWidth: '1',
      cursor: 'pointer',
      textAlign: "center",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid black",
    }
  }
  /*
  {
    icon: inputIcon,
    title: '输入',
    width: 50,
    height: 50,
    style: {
      fillColor: 'transparent', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: MxConstants.SHAPE_LABEL, // 形状
      align: MxConstants.ALIGN_CENTER, // 水平方向对其方式
      verticalAlign: MxConstants.ALIGN_BOTTOM, // 垂直方向对其方式
      imageAlign: MxConstants.ALIGN_CENTER, // 图形水平方向对其方式
      imageVerticalAlign: MxConstants.ALIGN_TOP, // 图形方向对其方式
      image: inputIcon // 图形
    }
  }*/
]

/**
 * Array with the types of realtionships follows the structure:
 * {
 *  title: ...,
 *  relationship: ...,
 *  icon: ...,
 *  style:  {}
 *  }
 */
export const relationshipTypes = [
  {
    title: 'Optional',
    relationship: 'Parenthood',
    icon: optionalIcon,
    style: {
      startArrow: 0,
      endArrow: 'oval',
      endFill: 0
    }
  },
  {
    title: 'Mandatory',
    relationship: 'Parenthood',
    icon: mandatoryIcon,
    style: {
      startArrow: 0,
      endArrow: 'oval',
      endFill: 1
    }
  },
  {
    title: 'XOR',
    relationship: 'LogicAssociation',
    icon: alternativeIcon,
    style: {
      startArrow: 'block', endArrow: 'block', startFill: 0, endFill: 0
    }
  },
  {
    title: 'OR',
    relationship: 'LogicAssociation',
    icon: orIcon,
    style: {
      startArrow: 'block', endArrow: 'block', startFill: 1, endFill: 1
    }
  },
  {
    title: 'Requires',
    relationship: 'Dependency',
    icon: requiresIcon,
    style: {
      dashed: 1, startArrow: 0, endArrow: 'block', endFill: 1
    }
  },
  {
    title: 'Excludes',
    relationship: 'Dependency',
    icon: excludesIcon,
    style: {
      dashed: 1, startArrow: 'block', endArrow: 'block', startFill: 1, endFill: 1
    }
  },
]
/*
// Defines a new class for all icons
export default function mxIconSet(state) {
  this.images = [];
  var graph = state.view.graph;

  // Delete
  var img = mxUtils.createImage('./icon/delete.png');
  img.setAttribute('title', 'Delete');
  img.style.position = 'absolute';
  img.style.cursor = 'pointer';
  img.style.width = '16px';
  img.style.height = '16px';
  img.style.left = (state.x + state.width) + 'px';
  img.style.top = (state.y - 16) + 'px';

  mxEvent.addGestureListeners(img,
    mxUtils.bind(this, function (evt) {
      // Disables dragging the image
      mxEvent.consume(evt);
    })
  );

  mxEvent.addListener(img, 'click',
    mxUtils.bind(this, function (evt) {
      graph.removeCells([state.cell]);
      mxEvent.consume(evt);
      this.destroy();
    })
  );

  state.view.graph.container.appendChild(img);
  this.images.push(img);
}

mxIconSet.prototype.destroy = function () {
  if (this.images != null) {
    for (var i = 0; i < this.images.length; i++) {
      var img = this.images[i];
      img.parentNode.removeChild(img);
    }
  }

  this.images = null;
};
*/