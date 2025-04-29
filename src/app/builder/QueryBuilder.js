class QueryBuilder {
  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // search by fields
  search(searchableFields) {
    const search = this?.query?.search;
    if (search) {
      const searchCondition = searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
      this.modelQuery = this.modelQuery.find({
        $or: searchCondition,
      });
    }

    return this;
  }

  // sort by field
  sort() {
    const sortBy = this?.query?.sortBy;
    const sortOrder = this?.query?.sortOrder;

    if (sortBy) {
      const order = sortOrder === "asc" ? 1 : -1;
      this.modelQuery = this.modelQuery.sort({ [sortBy]: order });
    } else {
      this.modelQuery = this.modelQuery.sort({ createdAt: -1 });
    }

    return this;
  }

  // filter blogs by author
  filter() {
    const filter = this?.query?.filter;
    if (filter) {
      this.modelQuery = this.modelQuery.find({ author: filter });
    }

    return this;
  }
}

export default QueryBuilder;
