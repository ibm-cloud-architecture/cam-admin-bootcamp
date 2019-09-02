#!/bin/sh

cat << EOM > /etc/yum.repos.d/ceph.repo
[ceph-packages]
name=Ceph x86_64 packages
baseurl=https://download.ceph.com/rpm-nautilus/el7/x86_64/
enabled=1
gpgcheck=1
type=rpm-md
gpgkey=https://download.ceph.com/keys/release.asc
EOM

