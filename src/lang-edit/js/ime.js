function onKeyDown(event) {
	const key = event.key;
	switch(key) {
        case 'Shift':
            this.state.shift = true;
            break;
        case 'Alt':
            this.state.alt = true;
            break;
        case 'Control':
            this.state.ctrl = true;
            break;
	}
}

function onKeyUp(event) {
	const key = event.key;
	switch(key) {
        case 'Shift':
            this.state.shift = false;
            break;
        case 'Alt':
            this.state.alt = false;
            break;
        case 'Control':
            this.state.ctrl = false;
            break;
	}
}

function sortIme(a,b) {
	return b[0].length - a[0].length;
}

function compileImeSuffix(data) {
    return data;
}

function onKeyPressSuffix(event) {
	if (this.ime == null) return;
	if (event.key == "Enter") return;
	
	event.preventDefault();
	var key = event.key;
	
	var startPos = this.selectionStart;
    var endPos = this.selectionEnd;
		
	prefix = this.value.substring(0, startPos);
	suffix = this.value.substring(endPos,this.value.length);

    for (let i of this.ime) { 
        if (!i[0].endsWith(key)) continue;
        const context = i[0].slice(0, -1);
        if (!prefix.endsWith(context)) continue;
        
        prefix = prefix.substring(0, prefix.length - context.length);
        key = i[1];
    }

	this.value = prefix + key + suffix;
	this.selectionStart = this.value.length - suffix.length;
	this.selectionEnd = this.selectionStart;
}

function onKeyPressTable(event) {}