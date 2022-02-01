export default {

  items: (state) => [...state.items],
  itemsTotal: (state) => state.itemsTotal,

  //  Deleted getters
  deletedItems: (state) => state.deletedItems,
  deletedItemsTotal: (state) => state.deletedItemsTotal,

  isApiCalling: (state) => state.isApiCalling,

}
