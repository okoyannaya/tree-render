const BASE_PADDING = "---";
function checkBracketsBalance(input) {
    let balance = 0;
    for (const char of input) {
        if (char === "(")
            balance++;
        if (char === ")")
            balance--;
        if (balance < 0)
            return false;
    }
    return balance === 0;
}
function parseNestedString(input) {
    input = input.trim();
    const result = [];
    if (!checkBracketsBalance(input)) {
        result.push("Пропущена скобка, проверте корректность ввода");
        return result;
    }
    if (input.startsWith("(") && input.endsWith(")")) {
        input = input.slice(1, -1).trim();
    }
    let current = "";
    let level = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === "(") {
            level++;
            if (level === 1) {
                if (current.trim()) {
                    const trimmed = current.trim();
                    result.push(isNaN(+trimmed) ? trimmed : +trimmed);
                }
                current = "";
                continue;
            }
        }
        if (char === ")") {
            level--;
            if (level === 0) {
                result.push(parseNestedString(current));
                current = "";
                continue;
            }
        }
        if (char === " " && level === 0) {
            if (current.trim()) {
                const trimmed = current.trim();
                result.push(isNaN(+trimmed) ? trimmed : +trimmed);
            }
            current = "";
            continue;
        }
        current += char;
    }
    if (current.trim()) {
        const trimmed = current.trim();
        result.push(isNaN(+trimmed) ? trimmed : +trimmed);
    }
    return result;
}
function drawTree(arr, level = 0, prefix = "", hasChildren = false, dashes, spaces = "") {
    let output = "";
    arr.forEach((item, index) => {
        var _a;
        const nextItem = arr[index + 1];
        const isArray = (arr) => {
            return Array.isArray(arr);
        };
        const nextIsArray = isArray(nextItem);
        const maxLength = isArray(item)
            ? Math.max(...item
                .filter((subItem) => !isArray(subItem))
                .map((subItem) => subItem.toString().length))
            : 1;
        const isMaxLength = maxLength > 1;
        const isLast = index === arr.length - 1;
        const itemStr = item.toString();
        const shouldAddPostfix = nextIsArray || (hasChildren && !isLast);
        const baseDashes = dashes && !isArray(item) && itemStr.length === 1 ? dashes : BASE_PADDING;
        const extraDashes = shouldAddPostfix ? `${baseDashes}+` : "";
        const line = `${prefix}${itemStr}${extraDashes}`;
        const generatePadding = (length) => {
            if (!length)
                return BASE_PADDING;
            let result = BASE_PADDING;
            Array.from({ length }).forEach(() => {
                result += "-";
            });
            return result;
        };
        const nextDashes = isMaxLength ? `${generatePadding(maxLength - 1)}` : "";
        const nextSpaces = isMaxLength
            ? (_a = nextDashes.replace(/-/g, " ")) === null || _a === void 0 ? void 0 : _a.slice(0, baseDashes.length - 1)
            : "";
        if (isArray(item)) {
            output += drawTree(item, level + 1, `${prefix}${isLast ? "    " : "|   "}${spaces}`, isLast, nextDashes, nextSpaces);
        }
        else {
            output += `${line}\n`;
        }
    });
    return output;
}
document.getElementById("drawButton").addEventListener("click", () => {
    const input = document.getElementById("treeInput")
        .value;
    const parsedTree = parseNestedString(input);
    const formattedTree = drawTree(parsedTree);
    document.getElementById("output").textContent = formattedTree;
});
