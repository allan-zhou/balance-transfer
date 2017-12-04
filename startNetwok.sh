# 删除容器
function dkcl(){
    CONTAINER_IDS=$(docker ps -ap)
    echo
 
    if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" = " " ];then
        echo "========== No containers available for deletion =========="
    else
        docker rm -f $CONTAINER_IDS
    fi
 
    echo
}

# 删除开发、测试镜像
function dkrmi(){
    DOCKER_IMAGE_IDS=$(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')
    echo

    if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" = " " ]; then
        echo "========== No images available for deletion ==========="
    else
        docker rmi -f $DOCKER_IMAGE_IDS
    fi

    echo
}

function restartNetwork(){
    echo

    cd artifacts
    docker-compose down
    dkcl
    dkrmi

    #Cleanup the material
    rm -rf /tmp/hfc-test-kvs_peerOrg* $HOME/.hfc-key-store/ /tmp/fabric-client-kvs_peerOrg*

    #Start the network
    docker-compose up -d
    cd -
    echo
}

restartNetwork