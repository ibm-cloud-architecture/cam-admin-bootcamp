# Deploy Service to ICP

In this lab you will be building off the simple NodeJS service that was created in the previous lab. Here we will be adding some additional complexity to the process and adding an e-mail task at the end of the process.

**Note:** All activities will be carried out on the Boot node using the Web browser on the desktop. 

## Configure the SMTP connection


1. Login to the CAM Console https://10.10.1.2:30000 (admin\passw0rd)

2. From the menu navigate to the Email Configuration page

   **Menu** > **Manage** > **Email Configuration**

3. Click Configure Email Server and enter the following information in the fields:

   **SMTP Host Name:** smtp.gmail.com

   **SMTP Port:** 25

   **SMTP Username:** ibmcloudautomationmanager@gmail.com

   **SMTP Password:** <will be provided separately>

   **Test Email Recipient:** <the email where you would like to receive a test messages>
   
   <img src="../images/4-3b_emailconfig.png" alt="image-20190904221834707" style="zoom:50%;" />
   
4. Before saving the connection click the link to test the email SMTP connection.

5. Check your e-mail to verify that you received the test message from **CAMadmin**

   **Note:** If you don't see a test e-mail, you may want to check you spam folder and add ibmcloudautomationmanager@gmail.com to your safe senders list.

6. If the test was complete, **Save** the connection.



### Service with decision

1. Navigate back to the **TeamX_ICP_Service** you created in the previous section and open the **Composition** tab.

2. Add a **Decision** component to your service by selecting it from the Flow Components section and dragging it onto your canvas just before the NodeJS helm chart.

   **Note:** Make sure you drag it the components and drop them on the square icon that appears on the process flow line on your canvas.

   <img src="../images/4-3b_basic_service.png" alt="image-20190905053156535" style="zoom:67%;" />

3. First let's rename our decision. In the configuration panel on the right side of the canvas change the **Title** of the decision. 
   
   ![An image](../images/4-3b_decision_title.png) <!-- .element height="50%" width="50%" -->

4. Next we will need to add a parameter to base our decision on. In configuration panel select **Add Parameter** at the bottom of the list.

5. Enter **Environments** in the field and click the check mark to create the variable.

   ​	<img src="../images/4-3b_mapped_parameter.png" alt="image-20190905054329125" style="zoom:50%;" />	

6. Under the new mapped parameter create the following cases

   ​	<img src="../images/4-3b_environment_decision.png" alt="image-20190905054207682" style="zoom:50%;" />

   Notice that as you add these cases the Decision on the canvas is updated and now has multiple options.

7. Click the **Save** button to save your changes

8. Next clone the NodeJS Helm chart two more times we have the copies on our canvas. Do this by hovering over the Helm chart on the canvas and clicking the clone icon that appears.

   <img src="../images/4-3b_cloned_helm.png" alt="image-20190905054720238" style="zoom:50%;" />	

9. Now drag and drop one of the Helm charts in to each of the Environments in your target_environment decision.

   ​	<img src="../images/4-3b_base_decision.png" alt="image-20190905054937018" style="zoom:50%;" />

10. Now drag the Email Notification item from the palette and place it after the target_environment decision

   ​	<img src="../images/4-3b_decision_email.png" alt="image-20190905055118802" style="zoom:50%;" />

11. In the configuration panel update the Email Notification with your e-mail and message

    ​	<img src="../images/4-3b_email_config.png" alt="image-20190905055416475" style="zoom:50%;" />

12. Save your changes

13. Next return to the Service Library **Menu** > **Library** > **Services**. Notice that your service is there as a **Draft**.

14. Test the Service by selecting the pull-down menu on the right side of the draft and selecting Deploy.

    <img src="../images/4-3b_deploy_service.png" alt="image-20190905055738219" style="zoom:50%;" />		

15. Click **Next** past the Overview page

16. On the Deploy a Service page enter a deployment name and select the default name. Then notice when you Click on the Environments it lets you choose the environments we defined in our Service. Select any of the environments and click **Create Instance**.

17. Click **Go to Instances** and monitor the deployment until it shows **Active**

18. The check the e-mail address you defined in your Email Notification to verify you received the email

    <img src="../images/4-3b_success_email.png" alt="image-20190905060625401" style="zoom:50%;" />	



### Publish the Service

Once the Service has been developed and tested the next step is to Publish the Service to the Catalog so it is available to other users.

1. Navigate back to the Service Library **Menu** > **Library** > **Services**
2. Click the pull-down menu on the right side of the draft service and select **Publish**

   <img src="../images/4-3b_publish_service.png" alt="image-20190905061023691" style="zoom:50%;" />

3. Your Service is now published

   <img src="../images/4-3b_success_publish.png" alt="image-20190905061112071" style="zoom:30%;" />	
4. Click **Close** and notice that the Service now shows Published and that we no longer can Edit the service

   <img src="../images/4-3b_no_edit.png" alt="image-20190905061235586" style="zoom:50%;" />

5. Next open a new browser tab and login to the IBM Cloud Private console (admin\passw0rd)

6. The service has been published to the Helm repository, but we need to sync our repositories before it will show up in the Catalog. Navigate to **Menu** > **Manage** > **Helm Repositories** and select **Sync repositories**

7. Click the **Catalog** link in the upper right corner

8. In the Search bar enter the name of your service and you should see your service in the catalog

   <img src="../images/4-3b_service_catalog.png" alt="image-20190905061934442" style="zoom:40%;" />	

9. Deploy your service and test to make sure it works and you receive an e-mail



### Updating a Service

Since testing our service we may have new requirements want want to update our service. However once we have published our service it is locked and can no longer be edited. So we first have to create a duplicate service to modify.

1. Return the the Cloud Automation Manager console and navigate to the Services Library

2. Select the pull-down menu on published service we created and select **View**

   <img src="../images/4-3b_view_service.png" alt="image-20190905063020359" style="zoom:50%;" />

   Notice that you can view, but can not modify any of the fields since it has been published.

3. Select **Duplicate** in the pull-down menu in the upper right corner

   <img src="../images/4-3b_duplicate_service.png" alt="image-20190905063128430" style="zoom:50%;" />	

4. You should now have a copy of the previous service that can be modified

5. In the previous version of the service we only worked in the Primary Flow in this version we will add an additional Email notification to the send a message when the request fails. First minimize the Primary Flow by and expand the Error Flow in the canvas. You should now see a blank canvas.

6. Drag the Email Notification component from the palette to the canvas and add your e-mail and a message to send in the service fails

   <img src="../images/4-3b_error_email.png" alt="image-20190905070330485" style="zoom:50%;" />	

8. Save your service

9. Next we need to add a component that will simulate a failure to test the Error Flow. Return to the primary flow and add a Rest Hook component just after the Helm chart for the Production environment.

   ​	<img src="../images/4-3b_404_resthook.png" alt="image-20190905070558772" style="zoom:50%;" />

10. In order to simulate the failure we will add a Rest call that we know will fail. Customize the Rest hook with the **Input URL**: [httpstat.us/404](https://httpstat.us/404) and the **Method**: GET

    ​	<img src="../images/4-3b_404_rest_config.png" style="zoom:50%;" />

11. Save your changes

12. Redeploy your new service and select the Production environment

13. Verify that the deployment failed and that you received the email defined in the Error Flow

    ​	<img src="../images/4-3b_error_email_received.png" alt="image-20190905071138149" style="zoom:50%;" />



### Promote and retire

Using what you have learned in the previous steps retire the previous service and publish the new service to the Catalog. Test your new offering to verify that you receive the email notifications for both the Primary Flow (select Development\Test) and the Error Flow (select Production).



### Clean-up

You have finished this lab, please make sure to Terminate and Delete the Services you have deployed.
