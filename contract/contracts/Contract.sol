// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Contract {
    struct Project {
        address owner;
        string title;
        string input;
        string[] outputs;
        string[] processes;
        string[] expects;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public projectsByOwner; // Mapping từ địa chỉ owner đến danh sách các project của họ

    uint256 public numberOfProjects = 0;

    event ProjectCreated(uint256 indexed projectId, address indexed owner, string title, string input);
    event ProcessInserted(uint256 indexed projectId, string process);
    event ExpectInserted(uint256 indexed projectId, string expect);
    event OutputInserted(uint256 indexed projectId, string output);

    function createProject(address _owner, string memory _title, string memory _input) public returns (uint256) {
        Project storage project = projects[numberOfProjects];

        project.owner = _owner;
        project.title = _title;
        project.input = _input;

        emit ProjectCreated(numberOfProjects, _owner, _title, _input);

        projectsByOwner[_owner].push(numberOfProjects); // Thêm project mới vào danh sách của owner

        numberOfProjects++;

        return numberOfProjects - 1;
    }

    function insertProcess(uint256 _id, string memory _process) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert process");
        project.processes.push(_process);

        emit ProcessInserted(_id, _process);
    }

    function insertExpect(uint256 _id, string memory _expect) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert process");
        project.expects.push(_expect);

        emit ExpectInserted(_id, _expect);
    }

    function insertOutput(uint256 _id, string memory _output) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert process");
        project.outputs.push(_output);

        emit OutputInserted(_id, _output);
    }
}
