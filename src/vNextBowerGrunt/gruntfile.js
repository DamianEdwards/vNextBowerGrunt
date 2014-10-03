module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-bower-task");

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir: true
                }
            }
        }
    });

    grunt.registerTask("default", ["bower:install"]);
};