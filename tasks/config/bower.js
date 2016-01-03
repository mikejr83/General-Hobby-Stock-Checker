/**
 * Install bower components.
 *
 * ---------------------------------------------------------------
 *
 * Installs bower components and copies the required files into the assets folder structure.
 *
 */



module.exports = function (grunt) {
  var path = require('path'),
      targetDir = '.tmp/public';

  grunt.config.set('bower', {
    install: {
      options: {
        targetDir: targetDir,
        layout: function (type, component, source) {
          var renamedType = type,
              destPath = '';
          if (type == 'js') renamedType = 'js/dependencies';
          else if (type == 'css') renamedType = 'styles';

          destPath = path.join(renamedType, component);

          console.log('destPath', destPath)

          return destPath;
        },
        install: true,
        cleanTargetDir: false,
        cleanBowerDir: false
          //verbose: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
};
