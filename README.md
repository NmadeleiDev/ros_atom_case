# Rolling Drones - Ros Atom Case

## Quick Start

```bash
git clone https://github.com/NmadeleiDev/ros_atom_case
cd ros_atom_case

cp .env.example .env

docker-compose build
docker-compose up -d
```

или с использованием make

```bash
git clone https://github.com/NmadeleiDev/ros_atom_case
cd ros_atom_case

cp .env.example .env

make up
```

## Структура проекта

Папки - части общего проекта. Каждая часть опционально имеет внутри Dockerfile. Все части соединены docker-compose файлом в корне проекта.

### ML

### Backend

### Front
