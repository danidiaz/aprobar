# Overview

This API was going to be more extensive, but due to time pressure it currently
consists in a set of endpoints for perfroming CRUD operations on a collection
of **user** resources.

# Avoiding a server singleton

Initially I read the configuration and started the server in an inflexible
manner. The Express Application instance was basically a singleton.

This caused problem with the integration tests, which need a reference to the
Application instance to work. A half-hearted solution I initially explored
consisted in exporting the Application instance from the server module, which
was then imported by the tests module. But this had some problems:

- Even if the Application was being exported, the module still started it
  automatically without giving the importing module a way to configure it.

- Related to the above, the importing module had now way of knowing when the
  Applicating was up and listening. This caused tests to fail.

The better solution was to make the **server.js** module export a function
which takes the application configuration and a callback that is invoked once
the server is finally up and running.

This way the server module has no unwanted side-effects, and the importing
modules can configure the server and control when it starts.

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
