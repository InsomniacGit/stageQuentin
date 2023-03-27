export default function createPadMaxtrix() {
    // get the matrix div element
    const matrix = document.getElementById("matrix");

    // create a 4x4 matrix of buttons with progress bars
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const button = document.createElement("button");
            button.textContent = `${i},${j}`;
            button.classList.add("padbutton");
            button.id = `pad${(i*4)+j}`;

            const progress = document.createElement("progress");
            progress.max = "10";
            progress.value = "0";
            progress.id = `progress${(i*4)+j}`;
            progress.classList.add("padprogress");

            const buttonTrim = document.createElement("button");
            buttonTrim.textContent = "Trim";
            buttonTrim.classList.add("padactionbutton");
            buttonTrim.id = `trim${(i*4)+j}`;
            
            const buttonEdit = document.createElement("button");
            buttonEdit.textContent = "Edit";
            buttonEdit.classList.add("padactionbutton");
            buttonEdit.id = `edit${(i*4)+j}`;

            const buttonMap = document.createElement("button");
            buttonMap.textContent = "Map";
            buttonMap.classList.add("padactionbutton");
            buttonMap.id = `map${(i*4)+j}`;

            const cell = document.createElement("div");
            cell.appendChild(button);
            cell.appendChild(progress);
            cell.appendChild(buttonTrim);
            cell.appendChild(buttonEdit);
            cell.appendChild(buttonMap);

            matrix.appendChild(cell);
        }
    }
}
