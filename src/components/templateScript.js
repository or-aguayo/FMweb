export const templateScript = (projectName, rules) => {
    return `#!/bin/sh

#Prerequisitos:
#1) Instalar node
#2) Instalar npm
#3) Instalar git

#1. Instalación de Angular y Schematics de forma global.

npm install -g @angular/cli@v11-lts @angular-devkit/schematics-cli@v11-lts

#2. Descarga y preparación del repositorio "repositorioeshop-actualizado".

git clone https://gitlab.com/1jorge.echeverria/repositorioeshop-actualizado
cd repositorioeshop-actualizado
cd repositorio
npm install

#3. Compilación de repositorioeshop.

npm run build

#4. Creación y preparación de ProyectoNuevo.

cd ../..
ng new ${projectName} --routing --style=scss
cd ${projectName}

npm install @angular/cdk@v11-lts @angular/material@v11-lts @angular/flex-layout@9.0.0-beta.31

#5. Ejecución de Schematics en ProyectoNuevo.

schematics ../repositorioeshop-actualizado/repositorio/src/collection.json:ng-add --proyecto=${projectName} ${rules} --dry-run=false

#6. Corrección de tsconfig en ProyectoNuevo para evitar errores sintacticos que imposibilitan el despliegue.

rm tsconfig.json
git clone https://gitlab.com/1jorge.echeverria/repositorioeshop-actualizado/snippets/2367104.git
mv 2367104/tsconfig.json .
rm -Rf 2367104/

#7. Despliegue.

ng serve -o`
}