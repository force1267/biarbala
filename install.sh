#!/bin/bash


mkdir /usr/src/biarbala
cp ./* usr/src/biarbala/
cd /usr/src/biarbala

set -e # exit on error

if hash node 2>/dev/null; then
    echo "node exists"
else
    if hash yum 2>/dev/null; then # centos
        curl -sL https://rpm.nodesource.com/setup_13.x | sudo bash -
        yum install -y nodejs gcc-c++ make
    elif hash apt 2>/dev/null; then # ubuntu
        curl -sL https://deb.nodesource.com/setup_13.x | sudo bash -
        apt install -y nodejs build-essential # not tested
    fi
fi
/usr/bin/npm ci

# chown -R node /usr/src/biarbala
# echo "/usr/src/biarbala owned by force"

cp /usr/src/biarbala/biarbala.index.service /lib/systemd/system
systemctl daemon-reload
systemctl start biarbala.index
systemctl enable biarbala.index

# open port 80 and 443
if firewall-cmd node 2>/dev/null; then
    firewall-cmd --zone=public --permanent --add-port=80/tcp
    firewall-cmd --zone=public --permanent --add-port=443/tcp
    firewall-cmd --reload
else
    echo "open ports 80 and 443 manually"
fi