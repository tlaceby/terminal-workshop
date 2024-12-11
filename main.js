const input_el = document.getElementById("terminal-el");
const output_el = document.getElementById("output-el");
const handlers = {
    help: HelpHandler,
    set: SetHandler,
    echo: EchoHandler,
    clear: () => output_el.innerHTML = "",
    vardump: VarDumpHandler,
    varclear: VarClearHandler,
    "+": BinaryArithmeticHandler,
    "-": BinaryArithmeticHandler,
    "/": BinaryArithmeticHandler,
    "*": BinaryArithmeticHandler,
    "%": BinaryArithmeticHandler,
    "max": BinaryArithmeticHandler,
    "min": BinaryArithmeticHandler,
};

let state = {
    PI: Math.PI, 
    E: Math.E,
    res: 0.0, // Used for arithmetic calculations. Similar to ARM acc register
};

input_el.addEventListener("keyup", (ev) => {
    if (ev.key !== "Enter") return;
    const input = input_el.value;
    
    if (typeof input !== "string" || input.length === 0) {
        return CreateError("invalid command entered. please enter a valid command!");
    }

    CreateSuccess(input); // send input to output before clearing it
    input_el.value = ""; // clear input

    const args = input.trim().split(" ");
    const command = args[0];

    if (typeof handlers[command] !== "function") {
        return CreateError(`command not found: ${command}.`);
    }

    // Execute handler
    handlers[command](command, args.slice(1));
});



function VarClearHandler() { state = {}; }

function VarDumpHandler () {
    const message = Object.entries(state).map((v) => `${v[0]} -> ${v[1]}`).join("<br>>> ")
    CreateSuccess(message);
}

function HelpHandler () {
    const len = Object.entries(handlers).length;
    const message = `[${len}] available commands: ` + Object.keys(handlers).join(", ");
    CreateSuccess(message);
}

function EchoHandler (_, args = []) {
    if (args.length !== 1) {
        return CreateError(`echo command expects 1 argument. Received ${args.length} instead. ex: 'echo foo'`);
    }

    const varname = args[0];
    
    if (!IsAlphabetic(varname)) {
        return CreateError(`invalid identifier '${varname}'.`);
    }

    if (state[varname] === undefined) {
        return CreateError(`no variable with the name '${varname}' exists.`);
    }

    CreateSuccess(`${varname} = ${state[varname]}`);
}

function SetHandler(_, args = []) {
    if (args.length !== 2) {
        return CreateError(`set command expects 2 arguments. Only received ${args.length}. ex: 'set x 10'`);
    }

    const assignee = args[0];
    const value = args[1];

    if (!IsAlphabetic(assignee)) {
        return CreateError(`invalid variable name: '${assignee}'.`);
    }

    if (IsNumeric(value)) {
        state[assignee] = parseFloat(value);
        return CreateSuccess(`${assignee} : ${value}`);
    }

    // Check for rhs being an identifier ex: `set x y`
    if (IsAlphabetic(value)) {
        if (state[value] !== undefined) {
            state[assignee] = state[value]; // assumed that rhs is already numeric
            return CreateSuccess(`${assignee} : ${state[value]} (copied from ${value})`);
        }
        
        return CreateError(`variable '${value}' does not exist.`);
    }

    // If the value is neither numeric nor a valid identifier
    return CreateError(`invalid value: '${value}'. value must be numeric or an existing variable name.`);
}

function BinaryArithmeticHandler(cmd, args) {
    if (args.length !== 2) {
        return CreateError(`${cmd} command expects 2 arguments. Only received ${args.length}. ex: '${cmd} 10 20'`);
    }

    // assume only numeric arguments. Leave as instruction to follower to impliment identifier resolution
    if (!IsNumeric(args[0]) || !IsNumeric(1)) {
        return CreateError(`One or both arugments to ${cmd} is not numeric. arg1: ${args[0]} & arg2: ${args[1]}`);
    }

    const a = parseInt(args[0]);
    const b = parseInt(args[1]);

    switch (cmd) {
        case 'max':
            state.res = Math.max(a, b)
            break;
        case "min":
            state.res = Math.min(a, b);
            break;
        case "+":
            state.res = a + b;
            break;
        case "-":
            state.res = a - b;
            break;
        case "*":
            state.res = a * b;
            break;
        case "/":
            state.res = a / b;
            break;
        case "%":
            state.res = a % b;
            break;
        
        default:
            state.res = 0;
            return CreateError(`${cmd} unknown`);
    }

    CreateSuccess(`res : ${state.res}`);
}

function IsAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function IsNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}


function CreateError(message) {
    const p = document.createElement("p");
    p.innerHTML = `>> <span class="error">${new Date().toTimeString()}</span>${message}`;
    
    output_el.appendChild(p);
}

function CreateSuccess(message) {
    const p = document.createElement("p");
    p.innerHTML = `>> ${message}`;
    
    output_el.appendChild(p);
}

function IsAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function IsNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}