# Auth Nestjs Microservice
## Description

[Auth](https://gitlab.com/pm-v2/microservices/auth-microservice) microservice.

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

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
