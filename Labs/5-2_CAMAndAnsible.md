# Import CAM Template

This Lab will walk you through the steps to configure CAM Deployments automatically using Ansible. The Ansible script disables root account login and creates an admin user,`sysadmin` with password: `passw0rd`. 

## Importing Template

Import a new template following the steps from **2-4_CreateCAMTemplate** using:

   GitLab Repository URL: **<https://gitlab.10.10.1.4.nip.io/camlabs>** (this location may vary depending on how you imported the project)

   GitLab Repository sub-directory: **Terraform/Lab5**

   NOTE: Before Saving the template, make sure to change the Display Name to **CAMLAB5.X Terraform Project**, where ‘X’ is your team number.


## Deploy Template

1. Click on Menu bar and go to **Library > Templates**.

1. Search for template **CAMLAB5.X Terraform Project**, where ‘X’ is your team number.

1. Select the template to see the details and the click **Deploy**

1. For instance name, enter **camlab5-x-instance**.

1. For Namespace, select **default** from the drop down list.

1. For **Cloud Connection**, select **TeamX_VMWare**, where 'X' is your team number.

1. In the **Team Number** field, enter your team number.

1. For **SSH Password** type `passw0rd`.

1. Click **Deploy**. After you will directed to a deployment details page where you will see progress indicator and logs.


## Validate configuration was applied

1. ssh into vm as root (password is `passw0rd`), where <IP> is the ip address of your instance.
```
ssh root@<IP>
```

1. Validate root login is not available as seen below:
```
This account is currently not available.
Connection to <IP> closed.
```

1. ssh into vm as sysadmin (password is `passw0rd`), where <IP> is the ip address of your instance.
```
ssh sysadmin@<IP>
```

1. Validate login is successful


## Destroy resources

1. Go to deployed instances by selecting **menu > Deployed Instances > Templates**.

1. Find the row for the instance deployed in this lab. Click the row's drop down menu (three vertical dots) button and select `Destroy Resources`.

1. Type `destroy` as prompted, type click **Destroy**

1. When the instance status finally becomes `Destroyed`, click the row's drop down menu (three vertical dots) button again and this time select `Delete Instances`.

1. Type `delete` as prompted, type click **Delete**
