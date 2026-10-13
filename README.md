# Transaction antifraud service

NestJS GraphQL API, PostgreSQL and Kafka with a separate antifraud consumer. [Business requirements](CHALLENGE.md); [architecture diagram](images/diagram.png).

Copy `.env.example`, `api-transaction/.env.example` and `ms-antifraud/.env.example` to `.env` beside each source file. Sample credentials are for local development.

```sh
docker compose -f docker-compose.local.yml up --build postgres zookeeper kafka api-transaction ms-antifraud
```

Explore the schema, queries and mutations at `http://localhost:3000/graphql`. Transactions are validated asynchronously; a newly created transaction may still be pending.
Stop the stack with `docker compose -f docker-compose.local.yml down`.

For the production image configuration, substitute `docker-compose.prod.yml` and replace sample secrets before use.

In each service directory, run `npm ci`, `npm test -- --runInBand`, `npm run test:cov` and `npm run build`. Local service execution requires reachable PostgreSQL/Kafka hosts in its environment file.

With the stack running, load tests use:

```sh
docker compose -f docker-compose.local.yml run --rm k6 run --out json=report.json scripts/get_transactions.k6.js
docker compose -f docker-compose.local.yml run --rm k6 run --out json=report.json scripts/create_transaction.k6.js
```

Each load test overwrites `k6/report.json`; tune load and thresholds in the root `.env`.
