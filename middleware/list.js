const Companies = require("../models/Companies");
const { startCase, camelCase } = require("lodash");

module.exports = {
  getListData: async (req, res, next) => {
    function populateMoneyRaised() {
      // Populates Empty Money Raised Fields
      const values = [
        "$267M",
        "$2.2M",
        "$143M",
        "$100.5M",
        "$1B",
        "$500M",
        "$29M",
        "$112.5M",
        "$680M",
        "$143M",
        "$200M",
        "$25M",
        "$74M",
        "$5M",
        "$230M",
      ];
      return values[Math.floor(Math.random() * 15)];
    }

    function customOperations(company) {
      if (!company.twitter_username) {
        // Populate empty twitter_username field
        company.twitter_username = company.permalink;
      }
      if (company.description == null || company.description == "") {
        // Populate empty description
        company.description = "Data Not Available";
      }
      if (company.total_money_raised === "$0") {
        // Populate total_money_raised
        company.total_money_raised = populateMoneyRaised();
      }
    }

    const data = {};

    // Pagination Code
    const page = parseInt(req.query.page);
    const limit = 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit; // Not Being Used

    if (!req.query.category && !req.query.search) {
      // Initial Render (Get 20 companies sorted (page Load))
      // No Category Selected
      const onLoadData = await Companies.find(
        {
          name: { $regex: /^[a-zA-Z\s]*$/, $options: "i" },
          number_of_employees: { $gte: 1000 },
        },
        "name twitter_username description permalink total_money_raised"
      )
        .sort("name")
        .limit(limit)
        .skip(startIndex)
        .lean()
        .exec();

      // Custom Operations
      onLoadData.forEach((company, index) => {
        customOperations(company);
      });

      data.companies = onLoadData;

      const queryCount = await Companies.find({
        name: { $regex: /^[a-zA-Z\s]*$/, $options: "i" },
        number_of_employees: { $gte: 1000 },
      })
        .countDocuments()
        .exec();

      // Pagination Variables
      data.totalPages = Math.ceil(queryCount / limit);
      data.current = parseInt(req.query.page); // Current Page

      req.data = data;
    }
    if (req.query.category) {
      // Category Selected
      const category = req.query.category;
      // Get 20 companies sorted (page Load)
      const onSelectData = await Companies.find(
        {
          name: { $regex: /^[a-zA-Z\s]*$/, $options: "i" },
          category_code: category,
        },
        "name twitter_username description permalink total_money_raised"
      )
        .sort("name")
        .limit(limit)
        .skip(startIndex)
        .lean()
        .exec();
      // Custom Operations
      onSelectData.forEach((company, index) => {
        customOperations(company);
      });

      data.companies = onSelectData;

      // Query Count
      const queryCount = await Companies.find({
        name: { $regex: /^[a-zA-Z\s]*$/, $options: "i" },
        category_code: category,
      })
        .countDocuments()
        .exec();

      // Pagination Variables
      data.totalPages = Math.ceil(queryCount / limit);
      data.current = parseInt(req.query.page); // Current Page

      req.data = data;
    }
    if (req.query.search) {
      const search = startCase(camelCase(req.query.search)).replace(/ /g, ""); // Lodash
      const onSearchData = await Companies.find(
        { name: search },
        "name twitter_username description permalink total_money_raised"
      )
        .sort("name")
        .limit(limit)
        .skip(startIndex)
        .lean()
        .exec();
      // Custom Operations
      onSearchData.forEach((company, index) => {
        customOperations(company);
      });

      data.companies = onSearchData;

      // Query Count
      const queryCount = await Companies.find({ name: search })
        .countDocuments()
        .exec();
      if (queryCount === 0) { // No Companies Found
        data.queryCount = true;
      }

      // Pagination Variables
      data.totalPages = Math.ceil(queryCount / limit);
      data.current = parseInt(req.query.page); // Current Page

      req.data = data;
    }
    next();
  },
  paginator: function (req, res, next) {
    // Pagination Variables
    const currentPageNumber = req.data.current; // Not being used
    const totalPages = req.data.totalPages;
    const pages = [];

    // Url Variables
    const url = req.url;
    function newUrl(newPageNumber) {
      return url.replace(currentPageNumber, newPageNumber);
    }

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    let innerHTML;
      // Less Than 10 Pages
      innerHTML = pages.map(
        (number) =>
          `<li class='page-item' id="pagination-li-${number}"><a href=${newUrl(
            number
          )} class='page-link'>${number}</a></li>`
      );
    if (false) { // * Not Implemented: ...pagination functionality

      // More Than 10 Pages
      const dots = `<li class='page-item disabled'>...</li>`
      console.log(dots);
      innerHTML = pages.map((number) => {
        const standardReturn = `<li class='page-item' id="pagination-li-${number}"><a href=${newUrl(
          number
        )} class='page-link'>${number}</a></li>`;
        if (number === 1) {  // First Page
          return standardReturn
        }
        // Write code for - 3 current number 
        const leftSideNumbers = [(currentPageNumber-3), (currentPageNumber-2), (currentPageNumber-1)]

        // console.log(leftSideNumbers); 
        // leftSideNumbers.forEach((pageNumber) => {
        //   if ((pageNumber < 0) || (pageNumber === 1)) {

        //   }
        // })
        if (number === currentPageNumber) { // Current page 
          return standardReturn
        }
        // Write code for + 3 current number 
        const rightSideNumbers = [(currentPageNumber+1), (currentPageNumber+2), (currentPageNumber+3)]
        console.log(rightSideNumbers);
        if (number === totalPages) {  // Last page
          return standardReturn
        }
      });
      // console.log(innerHTML);
    }

    let paginationHTML = `
    <div>
    <ul id="pagination-ul" class='pagination pagination-lg flex-wrap' data-current-page=${currentPageNumber} style="justify-content: center">
    ${innerHTML.join("")}
    </ul>
    </div>
    `;
    res.locals.paginationHTML = paginationHTML;
    next();
  },
};
