#######################################
##### vSphere Access Credentials ######
#######################################
vsphere_server = "10.0.0.210"
allow_unverified_ssl = "true"

##############################################
##### vSphere deployment specifications ######
##############################################
vsphere_datacenter = "Datacenter"

vsphere_cluster = "DatacenterCluster"
vsphere_resource_pool = "CAMPool"
network_label = "VM Network"
datastore_cluster = "DatastoreCluster"
template = "rhels76-template"
folder = "Target/Team"
domain =  "camlab.local"
instance_name = "camlab3vm"

##################################
##### CEPH deployment details ####
##################################

##### Network #####
staticipblock = "10.0.0.0/24"
staticipblock_offset = 90
gateway = "10.0.0.254"
netmask = "24"
dns_servers = [ "10.0.0.254" ]

##### Local Terraform connectivity details #####
ssh_user = "root"
ssh_password = "Passw0rd!"
#ssh_agent = true

##### CAMLAB Cluster Components #####
nodes = "1"
vcpu = "2"
memory = "4096"
disk_size = "50"
thin_provisioned = "true"
