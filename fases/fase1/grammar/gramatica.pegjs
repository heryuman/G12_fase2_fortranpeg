{{
    
    // let identificadores = []

    // import { identificadores } from '../index.js'

    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'
    import * as n from '../visitor/CST.js';
}}

gramatica = _ prods:producciones+ _ {

    let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }


    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }
    return prods;
}

producciones = _ id:identificador _ alias:(literales)? _ "=" _ expr:opciones (_";")? { 
    ids.push(id) 
    return new n.Producciones(id, expr, alias);
}

opciones = expr:union rest:(_ "/" _ @union)* {
    return new n.Opciones([expr, ...rest]);
}

union = expr:expresion rest:(_ @expresion !(_ literales? _ "=") )* {
    return new n.Union([expr, ...rest]);
}

expresion = prefix:("@")? _ label:$(identificador _ ":")?_ operator:varios? _ expr:expresiones _ qty:$([?+*]/conteo)? {
    console.log("tipod e dato: "+typeof expr)
    
    return new n.Expresion(expr,prefix,label, operator, qty);
}

varios = ("!"/"&"/"$") 

expresiones  =  id:identificador { usos.push(id)
                    return new n.Identificador(id);
                }
                / val:$literales isCase:"i"?  {return new n.String(val.replace(/['"]/g, ''), isCase);}
                / "(" _ opciones _ ")"
                / chars:corchetes isCase:"i"? {
                    console.log("chars--->> ",chars.flat());
                    let arreglo = chars[0]
                    /*for (let i = 0; i < arreglo.length; i++) {
                        console.log("elemento:"+ arreglo[i]);
                        
                    }*/

                   //console.log(Array.isArray(variable1));

                   if( Array.isArray(arreglo)){
                    let cadena = arreglo.join("") 
                    console.log("cadena:"+cadena);
                    
                    let encontroSpace = false
                    if (cadena.includes("\\t")||cadena.includes("\\n")||cadena.includes("\\r")){

                        if(cadena.includes(" ")){
                            return new n.SpacesTabs(cadena);
                        }    
                        
                    }
                   }
                    

                    //console.log(encontroTab);
                    return new n.Corchete(chars.flat(), isCase)}
                / "."  {return new n.Punto();}
                / "!." {return new n.Fin();}

// conteo = "|" parteconteo _ (_ delimitador )? _ "|"

conteo = "|" _ (numero / id:identificador) _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "|"
        / "|" _ (numero / id:identificador)? _ "," _ opciones _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "," _ opciones _ "|"

// parteconteo = identificador
//             / [0-9]? _ ".." _ [0-9]?
// 			/ [0-9]

// delimitador =  "," _ expresion

// Regla principal que analiza corchetes con contenido
corchetes
    = "[" contenido:(@rango / @texto)+ "]" {
        //console.log("corchetes--->> ",contenido);
       console.log(`Entrada válida: ${contenido}`);
        //return `Entrada válida: [${input}]`;
      // return new n.Corchete(contenido);
     return contenido;
     
     //return contenido;
   }

// Regla para validar un rango como [A-Z]
rango
    = inicio:caracter "-" fin:caracter {
        if (inicio.charCodeAt(0) > fin.charCodeAt(0)) {
            throw new Error(`Rango inválido: [${inicio}-${fin}]`);

        }
        //return `${inicio}-${fin}`;
        return new n.Rango(inicio, fin);
    }

// Regla para caracteres individuales
caracter
    = [a-zA-Z0-9_ ] { return text()}

// Coincide con cualquier contenido que no incluya "]"
/*corchete
    = "[" contenido "]" */

texto
    = [^\[\]]+

literales = '"'  @stringDobleComilla* '"'
            / "'" @stringSimpleComilla* "'" 

stringDobleComilla = !('"' / "\\" / finLinea) .
                    / "\\" escape
                    / continuacionLinea

stringSimpleComilla = !("'" / "\\" / finLinea) .
                    / "\\" escape
                    / continuacionLinea

continuacionLinea = "\\" secuenciaFinLinea

finLinea = [\n\r\u2028\u2029] 

escape = "'"
        / '"'
        / "\\"
        / "b"
        / "f"
        / "n"
        / "r"
        / "t"
        / "v"
        / "u"

secuenciaFinLinea = "\r\n" / "\n" / "\r" / "\u2028" / "\u2029"

// literales = 
//     "\"" [^"]* "\""
//     / "'" [^']* "'"
    

numero = [0-9]+ {return new n.Numero()}

identificador = [_a-z]i[_a-z0-9]i* { return text() }


_ = (Comentarios /[ \t\n\r])*


Comentarios = 
    "//" [^\n]* 
    / "/*" (!"*/" .)* "*/"
