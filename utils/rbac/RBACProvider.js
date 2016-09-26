const rbac = require('koa-rbac');

class RBACProvider extends rbac.RBAC.providers.JsonProvider {

  getRoles(user) {
    const rules = this._rules || {};
    const cache = {};

    return (function collect(roles, userRoles, depth) {
      for (let i = 0, iLen = roles.length; i < iLen; ++i) {
        cache[roles[i]] = cache[roles[i]] || depth;
      }

      for (let i = 0, iLen = roles.length; i < iLen; ++i) {
        if (cache[roles[i]] >= depth) {
          let role = rules['roles'] && rules['roles'][roles[i]];

          if (role) {
            if (Array.isArray(role['inherited'])) {
              userRoles[roles[i]] = collect(role['inherited'], {}, depth + 1);
            } else {
              userRoles[roles[i]] = null;
            }
          }
        }
      }

      return userRoles;
    })(user && user.roles || [], {}, 1);
  }

}

module.exports = RBACProvider;