#!/bin/bash

which docker > /dev/null
if [[ $? == 1 ]]; then
    echo -e "Docker is not installed"
    sudo pacman -Syu docker docker-compose --noconfirm
    sudo gpasswd -a ${USER} docker
    sudo docker-compose up -d
    if [[ $? == 0 ]]; then
        source .env
        echo -e "Your database can be connected at:"
        echo -e "mongodb://${db_user}:${db_password}@localhost:${db_port}/${database_name}"
    fi
else
    sudo docker-compose up -d
    source .env
    echo -e "Your database can be connected at:"
    echo -e "mongodb://${db_user}:${db_password}@localhost:${db_port}/${database_name}"
fi

