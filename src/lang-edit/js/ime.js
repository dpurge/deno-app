// #region: Common utility functions

function sortIme(a,b) {
	return b[0].length - a[0].length
}

function compileImeSuffix(data) {
    data.sort((a, b) => a[0].length - b[0].length)
    const result = new Array()
    for (i in data) {
        let key = data[i][0]
        const value = data[i][1]
        for (j in result) {
            if (key.startsWith(result[j][0])) {
                key = result[j][1] + key.substring(result[j][0].length)
            }
        }
        result.push([key, value])
    }
    return result.sort((a, b) => b[0].length - a[0].length)
}

function compileImeTable(data) { 
    const result = data.reduce((res, item) => (item[0] in res ? res[item[0]].push(item[1]):res[item[0]]=[item[1],], res), {})
    return result
}

// #endregion

// #region: Suffix IME

function newStateSuffix() {
    return {shift:false, alt:false, ctrl:false}
}

function onKeyDownSuffix(event) {
	const key = event.key
	switch(key) {
        case 'Shift':
            this.state.shift = true
            break
        case 'Alt':
            this.state.alt = true
            break
        case 'Control':
            this.state.ctrl = true
            break
        case 'Tab':
            prefix = this.value.substring(0, this.selectionStart)
	        suffix = this.value.substring(this.selectionEnd,this.value.length)

            this.value = prefix + "\t" + suffix

            this.selectionStart = this.selectionEnd = this.value.length - suffix.length
            event.preventDefault()
            break
	}
}

function onKeyUpSuffix(event) {
	const key = event.key
	switch(key) {
        case 'Shift':
            this.state.shift = false
            break
        case 'Alt':
            this.state.alt = false
            break
        case 'Control':
            this.state.ctrl = false
            break
	}
}

function onKeyPressSuffix(event) {
	if (this.ime == null) return
	if (event.key == "Enter") return
	
	event.preventDefault()
	var key = event.key
	
	prefix = this.value.substring(0, this.selectionStart)
	suffix = this.value.substring(this.selectionEnd,this.value.length)

    for (let i of this.ime) { 
        if (!i[0].endsWith(key)) continue
        const context = i[0].slice(0, -1)
        if (!prefix.endsWith(context)) continue
        
        prefix = prefix.substring(0, prefix.length - context.length)
        key = i[1]
    }

	this.value = prefix + key + suffix
	this.selectionStart = this.selectionEnd = this.value.length - suffix.length
}

// #endregion

// #region: Table IME

function newStateTable() {
    return {input:"", candidates:[]}
}

function onKeyDownTable(event) {
	const key = event.key

	switch(key) {
        case 'Tab':
            event.preventDefault()
            prefix = this.value.substring(0, this.selectionStart)
	        suffix = this.value.substring(this.selectionEnd,this.value.length)
            this.value = prefix + "\t" + suffix
            this.selectionStart = this.selectionEnd = this.value.length - suffix.length
            break
        case 'Escape':
            this.state.input = ""
            break
        case 'PageUp':
            // text = "[PageUp]"
            break
        case 'PageDown':
            // text = "[PageDown]"
            break
        // case 'Enter':
        //     // text = "[Enter]\n"
        //     break
	}
}

function onKeyUpTable(event) {
	const key = event.key
}

function onKeyPressTable(event) {
	if (this.ime == null) return
	if (this.state.input == "" && (event.key == "Enter" || event.key == " ")) return
	
	event.preventDefault()
	var key = event.key
	
	prefix = this.value.substring(0, this.selectionStart)
	suffix = this.value.substring(this.selectionEnd,this.value.length)
    text = undefined
    
    switch (key) {
        case " ":
            text = this.state.input
            this.state.input = ""
            break
        default:
            this.state.input += key
    }
    // console.log(this.state.input)

    if (text) {
	    this.value = prefix + text + suffix
	    this.selectionStart = this.selectionEnd = this.value.length - suffix.length
    }
}

// #endregion