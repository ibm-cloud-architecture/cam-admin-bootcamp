#!/bin/sh

cat << EOM >/etc/yum.repos.d/ceph-deploy.repo
[ceph-noarch]
name=Ceph noarch packages
baseurl=https://download.ceph.com/rpm-nautilus/el7/noarch
enabled=1
gpgcheck=1
type=rpm-md
gpgkey=https://download.ceph.com/keys/release.asc
EOM

yum install -y ceph-deploy



