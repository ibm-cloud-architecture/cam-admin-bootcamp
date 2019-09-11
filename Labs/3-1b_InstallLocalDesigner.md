# Installing the Local Template Designer



### Prerequisites

##### Subscribe to the content on DockerHub

1. Create a Docker account if you don't already have one - [docker store ![External link icon](https://www.ibm.com/support/knowledgecenter/SS2L37_3.1.2.1/images/launch-glyph.svg)](https://www.ibm.com/links?url=https%3A%2F%2Fstore.docker.com)
2. Log in to Docker Store.
3. Search for IBM Cloud Automation Manager.
4. Click Proceed to Checkout.
5. Enter your contact information and click **Get Content**.

#### Install docker-compose on Boot node

**Note:** Execute these commands on the **Boot** node as the **root** user.

1. Download the current stable release of Docker Compose 

   ```
   sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   ```

2. Apply executable permissions to the binary

   ```
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. Link the binary

   ```
   sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
   ```

   

### Create Docker Compose YAML

**Note:** Execute these commands on the **Boot** node as the **root** user.

1. Open a text editor and create a file named *docker-compose.yml* with the following contents:

```
version: '2.1'
services:
  mongo:
    container_name: mongo
    image: store/ibmcorp/icam-mongo:3.1.2.0-x86_64
    ports:
      - "27017:27017"
#    volumes:
#      - "<PATH>/mongodb:/data/db"
  cam-provider-terraform:
    container_name: cam-provider-terraform
    image: store/ibmcorp/icam-provider-terraform:3.1.2.0-x86_64
    healthcheck:
      test: ["CMD", "curl", "http://localhost:7000"]
      timeout: 20s
      retries: 10
      interval: 5s
    environment:
      NODE_ENV: development
      POD_NAME: cam-provider-terraform
      CIPHER_PWD: fFCXb5Z9R6X7Lhk
      DB_URL: mongodb://mongo:27017/cam
      TERRAFORM_HOME: /home/terraform
      TERRAFORM_UID: 1111
      TERRAFORM_GID: 1111
    depends_on:
      - mongo
    ports:
      - "7000:7000"
#    volumes:
#      - "<PATH>/terraform/stacks:/stacks"
#      - "<PATH>/terraform/logs:/var/camlog"
  designermds:
    image: store/ibmcorp/icam-bpd-mds:3.1.2.0-x86_64
    healthcheck:
      test: ["CMD", "curl", "http://localhost:7578"]
      timeout: 20s
      retries: 10
      interval: 5s
    depends_on:
      - mongo
    ports:
      - "7578"
    environment:
      LICENSE: ACCEPT
      DB_URL: mongodb://mongo:27017/
  designerdb:
    image: mariadb:10.1.16
    environment:
       MYSQL_USER: ibm_ucdp
       MYSQL_ROOT_PASSWORD: passw0rd
       MYSQL_PASSWORD: passw0rd
       MYSQL_DATABASE: ibm_ucdp
    healthcheck:
       test: "mysqlshow -u$$MYSQL_USER -p$$MYSQL_PASSWORD -h $$HOSTNAME | grep $$MYSQL_DATABASE"
       timeout: 1s
       retries: 5
       interval: 3s
#    volumes:
#       - "<PATH>/mariadb/data:/var/lib/mysql"
  designercds:
    image: store/ibmcorp/icam-bpd-cds:3.1.2.0-x86_64
    environment:
       LICENSE: ACCEPT
    healthcheck:
       test: ["CMD", "curl", "http://localhost:7575"]
       timeout: 20s
       retries: 10
       interval: 5s
    ports:
      - "7575"
  designer:
    image: store/ibmcorp/icam-bpd-ui:3.1.2.0-x86_64
    environment:
       LICENSE: ACCEPT
       DB_NAME: ibm_ucdp
       DB_USER: ibm_ucdp
       DB_PASSWORD: passw0rd
       DB_TCP_PORT: 3306
       DB_TCP_URL: designerdb
       DB_TYPE: mariadb
       DEPLOY_SERVER_URL:
       DEPLOY_SERVER_AUTH_TOKEN:
       DISCOVERY_SERVER_URL: http://designercds:7575
       MODULE_SERVICE_URL: http://designermds:7578
    depends_on:
      designerdb:
        condition: service_healthy
      designercds:
        condition: service_healthy
      designermds:
        condition: service_healthy
      cam-provider-terraform:
        condition: service_healthy
    ports:
       - "8080:8080"
#    volumes:
#      - "<PATH>/designer/workspace:/opt/ibm-ucd-patterns/workspace"
#      - "<PATH>/designer/repositories:/opt/ibm-ucd-patterns/repositories"
```

2. Login to docker

   ```
   docker login
   ```

3. Pull docker images (this will take ~5 min)

   ```
   docker-compose pull
   ```

4. Start the Template Designer

   ```
   docker-compose up -d
   ```

   **Note:** You may have to run this command twice due to race condition

5. The template designer is now running



### Login and Configure the Template Designer

1. Launch the Template Designer by using the following URL:

   [http://localhost:8080/landscaper/](https://www.ibm.com/links?url=http%3A%2F%2Flocalhost%3A8080%2Flandscaper%2F)

   The default login id and password is as follows:

   - id: ucdpadmin
   - pw: ucdpadmin

2. Go to **Settings** > **Orchestrations**.

3. Enter the following values for the Orchestration Service:

   - **Name**: CAM
   - For **Type**, select Terraform Service
   - **Terraform Service URL**: [http://cam-provider-terraform:7000](https://www.ibm.com/links?url=http%3A%2F%2Fcam-provider-terraform%3A7000)

4. Click **Test Connection** to verify connectivity

5. Click **Save**.

6. Click the **Team** tab.

7. For the Internal Team, click the **Orchestration Connections** tab.

8. Click **Add**

9. Select the Terraform Orchestration Service created in the previous step and click **Ok**.

10. Click **Save** to save changes.

#### Configure CAM Integration

1. Navigate to **Settings** > **System Settings**.

2. Enter the following values for the Cloud Automation Manager settings

   IBM Cloud Private URL:   **https://10.10.1.2:8443**

   Cloud Automation Manager URL:   **https://10.10.1.2:8443**

   Username:  **admin**

   Password:  **passw0rd**

3. Click **Test Connection** to verify connectivity
4. Click **Save** to complete the configuration

