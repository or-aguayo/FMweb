<template>
  <div class="customToolbarContainer">
    <FileMenuComponent 
      :modelGraph="graph" 
      :modelAppViewName="appViewName" 
      :modelValidModel="validModel"
      @validateModelInFMweb="validateModel"
    />
    <CardinalityInputComponent :modelLabelWidth="labelWidth" :modelThat="this"/>

    <div class="workspace column">
      <div class="toolbarContainer" id="toolbarContainer">
        <ul>
          <!--
          <li v-for="item in toolbarItems" :key="item['title']" ref="toolItem">
            <el-button type="primary" plain style="width: 90%">
              <img :src="item['icon']"/>
              <span>{{ item["title"] }}</span>
            </el-button> 
          </li>
          -->
          <li>
            <el-button type="primary" plain style="width: 90%" ref="featureBtn" @click="addCellWrapper(toolbarItems[0], 10, 10, graph)" id="featureBtn" focusable="false">
              <img :src="toolbarItems[0]['icon']"/>
              <span>{{ toolbarItems[0]["title"] }}</span>
            </el-button> 
          </li>
          <li>
            <el-button type="info" plain style="width: 65%" ref="noteBtn" @click="addNote(toolbarItems[1], 10, 70, graph)" id="noteBtn" focusable="false">
              <img :src="toolbarItems[1]['icon']"/>
              <span>{{ toolbarItems[1]["title"] }}</span>
            </el-button> 
          </li>
          <br>
          <li>
              <div v-if="!validModel && firstFeatureCreated">
                <span style="font-size:50%">Model problems:</span>
                <ul>
                  <li v-for="problem in modelProblems" :key="problem" style="font-size:50%">
                    * {{problem}}
                  </li>
                </ul>
              </div>
          </li>
          <br>
        </ul>

        <p style="font-size:80%;">Relationship: {{ relationType }}</p>
        
        <ul>
          <li
            v-for="item in relationshipTypes"
            :key="item['title']"
            ref="relItem"
          >
            <el-button
              plain
              type="success"
              style="width: 65%"
              v-on:click="relationType = item['title']"
            >
              <img :src="item['icon']" :alt="item['title']" />
              {{ item["title"] }}
            </el-button>
          </li>
        </ul>
        <br>
      </div>

      <div class="graphContainer" ref="container" id="graphContainer"></div>
    </div>
  </div>
</template>
<script>
  import {
    mxCell as MxCell,
    mxConnectionConstraint as MxConnectionConstraint,
    mxEvent as MxEvent,
    mxGeometry as MxGeometry,
    mxGraph as MxGraph,
    mxPoint as MxPoint,
    mxShape as MxShape,
    mxUtils as MxUtils,
    mxCodec as MxCodec,
  } from "mxgraph/javascript/mxClient";
  import { relationshipTypes, toolbarItems } from "./js/toolbar";
  import FileMenuComponent from '../../components/fileMenuComponent.vue';
  import { addCell, addNote } from './js/addElements.js';
  import CardinalityInputComponent from './cardinalityInputComponent.vue';
  import { initializeKeyHandler, initializeListeners } from './js/listener.js';
  import '../../style/gabriel.scss';
  import { applyRules } from './js/ruler.js';
  import { convertXMLToJSON } from './js/misc.js';

  export default {
    name: 'FMwebView',
    components: {
      FileMenuComponent,
      CardinalityInputComponent,
    },
    computed: {
      toolbarItems: () => toolbarItems,
      relationshipTypes: () => relationshipTypes,
      addNote: () => addNote,
    },
    data() {
      return {
        graph: null,
        relationType: "Optional",
        featureSelected: false,
        inputMinCar: 0,
        inputMaxCar: 0,
        dialogFormVisible: false,
        labelWidth: "120 px",
        appViewName: "FMweb",
        validModel: false,
        repeatedFeatureNames: [],
        modelProblems: [],
        firstFeatureCreated: false,
      };
    },
    methods: {
      addCellWrapper(toolItem, x, y, graph){
        addCell(toolItem, x, y, graph);
        this.firstFeatureCreated = true;
        this.validateModel();
      },
      resetData(){
        this.validModel = false;
        this.repeatedFeatureNames = [];
      },
      validateModel(){
        this.modelProblems = [];
        var hasRepeatedFeatureNames = false;
        var hasRelationships = false;

        this.getRepeatedFeatureNames();
        if(this.repeatedFeatureNames.length > 0){
          this.modelProblems.push(`Multiple features with the same name: ${this.repeatedFeatureNames}.`);
          hasRepeatedFeatureNames = true;
        }
        else{
          hasRepeatedFeatureNames = false;
        }
        if(!this.isGraphIncludesRelationships()){
          this.modelProblems.push(`This model hasn't relationships.`);
          hasRelationships = false;
        }
        else{
          hasRelationships = true;
        }

        if(hasRepeatedFeatureNames || !hasRelationships){
          this.validModel = false;
        }
        else if(!hasRepeatedFeatureNames && hasRelationships){
          this.validModel = true;
        }
      },
      getRepeatedFeatureNames(){
        var features = convertXMLToJSON(new MxCodec().encode(this.graph.getModel())).root.feature;
        this.repeatedFeatureNames = [];
        if(features && features.length > 0){
          for(var i = 0; i < features.length; i++){
            var fixedFeatureName = features[i]['@attributes'].name;
            for(var j = 0; j < features.length; j++){
              var featureToCompare = features[j]['@attributes'].name;
              if(
                i != j && 
                featureToCompare == fixedFeatureName && 
                !this.repeatedFeatureNames.includes(featureToCompare)
              ){
                this.repeatedFeatureNames.push(featureToCompare);
              }
            }
          }
        }
      console.log(this.repeatedFeatureNames);
      },
      isGraphIncludesRelationships(){
        return convertXMLToJSON(new MxCodec().encode(this.graph.getModel())).root.relationship != undefined;
      },
      getFeatures(){
        return convertXMLToJSON(new MxCodec().encode(this.graph.getModel())).root.feature; 
      },
      /**
       * Creates the graph asociating to the container
       * Also sets up the shape connection constraints and the connect image
       * Ands add a connection handler so that each connection gets the realtion type setted
       * Finally adds the connection listener that listen for the Definitions and Constraints
       */
      createGraph() {
        MxGraph.prototype.getAllConnectionConstraints = (terminal) => this.initAllConnectionConstraints(terminal);        
        MxShape.prototype.constraints = this.initPrototypeConstraints();
        /*MxConnectionHandler.prototype.connectImage = new MxImage(
          require("../../../assets/connector.gif"),
          16,
          16
        );
        */
        let that = this;
        this.graph = new MxGraph(this.$refs.container);
        this.graph.connectionHandler.factoryMethod = (style) => this.initFactoryMethod(style, that);
        this.graph.connectionHandler.addListener(
          MxEvent.CONNECT,
          (sender, evt) => applyRules(that, evt)
        );
      },
      initAllConnectionConstraints(terminal){
        if (terminal != null && terminal.shape != null) {
            if (terminal.shape.stencil != null) {
              if (terminal.shape.stencil.constraints != null) {
                return terminal.shape.stencil.constraints;
              }
            } else if (terminal.shape.constraints != null) {
              return terminal.shape.constraints;
            }
        }
        return null;
      },
      initFactoryMethod(style, that){
        let aux = this.initNewRelationship(that, relationshipTypes);
        let newRelationship = aux.newRelationship;
        let relation = aux.relation;
        style = Object.keys(relation.style)
          .map((attr) => `${attr}=${relation.style[attr]}`)
          .join(";");
        return this.initEdge(newRelationship, style);
      },
      initPrototypeConstraints(){
        var prototypeConstraints = [];
        for(var i = 0.25; i < 1 ; i+=0.25){
          prototypeConstraints.push(
            new MxConnectionConstraint(new MxPoint(i, 0), true)
          );
          prototypeConstraints.push(
            new MxConnectionConstraint(new MxPoint(0, i), true)
          );
          prototypeConstraints.push(
            new MxConnectionConstraint(new MxPoint(1, i), true)
          );
          prototypeConstraints.push(
            new MxConnectionConstraint(new MxPoint(i, 1), true)
          );
        }
        return prototypeConstraints;
      },
      initNewRelationship(that, relationshipTypes){
        let newRelationship = document.createElement("Relationship");
        newRelationship.setAttribute("type", that.relationType);
        let relation = relationshipTypes.find((obj) => {
          return obj.title === that.relationType;
        });
        newRelationship.setAttribute("relationship", relation.relationship);
        return {
          'newRelationship' : newRelationship,
          'relation' : relation
        };
      },
      initEdge(newRelationship, style){
        let edge = new MxCell(newRelationship, new MxGeometry());
        edge.setEdge(true);
        edge.setStyle(style);
        edge.geometry.relative = true;
        return edge;
      },
      /**
       * Initailizes the graph elemnts and adds an event for double click
       * on elements that shows the elements data in the console.
       */
      initGraph() {
        if (this.R.isNil(this.graph)) {
          return;
        }
        
        this.graph.setConnectable(true);
        this.graph.setCellsDisconnectable(false);
        this.graph.setPanning(true);
        this.graph.setAllowDanglingEdges(false);
        this.graph.setCellsEditable(false);
        this.graph.setMultigraph(false);
        this.graph.setAllowLoops(false);
        this.graph.convertValueToString = (cell) => this.R.prop("name", cell);
        this.graph.convertValueToString = (cell) => this.initConvertValueToString(cell);
        
        var that = this;
        initializeKeyHandler(that, this.graph);
        initializeListeners(that, this);
      },
      initConvertValueToString(cell){
        if (
          MxUtils.isNode(cell.value) &&
          (cell.value.nodeName.toLowerCase() == "feature" || cell.value.nodeName.toLowerCase() == "note")
        ) {
          return cell.getAttribute("name", "")
        }
        return "";
      },
    },
    mounted() {
      this.createGraph();
      this.initGraph();
      this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")';
    },
  };
</script>