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

- TODO: read database url from the environment.
