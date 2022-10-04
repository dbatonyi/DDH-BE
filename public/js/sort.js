window.addEventListener("load", function () {
  if (this.document.getElementById("userTable")) {
    const getTable = this.document.getElementById("userTable");
    const getNameColumn = this.document.querySelector(".order-by a");

    getNameColumn.addEventListener("click", sortByName);

    async function sortByName() {
      console.log("Button is working!");
    }
  }
});
