import { buildJson } from './instances.js';

var jsonStats = null;
var constraintsList = [];
var requireFeatures = [];
var excludeFeatures = [];
var dropdownList = [];

export const resetData = () => {
    jsonStats = null;
    constraintsList = [];
    requireFeatures = [];
    excludeFeatures = [];
    dropdownList = [];
}

/**
 * Se envia a configurar el JSON, instancia la construiccion de nodos
 * y de restricciones
 */
export const configurateJSON = (result) => {
    resetData();

    var instances = buildJson(result);
    fillConstraints(instances);
    fillStats(instances);
    fillDropdownList(constraintsList);

    /*
    console.log("LOG");
    console.log('jsonStats');
    console.log(jsonStats);
    console.log("constraintsList");
    console.log(constraintsList);
    console.log("requireFeatures");
    console.log(requireFeatures);
    console.log("excludeFeatures");
    console.log(excludeFeatures);
    console.log('dropdownList');
    console.log(dropdownList);
    */
    
    return {
        'jsonStats' : jsonStats,
        'constraintsList' : constraintsList,
        'requireFeatures' : requireFeatures,
        "excludeFeatures" : excludeFeatures,
        "dropdownList" : dropdownList
    };
}

/**
 * Genera la lista desplegable a partir del listado de restricciones.
*/
export const fillDropdownList = (constraintsList) => {
    //console.log('constrainsList en fillDropDownlist');
    //console.log(constraintsList);

    var arrayToTree = require('array-to-tree');

    dropdownList = arrayToTree(constraintsList, {
        parentProperty: 'parent',
        customID: 'id'
    });
    return dropdownList;
}

/**
 * Se construyen las restricciones basica (Optional, Mandatory, etc)
 * Se instancia la construccion de los require y exclude
 * @param instances
 */
export const fillConstraints = (instances) => {
    for ( let i = 0; i < instances.length; i++ ) {
        constraintsList.push(
            {
                id: instances[i][0],
                label: instances[i][0],
                atributo: instances[i][1],
                parent: instances[i][2],
                //isDisabled: instances[i][2] == "Mandatory" ? true : false
            }
        );
    
        if (instances[i][3].length !== 0) {
            fillRequireOrExclude(instances[i][3], instances[i][0]);
        }
    }
    //console.log('restricciones');
    //console.log(constraintsList);
}

/**
 * Se inicializan y llenan los arreglos require y exclude
 * @param instances
 */
export const fillRequireOrExclude = (instances, origin) => {
    instances.forEach(instance => {
        if(instance[0] == 'Excludes'){
            fillExcludeList(instance, origin);
        }
        else{
            fillRequireList(instance, origin);
        }
    });
    //console.log('requireFeatures');
    //console.log(requireFeatures);
    //console.log('excludeFeatures');
    //console.log(excludeFeatures);
}

export const fillRequireList = (instance, origin) => {
    requireFeatures.push(
        {
            nodo: instance[0],
            origen: instance[1],
            destino: origin,
            //nodoAtributo: instance[2]
        }
    );
}

export const fillExcludeList = (instance, origin) => {
    excludeFeatures.push(
        {
            nodo: instance[0],
            origen: origin,
            destino: instance[1],
            //nodoAtributo: instance[2]
        }
    );
}

/**
 * Se obtienen de las instancias, los datos necesarios para construir una tabla
 * con las estadisticas del modelo de caracteristicas
 * @param instancias
 */
 export const fillStats = (instances) => {
    jsonStats = {
        cantidad: instances.length
    };

    instances.forEach(instance => {
        calculateStat(instance[1]);
    
        if (instance[3].length > 0) {
            instance[3].forEach(inst => {
                calculateStat(inst[0]);
            });
        }
    });
}

/**
 * Iniciar o sumar los valores de los nodos que corresponden
 * @param instance
 */
export const calculateStat = (instance) => {
    if (!jsonStats[instance]) {
        jsonStats[instance] = 1;
    } else {
        jsonStats[instance]++;
    }
}