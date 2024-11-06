function getIME() {
    return imeSelect.value;
}

function setIME(ime) {
    imeSelect.value = ime;
    changeIME();
}

function setFilename(filename) {
    document.getElementById('filename').innerHTML = filename;
    loadBtn.click();
}

function getFilename() {
    return document.getElementById('filename').innerHTML;
}

function setText(text) {
    editor.value = text;
}

function getText() {
    return editor.value;
}

function copyText() {}

function changeIME() {
    const name = getIME();
    fetch(`ime/${name}.json`)
    .then((response) => response.json())
    .then((ime) => {
        editor.setAttribute("class", ime.script);
        candidates.setAttribute("class", ime.script);
        switch(ime.type) {
            case "suffix":
                lookup.style.display = 'none';
                break;
            case "table":
                lookup.style.display = 'block';
                break;
            case null:
                lookup.style.display = 'none';
                break;
            default:
                alert(`Invalid IME type: ${ime.type}`);
        }
    });
    // loadIME(name).then(
    // (ime) => {
    //     console.log('Loaded IME: ' + JSON.stringify(ime));
    // });
}