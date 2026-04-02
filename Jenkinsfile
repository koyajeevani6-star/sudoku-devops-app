pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/koyajeevani6-star/sudoku-devops-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t sudoku-devops-app .'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker rm -f sudoku-container || exit 0'
                bat 'docker run -d -p 5000:5000 --name sudoku-container sudoku-devops-app'
            }
        }
    }
}