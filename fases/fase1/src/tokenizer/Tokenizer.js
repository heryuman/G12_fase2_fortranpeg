import Visitor from '../visitor/Visitor.js';
import { Rango } from '../visitor/CST.js';
// tokenizer
export default class Tokenizer extends Visitor {
    generateTokenizer(grammar) {
        return `
module parser
implicit none

contains

subroutine parse(input)
    character(len=*), intent(in) :: input
    character(len=20) :: lexeme
    integer :: cursor

    cursor = 1
    lexeme = " "

    do while (lexeme /= "EOF" .and. lexeme /= "ERROR")
        lexeme = nextSym(input, cursor)
        print *, "Lexeme: ", lexeme
    end do
end subroutine parse

function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme
    integer :: i

    if (cursor > len(input)) then
        allocate( character(len=3) :: lexeme )
        lexeme = "EOF"
        return
    end if

    ${grammar.map((produccion) => produccion.accept(this)).join('\n')}

    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
end function nextSym
end module parser 
        `;
    }

    visitProducciones(node) {
        return node.expr.accept(this);
    }
    visitOpciones(node) {
        return node.exprs
            .map((expr) => expr.accept(this))
            .filter((str) => str)
            .join('\n');
    }
    visitUnion(node) {
        return node.exprs
            .map((expr) => expr.accept(this))
            .filter((str) => str)
            .join('\n');
    }
    visitExpresion(node) {
        return node.expr.accept(this);
    }
    visitString(node) {
        return `
    if ("${node.val}" == input(cursor:cursor + ${node.val.length - 1})) then
        allocate( character(len=${node.val.length}) :: lexeme)
        lexeme = input(cursor:cursor + ${node.val.length - 1})
        cursor = cursor + ${node.val.length}
        return
    end if
    `;
    }
    visitCorchete(node) {

        let salida= `
        i = cursor
        ${generateCaracteres(node.chars.filter((node) => typeof node === 'string'))}`;

        console.log("salida parte1 ",salida);
        salida+= `
        ${node.chars
            .filter((node) => node instanceof Rango)
            .map((range) => range.accept(this))
            .join('\n')}
            `;
        console.log("salida parte2 ",salida);
        return salida;
    }
    visitRango(node) {
        return `
    if (input(i:i) >= "${node.bottom}" .and. input(i:i) <= "${node.top}") then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
        `;
    }
    visitIdentificador(node) {
        return '';
    }
    visitPunto(node) {
        return '';
    }
    visitFin(node) {
        return '';
    }

    visitSpacesTabs(node){
        return `
        ! whitespace ${node.value}
        else if (input(i:i) == ' ' .or. input(i:i) <= char(9) .or. input(i:i) == char(10)) then
            if (is_int) then
                input = input(i:)
                lexval = lexval // ' - integer'
                return
            else if (is_str) then
                input = input(i:)
                lexval = lexval // ' - string'
                return
            else if (is_space) then
                input = input(i:)
                lexval = lexval // ' - whitespace'
                return
            end if
            is_space = .true.
            if (input(i:i) == ' ') lexval = lexval // '_'
            if (input(i:i) == char(9)) lexval = lexval // '\t'
            if (input(i:i) == char(10)) lexval = lexval // '\n'
    
        `;
    }
}

export function generateCaracteres(chars) {
    console.log(chars,'GENERATE CARACTERES');
    if (chars.length === 0) return '';
    let cosas= `
    if (findloc([${chars
        .map((char) => `"${char}"`)
        .join(', ')}], input(i:i), 1) > 0) then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
    `;

    console.log(cosas);
    return cosas;
}