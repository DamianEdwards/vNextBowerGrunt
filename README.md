# Sample Bower/Grunt Integration with ASP.NET vNext
This project contains a demonstration of an approach for integration of Bower and Grunt into an ASP.NET vNext project.

## Prerequisites

- `nodejs` and `npm`
- `grunt-cli`
- `bower`

### bower.json
```JSON
{
  "name": "MyProject",
  "version": "0.0.0",
  "private": true,
    "dependencies": {
        "jquery": "~2.1.1",
        "bootstrap": "~3.2.0",
    },
    "exportsOverride": {
        "/bootstrap|jquery/": {
          "js": "dist/**/*.js",
          "css": "dist/**/*.css",
          "fonts": "**/*.{eot,svg,ttf,woff}"
        }
    }
}
```

The `bower.json` lists the client side dependencies you want to use in the application. The `exportsOverride` is required in this case because **boostrap** and **jquery** need some special copying rules. For more advanced usage, see https://github.com/yatskevich/grunt-bower-task#advanced-usage.

### package.json

```JSON
{
  "name": "MyProject",
  "version": "1.0.0",
  "devDependencies": {
    "grunt": "^0.4.5",
    "grunt-bower-task": "^0.4.0"
  }
}
```

This file declares the grunt dependency and the grunt task that copies bower packages.

### gruntfile.js

```Javascript
module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-bower-task");

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                }
            }
        }
    });

    grunt.registerTask("default", ["bower:install"]);
};
```

The default grunt task wires up the `grunt-bower-task` and sets up the default copy location to be `wwwroot`. This is where our static file server will run. We're copying 3rd party libraries (bower components) to the `wwwroot\lib` subfolder.

**NOTE: We're not comitting node_modules or bower_components, however, we do commit the files in the wwwroot.**


### project.json
```JSON
{
    "exclude": [
        "wwwroot",
        "node_modules",
        "bower_components"
    ],
    "pack-exclude": [
        "node_modules",
        "bower_components",
        "package.json",
        "gruntfile.js",
        "bower.json"
    ],
    "scripts": {
        "postrestore": [ "npm install" ],
        "prepare": [ "grunt" ]
    }
}
```

Among other things, this files declares the folders to exclude for packing and compilation. It also declares scripts that will execute after restoring the application and when packaging the application for deployment. The **postrestore** script will run after `kpm restore` completes, and **prepare** which will run after **postrestore** and before `kpm pack` packages the application. 

### How it works

To kick off the process, execute `kpm restore`. This will run `npm install` which will install the packages defined in packages.json. After this, the grunt task will execute the grunt file. The `grunt-bower-task` executes `bower install` which installs the bower packages into `bower_components` and copies those files into the `wwwroot` folder according to the settings in gruntfile.js and bower.json.

The workflow for adding packages to either bower.json/packages.json/project.json is as follows:

- Add a line to the appropriate file
- Run `kpm restore`
