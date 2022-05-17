import Vue from "./Vue.js";
let f_epsilon = 0.00001;
// Borrowed and slightly modified from https://github.com/jashkenas/underscore/blob/master/underscore.js
let eq = function (a, b, aStack, bStack) {
    // Added check for floating point comparisons
    if (typeof (a) === 'number' && typeof (b) === 'number')
        return Math.abs(a - b) < f_epsilon;
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b)
        return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null)
        return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a)
        return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object')
        return false;
    return deepEq(a, b, aStack, bStack);
};
// Internal recursive comparison function for `isEqual`.
let deepEq = function (a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b))
        return false;
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return '' + a === '' + b;
        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a)
                return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            //return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            return Math.abs(a - b) < f_epsilon;
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
    }
    var areArrays = className === '[object Array]';
    if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object')
            return false;
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(typeof aCtor === "function" && aCtor instanceof aCtor &&
            typeof bCtor === "function" && bCtor instanceof bCtor)
            && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a)
            return bStack[length] === b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length)
            return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack))
                return false;
        }
    }
    else {
        // Deep compare objects.
        var keys = Object.keys(a), key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (Object.keys(b).length !== length)
            return false;
        while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(key in b && eq(a[key], b[key], aStack, bStack)))
                return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
};
// Perform a deep comparison to check if two objects are equal.
let isEqual = function (a, b) {
    return eq(a, b, [], []);
};
function failWithMessage(msg) {
    throw {
        status: "Failed",
        reason: (msg || "") +
            "\n" +
            (new Error().stack || "").toString().replace(/@.*\/(.*\.js)/g, "@$1")
    };
}
function assertTrue(predicate) {
    if (!predicate()) {
        failWithMessage(predicate.toString() + " is not true");
    }
}
function assertEqual(a, b) {
    if (!isEqual(a, b)) {
        failWithMessage(a.toString() + " !== " + b.toString());
    }
}
function expectError(f) {
    try {
        f();
        failWithMessage(f.toString() + " should have failed");
    }
    catch (e) { }
}
class TestSuite {
    constructor(ctx, rootNode) {
        this.ctx = ctx;
        this.rootNode = rootNode;
        this.tests = [];
        this.setup = () => { };
        this.cleanup = () => { };
        this.deps = null;
        this.vueApp = new Vue({
            data: () => {
                return {
                    run: () => this.runSuite(),
                    run_test: (t) => this.runTest(t),
                    expand_results: (b) => this.expandAllResults(b),
                    tests: this.tests,
                    show_all_tests: () => this.tests.map((t) => t.visible = true)
                };
            },
            el: rootNode
        });
    }
    registerDeps(deps) {
        this.deps = deps;
    }
    unitTest(name, t, visible = true) {
        this.tests.push(this.mapTest(name, visible, t));
    }
    integrationTest(name, ref, t, visible = true) {
        this.tests.push(this.mapTest(name, visible, () => {
            if (this.deps === null) {
                return { status: "Failed", reason: "No dependancies registered" };
            }
            t(this.deps);
            throw {
                status: "Manual Verification Needed",
                img: this.ctx.toDataURL(),
                ref_img: ref
            };
        }));
    }
    runSuite() {
        this.tests.map((t) => {
            if (this.deps)
                this.setup(this.deps);
            t.lastResult = this.runTest(t.test);
            if (this.deps)
                this.cleanup(this.deps);
        });
        console.log(this.tests);
    }
    runTest(t) {
        try {
            if (this.deps === null) {
                return { status: "Failed", reason: "No dependancies registered" };
            }
            t(this.deps); // ran without error
            return { status: "Passed" };
        }
        catch (result) {
            if (result.status) {
                return result;
            }
            else if (result instanceof Error) {
                return { status: "Failed", reason: result.message };
            }
        }
        return { status: "Unknown" };
    }
    mapTest(name, visible, t) {
        return {
            lastResult: {
                status: "Unknown"
            },
            visible,
            name,
            test: t
        };
    }
    expandAllResults(open_state) {
        document.querySelectorAll("details").forEach((obj) => obj.open = open_state);
    }
}
export { TestSuite as Tests, assertTrue as isTrue, assertEqual as isEqual, expectError as shouldFail, };
//# sourceMappingURL=Suite.js.map