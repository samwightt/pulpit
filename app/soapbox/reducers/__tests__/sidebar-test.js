import reducer from '../sidebar';

describe('sidebar reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ sidebarOpen: false });
  });
});
