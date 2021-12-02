include .env

.DEFAULT_GOAL=up

build: ## build all containers (docker compose)
	docker-compose build

up: ## build & start the project (docker-compose)
	docker-compose up --build -d

up-hl: ## build & start the project (docker-compose)
	docker-compose up --build -d backend

up-c: clean_storage up

up-i: ## build & start the project (docker-compose)
	docker-compose up --build

down: ## stop the project (docker-compose)
	docker-compose down

re: down up

clean_storage:
	rm -rf db_data/*

parser:
	rm -rf images && docker-compose kill parser || docker-compose rm -f && docker-compose up -d db && docker-compose up parser