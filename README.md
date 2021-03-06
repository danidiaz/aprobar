# Overview

This API was going to be more extensive, but due to time pressure, at this
moment it merely consists in a set of endpoints for perfroming CRUD operations
on a collection of **user** resources.

The avaliable endpoints are as following

- {GET,POST} /users
- {GET,PUT,DELETE} /users/:userGuid

## Example curls

To get the created users:

```
curl http://host:port/users
```

To create a new user:

```
curl -H "Content-Type: application/json" -X POST -d '{ "name" : "Rodolfo9", "email": "rodolfo9@someemailprovider.com", "isAdmin" : true }' http://host:port/users
```

This sends the request body

```
{   
    "name" : "Rodolfo9",
    "email": "rodolfo9@someemailprovider.com",
    "isAdmin" : true
}
```

Trying to make anoher POST with the same name or email will fail, as they must be unique.

To inspect a created user:

```
curl http://host:port/users/bfa562b9-dc1d-4d83-b6c8-a4908199f1fa
```

To update the "isAdmin" field of an existing user, we PUT the whole
representation of the user with the "isAdmin" field changed:

```
curl -H "Content-Type: application/json" -X PUT -d '{ "name" : "Rodolfo9", "email": "rodolfo9@someemailprovider.com", "isAdmin" : false }' http://host:port/users/bfa562b9-dc1d-4d83-b6c8-a4908199f1fa
```

The "name" and "email" fields can't be changed, trying to do that in a PUT will
result in an error.

To delete a user:

```
curl -X DELETE http://host:port/users/bfa562b9-dc1d-4d83-b6c8-a4908199f1fa
```

# Design decisions

## "Persistence ignorance" and the repository pattern

I tried to achieve ["persistence
ignorance"](http://stackoverflow.com/questions/905498/what-are-the-benefits-of-persistence-ignorance)
for the entities in my model. That means they should not depend in any way on
the underlying persistence mechanism (this was brought about because I was
undecided for a while between Monogoose & Waterline). 

One consequence of this approach is that it becomes the model's responsibility
to generate and assign globally unique identifiers (GUIDs) instead of
delegating the task to the persistence layer. 

The **persistence** module implements the [repository
pattern](https://msdn.microsoft.com/en-us/library/ff649690.aspx), hiding the
details of the Waterline orm.

## Avoiding a server singleton

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

## Environment-based configuration

(This is more of a deployment pattern than a sotware one.) 

I tried to follow
the principles of the "12-factor app", in particular [the one about storing
appliation configuration in environment
variables](https://12factor.net/config).

That said, I used the [dotenv](https://www.npmjs.com/package/dotenv) package
during development.

# Testing strategy

I wrote integration tests for the CRUD endpoints using mocha, chai, and
[chai-http](https://www.npmjs.com/package/chai-http) for the requests.

I encountered an [annoying
limitation](https://github.com/chaijs/chai-http/issues/75) in chai-http: it is
not possible to test expected failure codes. This prevented me from testing
important behaviour like rejection of malformed inputs when creating or
updating resources.

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
