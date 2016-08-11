export const FETCH_COMPONENT = 'FETCH_COMPONENT';
export const FETCH_COMPONENT_SUCCESS = 'FETCH_COMPONENT_SUCCESS';
export const FETCH_COMPONENT_FAIL = 'FETCH_COMPONENT_FAIL';

export const FETCH_COMPONENTS_BY_TYPE = 'FETCH_COMPONENTS_BY_TYPE';
export const FETCH_COMPONENTS_BY_TYPE_SUCCESS = 'FETCH_COMPONENTS_BY_TYPE_SUCCESS';
export const FETCH_COMPONENTS_BY_TYPE_FAIL = 'FETCH_COMPONENTS_BY_TYPE_FAIL';

export function fetchComponent(type, name) {
  return {
    type: FETCH_COMPONENT,
    payload: {
      request: {
        method: 'get',
        url: `/registry/components/types/${type}/name/${name}`
      }
    }
  };
}

export function fetchComponentsByType(type) {
  return {
    type: FETCH_COMPONENTS_BY_TYPE,
    payload: {
      request: {
        method: 'get',
        url: `/registry/components/types/${type}`
      }
    }
  };
}
