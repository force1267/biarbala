systemctl stop biarbala.proxy
systemctl stop biarbala.index
systemctl disable biarbala.proxy
systemctl disable biarbala.index
rm /lib/systemd/system/biarbala.proxy.service
rm /lib/systemd/system/biarbala.index.service
systemctl daemon-reload