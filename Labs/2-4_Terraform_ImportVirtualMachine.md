# Terraform Import Virtual Machine

In this lab we will simulate the terrafrom import process. The import process is used to query the hypervisor and create a terraform tfstate file for an existing virtual machine. In turn, enabling terraform to manage (or on-board) the existing virtual machine.

### Remove existing state files

This lab will build upon the previous deployment of your terraform code. In order to simulate the onboarding process we are going rename our existing terraform.tfstate files so we have essetially orphaned our instance(s).

1. Navigate to your terraform project folder
2. Rename your .tfstate files

### Import existing virtual machine

1. Run the import command

   **Note:** You may need to run this multiple times for each instance you previously created

   ```
   terraform import vsphere_virtual_machine.camlab /Datacenter/vm/Target/Team#/Lab2/camlab2vm-camlab#1
   ```

2. You should now see the new .tfstate files

3. Review the .tfstate files and compare them to the old .tfstate files

4. What is different?

### Destroy imported virtual machine

1. Destroy the instances you onboarded

   ```
   terraform destroy
   ```

2. Check your VM environment what resources still remain?

