fetch(`${BASE}users`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((res) => {
    var tbodyRef = document
      .getElementById("userTable")
      .getElementsByTagName("tbody")[0];
    res.forEach((element) => {
      // Insert a row at the end of table
      var newRow = tbodyRef.insertRow();

      var newCell = newRow.insertCell();
      var newText = document.createTextNode(element.firstname);
      newCell.appendChild(newText);

      var newCell1 = newRow.insertCell();
      var newText1 = document.createTextNode(element.lastname);
      newCell1.appendChild(newText1);

      var newCell2 = newRow.insertCell();
      var newText2 = document.createTextNode(element.username);
      newCell2.appendChild(newText2);

      console.log(element);
    });

    console.log(res);
  })
  .catch((err) => console.log(err));
