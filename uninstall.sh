#!/bin/bash

set -e

# systemctl stop biarbala.index
# systemctl disable biarbala.index
# rm /lib/systemd/system/biarbala.index.service
# systemctl daemon-reload

$(npm run pm2 unstartup | grep sudo)
npm run pm2 kill

# TODO stop iptables routing 443 and 80 to 4443 and 8080

# close port 80 and 443
if firewall-cmd node 2>/dev/null; then
    firewall-cmd --zone=public --permanent --remove-port=80/tcp
    firewall-cmd --zone=public --permanent --remove-port=443/tcp
    firewall-cmd --reload
else
    echo "close ports 80 and 443 manually"
fi

# rm -rf /usr/src/biarbala