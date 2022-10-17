window.addEventListener("load", function () {
  if (this.document.getElementById("userTable")) {
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let sort = urlParams.get("sort");

    let page = urlParams.get("page");

    // Sort by name

    const getNameColumn = this.document.querySelector(".order-by");

    getNameColumn.addEventListener("click", sortByName);

    async function sortByName() {
      if (sort === "asc") {
        sort = "desc";
      } else if (sort === "desc") {
        sort = "asc";
      }

      if (!["asc", "desc"].includes(sort)) {
        sort = "desc";
      }

      if (!page && !isNumeric(page)) {
        page = 1;
      }

      window.location.href = `/users?sort=${sort}&page=${page}`;
    }

    // Pagination

    // Prev button

    const getPaginationPrevBtn =
      this.document.querySelector(".pagination--prev");

    if (getPaginationPrevBtn) {
      getPaginationPrevBtn.addEventListener("click", prevPage);

      async function prevPage() {
        if (!page && !isNumeric(page)) {
          page = 1;
        } else {
          page = Number(page) - 1;
        }

        if (!["asc", "desc"].includes(sort)) {
          sort = "asc";
        }

        window.location.href = `/users?sort=${sort}&page=${page}`;
      }
    }

    // Next button

    const getPaginationNextBtn =
      this.document.querySelector(".pagination--next");

    if (getPaginationNextBtn) {
      getPaginationNextBtn.addEventListener("click", nextPage);

      async function nextPage() {
        if (!page && !isNumeric(page)) {
          page = 2;
        } else {
          page = Number(page) + 1;
        }

        if (!["asc", "desc"].includes(sort)) {
          sort = "asc";
        }

        window.location.href = `/users?sort=${sort}&page=${page}`;
      }
    }

    // Pagination number

    const getAllPaginationNumber = this.document.querySelectorAll(
      ".pagination__container--number"
    );

    if (getAllPaginationNumber) {
      getAllPaginationNumber.forEach((element) => {
        const getPageNumber = element.getAttribute("page-number");

        if(getPageNumber === page) {
          element.classList.add("pag-active");
        }

        if(!page && getPageNumber === "1") {
          element.classList.add("pag-active");
        }

        element.addEventListener("click", pageNumber);

        async function pageNumber() {
          if (!["asc", "desc"].includes(sort)) {
            sort = "asc";
          }

          page = getPageNumber;

          window.location.href = `/users?sort=${sort}&page=${page}`;
        }
      });
    }
  }
});
