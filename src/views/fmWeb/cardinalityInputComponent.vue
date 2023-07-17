<template>
    <el-dialog
      title="Cardinality Input"
      :visible.sync="modelThat.dialogFormVisible"
      :close="handleClose"
    >
      <el-form>
          <el-form-item label="Minimum Cardinality" :label-width="modelLabelWidth">
              <el-input-number
                  v-model="modelThat.inputMinCar"
                  controls-position="right"
                  :min="0"
              ></el-input-number>
          </el-form-item>
          <el-form-item label="Maximum Cardinality" :label-width="modelLabelWidth">
              <el-input-number
                  v-model="modelThat.inputMaxCar"
                  controls-position="right"
                  :min="0"
              ></el-input-number>
          </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(modelThat)">Cancel</el-button>
          <el-button type="primary" @click="carInputSave(modelThat)">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script>
import {  mxUtils as MxUtils, } from "mxgraph/javascript/mxClient";
    import { def01, def02, cst01, cst03 } from "./js/ruler.js";

    export default {
        name: 'CardinalityInputComponent',
        props: ['modelLabelWidth', 'modelThat'],
        methods: {
            carInputSave(modelThat) {
                modelThat.dialogFormVisible = false;

                let minCardinality = modelThat.inputMinCar;
                let maxCardinality = modelThat.inputMaxCar;

                //let minCardinality = MxUtils.prompt("Minimum Cardinality");
                //let maxCardinality = MxUtils.prompt("Maximum Cardinality");
                let edge = modelThat.graph.getSelectionCell();
                edge.setAttribute("minCardinality", minCardinality);
                edge.setAttribute("maxCardinality", maxCardinality);

                if (minCardinality == null || maxCardinality == null) {
                    MxUtils.alert(
                        "You didn't complete the min or max cardinality input request or canceled it, so the relationship will be removed"
                    );
                    modelThat.graph.removeCells([edge]);
                    return;
                }

                //DEF01
                if (modelThat.relationType == "Mandatory") {
                    def01(minCardinality, modelThat, edge);
                }
                //DEF02
                else if (modelThat.relationType == "Optional") {
                    def02(minCardinality, modelThat, edge);
                }
                //CST01

                if (!(minCardinality >= 0 && minCardinality <= maxCardinality)) {
                    cst01(modelThat, edge);
                }

                //CST03
                cst03(modelThat,edge);
                
                this.resetCardinalities(modelThat);
                modelThat.validateModel();
            },

            resetCardinalities(modelThat){
                modelThat.inputMinCar = 0;
                modelThat.inputMaxCar = 0;
            },
            /**
             * Handles the close event for dialog
             */
            handleClose(modelThat) {
                this.$confirm("Are you sure to close this dialog?")
                    .then(() => {
                    modelThat.dialogFormVisible = false;
                    let edge = modelThat.graph.getSelectionCell();
                    modelThat.graph.removeCells([edge]);
                    this.$message({
                        type: "info",
                        message: "Cadinality Input canceled, the relation was be removed",
                    });
                    this.resetCardinalities();
                    })
                .catch(() => {});
            },
        }
    }
</script>
