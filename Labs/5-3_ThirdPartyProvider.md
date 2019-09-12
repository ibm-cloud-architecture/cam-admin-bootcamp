# 3rd Party Terraform Plugin

In this lab we will use the GitLabs plugin for Terraform to create a simple Project in GitLab. Since Cloud Automation Manager does not include this in the default set of Terraform providers we will have to take some steps to include it. In this lab we will walk through the process of creating a CAM Template that references the GitLab provider and passes the credentials in a secure way and import the GitLab provider into CAM

### Lab Setup

**Note:** If you have your API key from previous labs you can use the same API key and skip this step

1. Login in using **labadmin** with password **passw0rd**

   https://gitlab.10.10.1.4.nip.io/

2. Once logged in, click on the user icon (top right) and select **Settings** 

3. Select **Access Tokens** from the left hand sidebar

4. Give it a name e.g. **camlab**

5. Check mark the **api** scope

6. Click on the **Create personal access token**

8. Save this API Key for use in the next steps

### Importing the Sample CAM Template

1. Login to CAM

2. Import the CAM Template found at the Git repo below:

   https://github.com/jdiggity22/gitlabterraform

3. Deploy the CAM Template using the settings 

   Name: **TeamX_GitLab**

   Namespace: **default**

   Cloud Connection: **Other**

   API Key: **Enter your GitLab API Key**
   
   URL: **https://gitlab.10.10.1.4.nip.io/api/v4/**
   
4. Check the status of the deployment. When it is completed check GitLab to see if you have a new GitLab project.

4. From the CAM Console check the log file for your TeamX_GitLab instance. You should see something similar to the output below.

   Notice that the CAM Template was successfully deployed
   ![image-20190911145922818](../images/5-3_provider_download.png)



### Importing GitLab Terraform Provider

The deployment worked, but you can see that the "gitlab" Terraform provider was downloaded from the internet. In an offline environment this would have failed, so we will add the "gitlab" provider to the CAM so it will use the local copy instead of downloading it from the internet.

Follow the steps below to download the "gitlab" Terraform provider and copy it to CAM.

**Note:** Execute the steps below from the **Boot** node.

1. Open a terminal window

2. Create a temporary directory to create a simple Terraform project and to download the provider binary

   ```
   mkdir ~/Documents/gitlabtmp
   ```

3. Change to the new directory

   ```
   cd ~/Documents/gitlabtmp
   ```

4. Create a new file "gitlab.tf" and copy the code below into

   ```
   provider "gitlab" {
       insecure = "true"
   }
   ```
   
5. Initialize the Terraform directory to download the "gitlab" provider binary from the repository

   ```
   terraform init
   ```

6. You should now have a .terraform directory with the "gitlab" provider binary

   ![image-20190912085225691](../images/5-3_list_plugin.png)

7. Login to IBM Cloud Private with the command below

   ```
   cloudctl login -a https://10.10.1.2:8443 --skip-ssl-validation -n services -u admin -p passw0rd
   ```

8. Now that we have the binary we can copy it into the running "cam-provider-terraform" pod

   ```
   kubectl cp -n services .terraform/plugins/linux_amd64/terraform-provider-gitlab_v2.2.0_x4 $(kubectl get -n services pods | grep cam-provider-terraform | awk '{print $1;}' | head -n 1):/home/terraform/.terraform.d/plugins/
   ```

9. Next change the owner of the provider files so CAM can load the provider binaries

   ```
   kubectl exec -n services $(kubectl get -n services pods | grep cam-provider-terraform | awk '{print $1;}' | head -n 1) chown terraform:terraform /home/terraform/.terraform.d/plugins/terraform-provider-gitlab_v2.2.0_x4
   ```



### Redeploy the GitLab Template

1. Navigate back to the CAM Console and destroy and delete the instance of the GitLab template we created earlier

2. Check GitLab to verify your project was removed

3. Return to CAM and re-deploy the GitLab Template

4. Once the deployment has completed check the log file

   You should see output similar to below

   ![image-20190912090225314](../images/5-3_provider_local.png)

5. Notice how the provider is not being downloaded from the internet.

### Conclusion

This process can be used for any terraform provider that is not included with CAM. Notice that in this lab we didn't use a Cloud Connection for our deployment. It is valuable to understand that you can utilize Terraform and CAM for more that just deploying infrastructure.

