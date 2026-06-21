---
title: "Docker"
description: "Containers, images, volumes, networking, Docker Compose, and Dockerfile"
subject: setup
math: false
tags: [containers, deployment-serving, devops, docker, setup, tools]
order: 1
---

- Docker contains many images, many containers
- Platform independent

## Images

Executable files to build containers. Image is like class, container is like object.

```bash
docker build -t <imagename> <location>
docker run <imagename>
docker run -d <imagename>              # detached
docker run --name <name> -d <image>    # named + detached
docker images -a
```

## Containers

Running instances created from images.

```bash
docker ps          # running
docker ps -a       # all
docker stop <name>
docker rm <name>
```

## Port Binding

```bash
docker run -p <host_port>:<container_port> <image>
```

## Push/Pull

```bash
docker tag <image> <user>/<image>:<tag>
docker push <user>/<image>
docker pull <user>/<image>
docker rmi <image>
```

## Troubleshooting

```bash
docker logs <container_id>
docker exec -it <container_id> /bin/bash
```

## VM vs Docker

- **VM:** Virtualizes Host OS Kernel + Application Layer (heavier, all OS compatible)
- **Docker:** Virtualizes Application Layer only (lighter, faster, Linux-based)

## Docker Network

```bash
docker network ls
docker network create <name>
docker network rm <name>
```

Drivers: bridge, host, null

## Docker Compose

Define and run multi-container apps with `.yaml`:

```yaml
services:
    service1:
        image:
        port:
        environment:
    service2:
```

```bash
docker compose -f file.yaml up -d
docker compose -f file.yaml down
```

## Dockerfile

```dockerfile
FROM base_image
WORKDIR /app
COPY host_path image_path
RUN instruction        # multiple allowed
CMD entry_point        # single only
```

## Docker Volumes

Persistent data stores:

```bash
docker volume create <name>
docker run -v <name>:<container_dir>           # Named
docker run -v <mount_path>                      # Anonymous
docker run -v <host_dir>:<container_dir>        # Bind mount
docker volume prune                             # cleanup
```