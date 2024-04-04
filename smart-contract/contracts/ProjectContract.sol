// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ProjectContract {
    struct Project {
        address owner;
        string farm;
        string[] input;
        string[] outputs;
        string[] processes;
        string[] expects;
        string[] images;
        string[] weathers;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public projectsByOwner; // Mapping từ địa chỉ owner đến danh sách các project của họ

    uint256 public numberOfProjects = 0;

    event ProjectCreated(uint256 indexed projectId, address indexed owner, string farm, string input);
    event ProcessInserted(uint256 indexed projectId, string process);
    event ExpectInserted(uint256 indexed projectId, string expect);
    event OutputInserted(uint256 indexed projectId, string output);
    event ImageInserted(uint256 indexed projectId, string hashImage);
    event WeatherInserted(uint256 indexed projectId, string weather);
    event InputUpdated(uint256 indexed projectId, string input);
    event ProcessUpdated(uint256 indexed projectId, string process);
    event ExpectUpdated(uint256 indexed projectId, string expect);
    event OutputUpdated(uint256 indexed projectId, string output);

    function createProject(address _owner, string memory _farm, string memory _input) public returns (uint256) {
        Project storage project = projects[numberOfProjects];

        project.owner = _owner;
        project.farm = _farm;
        project.input.push(_input);

        emit ProjectCreated(numberOfProjects, _owner, _farm, _input);

        projectsByOwner[_owner].push(numberOfProjects); // Thêm project mới vào danh sách của owner

        numberOfProjects++;

        return numberOfProjects - 1;
    }

    function updateInput(uint256 _id, string memory _input) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can update input");
        project.input.push(_input);

        emit InputUpdated(_id, _input);
    }

    function insertProcess(uint256 _id, string memory _process) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert process");
        project.processes.push(_process);

        emit ProcessInserted(_id, _process);
    }

    function updateProcess(uint256 _id, string memory _process) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can update process");
        project.processes.push(_process);

        emit ProcessUpdated(_id, _process);
    }

    function insertExpect(uint256 _id, string memory _expect) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert expect");
        project.expects.push(_expect);

        emit ExpectInserted(_id, _expect);
    }

    function updateExpect(uint256 _id, string memory _expect) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can update expect");
        project.expects.push(_expect);

        emit ExpectUpdated(_id, _expect);
    }

    function insertOutput(uint256 _id, string memory _output) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert output");
        project.outputs.push(_output);

        emit OutputInserted(_id, _output);
    }

    function updateOutput(uint256 _id, string memory _output) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can update output");
        project.outputs.push(_output);

        emit OutputUpdated(_id, _output);
    }

    function insertImage(uint256 _id, string memory _hashImage) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert image");
        project.images.push(_hashImage);

        emit ImageInserted(_id, _hashImage);
    }

    function insertWeather(uint256 _id, string memory _weather) public {
        Project storage project = projects[_id];

        project.weathers.push(_weather);

        emit WeatherInserted(_id, _weather);
    }

    function getProject(uint256 _id) public view returns (address, string memory, string[] memory) {
        Project storage project = projects[_id];
        return (project.owner, project.farm, project.input);
    }

    function getProjectInput(uint256 _id) public view returns (string[] memory) {
        return projects[_id].input;
    }

    function getProjectProcesses(uint256 _id) public view returns (string[] memory) {
        return projects[_id].processes;
    }

    function getProjectOutputs(uint256 _id) public view returns (string[] memory) {
        return projects[_id].outputs;
    }

    function getProjectExpects(uint256 _id) public view returns (string[] memory) {
        return projects[_id].expects;
    }

    function getProjectImages(uint256 _id) public view returns (string[] memory) {
        return projects[_id].images;
    }

    function getProjectWeathers(uint256 _id) public view returns (string[] memory) {
        return projects[_id].weathers;
    }


}