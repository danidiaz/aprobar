- Use PUT to update resources (and maybe to choose between alternatives) but
  never force clients to construct a URI, the users must be made aware of the
  position of the resource beforehand.

- PUTs could have effects on other resources, as long as they are idempotent.

- Tentative api structure

  /users
  /users/{userid}
  /plans 
  /plans/{planid} <- POST here to clone plan?
  /plans/{planid}/details
  /plans/{plaind}/groups (how to link the plan with the root group?)
  /plans/{plaind}/groups/{groupid}
  /plans/{plaind}/groups/{groupid}/details <- put ordered/unordered here?
  /plans/{plaind}/groups/{groupid}/axes
  /plans/{plaind}/groups/{groupid}/axes/{axisid}
  /plans/{plaind}/groups/{groupid}/sequential
  /plans/{plaind}/groups/{groupid}/unoredered <- are these independent resources?
  /plans/{plaind}/tests/
  /plans/{plaind}/tests/{testid}
  /plans/{plaind}/runs/
  /plans/{plaind}/runs/{runid}
  /plans/{plaind}/runs/{runid}/groups 
  /plans/{plaind}/runs/{runid}/groups/{rungroupid} <- axis here?
  /plans/{plaind}/runs/{runid}/tests/{runtestid}
  /plans/{plaind}/runs/{runid}/tests/{runtestid}/started
  /plans/{plaind}/runs/{runid}/tests/{runtestid}/started/finished

- Dont give too many options to edit subresources. Favor pushing the whole
  hierarchy in a single step.
