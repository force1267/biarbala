#!/bin/bash

set -e

systemctl stop biarbala.index
systemctl disable biarbala.index
rm /lib/systemd/system/biarbala.index.service
systemctl daemon-reload

# close port 80, 443 and 3000
if firewall-cmd node 2>/dev/null; then
    firewall-cmd --zone=public --permanent --remove-port=80/tcp
    firewall-cmd --zone=public --permanent --remove-port=3000/tcp
    firewall-cmd --zone=public --permanent --remove-port=443/tcp
    firewall-cmd --reload
else
    echo "close ports 80 and 443 manually"
fi

rm -rf /usr/src/biarbala