- Use PUT to update resources (and maybe to choose between alternatives) but
  never force clients to construct a URI, the users must be made aware of the
  position of the resource beforehand.

- PUTs could have effects on other resources, as long as they are idempotent.

- Tentative api structure
    - /users
    - /users/{userid}
    - /plans 
    - /plans/{planid} <- POST here to clone plan?
    - /plans/{planid}/details
    - /plans/{plaind}/groups (how to link the plan with the root group?)
    - /plans/{plaind}/groups/{groupid}
    - /plans/{plaind}/groups/{groupid}/details <- put ordered/unordered here?
    - /plans/{plaind}/groups/{groupid}/axes
    - /plans/{plaind}/groups/{groupid}/axes/{axisid}
    - /plans/{plaind}/tests/
    - /plans/{plaind}/tests/{testid}
    - /plans/{plaind}/runs/
    - /plans/{plaind}/runs/{runid}
    - /plans/{plaind}/runs/{runid}/instance/{instanceid}
    - /plans/{plaind}/runs/{runid}/instance/{instanceid}/started
    - /plans/{plaind}/runs/{runid}/instance/{instanceid}/started/finished

- Dont give too many options to edit subresources. Favor pushing the whole
  hierarchy in a single step.

- Reading the body of a request as JSON
  http://stackoverflow.com/a/24635296/1364288
  https://www.npmjs.com/package/body-parser

- Mongoose and UUIDs
    - https://github.com/Automattic/mongoose/issues/2738

- express api docs: https://expressjs.com/en/api.html

- perhaps prefer indirect recursion for datatypes when saving to the db?

- always put the requires at the beginning of the file. Use the name of the
  module for the var.

- Use joi for view schemas?

- TODO: push a request body into the db (as an user) with post, get it out with
  get. Start small.
- TODO: add a "nukedb" script to npm.

- Do the joi schema verifications belong to the model or to the views?

- Provide HTTP output for GET actions, if you have time.

- Investigate usefult express middleware like body-parser.

- https://youtu.be/OlapNW9Jc8s?t=1570
  Describes the "Router" approach to separate routes. Use it!

- https://expressjs.com/en/api.html#router

- http://expressjs.com/en/guide/using-middleware.html

- [official middleware](https://github.com/senchalabs/connect?_ga=1.182940708.38143649.1485124457#middleware)

- [third-party middleware](http://expressjs.com/en/resources/middleware.html)

- [best practices](https://expressjs.com/en/advanced/best-practice-performance.html)

- "Since you're using bluebird for promises, you actually don't need a catch
  statement after every function. You can chain all your thens together, and
  then close the whole thing off with a single catch."
  http://stackoverflow.com/questions/24619444/chaining-promises-with-then-and-catch
  http://stackoverflow.com/questions/34234703/how-to-decide-which-promise-does-a-then-catch-according-too

- ['after a catch the chain is restored'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

- Remember that there are named class expressions, just as there are named
  function expressions.

- Remember to return promises from *thens* when necessary!

