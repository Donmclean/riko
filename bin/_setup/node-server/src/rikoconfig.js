//**********************************************************************
//******************************CUSTOM**********************************
//**********************************************************************
const config = {
    entryFile: 'src/app.js',

    nodemonJson: 'nodemon.json',

    //Specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
    //Path must be relative to package.json.
    customBoilerplatePath: 'src/riko-custom-boilerplates'
};

module.exports = () => config;