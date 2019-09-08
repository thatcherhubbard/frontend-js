const sonarqubeScanner = require('sonarqube-scanner');
     sonarqubeScanner({
       serverUrl: 'http://localhost:9000',
       options : {
       'sonar.sources': '.',
       'sonar.exclusions':'tests/*, node_modules/*',
       'sonar.inclusions' : '*.js' // Entry point of your code
       }
     }, () => {});