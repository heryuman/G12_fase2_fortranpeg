import Node from './Node.js'

export class Produccion extends Node{
    constructor (a1, a2, a3){
        this.a1 = a1;
        this.a2 = a2;
        this.a3 = a3;

    }
    accept(visitor){
        return visitor.visitProduccion(this);
    }
}
export class Produccion extends Node{
    accept(visitor){}
}
export class Produccion extends Node{
    accept(visitor){}
}
export class Produccion extends Node{
    accept(visitor){}
}
export class Produccion extends Node{
    accept(visitor){}
}
