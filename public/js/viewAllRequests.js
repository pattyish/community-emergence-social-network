const populate = (data) =>{
    let html = "<div style='width: 90%; margin-left: 5%; border: solid 1px grey' class='w3-container w3-center w3-round'>";
        html += "<h4>";
        html += `<b> ${data.topic} </b> <small class='w3-right w3-text-teal'>${data.date}`;
        html += `</small></h4>`;
        html += `<p> <i> ${data.description}  </i>  </p> <br/>`;
        html += `<p class='w3-text-blue'>`;
        html += `<input type='hidden' value='${data._id}'><a href='/documents/${data._id}'>`;
        html += `<button class='w3-white go-to-review' style='margin-right: 30px; border: none'><u>review</u></button> </a>`;
        html += ` <a href='/files/${data.document_name}.pdf' target='_blank'> <i>Read and download </i> </a>`;
        html += " </p> </div>";        
    return html;
} 

const addDataToScreen = (list_of_documents) =>
{
    document.getElementById('documentList').innerHTML = "";
    list_of_documents.forEach(element => {
        document.getElementById('documentList').innerHTML += populate(element);
    });
}

// I am gon have a filter pattern to only show me all those document that are reviewed
class Filter
{
    constructor(documents)
    {
        this.documents= documents
    }
    filter()
    {
        return [];
    }
}

class FilterUnProvedDocuments extends Filter
{
    constructor(documents)
    {
        super(documents);
    }
    filter()
    {
        const docs = this.documents;
        let filtered = [];
        docs.forEach(element =>{
            if(!element.reviewed)
            {
                filtered.push(element);
            }
        });
        return filtered;
    }
}

class FilterTopic extends Filter
{
    constructor(documents, criteria)
    {
        super(documents);
        this.criteria = criteria;
    }
    filter()
    {
        const docs = this.documents;
        let filtered = [];
        docs.forEach(element =>{
            let topic = element.topic;
            topic=topic.toLowerCase();
            if(topic.includes(this.criteria))
            {
                filtered.push(element);
            }
        });
        return filtered;
    }
}

class FilterDescription extends Filter
{
    constructor(documents, criteria)
    {
        super(documents);
        this.criteria = criteria;
    }
    filter()
    {
        const docs = this.documents;
        let filtered = [];
        docs.forEach(element =>{
            let description = element.description;
            description = description.toLowerCase();
            if(description.includes(this.criteria))
            {
                filtered.push(element);
            }
        });
        return filtered;
    }
}

class FilterDescriptionOrTopic extends Filter
{
    constructor(documents, criteria)
    {
        super(documents);
        this.criteria = criteria;
    }
    filter()
    {
        const docs = this.documents;
        let filtered = [];
        docs.forEach(element =>{
            let description = element.description;
            let topic = element.topic
            topic = topic.toLowerCase();
            description = description.toLowerCase();
            if(description.includes(this.criteria) || topic.includes(this.criteria))
            {
                filtered.push(element);
            }
        });
        return filtered;
    }
}

const getAllDocuments = async() =>
{
    try
    {
        const result = await axios({
            method: "GET",
            url:"http://localhost:8080/documents"
        });
        if(result)
        {
            if(result.data)
            {
                const data = result.data.data;
                let filter= new FilterUnProvedDocuments(data);
                addDataToScreen(filter.filter());
            }
        }
        
    }
    catch(err)
    {
        console.log(error);
    }
}

getAllDocuments();

//_____________________________________________________________________________________________________________________________


// I AM GOING TO CODE SEARCHING
const searchAll = async(criteria) =>{
    try
    {
        const result = await axios({
            method: "GET",
            url:`${BASE}documents`
        });
        if(result)
        {
            if(result.data)
            {
                const data = result.data.data;
                let proved_filter= new FilterUnProvedDocuments(data);
                let all_fiter = new FilterDescriptionOrTopic(proved_filter.filter(), criteria);
                addDataToScreen(all_fiter.filter());
            }
        }
        
    }
    catch(err)
    {
        console.log(err);
    }
}

const searchTopic = async(criteria) =>{
    try
    {
        const result = await axios({
            method: "GET",
            url:`${BASE}documents`
        });
        if(result)
        {
            if(result.data)
            {
                const data = result.data.data;
                let proved_filter= new FilterUnProvedDocuments(data);
                let topic_filter = new FilterTopic(proved_filter.filter(), criteria);
                addDataToScreen(topic_filter.filter());
            }
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

const searchDescription = async(criteria) =>{
    try
    {
        const result = await axios({
            method: "GET",
            url:`${BASE}documents`
        });
        if(result)
        {
            if(result.data)
            {
                const data = result.data.data;
                let proved_filter= new FilterUnProvedDocuments(data);
                let description_filter = new FilterDescription(proved_filter.filter(), criteria);
                addDataToScreen(description_filter.filter());
            }
        }
        
    }
    catch(err)
    {
        console.log(err);
    }
}

document.querySelector('#search-document-btn').addEventListener('click', e =>
{
    let category = document.getElementById('searchOption').value;
    let criteria = document.getElementById('search').value;
    criteria = criteria.toLowerCase();
    category = category.toLowerCase();
    if(criteria.trim().length > 0)
    {
        if(category === "all")
        {
            searchAll(criteria);
        }
        else if(category === "topic")
        {
            searchTopic(criteria);
        }
        else if(category === "description")
        {
            searchDescription(criteria);
        }
        else
        {
            alert(category);
        }
    }
    else
    {
        getAllDocuments();
    }
});