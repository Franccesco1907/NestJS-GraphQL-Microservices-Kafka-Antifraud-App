# Transaction validation requirements

Create each transaction with status `pending`, send it through Kafka to the antifraud service, then apply its `approved` or `rejected` response. Values greater than 1000 must be rejected.

Creation requires debit/credit account UUIDs (`accountExternalIdDebit`, `accountExternalIdCredit`), `tranferTypeId` and `value`. Preserve the original API spelling `tranferTypeId`.
Retrieval returns the external transaction ID, transaction type/status, value and creation time.

The challenge requires Node.js, a database and Kafka; GraphQL is optional. Consider concurrent high-volume reads and writes when changing persistence.
