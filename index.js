const input_el = document.getElementById("prompt");
const output_el = document.getElementById("output");

input_el.addEventListener("keypress", handleKeypress);

let state = {
    PI: Math.PI,
    foo: 10.5,
};

let user = "eest";

function handleKeypress (event) {
    const text = input_el.value;
    
    if (event.key !== "Enter" || text.length === 0) return; 
    // quit if they did not submit a command
    
    message(user + "#~: " + text, "white");
    input_el.value = "";

    const args = text.trim().split(" ");
    const command = args.shift();

    switch (command) {
        case "echo":
            return message(args.join(" "));
        case "clear":
            return output_el.innerHTML = "";
        case "alert":
            return alert(args.join(" "));
        case "triangle":
            return handleTriangle(command, args);
        case "rename":
            return handleRename(command, args);
        case "color":
            return handleColor(command, args);
        
        case "set":
            return handleSet(command, args);
        case "vardump":
            return handleVardump(command, args);

        case "+":
        case "add":
        case "-":
        case "sub":
        case "/":
        case "div":
        case "*":
        case "mul":
        case "max":
            return handleBinary(command, args); 
        default:
            message(`${command}: command not found!`, "red");
            break;
    }
}

function handleSet(_, args) {
    if (args.length !== 2) {
        return message(`set expects 2 arguments. Recieved only ${args.length}`, "orange");
    }

    const assigne = args[0];
    const rhs = args[1];

    if (!IsAlphabetic(assigne)) {
        return message(`set expects first argument to be a valid identifier`, "orange");
    }

    if(!IsNumeric(rhs)) {
        return message(`set expects second argument to be a valid number`, "orange");
    }

    let rhs_val = parseFloat(rhs);
    // If the value does not exist, create it and return.

    state[assigne] = rhs_val;
    return message(`${assigne} = ${rhs_val}`);
}

function IsAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function IsNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

function handleVardump(_, args) {
    if (args.length > 1) {
        return message(`vardump expects 0 or 1 argument. However ${args.length} were provided instead.`, "orange");
    }

    // Display all variables in state
    if (args.length === 0) {
        let output_str = Object.entries(state).map(v => ` ${v[0]} -> ${v[1]}`).join("</br>");
        return message(output_str, "#ccc");
    }

    const varname = args[0];
    if (!IsAlphabetic(varname)) {
        return message("vardump $0 expected to be a identifier.", "orange");
    }

    if (typeof state[varname] !== "number") {
        return message(`Variable ${varname} does not exist.`, "orange");
    }

    message(`${varname} -> ${state[varname]}`, "#ccc");
}

function handleBinary(command, args) {
    if (args.length !== 2) {
        return message(`Binary ${command}: expects two arguments. Recieved ${args.length} instead.`, "orange")
    }

    const first = parseFloat(args[0]);
    const second = parseFloat(args[1]);

    let result = 0; // tmp variable to hold result output

    switch (command) {
        case "+":
        case "add":
            result = first + second;
            break;
        case "-":
        case "sub":
            result = first - second;
            break;
        case "/":
        case "div":
            result = first / second; // Check for division by zero?
            break;
        case "*":
        case "mul":
            result = first * second;
            break;
        case "max":
            result = Math.max(first, second);
            break;
        default:
            return message(`Unknown binary operation ${command}`);
    }

    message(`Result: ${result}`, "cyan");
} 

// Print a half triangle of size n.
function handleTriangle(_, args) {
    if (args.length !== 1) {
        return message("Please provide a triangle size.", "orange");
    }

    for (let i = 1; i < parseInt(args[0]) + 1; i++) {
        let row = "";

        for (let j = 0; j < i; j++) {
            row += "*";
        }

        message(row);
    }

}

function handleRename(_, args) {
    if (args.length !== 1) {
        return message("Rename expects a name.", "orange");
    }

    const new_name = args[0];
    const old_name = user;
    user = new_name;

    message(`Renamed ${old_name} to ${new_name}`);
}

// Changes the background color of the body
function handleColor(_, args) {
    if (args.length !== 1) {
        return message("Color expects a color for the first argument.", "orange");
    }

    document.body.style.backgroundColor = args[0];
    message(`Background changed to ${args[0]}`);
}

function message (text, color = "green") {
    const p_el = document.createElement("p");

    p_el.innerHTML = text;
    p_el.style.color = color;

    output_el.appendChild(p_el);
    output_el.scrollTo({
        top: output_el.scrollHeight
    });

    console.log(output_el.children)
}