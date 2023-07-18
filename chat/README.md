# User Nestjs Microservice
## Description

[user-nest-microservice](https://gitlab.com/pm-v2/boilerplate-nest-microservice) for microservices architecture.

## Configuration

### Environment Variables priority:
```text
.env.development.local
.env.development
.env
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# development in docker
$ yarn docker:up
$ yarn docker:logs

# production mode
$ yarn start:prod
```

## Generate interface from .proto file
```bash
$ yarn proto:generate
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Work with Error Handling
```text
utils/
```
