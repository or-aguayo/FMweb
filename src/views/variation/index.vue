<template>
  <div class="customToolbarContainer">
    <FileMenuComponent 
      :modelGraph="graph"
      :modelAppViewName="appViewName"
      :modelValidTree="validTree"
      :modelFeaturesSelected="featuresSelected"
      :modelVariAtionOutputJSON="variAtionOutputJSON"
      @initializeResponse="getInitializeResponse"
      @resetParentComponent="resetData"
    />

     <div class="workspace row">
      <div class="toolbarContainer" id="toolbarContainer">
        <p><b>Features Selection</b></p>
        <ul>
          <li>
            <div v-if="!validTree && dropdownList.length > 0" id="missing-selected-features">
              <span style="font-size:50%">
                <b>Must be select some option in feature:</b>
              </span>
              <ul>
                <li v-for="feature in missingFeatures" :key="feature" style="font-size:50%">
                  * {{feature}}
                </li>
              </ul>
            </div>
            <br>
            <div v-if="jsonStats != undefined && Object.keys(jsonStats).length" id="model-stats">
              <span style="font-size:50%">
                <b>Model stats:</b>
              </span>
              <ul style="font-size:50%">
              <li>
                <p v-if="jsonStats.cantidad">
                  * Total: {{jsonStats.cantidad}}.
                </p>
                <p v-else>
                  * Total: 0.
                </p>
              </li>
              <li>
                <p v-if="jsonStats.Mandatory">
                  * Mandatory: {{jsonStats.Mandatory}}.
                </p>
                <p v-else>
                  * Mandatory: 0.
                </p>
              </li>
              <li>
                <p v-if="jsonStats.Optional">
                  * Optional: {{jsonStats.Optional}}.
                </p>
                <p v-else>
                  * Optional: 0.
                </p>
              </li>
              <li>
                <p v-if="jsonStats.XOR">
                  * XOR: {{jsonStats.XOR}}.
                </p>
                <p v-else>
                  * XOR: 0.
                </p>
              </li>
              <li>
                <p v-if="jsonStats.OR">
                  * OR: {{jsonStats.OR}}.
                </p>
                <p v-else>
                  * OR: 0.
                </p>
              </li>
              <li>
                <p v-if="jsonStats.Requires">
                  * Requires: {{jsonStats.Requires}}.
                </p>
                <p v-else>
                  * Requires: 0.
                </p>
              </li>
              <li>
                <p v-if="jsonStats.Excludes">
                  * Excludes: {{jsonStats.Excludes}}.
                </p>
                <p v-else>
                  * Excludes: 0.
                </p>
              </li>                
              <li>
                <p v-if="jsonStats.Null">
                  * Null: {{jsonStats.Null}}.
                </p>
                <p v-else>
                  * Null: 0.
                </p>
              </li>
              </ul>
          </div>
          </li>
          <br><br>
          <li>
            <div>
              <TreeListComponent
                :modelDropdownList="dropdownList"
                :modelMandatoryFeatureNames="mandatoryFeatureNames"
                :modelRequireFeatures="requireFeatures"
                :modelExcludeFeatures="excludeFeatures"
                :modelConstraintsList="constraintsList"
                @featuresSelected="getFeaturesSelected"
                @variationOutputJSON="getVariAtionOutputJSON"
                @validTree="getValidTree"
                @missingFeatures="getMissingFeatures"
              />
            </div>
          </li>
        </ul>
        <br/>
      </div>
      <div class="graphContainer" ref="container" id="graphContainer"></div>
    </div>
  </div>
</template>
<script>
  import {
    mxGraph as MxGraph,
    mxUtils as MxUtils,
  } from "mxgraph/javascript/mxClient";
  import TreeListComponent from "./treeListComponent";
  import FileMenuComponent from '../../components/fileMenuComponent.vue';
  import { getMandatoryFeatureNames } from './js/misc.js';
  import '../../style/gabriel.scss';

  export default {
    name: 'VariAtionView',
    components: {
      FileMenuComponent,
      TreeListComponent,
    },
    data() {
      return this.initData();
    },
    methods: {
      initComponent(){
        this.graph = new MxGraph(this.$refs.container);
        this.initGraph();
        this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")';
      },
      initData(){
        return {
          graph: null,
          labelWidth: "120 px",
          appViewName: 'Vari::Ation',
          validTree: false,
          jsonStats: {},
          constraintsList: [],
          requireFeatures: [],
          excludeFeatures: [],
          dropdownList: [],
          mandatoryFeatureNames: [],
          featuresSelected: [],
          variAtionOutputJSON: {},
          missingFeatures: [],
        };
      },
      resetData(){
        //this.graph = null,
        //this.labelWidth = "120 px",
        //this.appViewName = 'Vari::Ation',
        this.validTree = false;
        this.jsonStats = {},
        this.constraintsList = [];
        this.requireFeatures = [];
        this.excludeFeatures = [];
        this.dropdownList = [];
        this.mandatoryFeatureNames = [];
        this.featuresSelected = [];
        this.variAtionOutputJSON = {};
        this.missingFeatures = [];
      },
      getMissingFeatures(val){
        this.missingFeatures = val;
      },
      getValidTree(val){
        this.validTree = val;
      },
      getVariAtionOutputJSON(val){
        this.variAtionOutputJSON = val;
      },
      getFeaturesSelected(val){
        this.featuresSelected = val;
      },
      getInitializeResponse(val){
        this.jsonStats = val.jsonStats;
        this.constraintsList = val.constraintsList;
        this.requireFeatures = val.requireFeatures;
        this.excludeFeatures = val.excludeFeatures;
        this.dropdownList = val.dropdownList;
        this.mandatoryFeatureNames = getMandatoryFeatureNames(this.constraintsList);
        this.mandatoryFeatureNames.push(this.dropdownList[0].id);
      },
      /**
       * Initailizes the graph elemnts and adds an event for double click
       * on elements that shows the elements data in the console.
       */
      initGraph() {
        if (this.R.isNil(this.graph)) {
          return;
        }
        this.graph.setEnabled(false);
        this.graph.convertValueToString = (cell) => this.initConvertValueToString(cell);
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
      this.initComponent();
    },
  };
</script>