const ROLE_SCOPE_FIELDS = {
  NATIONAL_ADMIN: [],
  STATE_AUTHORITY: ['stateId'],
  DISTRICT_AUTHORITY: ['stateId', 'districtId'],
  MUNICIPAL_AUTHORITY: ['stateId', 'districtId', 'municipalityId'],
  CITY_WARD_OPERATOR: ['stateId', 'districtId', 'municipalityId', 'cityId', 'wardId'],
  FIELD_OFFICER: ['assignedLocationIds'],
  EMERGENCY_RESPONSE: ['assignedLocationIds'],
  CITIZEN: [],
};

const LEGACY_ROLE_MAP = {
  admin: 'NATIONAL_ADMIN',
  disaster_authority: 'STATE_AUTHORITY',
  response_team: 'EMERGENCY_RESPONSE',
  field_officer: 'FIELD_OFFICER',
  citizen: 'CITIZEN',
};

const canonicalRole = (role) => LEGACY_ROLE_MAP[role] || role;

const scopeFromUser = (user) => {
  const role = canonicalRole(user?.role);
  const scope = user?.geographicScope || {};
  const filter = {};

  if (role === 'CITIZEN' || role === 'NATIONAL_ADMIN') return filter;

  if (role === 'FIELD_OFFICER' || role === 'EMERGENCY_RESPONSE') {
    const locationIds = Array.isArray(scope.assignedLocationIds) ? scope.assignedLocationIds.filter(Boolean) : [];
    return locationIds.length ? { locationId: { $in: locationIds } } : { _id: { $in: [] } };
  }

  const fields = ROLE_SCOPE_FIELDS[role] || [];
  for (const field of fields) {
    if (!scope[field]) return { _id: { $in: [] } };
    filter[field] = scope[field];
  }
  return filter;
};

const requireScopedAccess = (options = {}) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required for scoped access.' });
  const role = canonicalRole(req.user.role);
  if (options.roles?.length && !options.roles.includes(role)) {
    return res.status(403).json({ message: 'Role is not permitted for this operation.' });
  }
  req.geographicFilter = scopeFromUser(req.user);
  next();
};

module.exports = { canonicalRole, scopeFromUser, requireScopedAccess };
