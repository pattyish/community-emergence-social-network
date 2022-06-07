/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-constructor */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable max-len */
/* eslint-disable no-undef */
// eslint-disable-next-line max-classes-per-file
socket.on("newAnnouncement", (data) => getAllAnnouncements());

// Helper functions

const stopWords = () => {
  /*
        This functions turns the list of all stopWords to a javascript arraylist to be used
    */
  let words =
    " a, able, about, across, after, all, almost, also, am, among, an, and, any,";
  words +=
    " are, as, at, be, because, been, but, by, can, cannot, could, dear, did, do,";
  words +=
    "does, either, else, ever, every, for, from, get, got, had, has, have, he, her,";
  words +=
    " hers, him, his, how, however, i, if, in, into, is, it, its, just, least, let, ";
  words +=
    "like, likely, may, me, might, most, must, my, neither, no, nor, not, of, off,";
  words +=
    " often, on, only, or, other, our, own, rather, said, say, says, she, should,";
  words +=
    "since, so, some, than, that, the, their, them, then, there, these, they, this,";
  words +=
    "tis, to, too, twas, us, wants, was, we, were, what, when, where, which, while,";
  words += "who, whom, why, will, with, would, yet, you, your";
  const arr = words.split(",");
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].trim();
  }
  return arr;
};

const filterInput = (input) => {
  /*
        This function is for performing the filter in an inputed text and return true if the text can proceed to back end or not by false.
    */
  const stopwords = stopWords();
  let checking = input;
  for (let i = 0; i < stopwords.length; i++) {
    checking = new FilterStopWords(checking).filter(stopwords[i]).getData();
    if (checking.trim().length == 0) {
      break;
    }
  }

  if (checking.trim().length == 0) {
    return false;
  }
  return true;
};

const reformatInput = (input) => {
  const input_array = input.split(" ");
  const output = [];
  input_array.forEach((element) => {
    if (element.trim().length > 0) {
      output.push(element);
    }
  });
  return output.join(" ");
};
// _______________________________________________________________________________________________

// FILTER PATTERNS // // // //
class Filter {
  // Parent class that can be inherited by all kind of filterings we may want to implement
  constructor(data) {
    this.data = data;
  }

  filter(criteria) {
    return criteria;
  }

  getData() {
    return this.data;
  }
}

class FilterStopWords extends Filter {
  // this is a child filter that is specifically filtering the stopwords
  constructor(data) {
    super(data);
  }

  filter(stopword) {
    const data_to_list = this.data.split(" ");
    const filtered = data_to_list.filter(
      (value, index, arr) => value.trim() !== stopword.trim()
    );

    this.data = filtered.join(" ");
    return this;
  }
}
// ________________________________________________________________________________

// Submit and listen to the form event (submit). In this section we also have a search function.
const search = (search_criteria) => {
  /*
        This functions uses all other helper functions, and finally does the query to select the data from the database.
        I might use a filter pattern to filter the messages that contains the search criteria, and return the list of those
    */
  search_criteria = reformatInput(search_criteria);
  if (search_criteria.length === 0) {
    $(".card").show();
  } else if (!filterInput(search_criteria)) {
    // eslint-disable-next-line no-alert
    alert("We can't search only stopwords!");
  } else {
    // Do a search
    $(".card").show();

    const selectedOption = $("#searchOption").find(":selected").text();

    const announcementCards = $("#announcementList");

    // make jquery ignore case
    // eslint-disable-next-line no-undef
    $.expr[":"].contains = $.expr.createPseudo(
      (arg) =>
        function (elem) {
          return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        }
    );

    switch (selectedOption) {
      case "Content":
        announcementCards
          .find(`.announcement-content:not(:contains('${search_criteria}'))`)
          .parent()
          .parent()
          .parent()
          .parent()
          .css("display", "none");
        break;
      case "Username":
        announcementCards
          .find(`.announcement-username:not(:contains('${search_criteria}'))`)
          .parent()
          .parent()
          .parent()
          .parent()
          .css("display", "none");
        break;
      case "Status":
        announcementCards
          .find(`.announcement-status:not(:contains('${search_criteria}'))`)
          .parent()
          .parent()
          .parent()
          .parent()
          .css("display", "none");
        break;
      case "Date":
        announcementCards
          .find(`.announcement-date:not(:contains('${search_criteria}'))`)
          .parent()
          .parent()
          .parent()
          .parent()
          .css("display", "none");
        break;
      default:
        announcementCards
          .find(`.card-body:not(:contains('${search_criteria}'))`)
          .parent()
          .parent()
          .parent()
          .css("display", "none");
    }
  }
};

const formatTime = (date) => {
  const t = date.toString().split(" ");
  const ti = t[4].split(":");
  const tim = [ti[0], ti[1]].join(":").toString();
  const timm = [t[0], t[1], t[2], t[3]].join(" ").toString();
  const time = `${timm} ${tim}`;

  return time;
};


const getOneUser = async (announcementsDiv, announcement, id) =>
{
  try
  {
    const result = await axios({
      method: "GET",
      url: `${BASE}users/${id}`
    });
    if(result)
    {
      if(result.data)
      {
        const data = result.data.data
        if(data)
        {
          if(data.status === "active")
          {
            console.log(data);
            announcementsDiv.innerHTML += addOneAnnouncements(announcement);
          }
        }
      }
      else
      {
        return null;
      }
    }
    else
    {
      return null;
    }
  }
  catch(err)
  {
    console.log(err);
    return null;
  }
}

const addOneAnnouncements = (announcement) =>
{
  const { content } = announcement;
  const { username } = announcement.sender;
  const status = announcement.sender.userstatus;
  let html = "";
  html += '<div class="card m-1">';
  html += '   <div class="row g-0">';
  html += '       <div class="col-3 text-center">';
  html +=
    "           <img src='/images/megaphone.png' class='img-fluid rounded-start p-2' style='max-height: 80px;'>";
  html += "       </div>";
  html += '       <div class="col-9">';
  html += '           <div class="card-body">';
  html += `                <span class="announcement-content"><i>${content}</i></span><br>`;
  html += `                <br> <strong class="announcement-username"><span style='text-transform: capitalize;'>${username}</span></strong>`;
  if (status) {
    try {
      html += `        <em class="announcement-status" style="color: ${announcement.sender.userstatus.color.toLowerCase()}"><b>(${
        announcement.sender.userstatus.status
      })</b></em>`;
      // eslint-disable-next-line no-empty
    } catch (er) {}
  }
  html += `                [<em class="announcement-date">${announcement.date}</em>]`;
  html += "           </div>";
  html += "       </div>";
  html += "   </div>";
  html += "</div>";
  return html;
}

const addAnnouncementToPage = (announcements) =>
{
      const announcementsDiv = document.getElementById("announcementList");
      announcementsDiv.innerHTML =
        '<div class="d-flex justify-content-center"> <div class="spinner-border" role="status"></div> </div>';  
      announcementsDiv.innerHTML = "";
      announcements.forEach((announcement) => {
        getOneUser(announcementsDiv, announcement, announcement.sender._id);
      });
}

function getAllAnnouncements() {
  fetch(`${BASE}announcements`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) => {
      // console.log(res.data);
      addAnnouncementToPage(res.data);
    })
    .catch((err) => console.log(err));
}

async function createAnnouncement(content) {
  try {
    $("#postButtonSpinner").show();
    const result = await axios({
      method: "POST",
      url: `${BASE}announcements`,
      data: {
        content,
        sender: userId,
        date: formatTime(new Date()),
      },
    });
    console.log(result);
    if (result) {
      const { data } = result;
      if (data.status === "OK") {
        $("#myToast").toast("show");
        $("#postButtonSpinner").css("display", "none");
      }
    }
  } catch (err) {
    console.log(err.message);
    $("#postButtonSpinner").css("display", "none");
  }
}

async function submitAnnouncement() {
  await createAnnouncement($("#announcementText").val());
  $("#announcementText").val("");
}

function filterAnnouncements() {
  const filter = $("#search").val().toLowerCase();
  search(filter);
}

getAllAnnouncements();

const checkPrivelegeForPost = () => {
  const privilege = localStorage.getItem("privilege");
  if (privilege !== "coordinator") {
    document.querySelector("#post-announcement-area").style.display = "none";
  } else {
    document.querySelector("#post-announcement-area").style.display = "block";
  }
  console.log(privilege);
};

checkPrivelegeForPost();
