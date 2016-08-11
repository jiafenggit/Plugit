export const FETCH_COMPONENT_MAPS_GROUPS = 'FETCH_COMPONENT_MAPS_GROUPS';
export const FETCH_COMPONENT_MAPS_GROUPS_SUCCESS = 'FETCH_COMPONENT_MAPS_GROUPS_SUCCESS';
export const FETCH_COMPONENT_MAPS_GROUPS_FAIL = 'FETCH_COMPONENT_MAPS_GROUPS_FAIL';

export const COMPONENT_MAPS_SELECT_GROUP = 'COMPONENT_MAPS_SELECT_GROUP';


export function fetchComponentMapsGroups() {
  return {
    type: FETCH_COMPONENT_MAPS_GROUPS,
    payload: {
      request: {
        method: 'get',
        url: `/map/components/groups`
      }
    }
  };
}

export function componentMapsSelectGroup(index) {
  return {
    type: COMPONENT_MAPS_SELECT_GROUP,
    activeIndex: index
  };
}
