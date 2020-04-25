cd /home/force/biarbala
chown -Rv force /home/force/biarbala
if hash node 2>/dev/null; then
    echo "node exists"
else
    curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
fi
npm install
cp /home/force/biarbala/biarbala.proxy.service /lib/systemd/system
cp /home/force/biarbala/biarbala.index.service /lib/systemd/system
sudo systemctl daemon-reload
systemctl start biarbala.proxy
systemctl start biarbala.index
systemctl enable biarbala.proxy
systemctl enable biarbala.index