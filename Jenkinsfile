node {
	def app
	def project_name = 'Decade-Manager'

	stage('Clone repo'){
		checkout scm
	}

	stage('Prepare'){
		echo 'Cleaning old files.'
		sh "rm -rf package.zip"
		sh "rm -rf node_modules"

		echo 'Packing files.'
		sh "zip -r package.zip ."
	}

	stage('Push'){
		echo 'Connecting to the server.'
		sshagent(['b090bf66-6a26-40a3-92e3-a7e9066d3777']){
			sh "scp -r $WORKSPACE/package.zip root@60.249.179.125:/srv/manager"
		}
	}

	stage('Deploy'){
		echo 'Connecting to the server.'
		sshagent(['b090bf66-6a26-40a3-92e3-a7e9066d3777']){
			sh "ssh root@60.249.179.125 '\
				cd /srv/manager;
				pm2 stop decade-manager;
				ls | grep -v package.zip | xargs rm;
				unzip -o package.zip;
				npm install;
				npm run build:prod;
				pm2 restart manager.json;
				rm package.zip;
			'"
		}
	}

	stage('Clean'){
		echo 'Cleaning old files.'
		sh "rm -rf package.zip"
	}
}