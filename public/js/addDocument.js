const saveDocument = async (doc_data) => {
  try {
    const result = await axios({
      method: "POST",
      url: `${BASE}documents/`,
      data: doc_data,
    });
    if (result) {
      if (result.data) {
        const data = result.data.data;
        console.log(data);

        document.getElementById("feedback").innerHTML += "Document uploaded";
        document.getElementById("feedback").style.color = "green";
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const formatTime = (date) => {
  const t = date.toString().split(" ");
  const ti = t[4].split(":");
  const tim = [ti[0], ti[1]].join(":").toString();
  const timm = [t[0], t[1], t[2], t[3]].join(" ").toString();
  const time = timm + " " + tim;

  return time;
};

const getFileName = (file) => {
  let a = file.split("\\");
  let i = a.length;
  return a[i - 1].toLowerCase();
};

document.querySelector("#add-document-form").addEventListener("submit", (e) => {
  // e.preventDefault();
  const d = new Date();
  const da =
    d.getFullYear() +
    "_" +
    d.getMonth() +
    "_" +
    d.getDate() +
    "_" +
    d.getHours() +
    "_" +
    d.getMinutes() +
    "_" +
    parseInt(d.getSeconds() / 5);
  const topic = document.getElementById("document-topic").value;
  const description = document.getElementById("document-description").value;
  let document_name = document.getElementById("file_to_upload").value;
  document_name = da + "_" + getFileName(document_name);

  const my_id = localStorage.getItem("userid");
  const date = formatTime(new Date());
  saveDocument({
    topic: topic,
    description: description,
    document_name: document_name,
    uploader: my_id,
    date: date,
  });
});
