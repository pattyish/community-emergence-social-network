const acceptDocument = async(data) =>
{
    try
    {
        const result = await axios({
            method: "PATCH",
            url: `${BASE}documents/accept`,
            data: data
        });
        if(result)
        {
            if(result.data)
            {
                const data= result.data.data;
                alert("This document is reviewed");
            }
        }
        else
        {
            alert("could not save the changes");
        }
    }
    catch(err)
    {
        console.log(err);
        alert("Not accepted");
    }
}
document.querySelector('#accept-request').addEventListener('click', e =>{
    const c = confirm("Are you accepting this guidance?");
    if(c)
    {
        const id = document.getElementById('doc_id').value;
        const acceptance = true;
        acceptDocument({document_id: id, acceptance: acceptance, reviewed: true});
    }
});


document.querySelector('#decline-request').addEventListener('click', e =>{
    const c = confirm("By accepting this, the request is declined and no way to bring it back");
    if(c)
    {
        const id = document.getElementById('doc_id').value;
        const acceptance = false;
        acceptDocument({document_id: id, acceptance: acceptance, reviewed: true});
    }
});