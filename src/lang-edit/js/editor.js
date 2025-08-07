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
        // document.documentElement.setAttribute('lang', ime.lang.html);
        editor.lang = ime.lang.html;
        switch(ime.type) {
            case "suffix":
                tools.style.display = 'none';
                workspace.style.width = '100%';
                editor.ime = compileImeSuffix(ime.data);
                editor.state = newStateSuffix();
	            editor.onkeydown = onKeyDownSuffix;
                editor.onkeypress = onKeyPressSuffix;
	            editor.onkeyup = onKeyUpSuffix;
                break;
            case "table":
                workspace.style.width = '80%';
                tools.style.display = 'block';
                editor.ime = compileImeTable(ime.data);
                editor.state = newStateTable();
	            editor.onkeydown = onKeyDownTable;
                editor.onkeypress = onKeyPressTable;
	            editor.onkeyup = onKeyUpTable;
                break;
            case null:
                tools.style.display = 'none';
                workspace.style.width = '100%';
                editor.ime = null;
	            editor.onkeydown = null;
                editor.onkeypress = null;
	            editor.onkeyup = null;
                break;
            default:
                alert(`Invalid IME type: ${ime.type}`);
        }

        // console.log('Loaded IME: ' + JSON.stringify(ime));
        console.log('Loaded IME: ', ime.name);
    });
}

function onLoad() {
    editor.focus();
}