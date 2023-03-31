export default function createEffects() {
    // get the effects div element
    const effects = document.getElementById('effects');


    const select = document.createElement('select');
    select.id = 'selectPreset';


    const create = document.createElement('option');
    create.value = 'create';
    create.textContent = 'Create preset';
    select.appendChild(create);


    const preset1 = document.createElement('option');
    preset1.value = 'preset1';
    preset1.textContent = 'Preset 1';
    select.appendChild(preset1);


    const preset2 = document.createElement('option');
    preset2.value = 'preset2';
    preset2.textContent = 'Preset 2';
    select.appendChild(preset2);


    const research = document.getElementById('research');   


    const search = document.createElement('input');
    search.type = 'text';
    search.id = 'search';
    search.name = 'search';
    search.placeholder = 'Search';

    const searchButton = document.createElement('button');
    searchButton.id = 'buttonSearchWithBufferLoader';
    searchButton.textContent = 'Search (buffer loader)';

    research.appendChild(search);
    research.appendChild(searchButton);


    effects.appendChild(select);
    effects.appendChild(research);

}