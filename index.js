import mxgraph from 'mxgraph';
//import mxUtils from 'mxgraph'
//import mxConstants from 'mxgraph'

var graph;

// Function to save the diagram
function getDiagramXML(graph) {
  // Output the XML representation of the mxGraph model
  const encoder = new mg.mxCodec();
  const node = encoder.encode(graph.getModel());
  const xml = mg.mxUtils.getXml(node);// Get the XML representation of the graph model
  // You can now do something with the XML data, such as sending it to a server or storing it locally
  return xml;
}

// Function to save the diagram as a file
function saveDiagramLocally(xml) {
  // Create a Blob object from the XML data
  var blob = new Blob([xml], { type: 'text/xml' });

  // Create a file download link
  var downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'diagram.xml'; // Specify the file name

  // Programmatically trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}




function handleCellClick(cell) {
  cell.setAttribute('val1', 10);
  console.log('Cell clicked:', cell);

  var style = cell.getStyle();
  console.log(style);
  //console.log('**' + cell.getAttribute(''))
  console.log(mg.mxUtils.getStylenames(style));
  style = mg.mxUtils.setStyle(style, 'fillColor', '#00FF00');
  graph.getModel().setStyle(cell, style);
  // Your logic here...
}

const mg = mxgraph();
const mxUtils = mg.mxUtils;
var graph;

// Function to load a remote diagram
function loadRemoteDiagram(url) {
  mxUtils.get(url, function (req) {
    var xml = req.getText(); // Get the XML data of the diagram
    var doc = mxUtils.parseXml(xml); // Parse the XML data
    var codec = new mxCodec(doc); // Create a codec to decode the XML data
    var model = new mxGraphModel(); // Create a new graph model
    codec.decode(doc.documentElement, model); // Decode the XML and update the model
    graph.setModel(model); // Set the model to the graph
  });
}

// Example usage: loadRemoteDiagram('http://example.com/diagram.xml');

function createNode(name = 'custom', label = 'label') {
  let doc = mg.mxUtils.createXmlDocument();
  let node = doc.createElement(name);
  node.setAttribute('label', label);
  node.setAttribute('attribute1', '***********');
  return node;
}

var f_convertValueToString = function (cell) {
  if (mg.mxUtils.isNode(cell.value)) {
    return cell.getAttribute('label', '');
  } else return cell.value;
};

var cellLabelChanged;

var f_cellLabelChanged = function (cell, newValue, autoSize) {
  if (mg.mxUtils.isNode(cell.value)) {
    // Clones the value for correct undo/redo
    var elt = cell.value.cloneNode(true);
    elt.setAttribute('label', newValue);
    newValue = elt;
  }
  cellLabelChanged.apply(this, arguments);
};

const main = (container) => {
  if (!mg.mxClient.isBrowserSupported()) {
    mg.mxUtils.error('nope', 200, false);
  } else {
    graph = new mg.mxGraph(container);
    graph.setEnabled(true); // disable editing
    graph.convertValueToString = f_convertValueToString;
    let cellLabelChanged = graph.cellLabelChanged;
    const model = graph.getModel();
    new mg.mxRubberband(graph);
    const parent = graph.getDefaultParent();

    graph.container.addEventListener('click', function (event) {
      var cell = graph.getCellAt(event.offsetX, event.offsetY);
      if (cell !== null) {
        handleCellClick(cell);
      }
    });

    model.beginUpdate();
    try {
      const v1 = graph.insertVertex(parent, null, 'Hello', 20, 20, 80, 30);
      const v2 = graph.insertVertex(parent, null, 'World', 200, 150, 80, 30);
      const v3 = graph.insertVertex(parent,null,'Ellipse',150,250,80,'shape=ellipse;fillColor=white;strokeColor=black');
      const v4 = graph.insertVertex(parent,null,'Hexagon',280,250,80,30,'shape=hexagon;fillColor=white;strokeColor=black');
      const v5 = graph.insertVertex(parent,null,'Cylinder',280,30,80,50,'shape=cylinder;fillColor=white;strokeColor=red');
      const v6 = graph.insertVertex(parent,null,'Cloud',280,100,80,50,'shape=cloud;fillColor=white;strokeColor=red');
      const v7 = graph.insertVertex(parent,null,'Rhombus',290,160,80,50,'shape=rhombus;fillColor=white;strokeColor=red');
      v7.setVisible(true);
      v7.setAttribute('fontColor', 'green');
      const v8 = graph.insertVertex(parent,null,createNode('dataSource', 'dataSource'),10,150,80,50);
      const e1 = graph.insertEdge(parent, null, '', v1, v2);
      const e2 = graph.insertEdge(parent, null, '', v2, v3);
      const style = graph.getStylesheet().getDefaultVertexStyle();
      //style[mg.mxConstants.STYLE_GRADIENTCOLOR] = '#FF0000';
      style[mg.mxConstants.STYLE_FILLCOLOR] = '#FF0000';
      //v3.setSy
      const v3Style = v3.getStyle();

      //v3Style[mg.mxConstants.STYLE_FILLCOLOR] = '#FF0000';

      model.setValue(v3, 'Metka');
      let xml = getDiagramXML(graph)
      console.log(xml);
      saveDiagramLocally(xml)
    } finally {
      model.endUpdate();
    }
  }
};

const app = document.getElementById('app');
main(app);
