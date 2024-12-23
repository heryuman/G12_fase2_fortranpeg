import Visitor from './Visitor.js';

export default class Tokenizer extends Visitor {
    generateTokenizer(grammar) {
        return `
module tokenizer
implicit none

contains
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
end module tokenizer 
        `;
    }

    visitProducciones(node) {
        return node.expr.accept(this);
    }

    visitOpciones(node) {
        return node.exprs[0].accept(this);
    }
    visitUnion(node) {
        return node.exprs[0].accept(this);
    }
    visitExpresion(node) {
        return node.expr.accept(this);
    }
    visitString(node) {
        return `
    if ("${node.val}" == input(cursor:cursor + ${
            node.val.length - 1
        })) then !Foo
        allocate( character(len=${node.val.length}) :: lexeme)
        lexeme = input(cursor:cursor + ${node.val.length - 1})
        cursor = cursor + ${node.val.length}
        return
    end if
    `;
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