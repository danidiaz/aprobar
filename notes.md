NOTES
=====

These are notes to myself while writing the app. If you are not me, better turn
to the README.md instead.

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

- http://stackoverflow.com/questions/19199872/best-practice-for-restful-post-response

- http://stackoverflow.com/questions/14943607/how-to-set-the-location-response-http-header-in-express-framework

- "However, if you are building the server and you expect other people to write client code then they will love you much more if you provide complete URIs."
  http://stackoverflow.com/a/2240380/1364288

- "found it a bit of a PITA to get the requested url. I can't believe there's not an easier way in express. Should just be req.requested_url"
  http://corpus.hubwiz.com/2/node.js/10183291.html

- Complete DELETE and PUT on user.

- Improve error messages.

- Refactor into separate routes.

- Add mocha/chai tests.

- Parameterize the persitence backend?

- Waterline tip: when a "findOne" function doesn't find anything, it returns
  undefined (which is falsy). Propagate the undefined upwards.

- I need automated tests to scale development. Testing more than a few paths by
  hand after each change quickly becomes a bottleneck.

- Perhaps add a separate main.js module to simplify testing?

- Do not use effectul default parameters.

- Only use simplified expression arrow syntax with pure functions
  (possible exception: promises)

- http://es6-features.org/#Lexicalthis

- TODO: Accurate error meesages (differentiate normal errors from internal errors).

- TODO: refactor routes.

- TODO: implement tests.

- Put versus post:
    - http://restcookbook.com/HTTP%20Methods/put-vs-post/
    - https://knpuniversity.com/screencast/rest/put-versus-post
    - http://stackoverflow.com/questions/35742358/put-or-post-to-update-resource
    - http://stackoverflow.com/questions/630453/put-vs-post-in-rest

- https://httpstatuses.com/409 
  "Conflicts are most likely to occur in response to a PUT request."

- return from failures early!

- By moving the handlers to routes modules, the server.js is freed from a
  dependency on models (and on bluebird).

- Resources on testing REST APIs using Mocha and Chai:
    - https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
    - https://thewayofcode.wordpress.com/2013/04/21/how-to-build-and-test-rest-api-with-nodejs-express-mocha/
    - https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/
    - http://mherman.org/blog/2016/09/12/testing-node-and-express/#.WJYl3vnhDcs
    - https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
    - https://developers.redhat.com/blog/2016/03/15/test-driven-development-for-building-apis-in-node-js-and-express/
    - https://labs.chiedo.com/blog/testing-a-node-js-rest-api-with-mocha-and-chai/
    - https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
    - https://mochajs.org/

- TODO: mention in the README that security and transactions are left pending.

- "Passing arrow functions (“lambdas”) to Mocha is discouraged. Due to the
lexical binding of this, such functions are unable to access the Mocha
context." http://mochajs.org/#getting-started

- "Testing a restful api with mocha and chai."
https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

- ["it’s straightforward to generate your tests dynamically. No special syntax is required"](https://mochajs.org/#dynamically-generating-tests)

- The main combinators of Mocha seem to be "describe" (which can be nested) and
"it". Example of nested "describe":
http://stackoverflow.com/questions/28546182/why-cant-nested-describe-blocks-see-vars-defined-in-outer-blocks

- Chai seems to have three assertion styles. Vanilla "assert" style is not
chainable. "should" style seems like too much magic.

- https://mochajs.org/#asynchronous-code

- Delayed root suite https://mochajs.org/#delayed-root-suite This might solve
my problem with delayed initialization.

- It seems that the [supertest]() library doesn't suffer from the avobe problem,
  but stick to mocha/chai anyway.

- ["Test your REST api using Mocha and supertest"](https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/).

- https://www.npmjs.com/package/supertest

- Is the package.json "config" section an alternative to dotenv?
  https://docs.npmjs.com/misc/scripts

- "Another cool feature about npm is that any script that can be executed also
  has a set of pre- and post- hooks, which are simply definable in the scripts
  object." https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/

- https://www.npmjs.com/package/chai-as-promised
  But chai-http is also promise-enabled. What is the difference?
  It seems that chai-as-promised allows you to perform assertions on the
  promises *directly*, without having to extract their results with then. 

- https://www.terlici.com/2015/09/21/node-express-controller-testing.html

- Remember: when using mocha with promises, the test callback doesn't pass a
  "done".
 
- "In general, if you want to test promise-based code in Mocha, you should rely
on the fact that Mocha itself can handle promises already. You shouldn't use
done(), but instead, return a promise from your test. Mocha will then catch any
errors itself."
  "The "Unhandled promise rejection" is also caused by the failed assertion,
because if an error is thrown in a catch() handler, and there isn't a
subsequent catch() handler, the error will get swallowed (as explained in this
article). The UnhandledPromiseRejectionWarning warning is alerting you to this
fact."
	http://stackoverflow.com/a/39718611/1364288
  
- https://www.joyent.com/node-js/production/design/errors

- chai-http provides a way to perform tests against an express Application
object, and also a few extra assertions for dealing with responses.

- [to.deep.equal](http://chaijs.com/api/bdd/#method_deep) is an alternative to to.jsonEqual.
  
- How to pass a json body in chai-http? Ah, it's done with "send".

- The current version of chai-http is not able to test for bad requests. Sucks.
  https://github.com/chaijs/chai-http/issues/75


