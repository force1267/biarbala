cd /home/force/biarbala
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
/usr/bin/npm install
chown -Rv force /home/force/biarbala
cp /home/force/biarbala/biarbala.proxy.service /lib/systemd/system
cp /home/force/biarbala/biarbala.index.service /lib/systemd/system
systemctl daemon-reload
systemctl start biarbala.proxy
systemctl start biarbala.index
systemctl enable biarbala.proxy
systemctl enable biarbala.index