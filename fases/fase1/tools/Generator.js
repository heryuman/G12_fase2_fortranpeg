// Generar clases para AST
// Este archivo genera las clases necesarias para implementar el patrón visitante con Typescript

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import nodes from './Nodes.js';

const __dirname = import.meta.dirname;
const classesDestination = '../visitor/AST.js';
const visitorDestination = '../visitor/Visitor.js';

let codeString = `
// Auto-generated
import Node from './Node.js';

export default class Visitor {

`;
for (const node of Object.keys(nodes)) {
    codeString += `\tvisit${node}(node) {}\n`;
}
codeString += `}`;

writeFileSync(path.join(__dirname, visitorDestination), codeString);
console.log('Generated visitor Interface');

codeString = `
// Auto-generated
import Node from './Node.js';
`;
for (const [name, args] of Object.entries(nodes)) {
    codeString += `
export class ${name} extends Node {
    constructor(${args.join(', ')}) {
        ${args.map((arg) => `this.${arg} = ${arg};`).join('\n\t\t')}
    }

    accept(visitor){
        return visitor.visit${name}(this);
    }
}
    `;
    console.log(`Generating ${name} node`);
}

writeFileSync(path.join(__dirname, classesDestination), codeString);
console.log('Done!');