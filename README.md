# Domain Analyzer

## Table of contents

-   [General info](#general-info)
-   [Features](#features)
-   [Technologies](#technologies)

## General info

The project incorporates a queuing mechanism for background analysis of domains. This allows domains to be added to the analysis queue, ensuring efficient and asynchronous processing. The system leverages the queuing system to handle analysis requests in the background while providing immediate responses to API endpoints.

Prod Website: https://domain-analyzer-service.onrender.com/api (running on cold start might take few mins).

## Technologies

NestJS, Prisma, Docker, Redis, Zod

## Features

-   Domain Information Retrieval: The system gathers security and identity information about domains using APIs like VirusTotal and WHOIS, storing the data for future reference.
-   Scheduled Monthly Analysis: The analysis queue runs on the first day of every month, allowing regular and predictable domain scanning intervals. This configurable schedule ensures periodic and up-to-date domain information.
-   Analysis Queue: Domains added for analysis are processed through a queue system, ensuring efficient background processing. The queue mechanism prevents duplicate domains from being added and ensures that domains are analyzed once.
-   Docker Deployment: The project includes a Dockerfile and docker-compose, enabling easy setup and deployment of the system. This ensures a consistent and reproducible environment for running the application.
-   Scalable Design: The system is designed to be scalable, accommodating increasing demands for domain analysis. It can handle a growing number of domains efficiently and effectively.
-   Past Results Storage: The system stores past analysis results, enabling the retrieval of historical domain information.

## Docker compose for EZ setup

```
version: '3.8'

services:
    mongo:
        image: 'nivsv/domainsanalysis-mongo:latest'
        environment:
            MONGO_INITDB_ROOT_USERNAME: root
            MONGO_INITDB_ROOT_PASSWORD: example
            MONGO_REPLICA_HOST: host.docker.internal
            MONGO_REPLICA_PORT: 27018
        ports:
            - '27018:27018'
    redis:
        image: 'bitnami/redis:latest'
        environment:
            - REDIS_PORT_NUMBER=6379
            - ALLOW_EMPTY_PASSWORD=yes
        ports:
            - 6379:6379
    app:
        image: 'nivsv/domainsanalysis-app:latest'
        ports:
            - '8080:8080'
        depends_on:
            - mongo
```

![image](https://github.com/NivSv/Domain-Analyzer/assets/71709946/e6191895-618c-4713-b171-7664a0df58fc)
![image](https://github.com/NivSv/Domain-Analyzer/assets/71709946/cc37f90c-86e4-471c-a0d9-62787fb8e1f9)
