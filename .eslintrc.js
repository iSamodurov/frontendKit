module.exports = {
    "extends": "google",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "class-property"
    ],
    "rules": {
        "indent": [2, "tab"],
        "no-tabs": 0,
        "object-curly-spacing": ["error", "always"],
        "require-jsdoc": 0,
        "no-invalid-this": 0,
    }
};