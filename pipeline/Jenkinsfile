pipeline
        {
//            agent { dockerfile true }
            agent none
            environment {
                CI = 'true'
            }
            stages {

                stage('Build & Test') {
                    agent { dockerfile true }
                    steps {
                        sh 'npm install'
                        sh '/pipeline/scripts/run-tests.sh'
                    }
//                    steps {
//
//                    }
                }
//                stage('Test') {
//
//                }

                stage('Deploy') {
                    agent {
                        docker {
                            image 'node:6.14.2-alpine'
//                            label 'umma-service-identity'
                            args '-p 8081:8000'
                        }
                    }
//                    agent {
//                        docker {
//                            image 'node/6.14.2-alpine'
//                        }
//                    }
                    steps {
                        sh 'npm install --production'
                        sh 'npm run start-service'
                    }
                }
            }
            post {
                always {
                    archiveArtifacts 'reports/*'
                    junit 'reports/*.xml'
                }
            }
        }
