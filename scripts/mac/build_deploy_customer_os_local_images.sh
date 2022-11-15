#! /bin/sh

### Locations for remote file downloads ###
DOCKER_CUSTOMER_OS="ghcr.io/openline-ai/openline-customer-os/customer-os-api:latest"
DOCKER_MESSAGE_STORE="ghcr.io/openline-ai/openline-customer-os/message-store:latest"
CUSTOMER_OS_API_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/local-minikube/apps-config/customer-os-api.yaml"
CUSTOMER_OS_API_K8S_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/local-minikube/apps-config/customer-os-api-k8s-service.yaml"
CUSTOMER_OS_API_K8S_LOADBALANCER_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/local-minikube/apps-config/customer-os-api-k8s-loadbalancer-service.yaml"
MESSAGE_STORE_API_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/local-minikube/apps-config/message-store.yaml"
MESSAGE_STORE_K8S_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/local-minikube/apps-config/message-store-k8s-service.yaml"
NEO4J_CYPHER="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/packages/server/customer-os-api/customer-os.cypher"
###########################################

NAMESPACE_NAME="openline"
CUSTOMER_OS_HOME="$(dirname $(readlink -f $0))/../../../"

# Download latest Docker images
echo "  🦦 Getting latest customerOS API docker image..."
docker pull $DOCKER_CUSTOMER_OS
minikube image load $DOCKER_CUSTOMER_OS

echo "  🦦 Getting latest message store API docker image..."
docker pull $DOCKER_MESSAGE_STORE
minikube image load $DOCKER_MESSAGE_STORE


# Deploy Images
echo "  🦦 Deploying latest customerOS API docker image..."
curl $CUSTOMER_OS_API_CONFIG -o openline-setup/customer-os-api.yaml
kubectl apply -f openline-setup/customer-os-api.yaml --namespace $NAMESPACE_NAME
curl $CUSTOMER_OS_API_K8S_CONFIG -o openline-setup/customer-os-api-k8s-service.yaml
kubectl apply -f openline-setup/customer-os-api-k8s-service.yaml --namespace $NAMESPACE_NAME
curl $CUSTOMER_OS_API_K8S_LOADBALANCER_CONFIG -o openline-setup/customer-os-api-k8s-loadbalancer-service.yaml
kubectl apply -f openline-setup/customer-os-api-k8s-loadbalancer-service.yaml --namespace $NAMESPACE_NAME

echo "  🦦 Deploying latest message store API docker image..."
curl $MESSAGE_STORE_API_CONFIG -o openline-setup/message-store.yaml
kubectl apply -f openline-setup/message-store.yaml --namespace $NAMESPACE_NAME
curl $MESSAGE_STORE_K8S_CONFIG -o openline-setup/message-store-k8s-service.yaml
kubectl apply -f openline-setup/message-store-k8s-service.yaml --namespace $NAMESPACE_NAME

# Provision neo4j
while [ -z "$pod" ]; do
    pod=$(kubectl get pods -n $NAMESPACE_NAME|grep neo4j-customer-os|grep Running| cut -f1 -d ' ')
    if [ -z "$pod" ]; then
      echo "neo4j not ready waiting"
      sleep 1
    fi
done

started=""
while [ -z "$started" ]; do
    started=$(kubectl logs -n $NAMESPACE_NAME $pod|grep password)
    if [ -z "$started" ]; then
      echo "neo4j waiting for app to start"
      sleep 1
    fi
done
sleep 1

neo_output="not empty"
while  [ ! -z "$neo_output" ]; do
	echo "provisioning neo4j"
    curl $NEO4J_CYPHER -o openline-setup/customer-os.cypher
	neo_output=$(cat openline-setup/customer-os.cypher |kubectl run --rm -i --namespace $NAMESPACE_NAME --image "neo4j:4.4.11" cypher-shell  -- bash -c 'NEO4J_PASSWORD=StrongLocalPa\$\$ cypher-shell -a neo4j://neo4j-customer-os.openline.svc.cluster.local:7687 -u neo4j --non-interactive' 2>&1 |grep -v "see a command prompt" |grep -v "deleted")
	if [ ! -z "$neo_output" ]; then
		echo "neo4j provisioning failed, trying again"
		echo "output: $neo_output"
		kubectl delete pod cypher-shell -n $NAMESPACE_NAME
		sleep 1
	fi
done

echo "provisioning postrgess"
cd $CUSTOMER_OS_HOME/packages/server/message-store/sql
SQL_USER=openline SQL_DATABABASE=openline SQL_PASSWORD=password ./build_db.sh local-kube