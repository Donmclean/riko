//IMPORTANT: do not use <rootDir> in this config. use cwd to access relative paths
module.exports = (cwd) => {
    return {
        "verbose": true,
        "automock": false,
        "collectCoverage": false,
        "collectCoverageFrom": ["src/js/**/*.js", "src/js/**/*.jsx", "!**/vendor/**"],
        "coverageThreshold": {
            "global": {
                "branches": 0,
                "functions": 0,
                "lines": 0,
                "statements": 0
            }
        },
        "coverageDirectory": "test-coverage",
        "testRegex": "(src/*|\\.(test|spec))\\.(es6|js|jsx)$",
        "moduleFileExtensions": [
            "js",
            "jsx",
            "json"
        ],
        "moduleNameMapper": {
            "^.+\\.(css|less|sass|scss)$": `${cwd}/src/__tests__utils/styleMock.js`,
            "^.+\\.(jpe?g|png|gif|tif|svg|bmp|woff|woff2|eot|ttf|mp4|doc|docx|pdf|xls|xlsx|csv|txt)$": `${cwd}/src/__tests__utils/fileMock.js`
        },
        "coveragePathIgnorePatterns": [
            "/tests/",
            "/node_modules/",
            "/__tests__utils/"
        ],
        "testPathIgnorePatterns": [
            "/node_modules/",
            "/__tests__utils/"
        ]
    }
};