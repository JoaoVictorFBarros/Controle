export function restartmenu(oldname, newname){
    const restartelements = document.getElementsByClassName(oldname)

    Array.from(restartelements).forEach((element) => {
        element.classList.remove(oldname);
        element.classList.add(newname);
        Array.from(element.children).forEach((child) => {
            child.style.display = "none";
        });
    })  
}

export function opensubmenu(name, supername){

    restartmenu('activesidebaroption','sidebaroption')
    const elements = document.getElementsByClassName(name)

    Array.from(elements).forEach((element) => {        
        element.style.display = "block"
    })

    document.getElementById(supername).className = 'activesidebaroption'
}

export function opensubsubmenu(name, supername){
    const elements = document.getElementsByClassName(name)

    Array.from(elements).forEach((element) => {        
        element.style.display = "block"
    })

    document.getElementById(supername).classList.add('activesidebaroptionsubtitle')
}