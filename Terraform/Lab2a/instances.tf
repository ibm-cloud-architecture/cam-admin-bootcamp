#################################
# Configure the VMware vSphere Provider
##################################
provider "vsphere" {
  version        = "~> 1.11.0"
  vsphere_server = "${var.vsphere_server}"

  # if you have a self-signed cert
  allow_unverified_ssl = "${var.allow_unverified_ssl}"

}

##################################
#### Collect resource IDs
##################################
data "vsphere_datacenter" "dc" {
  name = "${var.vsphere_datacenter}"
}

data "vsphere_datastore_cluster" "datastore_cluster" {
  name          = "${var.datastore_cluster}"
  datacenter_id = "${data.vsphere_datacenter.dc.id}"
}

data "vsphere_resource_pool" "pool" {
  name          = "${var.vsphere_cluster}/Resources/${var.vsphere_resource_pool}"
  datacenter_id = "${data.vsphere_datacenter.dc.id}"
}

data "vsphere_network" "network" {
  name          = "${var.network_label}"
  datacenter_id = "${data.vsphere_datacenter.dc.id}"
}

data "vsphere_virtual_machine" "template" {
  name          = "${var.template}"
  datacenter_id = "${data.vsphere_datacenter.dc.id}"
}

# Create a folder
resource "vsphere_folder" "icpenv" {
 count = "${local.team_folder != "" ? 1 : 0}"
 path = "${local.team_folder}"
 type = "vm"
 datacenter_id = "${data.vsphere_datacenter.dc.id}"
}

locals  {
  team_folder = "${var.folder}${var.team_number}/Lab2"
  team_path = "${local.team_folder != "" ?
        element(concat(vsphere_folder.icpenv.*.path, list("")), 0)
        : ""}"
}

##############################################################
# Create temp public key for ssh connection
##############################################################
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
}

##################################
#### Create the camapp admin VM
##################################
resource "vsphere_virtual_machine" "camapp" {
  folder     = "${local.team_path}"

  #####
  # VM Specifications
  ####
  count            = "${var.camapp["nodes"]}"
  resource_pool_id = "${data.vsphere_resource_pool.pool.id}"

  name      = "${format("${lower(var.instance_name)}-camapp%02d", count.index + 1 + (var.team_number * 10)) }"
  num_cpus  = "${var.camapp["vcpu"]}"
  memory    = "${var.camapp["memory"]}"

  scsi_controller_count = 1

  ####
  # Disk specifications
  ####
  datastore_cluster_id  = "${data.vsphere_datastore_cluster.datastore_cluster.id}"
  guest_id      = "${data.vsphere_virtual_machine.template.guest_id}"
  scsi_type     = "${data.vsphere_virtual_machine.template.scsi_type}"

  disk {
    label            = "${format("${lower(var.instance_name)}-camapp2%02d.vmdk", count.index + 1 + (var.team_number * 10)) }"
    size             = "${var.camapp["disk_size"]        != "" ? var.camapp["disk_size"]        : data.vsphere_virtual_machine.template.disks.0.size}"
    eagerly_scrub    = "${var.camapp["eagerly_scrub"]    != "" ? var.camapp["eagerly_scrub"]    : data.vsphere_virtual_machine.template.disks.0.eagerly_scrub}"
    thin_provisioned = "${var.camapp["thin_provisioned"] != "" ? var.camapp["thin_provisioned"] : data.vsphere_virtual_machine.template.disks.0.thin_provisioned}"
    keep_on_remove   = "${var.camapp["keep_disk_on_remove"]}"
    unit_number      = 0
  }

  #
  # Bonus: Add a secondary disk
  #
  disk {
    label            = "${format("${lower(var.instance_name)}-data-camapp2%02d.vmdk", count.index + 1 + (var.team_number * 10)) }"
    size             = "${var.camapp["disk_size"]        != "" ? var.camapp["disk_size"]        : data.vsphere_virtual_machine.template.disks.0.size}"
    eagerly_scrub    = "${var.camapp["eagerly_scrub"]    != "" ? var.camapp["eagerly_scrub"]    : data.vsphere_virtual_machine.template.disks.0.eagerly_scrub}"
    thin_provisioned = "${var.camapp["thin_provisioned"] != "" ? var.camapp["thin_provisioned"] : data.vsphere_virtual_machine.template.disks.0.thin_provisioned}"
    keep_on_remove   = "${var.camapp["keep_disk_on_remove"]}"
    unit_number      = 1
  }

  ####
  # Network specifications
  ####
  network_interface {
    network_id   = "${data.vsphere_network.network.id}"
    adapter_type = "${data.vsphere_virtual_machine.template.network_interface_types[0]}"
  }

  ###
  # VM Customizations
  ####
  clone {
    template_uuid = "${data.vsphere_virtual_machine.template.id}"

    customize {
      linux_options {
        host_name = "${format("${lower(var.instance_name)}-camapp%02d", count.index + 1 + (var.team_number * 10)) }"
        domain    = "${var.domain != "" ? var.domain : format("%s.local", var.instance_name)}"
      }

      network_interface {
        ipv4_address  = "${var.staticipblock != "0.0.0.0/0" ? cidrhost(var.staticipblock, (var.team_number * 10) + var.staticipblock_offset + count.index) : ""}"
        ipv4_netmask  = "${var.netmask}"
      }

      ipv4_gateway    = "${var.gateway}"
      dns_server_list = "${var.dns_servers}"
    }
  }

  # Specify the ssh connection
  connection {
    user          = "${var.ssh_user}"
    password      = "${var.ssh_password}"
    host          = "${var.staticipblock != "0.0.0.0/0" ? cidrhost(var.staticipblock, (var.team_number * 10) + var.staticipblock_offset + count.index) : ""}"
  }

  provisioner "file" {
    source      = "${path.module}/scripts"
    destination = "/tmp/terraform_scripts"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod u+x /tmp/terraform_scripts/*.sh",
      "/tmp/terraform_scripts/add-public-ssh-key.sh \"${tls_private_key.ssh.public_key_openssh}\"",
      "/tmp/terraform_scripts/add-private-ssh-key.sh \"${tls_private_key.ssh.private_key_pem}\" \"${var.ssh_user}\""
    ]
  }
}

##################################
#### Create the camdb admin VM
##################################
resource "vsphere_virtual_machine" "camdb" {
  folder     = "${local.team_path}"

  #####
  # VM Specifications
  ####
  count            = "${var.camdb["nodes"]}"
  resource_pool_id = "${data.vsphere_resource_pool.pool.id}"

  name      = "${format("${lower(var.instance_name)}-camdb%02d", count.index + 2 + (var.team_number * 10)) }"
  num_cpus  = "${var.camdb["vcpu"]}"
  memory    = "${var.camdb["memory"]}"

  scsi_controller_count = 1

  ####
  # Disk specifications
  ####
  datastore_cluster_id  = "${data.vsphere_datastore_cluster.datastore_cluster.id}"
  guest_id      = "${data.vsphere_virtual_machine.template.guest_id}"
  scsi_type     = "${data.vsphere_virtual_machine.template.scsi_type}"

  disk {
    label            = "${format("${lower(var.instance_name)}-camdb2%02d.vmdk", count.index + 1 + (var.team_number * 100)) }"
    size             = "${var.camdb["disk_size"]        != "" ? var.camdb["disk_size"]        : data.vsphere_virtual_machine.template.disks.0.size}"
    eagerly_scrub    = "${var.camdb["eagerly_scrub"]    != "" ? var.camdb["eagerly_scrub"]    : data.vsphere_virtual_machine.template.disks.0.eagerly_scrub}"
    thin_provisioned = "${var.camdb["thin_provisioned"] != "" ? var.camdb["thin_provisioned"] : data.vsphere_virtual_machine.template.disks.0.thin_provisioned}"
    keep_on_remove   = "${var.camdb["keep_disk_on_remove"]}"
    unit_number      = 0
  }

  #
  # Bonus: Add a secondary disk
  #
  disk {
    label            = "${format("${lower(var.instance_name)}-db-camdb%02d.vmdk", count.index + 2 + (var.team_number * 10)) }"
    size             = "${var.camdb["disk_size"]        != "" ? var.camdb["disk_size"]        : data.vsphere_virtual_machine.template.disks.0.size}"
    eagerly_scrub    = "${var.camdb["eagerly_scrub"]    != "" ? var.camdb["eagerly_scrub"]    : data.vsphere_virtual_machine.template.disks.0.eagerly_scrub}"
    thin_provisioned = "${var.camdb["thin_provisioned"] != "" ? var.camdb["thin_provisioned"] : data.vsphere_virtual_machine.template.disks.0.thin_provisioned}"
    keep_on_remove   = "${var.camdb["keep_disk_on_remove"]}"
    unit_number      = 1
  }

  ####
  # Network specifications
  ####
  network_interface {
    network_id   = "${data.vsphere_network.network.id}"
    adapter_type = "${data.vsphere_virtual_machine.template.network_interface_types[0]}"
  }

  ###
  # VM Customizations
  ####
  clone {
    template_uuid = "${data.vsphere_virtual_machine.template.id}"

    customize {
      linux_options {
        host_name = "${format("${lower(var.instance_name)}-camdb%02d", count.index + 1 + (var.team_number * 10)) }"
        domain    = "${var.domain != "" ? var.domain : format("%s.local", var.instance_name)}"
      }

      network_interface {
        ipv4_address  = "${var.staticipblock != "0.0.0.0/0" ? cidrhost(var.staticipblock, (var.team_number * 10) + var.staticipblock_offset + count.index + 1 ) : ""}"
        ipv4_netmask  = "${var.netmask}"
      }

      ipv4_gateway    = "${var.gateway}"
      dns_server_list = "${var.dns_servers}"
    }
  }

  # Specify the ssh connection
  connection {
    user          = "${var.ssh_user}"
    password      = "${var.ssh_password}"
    host          = "${var.staticipblock != "0.0.0.0/0" ? cidrhost(var.staticipblock, (var.team_number * 10) + var.staticipblock_offset + count.index + 1) : ""}"
  }

  provisioner "file" {
    source      = "${path.module}/scripts"
    destination = "/tmp/terraform_scripts"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod u+x /tmp/terraform_scripts/*.sh",
      "/tmp/terraform_scripts/add-public-ssh-key.sh \"${tls_private_key.ssh.public_key_openssh}\"",
      "/tmp/terraform_scripts/add-private-ssh-key.sh \"${tls_private_key.ssh.private_key_pem}\" \"${var.ssh_user}\""
    ]
  }
}