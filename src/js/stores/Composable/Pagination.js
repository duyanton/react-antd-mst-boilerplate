import { reaction } from 'mobx';
import { types, getParent } from 'mobx-state-tree';

const Pagination = types
  .model('Pagination', {
    page: types.optional(types.number, 1),
    total: types.optional(types.number, 0),
    limit: types.optional(types.number, 20),
  })
  .views(self => ({
    get totalPages() {
      if (self.limit <= 0) return 0;
      return Math.ceil(self.total / self.limit);
    },
  }))
  .actions((self) => {
    const next = () => {
      if (self.page < self.totalPages) self.page += 1;
    };

    const prev = () => {
      if (self.page > 1) self.page -= 1;
    };

    const setPage = (page) => {
      if (page <= self.totalPages) {
        self.page = page;
      }
    };

    const afterAttach = () => {
      // Every time current page changed, call reload function of its parent
      reaction(
        () => self.page,
        () => {
          const parent = getParent(self);
          if (parent && parent.reload && parent.reload instanceof Function) {
            parent.reload();
          }
        },
      );
    };

    return {
      afterAttach,
      next,
      prev,
      setPage,
    };
  });

export default Pagination;
