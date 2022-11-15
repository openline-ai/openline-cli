#!/bin/bash

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
mkdir openline-setup
curl https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/openline-namespace.json -o openline-setup/openline_namespace.json
OPENLINE_NAMESPACE="openline-setup/openline-namespace.json"
NAMESPACE_NAME="openline"
#CUSTOMER_OS_HOME="$(dirname $(readlink -f $0))/../../../"
#echo CUSTOMER_OS_HOME=$CUSTOMER_OS_HOME


if [[ $(kubectl get namespaces) == *"$NAMESPACE_NAME"* ]];
  then
    echo " --- Continue deploy on namespace $NAMESPACE_NAME --- "
  else
    echo " --- Creating $NAMESPACE_NAME namespace in minikube ---"
    kubectl create -f "$OPENLINE_NAMESPACE"
    if [ $? -eq 0 ]; then
        echo "  ✅ $NAMESPACE_NAME namespace created in minikube"
    else
        echo "  ❌ failed to create $NAMESPACE_NAME namespace in minikube"
    fi
    
fi

#Adding helm repos :
helm repo add bitnami https://charts.bitnami.com/bitnami
if [ $? -eq 0 ]; then
    echo "  ✅ bitnami added to helm"
else
    echo "  ❌ failed to add bitnami to helm"
fi
helm repo add neo4j https://helm.neo4j.com/neo4j
if [ $? -eq 0 ]; then
    echo "  ✅ neo4j added to helm"
else
    echo "  ❌ failed to add neo4j to helm"
fi
helm repo add fusionauth https://fusionauth.github.io/charts
if [ $? -eq 0 ]; then
    echo "  ✅ fusionauth added to helm"
else
    echo "  ❌ failed to add fusionauth to helm"
fi
helm repo update
echo "  ✅ helm repo's updated"

#Get postgresql config and install 
curl https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/postgresql/postgresql-presistent-volume.yaml -o openline-setup/postgresql-presistent-volume.yaml
POSTGRESQL_PERSISTENT_VOLUME="openline-setup/postgresql-presistent-volume.yaml"
kubectl apply -f $POSTGRESQL_PERSISTENT_VOLUME --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ postgresql-persistent-volume configured."
else
    echo "  ❌ failed to configure postgresql-persistent-volume"
fi

curl https://https://raw.githubusercontent.com/openline-ai/openline-customer-os/5dd530e6e4ab64c3c4c05c2fde58b7abc397512f/deployment/k8s/configs/postgresql/postgresql-persistent-volume-claim.yaml -o openline-setup/postgresql-presistent-volume-claim.yaml
POSTGRESQL_PERSISTENT_VOLUME_CLAIM="openline-setup/postgresql-presistent-volume.yaml"
kubectl apply -f $POSTGRESQL_PERSISTENT_VOLUME_CLAIM --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ postgresql-persistent-volume-claim configured."
else
    echo "  ❌ failed to configure postgresql-persistent-volume-claim"
fi

curl https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/postgresql/postgresql-values.yaml -o openline-setup/postgresql-values.yaml
POSTGRESQL_VALUES="openline-setup/postgresql-values.yaml"
helm install --values $POSTGRESQL_VALUES postgresql-customer-os-dev bitnami/postgresql --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ postgreSQL configured"
else
    echo "  ❌ failed to configure postgreSQL"
fi

#Get Neo4j config and install
curl https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/neo4j/neo4j-helm-values.yaml -o openline-setup/neo4j-helm-values.yaml
NEO4J_HELM_VALUES="openline-setup/neo4j-helm-values.yaml"
helm install neo4j-customer-os neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f $NEO4J_HELM_VALUES --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ Neo4j configured"
else
    echo "  ❌ failed to configure Neo4j"
fi

curl https://raw.githubusercontent.com/openline-ai/openline-customer-os/otter/deployment/k8s/configs/fusionauth/fusionauth-values.yaml -o openline-setup/fusionauth-values.yaml
FUSIONAUTH_VALUES="openline-setup/fusionauth-values.yaml"
helm install fusionauth-customer-os fusionauth/fusionauth -f $FUSIONAUTH_VALUES --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "  ✅ FusionAuth installed"
else
    echo "  ❌ failed to install FusionAuth"
fi

rm -r openline-setup
