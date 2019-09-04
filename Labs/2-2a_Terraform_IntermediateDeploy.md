# Terraform Intermediate Deployment

### Readying your environment

**Note:** The Virtual Machines that we will use in this lab will be automatically provisioned based on the IP range assigned. You will need to destroy the VMs from the previous exercises or you may have IP address conflicts.

**Note:** For this lab open a new terminal session. Be careful not to use an existing super user terminal session from a previous lab.

### Deployment scenario

In this scenario we are going to build on the concepts learned in the previous lab exercise. This exercise will not provide the exact code to deploy the environment, but will walk you through the steps to build the environment on your own.

The sections below will walk you through the process of modyfing the code from the previous exercise to create a multiple server deployment with multiple disks on both virtual machines.


### Create a new project folder
Since we are going to build on the previous exercise first will will want to create a new project based on the prevous build and initialize it.

1. First we will start with a blank directory

   ```
   mkdir ~/Documents/myterraform
   ```

2. Copy the previous terraform files to your new directory
   ```
   cp -r ~/Documents/cam-admin-bootcamp/Terraform/Lab2/* ~/Documents/myterraform
   ```
   
4. Change to the new directory
   ```
   cd ~/Documents/myterraform
   ```
   
5. Clean up the directory by removing any tfstate files
   ```
   rm ./*.tfstate
   rm ./*.tfstate.backup
   ```

6. Initialize the directory
   ```
   terraform init
   ```
   
   Your new project should now be ready
   

### Adding an additional disk

In the previous deployment we provisioned a VM with a single disk. In this scenario we want add an additional disk to the virtual machine. Here we will walk you through the process to add an additional disk to your template.

1. Open the Visual Studio Code editor on the desktop (there is a link on the quick launch bar)
2. Navigate to File > Open Folder and navigate to the ~/Document/myterraform folder and click Ok.
3. Once you have opened the directory you should see all the files on the left side of the screen in the Explorer view. Double-click on the instances.tf file. Here you will see the HCL source for the previous lab. 
4. To add an additional disk is pretty simple. We can simply duplicate the code for the existing disk to create another. Navigate down to the section in the code where the "vsphere_virtual_machine" "camlab" (around line 65) is defined. In that stanza you will find where "disk" resources for the VM are defined. Copy the existing disk and paste the code directy under the currently defined disk, increment the disk "unit_number" for the new disk to 1 and update the label field so the disk label is unique (in the example we added "data" to the name).

   Original Code:
   ```
   disk {
       label            = "${format("${lower(var.instance_name)}-camlab2%02d.vmdk", count.index + 1 + (var.team_number * 100)) }"
       size             = "${var.camlab["disk_size"]        != "" ? var.camlab["disk_size"]        :  data.vsphere_virtual_machine.template.disks.0.size}"
       eagerly_scrub    = "${var.camlab["eagerly_scrub"]    != "" ? var.camlab["eagerly_scrub"]    : data.vsphere_virtual_machine.template.disks.0.eagerly_scrub}"
       thin_provisioned = "${var.camlab["thin_provisioned"] != "" ? var.camlab["thin_provisioned"] : data.vsphere_virtual_machine.template.disks.0.thin_provisioned}"
       keep_on_remove   = "${var.camlab["keep_disk_on_remove"]}"
       unit_number      = 0
     }
   ```

   Modified Code:
   ```
   disk {
       label            = "${format("${lower(var.instance_name)}-camlab2%02d.vmdk", count.index + 1 + (var.team_number * 100)) }"
       size             = "${var.camlab["disk_size"]        != "" ? var.camlab["disk_size"]        : data.vsphere_virtual_machine.template.disks.0.size}"
       eagerly_scrub    = "${var.camlab["eagerly_scrub"]    != "" ? var.camlab["eagerly_scrub"]    : data.vsphere_virtual_machine.template.disks.0.eagerly_scrub}"
       thin_provisioned = "${var.camlab["thin_provisioned"] != "" ? var.camlab["thin_provisioned"] : data.vsphere_virtual_machine.template.disks.0.thin_provisioned}"
       keep_on_remove   = "${var.camlab["keep_disk_on_remove"]}"
       unit_number      = 0
     }
  
     disk {
       label            = "${format("${lower(var.instance_name)}-data-camlab2%02d.vmdk", count.index + 1 + (var.team_number * 100)) }"
       size             = "${var.camlab["disk_size"]        != "" ? var.camlab["disk_size"]        : data.vsphere_virtual_machine.template.disks.0.size}"
       eagerly_scrub    = "${var.camlab["eagerly_scrub"]    != "" ? var.camlab["eagerly_scrub"]    : data.vsphere_virtual_machine.template.disks.0.eagerly_scrub}"
       thin_provisioned = "${var.camlab["thin_provisioned"] != "" ? var.camlab["thin_provisioned"] : data.vsphere_virtual_machine.template.disks.0.thin_provisioned}"
       keep_on_remove   = "${var.camlab["keep_disk_on_remove"]}"
       unit_number      = 1
     }
   ```

5. Save your code **File** -> **Save**
6. Test your code to make sure you don't have any error
   **Note:** Don't for get to set your vSphere credentials as environment variables.
   ```
   terraform plan
   ```
7. Review the output if there are error correct your code, and it shows what will be provisioned you code should be valid.
8. Apply your terraform template and login to vCenter to verify that you VM was provisiong with a secondary disk.
9. Destroy you VM once you are complete

**Optional:** What we have done is very simple we have just created two disks that are identical. Try updating modifying the code to add an additional variable to define the size of the secondary disk.

### Adding and additional Virtual Machine
There are a couple of ways we can do this. The first as we did in the previous lab is to simply modify the count, but what if we want an additional instance that isn't exactly the same? In that case we will have to add an addtional "vsphere_virtual_machine" resource to our code.

1. Building on what we did in the previous step. Make sure you have Visual Studio Code opened with the instances.tf file.
2. Navigate to the section of the code where we have defined the "camlab" "vsphere_virtual_machine" (around line 65).
3. What we are going to do is use the "camlab" resource as a template and we are going to copy and paste it to build our new "vsphere_virtual_machine". 
4. Select the entire "vsphere_virtual_machine" "camlab" stanza (from line 65 to the end of the file) and copy it and paste it at the bottom of the instances.tf file. 
5. You should now have two identical "vsphere_virtual_machine" "camlab" resources in your code. From this point on we will be working with the newly create resource you pasted at the end of the file.
6. First we need to change the name of the resource. So modify the new name of the resource to "camdb".

   Original:
   ```
   resource "vsphere_virtual_machine" "camlab"
   ```

   Modified:
   ```
   resource "vsphere_virtual_machine" "camdb"
   ```
   
7. Next we need to modify the name that will be assigned to the Virtual Machine in VMware. Modify the "name" field described below.

   **Note:** Notice how the name is being calculated based on the count.index

   Orignal:
   ```
    name      = "${format("${lower(var.instance_name)}-camlab%02d", count.index + 1 + (var.team_number * 10)) }"
   ```

   Modified:
   ```
    name      = "${format("${lower(var.instance_name)}-camdb%02d", count.index + 1 + (var.team_number * 10)) }"
   ```

8. Next we don't want the systems to have the same hostname so we can modify that with the following changes. The host_name is defined under the linux_options.

   Original:
   ```
    host_name = "${format("${lower(var.instance_name)}-camlab%02d", count.index + 1 + (var.team_number * 10)) }"
   ```

   Modified:
   ```
    host_name = "${format("${lower(var.instance_name)}-camdb%02d", count.index + 1 + (var.team_number * 10)) }"
   ```

9. Next we don't want the two virtual machines to share the same IP address so we will need to increment the IP address assigned.

   Original:
   ```
   ipv4_address  = "${var.staticipblock != "0.0.0.0/0" ? cidrhost(var.staticipblock, (var.team_number * 10) + var.staticipblock_offset + count.index) : ""}"
   ```

   Modified:
   ```
   ipv4_address  = "${var.staticipblock != "0.0.0.0/0" ? cidrhost(var.staticipblock, (var.team_number * 10) + var.staticipblock_offset + count.index + 1 ) : ""}"
   ```

10. Save your file **File** > **Save**

11. Test your code to make sure you don't have any errors
    ```
    terraform plan
    ```
12. If your "terraform plan" is successful then apply your code

    ```
    terraform apply
    ```
   
13. Login to VMware and verify that you have two virtual machines with different names and that the IP address are incremented based your team number.

14. Destroy your virtual machines

    ```
    terraform destroy
    ```
   
**Optional:** Create variables for your new camdb resource so you can modify the compute resources and disk sizes independently of the camlab instances.

### Conclusion
In this section we have tried to introduce you to the HCL syntax and how you can easily modify resources. This is a very simple exercise, but is used to illustrate the power of Terraform and how easy it is to deploy infrastructure.

If you are stuck or would like to compare you code you can find example code of this exercise in the [Terraform/Lab2a](../Terraform/Lab2a) folder.

