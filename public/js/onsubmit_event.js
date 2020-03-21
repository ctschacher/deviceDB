// Below Function Executes On Form Submit
function ValidationEvent() {
    var name = document.getElementById("name").value;
    var project = document.getElementById("project").value;
    
    if (name == '') {
        alert("Please provide a name for the item");
        return false;
    }

    if (project == '') {
        alert("Please provide a name for project");
        return false;
    }

    return true;
    }

