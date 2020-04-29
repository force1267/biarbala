#!/bin/bash

set -e # exit on error

if hash node 2>/dev/null; then
    echo "node exists"
else
    if hash yum 2>/dev/null; then # centos
        curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
        sudo yum install -y nodejs gcc-c++ make git
    elif hash apt 2>/dev/null; then # ubuntu
        curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
        sudo apt install -y nodejs build-essential git
    fi
fi

/usr/bin/npm ci
npm start
npm run pm2 save
$(npm run pm2 startup | grep sudo)

# rm -rf /usr/src/biarbala
# mkdir /usr/src/biarbala
# cp -r ./* /usr/src/biarbala/

# cp /usr/src/biarbala/biarbala.index.service /lib/systemd/system
# systemctl daemon-reload
# systemctl start biarbala.index
# systemctl enable biarbala.index

sudo iptables -A PREROUTING -t nat -i $1 -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -A PREROUTING -t nat -i $1 -p tcp --dport 443 -j REDIRECT --to-port 4443

# open port 80 and 443
if firewall-cmd node 2>/dev/null; then
    firewall-cmd --zone=public --permanent --add-port=80/tcp
    firewall-cmd --zone=public --permanent --add-port=443/tcp
    firewall-cmd --reload
else
    echo "open ports 80 and 443 manually"
fi