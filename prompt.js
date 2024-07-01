let historial = []

function calculateMaterial() {
    let ancho = parseFloat(document.getElementById("width").value);
    let alto = parseFloat(document.getElementById("height").value);
    let opcion = document.getElementById("option").value.toLowerCase();

    if (isNaN(ancho) || isNaN(alto) || (opcion !== 'pintura' && opcion !== 'empapelado')) {
        alert("Debes completar los datos requeridos")
        return;
    }

    let colorSeleccionado = document.getElementById("picker").value;
    console.log(colorSeleccionado);
    colorSeleccionado = colorSeleccionado.replace("#", "");
    console.log(colorSeleccionado);

    let materialsList = [];
    let calculateNeededMaterial = function (area, material) {
        let neededMaterial = Math.ceil(area / material.coverage);
        materialsList.push(neededMaterial);
        return neededMaterial;
    };

    //Calcular el total de material por area. Suponiendo que un litro de pintura cubre 10 metros cuadrados y un rollo de empapelado cubre 5 metros cuadrados
    let area = ancho * alto;

    let materials = {
        pintura: {
            coverage: 10,
            unit: "litros"
        },
        empapelado: {
            coverage: 5,
            unit: "rollos"
        }
    };

    let materialNeeded;
    if (opcion === 'pintura') {
        materialNeeded = calculateNeededMaterial(area, materials.pintura);
    } else if (opcion === 'empapelado') {
        materialNeeded = calculateNeededMaterial(area, materials.empapelado);
    }
    
    fetch("https://www.thecolorapi.com/id?hex="+ colorSeleccionado)
    .then(response => response.json())
    .then(data => {
        img = document.createElement("img")
        img.setAttribute("src", data.image.named)
        img.setAttribute("style", "height: 200px")
        img.setAttribute("class", "image")

        let container = document.getElementById("image-container")
        let resultElement = document.createElement("p");
        resultElement.textContent = "Para tu proyecto vas a necesitar " + materialNeeded + " " 
                                    + materials[opcion].unit + " de " + opcion + " de esta paleta.";
        container.appendChild(resultElement, container.firstChild);
        container.appendChild(img)
        
        console.log(data.image.named)
    }
    )
    .catch(error => 
        console.error(error)
    );

    fetch("https://www.thecolorapi.com/scheme?hex="+ colorSeleccionado +"&mode=analogic-complement&format=json")
    .then(response => response.json())
    .then(data => {
        let img = document.createElement("img")
        img.setAttribute("src", data.image.named)
        let container = document.getElementById("image-container")
        container.appendChild(img)
        
        console.log(data.image.named)
    }
    )
    .catch(error => 
        console.error(error)
    );
    
    historial.push(area);
    
    console.log(historial);

    Swal.fire("Resultado", "Para tu proyecto vas a necesitar " + materialNeeded + " " + materials[opcion].unit + " de " + opcion + ".", "success");
}

function historialActualizador(){
    if(document.getElementById('ascendente').checked){
        let container = document.getElementById("historial-container");
        container.innerHTML = '';
        historial = historial.sort();
        historial.forEach(element => {
            let elemento = document.createElement("p");
            elemento.textContent = element;
            container.appendChild(elemento)
        });
        console.log('asc')
        console.log(historial)
    } else {
        let container = document.getElementById("historial-container");
        container.innerHTML = '';
        historial = historial.reverse();
        historial.forEach(element => {
            let elemento = document.createElement("p");
            elemento.textContent = element;
            container.appendChild(elemento)
        });
        console.log('des')
        console.log(historial)
    }
}