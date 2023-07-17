<template>
  <treeselect 
    v-model="featuresSelected"
    :multiple="true"
    :options="modelDropdownList"
    :always-open="false"
    :disable-branch-nodes="true"
    :clearable="false"
  />
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  import {
    getHermanosXOR,
    findFeatureParent,
    getLastSelectedFeature,
    getLastUnselectedFeature,
    findRequireFeaturesById,
    findExcludeFeaturesById,
    getChildrenNames,
    getChildren
  } from './js/misc.js';

  import { fillDropdownList } from './js/initialize.js';

  export default {
    name: 'TreeListComponent',
    components: { Treeselect },
    props: [
      'modelDropdownList',
      'modelMandatoryFeatureNames',
      'modelRequireFeatures',
      'modelExcludeFeatures',
      'modelConstraintsList',
    ],
    data() {
      return {
        featuresSelected: [],
        validTree: false,
        missingFeatures: []
      }
    },
    watch: {
      featuresSelected: function (newValue, oldValue) {
        this.validateSelection(newValue, oldValue);
        this.validateUnselection(newValue, oldValue);
        this.validateMandatoryParentWithOROrXORChildren();
        
        this.$emit('featuresSelected', this.featuresSelected);
        this.$emit('missingFeatures', this.missingFeatures);
        this.$emit('validTree', this.validTree);
        
        if(this.validTree){
          this.createOutputJSON();
        }
      },
      modelMandatoryFeatureNames: function (){
        this.featuresSelected = this.modelMandatoryFeatureNames;
        //console.log(this.modelDropdownList);
      }
    },
    methods: {
      validateSelection(newValue, oldValue){
        var lastSelectedFeature = getLastSelectedFeature(newValue, oldValue);
        this.checkRequireFeaturesOfSelectedFeature(lastSelectedFeature);
        this.checkExcludeFeaturesOfSelectedFeature(lastSelectedFeature);
        this.waterfallRemoveExcludedFeatures(lastSelectedFeature);
        this.validateXOR(lastSelectedFeature);
        this.autoSelectParent(lastSelectedFeature);
      },
      validateUnselection(newValue, oldValue){
        var lastUnselectedFeature = getLastUnselectedFeature(newValue, oldValue);
        if(this.modelMandatoryFeatureNames.includes(lastUnselectedFeature[0])){
          this.featuresSelected.push(lastUnselectedFeature[0]);
          return;
        }
        this.waterfallRemoveRequiredFeatures(lastUnselectedFeature);
        this.autoUnselectParent(lastUnselectedFeature);
      },
      validateMandatoryParentWithOROrXORChildren(){
        this.missingFeatures = [];
        this.validTree = false;
        //console.log('modelMandatoryFeatureNames');
        //console.log(this.modelMandatoryFeatureNames);
        for(var i = 0; i < this.modelMandatoryFeatureNames.length - 1; i++){
          var mandatoryChildrenNames = getChildrenNames(this.modelConstraintsList, this.modelMandatoryFeatureNames[i]);
          var mandatoryChildren = getChildren(this.modelConstraintsList, this.modelMandatoryFeatureNames[i]);
          //console.log('mandatoryChildren');
          //console.log(mandatoryChildren);
          if(
            (mandatoryChildren[0].atributo == 'XOR' || mandatoryChildren[0].atributo == 'OR') &&
            !(this.featuresSelected.some(Set.prototype.has, new Set(mandatoryChildrenNames)))
          ){
            this.missingFeatures.push(this.modelMandatoryFeatureNames[i]);
          }
        }
        if(this.missingFeatures.length == 0){
          this.validTree = true;
        }
      },
      autoSelectParent(lastSelectedFeature){
        var parent = findFeatureParent(lastSelectedFeature, this.modelConstraintsList);
        if(
          parent != null &&
          !this.featuresSelected.includes(parent)
        ){
          this.featuresSelected.push(parent);
        }
      },
      autoUnselectParent(lastUnselectedFeature){
        var parent = findFeatureParent(lastUnselectedFeature, this.modelConstraintsList);
        var children = getChildrenNames(this.modelConstraintsList, parent);

        if(
          this.featuresSelected.includes(parent) &&
          !this.modelMandatoryFeatureNames.includes(parent) &&
          parent != this.modelDropdownList[0].id &&
          !this.featuresSelected.some(feature => children.includes(feature))
        ){
          this.removeListItemByValue(this.featuresSelected, parent);
        }
      },
      validateXOR(lastSelectedFeature){
        var hermanos = getHermanosXOR(
          findFeatureParent(lastSelectedFeature, this.modelConstraintsList), lastSelectedFeature, this.modelConstraintsList
        );
        //console.log('hermanos');
        //console.log(hermanos);
        for(var i = 0; i < hermanos.length; i++){
          this.removeListItemByValue(this.featuresSelected,hermanos[i]);
        }
      },

      waterfallRemoveRequiredFeatures(lastUnselectedFeature){
        for(var i = 0; i < this.modelRequireFeatures.length; i++){
          if(this.modelRequireFeatures[i].destino == lastUnselectedFeature){
            this.removeListItemByValue(this.featuresSelected, this.modelRequireFeatures[i].origen);
            var parent = findFeatureParent(this.modelRequireFeatures[i].origen, this.modelConstraintsList);
            if(!this.modelMandatoryFeatureNames.includes(parent)){
              this.removeListItemByValue(this.featuresSelected, parent);
            } 
          }
        }
      },
      waterfallRemoveExcludedFeatures(lastSelectedFeature){
        for(var i = 0; i < this.modelExcludeFeatures.length; i++){
          if(
            this.modelExcludeFeatures[i].destino == lastSelectedFeature &&
            lastSelectedFeature != this.modelExcludeFeatures[i].origen
          ){
            this.removeListItemByValue(this.featuresSelected, this.modelExcludeFeatures[i].origen);
          }
        }
      },
      removeListItemByValue(list, item){
        var index = list.indexOf(item);
          if(index !== -1){
            list.splice(index, 1);
          }
      },
      checkRequireFeaturesOfSelectedFeature(lastSelectedFeature){
        var requireFeaturesById = findRequireFeaturesById(lastSelectedFeature, this.modelRequireFeatures);
        //console.log('requireFeaturesById');
        //console.log(requireFeaturesById);
        for(var i = 0; i < requireFeaturesById.length; i ++){
          if(requireFeaturesById[i]!= null && !this.featuresSelected.includes(requireFeaturesById[i])){
            this.featuresSelected.push(requireFeaturesById[i]);
          }
        }
      },
      checkExcludeFeaturesOfSelectedFeature(lastSelectedFeature){
        var excludeFeaturesById = findExcludeFeaturesById(lastSelectedFeature, this.modelExcludeFeatures);
        //console.log('excludeFeaturesById');
        //console.log(excludeFeaturesById);
        for(var i = 0; i < excludeFeaturesById.length; i ++){
          if(excludeFeaturesById[i]!= null && this.featuresSelected.includes(excludeFeaturesById[i])){
            this.featuresSelected = this.featuresSelected.filter(
              function(f) { return f !== excludeFeaturesById[i] }
            );
          }
        }
      },
      createOutputJSON(){
        this.$emit(
          'variationOutputJSON', 
          fillDropdownList(
            this.addRequireAndExcludeToConstraintList(
              this.addSelectedValue(
                this.modelConstraintsList,
                this.featuresSelected
              ),
              this.modelRequireFeatures,
              this.modelExcludeFeatures
            )
          )
        );
      },
      addSelectedValue(constraintsList, featuresSelected){
        var constraintsListWithSelectedValue = constraintsList;
        for(var i = 0; i < constraintsListWithSelectedValue.length; i++){
          if(featuresSelected.includes(constraintsListWithSelectedValue[i].id)){
            constraintsListWithSelectedValue[i].enable = true;
          }
          else{
            constraintsListWithSelectedValue[i].enable = false;
          }          
        }
        return constraintsListWithSelectedValue;
      },
      addRequireAndExcludeToConstraintList(constraintsList, requireFeatures, excludeFeatures){
        var constraintsListWithRequireAndExclude = constraintsList;
        for(var i = 0; i < constraintsListWithRequireAndExclude.length; i++){
          constraintsListWithRequireAndExclude[i].require = findRequireFeaturesById(constraintsListWithRequireAndExclude[i].id, requireFeatures);
          constraintsListWithRequireAndExclude[i].exclude = findExcludeFeaturesById(constraintsListWithRequireAndExclude[i].id, excludeFeatures);
        }
        return constraintsListWithRequireAndExclude;
      }
    }
  }
</script>

<style>
.vue-treeselect__menu {
  font-size: 60%;
}
</style>