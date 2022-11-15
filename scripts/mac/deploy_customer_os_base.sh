#!/bin/bash

### Config file locations for remote download ###
POSTGRESQL_PERSISTENT_VOLUME_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/postgresql/postgresql-presistent-volume.yaml"
POSTGRESQL_PERSISTENT_VOLUME_CLAIM_CONFIG="https://https://raw.githubusercontent.com/openline-ai/openline-customer-os/5dd530e6e4ab64c3c4c05c2fde58b7abc397512f/deployment/k8s/configs/postgresql/postgresql-persistent-volume-claim.yaml"
POSTGRESQL_VALUES_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/postgresql/postgresql-values.yaml"
NEO4J_HELM_VALUES_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/neo4j/neo4j-helm-values.yaml"
FUSIONAUTH_VALUES_CONFIG="https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/fusionauth/fusionauth-values.yaml"
#################################################

# Start minikube
MINIKUBE_STATUS=$(minikube status)
MINIKUBE_STARTED_STATUS_TEXT='Running'
if [[ "$MINIKUBE_STATUS" == *"$MINIKUBE_STARTED_STATUS_TEXT"* ]];
  then
    echo "👍 Minikube already started"
  else
    eval $(minikube docker-env)
    minikube start &
    if [ $? -eq 0 ]; then
        echo "  ✅ minikube started"
    else
        echo "  ❌ minikube failed to start"
    fi
     
fi

#Get namespace config & setup namespace in minikube
OPENLINE_NAMESPACE="./openline-setup/openline_namespace.json"
NAMESPACE_NAME="openline"

if [[ $(kubectl get namespaces) == *"$NAMESPACE_NAME"* ]];
  then
    echo " --- Continue deploy on namespace $NAMESPACE_NAME --- "
  else
    echo " --- Creating $NAMESPACE_NAME namespace in minikube ---"
    kubectl create -f $OPENLINE_NAMESPACE
    if [ $? -eq 0 ]; then
        echo "  ✅ $NAMESPACE_NAME namespace created in minikube"
    else
        echo "  ❌ failed to create $NAMESPACE_NAME namespace in minikube"
    fi
    
fi

#Adding helm repos :
helm repo add bitnami https://charts.bitnami.com/bitnami
if [ $? -eq 0 ]; then
    echo "  ✅ bitnami good to go"
else
    echo "  ❌ failed to add bitnami to helm"
fi
helm repo add neo4j https://helm.neo4j.com/neo4j
if [ $? -eq 0 ]; then
    echo "  ✅ neo4j good to go"
else
    echo "  ❌ failed to add neo4j to helm"
fi
helm repo add fusionauth https://fusionauth.github.io/charts
if [ $? -eq 0 ]; then
    echo "  ✅ fusionauth good to go"
else
    echo "  ❌ failed to add fusionauth to helm"
fi
helm repo update
echo "  ✅ helm repo's updated"

#Get postgresql config and install 
curl $POSTGRESQL_PERSISTENT_VOLUME_CONFIG -o openline-setup/postgresql-presistent-volume.yaml
POSTGRESQL_PERSISTENT_VOLUME="./openline-setup/postgresql-presistent-volume.yaml"
kubectl apply -f $POSTGRESQL_PERSISTENT_VOLUME --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ postgresql-persistent-volume configured."
else
    echo "  ❌ failed to configure postgresql-persistent-volume"
fi

curl $POSTGRESQL_PERSISTENT_VOLUME_CLAIM_CONFIG -o openline-setup/postgresql-presistent-volume-claim.yaml
POSTGRESQL_PERSISTENT_VOLUME_CLAIM="./openline-setup/postgresql-presistent-volume.yaml"
kubectl apply -f $POSTGRESQL_PERSISTENT_VOLUME_CLAIM --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ postgresql-persistent-volume-claim configured."
else
    echo "  ❌ failed to configure postgresql-persistent-volume-claim"
fi

curl $POSTGRESQL_VALUES_CONFIG -o openline-setup/postgresql-values.yaml
POSTGRESQL_VALUES="./openline-setup/postgresql-values.yaml"
helm install --values $POSTGRESQL_VALUES postgresql-customer-os-dev bitnami/postgresql --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ postgreSQL configured"
else
    echo "  ❌ failed to configure postgreSQL"
fi

#Get Neo4j config and install
curl $NEO4J_HELM_VALUES_CONFIG -o openline-setup/neo4j-helm-values.yaml
NEO4J_HELM_VALUES="./openline-setup/neo4j-helm-values.yaml"
helm install neo4j-customer-os neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f $NEO4J_HELM_VALUES --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ Neo4j configured"
else
    echo "  ❌ failed to configure Neo4j"
fi

#Get FusionAuth config and install
curl $FUSIONAUTH_VALUES_CONFIG -o openline-setup/fusionauth-values.yaml
FUSIONAUTH_VALUES="./openline-setup/fusionauth-values.yaml"
helm install fusionauth-customer-os fusionauth/fusionauth -f $FUSIONAUTH_VALUES --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ FusionAuth installed"
else
    echo "  ❌ failed to install FusionAuth"
fi