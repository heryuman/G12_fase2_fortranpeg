const nodes = {
    Producciones: ['id', 'expr', 'alias'],
    Opciones: ['exprs'],
    Union: ['exprs'],
    //Expresion: ['expr', 'label', 'qty'],
    Expresion: ['expr', 'prefix', 'label', 'operator', 'qty'],
    String: ['val', 'isCase'],
    Corchete: ['chars', 'isCase'],
    SpacesTabs:['value'],
    Rango: ['bottom', 'top'],

    // seguir
};

export default nodes;