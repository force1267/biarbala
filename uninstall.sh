#!/bin/bash
set -e
# systemctl stop biarbala.proxy
systemctl stop biarbala.index
# systemctl disable biarbala.proxy
systemctl disable biarbala.index
# rm /lib/systemd/system/biarbala.proxy.service
rm /lib/systemd/system/biarbala.index.service
systemctl daemon-reload

# close port 80 and 443
if firewall-cmd node 2>/dev/null; then
    firewall-cmd --zone=public --permanent --remove-port=80/tcp
    firewall-cmd --zone=public --permanent --remove-port=443/tcp
    firewall-cmd --reload
else
    echo "close ports 80 and 443 manually"
fi