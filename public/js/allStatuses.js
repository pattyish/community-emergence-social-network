/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const allowPage = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please, login!!');
        window.location.href = `${BASE}login`;
    }
};
allowPage();

const getCurrentUser = async () => {
    try {
        const id = localStorage.getItem('userid');
        const result = await axios({
            method: 'GET',
            url: `${BASE}users/${id.toString()}`
        });

        return result.data.data.userstatus.status;
    } catch (err) {
        return { error: err };
    }
};

const selectStatus = (currstat, thisstat) => {
    if (currstat === thisstat) {
        return 'checked';
    }
};

const addRow = (status, currStatus) => {
    let new_row = `<tr class= 'w3-${status.color
        }'><td><input type ='radio' name='status' id='status' ${selectStatus(currStatus, status.status)
        } value='${status._id
        }'></td>`;
    new_row
        += `<td>  ${status.status
        } </td><td>  ${status.explanation
        } </td></tr>`;
    document.getElementById('status-table').innerHTML += new_row;
};
const renderData = (statuses, currStatus) => {
    let i = 0;
    statuses.forEach((element) => {
        addRow(element, currStatus);
        i++;
    });

    let submit_btn;
    if (i > 0) {
        submit_btn = '<tr><td colspan=\'3\'><button class=\'w3-btn w3-teal w3-round-large w3-right\' type=\'submit\'> Update </button></td></tr>';
    } else {
        submit_btn = '<p>No status available to choose from</p>';
    }

    document.getElementById('status-table').innerHTML += submit_btn;
};
const getStatuses = async () => {
    try {
        const result = await axios({
            method: 'GET',
            url: `${BASE}status`
        });
        // get the current user details
        const currStatus = await getCurrentUser();
        renderData(result.data.data, currStatus);
    } catch (err) {
        console.log({ error: err });
    }
};
getStatuses();

const updateStatus = async (user, status) => {
    try {
        const result = await axios({
            method: 'POST',
            url: `${BASE}status/user`,
            data: {
                user,
                status
            }
        });
        // get the current user details
        const { data } = result;
        console.log(data);
        if (data.status === 'success') {
            document.getElementById('feedback-status').innerHTML = '<marquee><b style=\'color: green\'>Status is updated</b></marquee>';
            alert('You status is updated');
        } else {
            alert('Failed, try again');
        }
    } catch (err) {
        console.log({ error: err });
    }
};

// I can even submit the form

document.querySelector('#status-form').addEventListener('submit', (e) => {
    e.preventDefault();
    /*
                  We are going to do the couple of things.

                  1. Get The current status of the logged in user, and then set it checked by default. This is done
                  2. Change the user status on submit, and then show it everywhere the user name appears except on announcement

              */

    const status = document.getElementsByName('status');
    let value;
    for (const s of status) {
        if (s.checked) {
            value = s.value;
            break;
        }
    }
    if (!value) {
        // alert("Choose a status, please");
        document.getElementById('feedback-status').innerHTML = '<marquee><b>Choose a status, please</b></marquee>';
    } else {
        const user = localStorage.getItem('userid');
        if (!user) {
            alert('You are not permitted to do this, log-in again and try!!!');
        } else {
            updateStatus(user, value);
        }
    }
});
