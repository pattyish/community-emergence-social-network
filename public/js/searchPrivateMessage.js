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
    let arr = words.split(",");
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim();
    }
    return arr;
};

const filterInput = (input) => {
    /*
          This function is for performing the filter in an inputed text and return true if the text can proceed to back end or not by false.
      */
    let stopwords = stopWords();
    let checking = input;
    for (let i = 0; i < stopwords.length; i++) {
        checking = new FilterStopWords(checking).filter(stopwords[i]).getData();
        if (checking.trim().length == 0) {
            break;
        }
    }

    if (checking.trim().length == 0) {
        return false;
    } else {
        return true;
    }
};

const reformatInput = (input) => {
    let input_array = input.split(" ");
    let output = [];
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
        var filtered = data_to_list.filter(function (value, index, arr) {
            return value.trim() !== stopword.trim();
        });

        this.data = filtered.join(" ");
        return this;
    }
}

class filterMessages extends Filter {
    /*
          This is child filter that takes the list of returned messages from the database and filter those 
          containing certain words.
      */
    constructor(data) {
        super(data);
    }
    filter(criteria) {
        let filtered = [];
        this.data.forEach((element, index) => {
            let message = element.content; // Extract the message
            message = reformatInput(message); // Reformat and make it easy to be searched
            message = message.toLowerCase(); // convert to lower case
            if (message.includes(criteria)) {
                filtered.push(element);
            }
        });
        return filtered;
    }
}

//________________________________________________________________________________

// HELPER CLASSES

class LandOnPage {
    constructor() { }
    leftAlign = (one_data) => {
        var additionalContent = "<div class='direct-chat-msg single-message'>";
        additionalContent +=
            "<div class='direct-chat-info clearfix'> <span class='direct-chat-name w3-left' style='text-transform: capitalize;'> &nbsp; &nbsp;<b>" +
            one_data.sender.username +
            "   ";
        if (one_data.sender.userstatus) {
            additionalContent +=
                "<span class='w3-text-" +
                one_data.sender.userstatus.color.toLowerCase() +
                "'>(" +
                one_data.sender.userstatus.status +
                ")</span>";
        }
        additionalContent += "</b></span>";
        additionalContent +=
            "<span class='direct-chat-timestamp w3-right'>" +
            one_data.date +
            "</span> </div> <img class='direct-chat-img' src='/img/citizens.jpg' alt='message user image'>";
        additionalContent +=
            "<div class='direct-chat-text'>" + one_data.content + " </div>";
        additionalContent += " </div>";
        return additionalContent;
    };

    rightAlign = (one_data) => {
        var additionalContent =
            "<div class='direct-chat-msg right single-message'>";
        additionalContent +=
            "<div class='direct-chat-info clearfix'> <span class='direct-chat-name w3-right' style='text-transform: capitalize;'> &nbsp; &nbsp;<b>" +
            one_data.sender.username +
            "   ";
        if (one_data.sender.userstatus) {
            additionalContent +=
                "<span class='w3-text-" +
                one_data.sender.userstatus.color.toLowerCase() +
                "'>(" +
                one_data.sender.userstatus.status +
                ")</span>";
        }
        additionalContent += "</b></span>";
        additionalContent +=
            "<span class='direct-chat-timestamp w3-left'>" +
            one_data.date +
            "</span> </div> <img class='direct-chat-img' src='/img/citizens.jpg' alt='message user image'>";
        additionalContent +=
            "<div class='direct-chat-text'>" + one_data.content + " </div>";
        additionalContent += " </div>";
        return additionalContent;
    };

    addOneMsg(msg) {
        if (isMe(msg.sender._id)) {
            document.getElementById("messages_container").innerHTML +=
                rightAlign(msg);
        } else {
            document.getElementById("messages_container").innerHTML += leftAlign(msg);
        }
    }

    appendMessage = (Messages) => {
        // this function loads the messages and add them to the page

        document.getElementById("messages_container").innerHTML = "";
        Messages.forEach((one_data, index) => {
            addOneMsg(one_data);
        });

        // Auto scroll to the bottom
        var obj = document.getElementById("messages_container");
        obj.scrollTop = obj.scrollHeight;
    };
}

// _______________________________________________________________________________________________________

// Submit and listen to the form event (submit). In this section we also have a search function.
const search = async (search_criteria) => {
    /*
          This functions uses all other helper functions, and finally does the query to select the data from the database.
          I might use a filter pattern to filter the messages that contains the search criteria, and return the list of those
      */
    search_criteria = reformatInput(search_criteria);
    if (!filterInput(search_criteria)) {
        alert("We can't search only stopwords!");
    } else {
        // Do a db query
        const receiverId = document.querySelector("#user-id").value;
        const senderId = localStorage.getItem("userid");
        console.log("recieve", typeof receiverId);
        console.log("", typeof senderId);
        console.log(`${localStorage.getItem("userid")}`);
        try {
            const result = await axios({
                method: "GET",
                url: `${BASE}messages/private/${senderId}/${receiverId}`,
            });
            console.log(result.data);
            if (result) {
                const data = result.data.data;
                // const data = d.slice(-10, d.length);

                // console.log(data);
                let filterMsg = new filterMessages(data);
                let filtered_data = filterMsg.filter(search_criteria.trim());
                filtered_data = filtered_data.slice(-10, filtered_data.length); // filtering and return a certain number of input
                console.log(filtered_data);
                const landing = new LandOnPage();
                landing.appendMessage(filtered_data);
            } else {
                console.log("error happened ", result);
            }
        } catch (err) {
            console.log(err);
        }
    }
};

const backToMessages = async () => {
    const receiverId = document.querySelector("#user-id").value;
    const senderId = localStorage.getItem("userid");
    console.log("recieve", typeof receiverId);
    console.log("", typeof senderId);
    console.log(`${localStorage.getItem("userid")}`);
    try {
        const result = await axios({
            method: "GET",
            url: `${BASE}messages/private/${senderId}/${receiverId}`,
        });
        console.log(result.data);
        if (result) {
            const data = result.data.data;
            const landing = new LandOnPage();
            landing.appendMessage(data);
        } else {
            console.log(result);
        }
    } catch (err) {
        console.log(err);
    }
};

document.querySelector("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let search_criteria = document.getElementById("search-field").value;
    if (search_criteria.trim().length == 0) {
        backToMessages();
    } else {
        search(search_criteria.toLowerCase());
    }
});
