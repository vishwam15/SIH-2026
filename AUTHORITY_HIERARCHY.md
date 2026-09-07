# Authority Hierarchy

This is an application access-control design, not a claim that these exact software permissions are mandated by any government organization.

```text
India / national
  -> state
    -> district
      -> municipality / urban local body
        -> city
          -> ward / zone
            -> location
              -> sensor node
```

## Roles and scope

| Role | Intended scope |
|---|---|
| NATIONAL_ADMIN | India |
| STATE_AUTHORITY | Assigned state |
| DISTRICT_AUTHORITY | Assigned district |
| MUNICIPAL_AUTHORITY | Assigned municipality |
| CITY_WARD_OPERATOR | Assigned city/ward |
| FIELD_OFFICER | Assigned incidents/locations |
| EMERGENCY_RESPONSE | Assigned response scope |
| CITIZEN/PUBLIC | Public warnings and information |

The backend must enforce role and geographic scope on every protected query and mutation. Frontend filtering is not authorization. Current implementation has legacy roles and department checks but no geographic scope enforcement.
