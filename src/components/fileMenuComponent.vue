<template>
    <div class="options row">
        <el-header style="font-size: 12px; height: 22px; padding: 3px">
            <el-dropdown @command="handleCommand" trigger="click" id="dropdownMenu">
                <span class="el-dropdown-link">
                    <i class="el-icon-setting"></i>File
                </span>
                <template v-slot:dropdown>
                    <el-dropdown-menu>
                        <div v-if="modelAppViewName === 'FMweb'">
                            <el-dropdown-item command="a">Import XML Model</el-dropdown-item>
                            <el-dropdown-item command="b" :disabled="!modelValidModel">Save as XML</el-dropdown-item>
                            <el-dropdown-item command="c" :disabled="!modelValidModel">Export as JSON</el-dropdown-item>
                            <el-dropdown-item command="d" :disabled="!modelValidModel">Export as SVG</el-dropdown-item>
                        </div>
                        <div v-else>
                            <el-dropdown-item command="a">Import XML Model</el-dropdown-item>
                            <el-dropdown-item command="b" :disabled="!modelValidTree">Save as JSON</el-dropdown-item>
                            <el-dropdown-item command="c" :disabled="!modelValidTree">Export Script</el-dropdown-item>
                        </div>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-header>

        <ModalComponent ref="modalImport">
            <template v-slot:header>
                <h1>Select a Model File and Upload it</h1>
            </template>

            <template v-slot:body>
                <input
                    type="file"
                    round
                    id="import-file-model"
                    accept=".xml"
                    v-on:change="importModel"
                />
            </template>

            <template v-slot:footer>
                <div>
                    <button @click="$refs.modalImport.closeModal()">Cancel</button>
                </div>
            </template>
        </ModalComponent>
    </div>    
</template>

<script>
    import ModalComponent from "./modalComponent.vue";
    import { configurateJSON } from '../views/variation/js/initialize.js';
    import { templateScript } from './templateScript.js';
    import {
        mxUtils as MxUtils,
        mxCodec as MxCodec,
        mxCell as MxCell,
        mxGeometry as MxGeometry,
    } from 'mxgraph/javascript/mxClient';

    export default {
        name: 'FileMenuComponent',
        components:{
            ModalComponent
        },
        props: [
            'modelGraph', 
            'modelAppViewName', 
            'modelValidTree', 
            'modelFeaturesSelected',  
            'modelVariAtionOutputJSON', 
            'modelValidModel',
        ],
        methods:{
            /**
             * Handles the command for the dropdown menu
             */
            handleCommand(command) {
                if(this.modelAppViewName == 'FMweb'){
                    this.switchFMweb(command);
                }
                else
                    this.switchVariAtion(command);
            },
            switchFMweb(command){
                switch (command) {
                    case "a":
                        this.$refs.modalImport.openModal();
                        break;
                    case "b":
                        this.saveFMXML();
                        break;
                    case "c":
                        this.exportFMJSON();
                        break;
                    case "d":
                        this.exportFMSVG();
                        break;
                    default:
                        break;
                }
            },
            switchVariAtion(command){
                switch (command) {
                    case "a":
                        this.$refs.modalImport.openModal();
                        break;
                    case "b":
                        this.saveVariAtionJSON();
                        break;
                    case "c":
                        this.exportScript();
                        break;
                    default:
                        break;
                }
            },       
            /**
             * Imports a XML model from a local XML file
             */
            importModel(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length) {
                    return;
                }
                this.$confirm(
                    "This will permanently delete the current model and replace it. Continue?",
                    "Warning",
                    {
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        type: "warning",
                    }
                )
                .then(() => {
                    var file = files[0];
                    var reader = new FileReader();
                    var vm = this;
                    reader.onload = (e) => {
                        var xml = e.target.result;
                        var doc = MxUtils.parseXml(xml.substring(14, xml.length - 15));
                        //console.log(doc);
                        vm.modelGraph.model.clear();
                        let codec = new MxCodec(doc);
                        codec.decode(doc.documentElement, vm.modelGraph.getModel());
                        let elt = doc.documentElement.firstChild;
                        let cells = [];
                        while (elt != null) {
                            let cell = codec.decode(elt);
                            if (
                                cell != undefined &&
                                (cell.nodeName == "feature" || cell.nodeName == "relationship")
                            ) {
                                //Just add to the graph if it is a feature in case of realtionships, push them to an array
                                //so you can add them later
                                if (cell.nodeName == "feature") {
                                    this.addFeature(cell);
                                } else {
                                    cells.push(cell);
                                }
                            }
                            elt = elt.nextSibling;
                        }
                        //Add all the relationships that weren't added previously
                        //console.log(cells);
                        cells.forEach((cell) => {
                            this.addRelation(cell);
                        });

                        vm.$emit('validateModelInFMweb');

                        //AQUI SE DEBE RESETEAR LOS ATRIBUTOS DEL COMPONENTE EXCEPTO GRAPH.
                        vm.$emit('resetParentComponent');

                        if(this.modelAppViewName == 'Vari::Ation'){
                            var parseString = require("xml2js").parseString;
                            parseString(xml, function (err, result) {
                                vm.$emit('initializeResponse', configurateJSON(result));
                            });
                        }
                    };
                    reader.readAsText(file);
                    this.$message({
                        type: "success",
                        message: "Import completed",
                    });
                    this.$refs.modalImport.closeModal();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "Import canceled",
                    });
                });
                return;
            },
            writeFile(filenameWithExtension, data, contentTypeBlob, contentTypeDataset){
                const blob = new Blob([data], { type: contentTypeBlob });
                const e = document.createEvent("MouseEvents");
                const a = document.createElement("a");
                a.download = filenameWithExtension;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = [contentTypeDataset, a.download, a.href].join(":");
                e.initEvent(
                    "click",
                    true,
                    false,
                    window,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                );
                a.dispatchEvent(e);
            },
            getEncodedXML(){
                var encoder = new MxCodec();
                var node = encoder.encode(this.modelGraph.getModel());
                return MxUtils.getXml(node);
            },
            /**
             * Shows the current XML data of the full graph in the console
             * And dispatches the XML data transformed to JSON to a local file with the name GraphData.json
             * Uses the blob method to make the download so it has size constraints
             */
            exportFMJSON() {
                var xmlString = this.getEncodedXML(); // fetch xml (string or document/node)
                
                //console.log(xmlString);
                var parseString = require("xml2js").parseString;
                var that = this;
                parseString(xmlString, function (err, result) {
                    var data = JSON.stringify(result, null, 4);
                    that.writeFile("GraphData.json", data, "text/plain", "text/json");
                }); // parses to JSON object
            },
            /**
             * Saves the data model of the graph to a local file
             * Normal format of the file is XML
             * Uses the blob method to make the download so it has size constraints
             */
            saveFMXML() {
                var data = this.getEncodedXML();
                var format = require('xml-formatter');
                this.writeFile("GraphData.xml", format(data), "text/plain", "text/xml");
            },
            /**
             * Saves the graph model as an image
             * Uses the SVG to save a image file
             */
            exportFMSVG() {
                const data = document.querySelector("#graphContainer > svg").outerHTML;
                this.writeFile("FM.svg", data, "image/svg+xml", "image/svg+xml");
            },
            /**
             * Adds a feature based on the data from an xml dom
             */
            addFeature(feature) {
                let geom = feature.getElementsByTagName("mxGeometry")[0];
                let auxCell = feature.getElementsByTagName("mxCell")[0];

                let newFeature = document.createElement("Feature");
                newFeature.setAttribute("name", feature.getAttribute("name"));
                this.modelGraph.getModel().beginUpdate();
                try {
                    var vertex = this.modelGraph.insertVertex(
                    this.modelGraph.getDefaultParent(),
                    feature.getAttribute("id"),
                    newFeature,
                    geom.getAttribute("x"),
                    geom.getAttribute("y"),
                    geom.getAttribute("width"),
                    geom.getAttribute("height"),
                    auxCell.getAttribute("style")
                    );
                    //console.log(vertex);
                    vertex.title = auxCell.getAttribute("title");
                } finally {
                    this.modelGraph.getModel().endUpdate();
                }
            },
            /**
             * Adds a realtionship based on the data from an xml dom
             */
            addRelation(relat) {
                //type="Optional" relationship="Parenthood" mincardinality="0" maxcardinality="1" id="4"
                //mxCell => style="startArrow=0;endArrow=oval;endFill=0" edge="1" parent="1" source="2" target="3">
                //mxGeometry => relative="1" as="geometry"/>
                let auxCell = relat.getElementsByTagName("mxCell")[0];

                let newRelationship = document.createElement("Relationship");

                let source = this.modelGraph.model.getCell(auxCell.getAttribute("source"));
                let target = this.modelGraph.model.getCell(auxCell.getAttribute("target"));

                if (relat.hasAttribute("mincardinality")) {
                    newRelationship.setAttribute(
                    "mincardinality",
                    relat.getAttribute("mincardinality")
                    );
                }
                if (relat.hasAttribute("maxcardinality")) {
                    newRelationship.setAttribute(
                    "maxcardinality",
                    relat.getAttribute("maxcardinality")
                    );
                }

                newRelationship.setAttribute("type", relat.getAttribute("type"));
                newRelationship.setAttribute(
                    "relationship",
                    relat.getAttribute("relationship")
                );

                let edge = new MxCell(newRelationship, new MxGeometry());
                edge.setEdge(true);
                edge.setStyle(auxCell.getAttribute("style"));
                edge.geometry.relative = true;

                this.modelGraph.addEdge(edge, null, source, target);
            },
            
            //Vari::Ation funcionalities

            createScript(projectName, rules) {
                return templateScript(projectName, rules);
            },
            exportScript() {
                let rules = '';
                this.modelFeaturesSelected.forEach(featureSelected => {
                    rules = rules + '--' + this.normalizeRule(featureSelected) + ' ';
                });
                this.writeFile(
                    'script.sh',
                    this.createScript('ProyectoNuevo', rules),
                    "text/plain",
                    "text/plain"
                );
            },
            normalizeRule(rule) {
                const withoutAccents = this.removeAccents(rule);
                let normalized = withoutAccents.replace(/[^-A-Za-z0-9]+/g, '_').toLowerCase();
                normalized = normalized.replace('-', '_');
                return normalized;
            },
            removeAccents(rule) {
                return rule
                    .replace("Á", "A")
                    .replace("É", "E")
                    .replace("Í", "I")
                    .replace("Ó", "O")
                    .replace("Ú", "U")
                    .replace("á", "a")
                    .replace("é", "e")
                    .replace("í", "i")
                    .replace("ó", "o")
                    .replace("ú", "u");
            },
            saveVariAtionJSON() {
                this.writeFile(
                    "ConfigurationModel.json",
                    JSON.stringify(this.modelVariAtionOutputJSON, null, 4),
                    "text/plain",
                    "text/json"
                );
            },
        },
    };
</script>