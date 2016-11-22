module.exports = function(grunt) {

grunt.initConfig({

browserify: {
    js: {
        src: ['../js/main.js'],
        dest: '../dist/app.js'
    },
    options: {
        transform: ['hbsfy'],
        browserifyOptions: {
            paths: [
                "./node_modules"
            ]
        }
    }
},

jshint: {
    files: ['../js/**/*.js'],
    options: {
        predef: ["document", "console", "$", "require", "index", "createCards", "cardTemplate", "getMovies"],
        esnext: true,
        browser: true,
        globalstrict: true,
        globals: {
            "cardTemplate": true
        },
        browserify: true
    }
},

copy: {
    bootstrap: {
        expand: true,
        cwd: 'node_modules/bootstrap/dist',
        src: ['**'],
        dest: '../dist'
    },
    jquery: {
        expand: true,
        cwd: 'node_modules/jquery/dist',
        src: ['jquery.min.js'],
        dest: '../dist'
    }
},

sass: {
    dist: {
        files: {
            '../css/main.css': '../scss/main.scss'
        }
    }
},

watch: {
    src: {
        files: ['../js/**/*.js'],
        tasks: ['jshint', 'browserify']
    },
    sass: {
        files: ['../scss/**/*.scss'],
        tasks: ['sass']
    },
    hbs: {
        files: ['../templates**/*.hbs'],
        tasks: ['browserify']
    }
}

});

require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

grunt.registerTask('default', ['jshint', 'copy', 'sass', 'browserify', 'watch']);
};
