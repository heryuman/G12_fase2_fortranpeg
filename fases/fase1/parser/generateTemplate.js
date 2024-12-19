export class Generator  {
    /**
     * @param {string} message
     */
    constructor() {
        
    }


    generateplantilla(){

        const contenido =    `
            module parser
            implicit none
            ...

            contains
            ...

            function nextsym(input) result(token)
                character(len=*), intent(inout) :: input
                character(len=100), intent(out) :: token

            ...
            end function nextsym
            ...

            end module parser
        `;

        const blob = new Blob([contenido], {type: "text/plain"});
        const archivo = new File ([blob], "parser.f90", {type:"text/plain"});

        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = archivo.name;
        enlace.click();

    }
}