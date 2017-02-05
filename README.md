# Overview

This API was going to be more extensive, but due to time pressure it currently
consists in a set of endpoints for perfroming CRUD operations on a collection
of **user** resources.

# Pending issues

## Transactions

Waterline by itself doesn't offer a lot in terms of transaction support,
possibly because dealing with the particularities of the whole array of
adapters would be difficult.

That said, Waterline does seem to give access to the underlying db connection,
so transactions could be handled at that level. An additional issue to take
into account is that Mongodb only supports document-level transactions.

## Security

The [passport](https://www.npmjs.com/package/passport) package could be used to
implement JWT authentication.
