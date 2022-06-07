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

// FILTER PATTERNS // // // //
class Filter {
    // Parent class that can be inherited by all kind of filterings we may want to implement
    constructor(data) {
        this.data = data;
    }
    filter() { }
    getData() {
        return this.data;
    }
}

class FilterStopWords extends Filter {
    constructor(data) {
        super(data);
    }
    filter(stopword) {
        const data_to_list = this.data.split(" ");
        var filtered = data_to_list.filter(function (value, index, arr) {
            return value.trim() !== ele.trim();
        });

        this.data = filtered.join(" ");
        return this;
    }
}
