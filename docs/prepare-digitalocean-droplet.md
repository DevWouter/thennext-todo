# Prepare DigitalOcean droplet

This is just to prepare the machine.

1. Create a new droplet (2GB mem is recommend, but not required)
2. Create swapfile of 4GB
    ```bash
    sudo mkdir -p /var/vm
    sudo fallocate -l 4096m /var/vm/swapfile1
    sudo chmod 600 /var/vm/swapfile1
    sudo mkswap /var/vm/swapfile1
    ```
3. Create swap init config for systemd by creating a file `/etc/systemd/system/var-vm-swapfile1.swap` with the following content
    ```
    [Unit]
    Description=Turn on swap

    [Swap]
    What=/var/vm/swapfile1

    [Install]
    WantedBy=multi-user.target
    ```
4. Update the config settings of the machine:
    ```bash
    sudo systemctl enable --now var-vm-swapfile1.swap
    echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/80-swappiness.conf
    sudo systemctl restart systemd-sysctl
    ```
5. Install docker-compose
    ```bash
    sudo mkdir -p /opt/bin
    sudo curl -L https://github.com/docker/compose/releases/download/1.21.1/docker-compose-$(uname -s)-$(uname -m) -o /opt/bin/docker-compose
    sudo chmod +x /opt/bin/docker-compose
    ```

After this you should be able to simply use the deploy script (at least for single use cases)