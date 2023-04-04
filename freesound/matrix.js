export default function createPadMaxtrix() {
    // get the matrix div element
    const matrix = document.getElementById("matrix");

    // create a 4x4 matrix of buttons with progress bars
    for (let i = 3; i >= 0; i--) {
        for (let j = 0; j < 4; j++) {
            const button = document.createElement("button");

            //button.textContent = `${i},${j}`;
            switch (i*4+j) {
                case 0:
                    button.textContent = "W";
                    break;
                case 1:
                    button.textContent = "X";
                    break;
                case 2:
                    button.textContent = "C";
                    break;
                case 3:
                    button.textContent = "V";
                    break;
                case 4:
                    button.textContent = "Q";
                    break;
                case 5:
                    button.textContent = "S";
                    break;
                case 6:
                    button.textContent = "D";
                    break;
                case 7:
                    button.textContent = "F";
                    break;
                case 8:
                    button.textContent = "A";
                    break;
                case 9:
                    button.textContent = "Z";
                    break;
                case 10:
                    button.textContent = "E";
                    break;
                case 11:
                    button.textContent = "R";
                    break;
                case 12:
                    button.textContent = "1";
                    break;
                case 13:
                    button.textContent = "2";
                    break;
                case 14:
                    button.textContent = "3";
                    break;
                case 15:
                    button.textContent = "4";
                    break;
            }

            button.classList.add("padbutton");
            button.id = `pad${(i*4)+j}`;

            button.addEventListener('click', () => {
            
                button.classList.add('active');
                setTimeout(() => {
                    button.classList.remove('active');
                }, 100);
                
            });

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
