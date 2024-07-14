class ApiFeatures {
  constructor(queryData, mongooseQuery) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  paginate = () => {
    if (!this.queryData.page || this.queryData.page <= 0) {
      this.queryData.page = 1;
    }
    if (!this.queryData.size || this.queryData.size <= 0) {
      this.queryData.size = 5;
    }
    this.mongooseQuery
      .skip((parseInt(this.queryData.page) - 1) * parseInt(this.queryData.size))
      .limit(parseInt(this.queryData.size));
    return this;
  };
  sort = () => {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", " "));
    return this;
  };
  search = () => {
    if (this.queryData.search) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.search, $options: "i" } },
          { textBody: { $regex: this.queryData.search, $options: "i" } },
        ],
      });
    }
    return this;
  };
}
export default ApiFeatures;
