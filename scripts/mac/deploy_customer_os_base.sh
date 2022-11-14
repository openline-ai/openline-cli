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
        echo "✅ minikube started"
    else
        echo "❌ minikube failed to start"
    fi
     
fi

NAMESPACE_NAME="openline"
CUSTOMER_OS_HOME="$(dirname $(readlink -f $0))/../../../"
echo CUSTOMER_OS_HOME=$CUSTOMER_OS_HOME

if [[ $(kubectl get namespaces) == *"$NAMESPACE_NAME"* ]];
  then
    echo " --- Continue deploy on namespace $NAMESPACE_NAME --- "
  else
    echo " --- Creating $NAMESPACE_NAME namespace in minikube ---"
    kubectl create -f "$CUSTOMER_OS_HOME/deployment/k8s/configs/openline-namespace.json"
    if [ $? -eq 0 ]; then
        echo "✅ $NAMESPACE_NAME namespace created in minikube"
    else
        echo "❌ failed to create $NAMESPACE_NAME namespace in minikube"
    fi
    
fi

#Adding helm repos :
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add neo4j https://helm.neo4j.com/neo4j
helm repo add fusionauth https://fusionauth.github.io/charts
helm repo update
echo "✅ helm repo's updated"

#install postgresql
kubectl apply -f $CUSTOMER_OS_HOME/deployment/k8s/configs/postgresql/postgresql-presistent-volume.yaml --namespace $NAMESPACE_NAME
kubectl apply -f $CUSTOMER_OS_HOME/deployment/k8s/configs/postgresql/postgresql-persistent-volume-claim.yaml --namespace $NAMESPACE_NAME

helm install --values "$CUSTOMER_OS_HOME/deployment/k8s/configs/postgresql/postgresql-values.yaml" postgresql-customer-os-dev bitnami/postgresql --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "✅ postgreSQL installed"
else
    echo "❌ failed to install postgreSQL"
fi


helm install neo4j-customer-os neo4j/neo4j-standalone --set volumes.data.mode=defaultStorageClass -f $CUSTOMER_OS_HOME/deployment/k8s/configs/neo4j/neo4j-helm-values.yaml --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "✅ Neo4j installed"
else
    echo "❌ failed to install Neo4j"
fi

helm install fusionauth-customer-os fusionauth/fusionauth -f "$CUSTOMER_OS_HOME/deployment/k8s/configs/fusionauth/fusionauth-values.yaml" --namespace $NAMESPACE_NAME
if [ $? -eq 0 ]; then
    echo "✅ FusionAuth installed"
else
    echo "❌ failed to install FusionAuth"
fi
