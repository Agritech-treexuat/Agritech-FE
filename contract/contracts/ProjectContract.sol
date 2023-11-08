// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectContract {
    // Struct chứa thông tin về một dự án
    struct Project {
        string name;
        string id;
        string farmID;
        Input input;
        mapping(string => Output) outputs;
        mapping(string => Process) processes;
        mapping(string => Expect) expects;
        Image[] images;
        Weather[] weather;
    }

    // Struct chứa thông tin về đầu vào của dự án
    struct Input {
        string initDate;
        string seed;
        uint256 amount;
        string[] images;
        string expect;
    }

    // Struct chứa thông tin về đầu ra của dự án
    struct Output {
        string id;  // Thêm trường ID
        uint256 amount;
        uint256 amount_perOne;
        string[] images;
        string time;
        string npp;
    }

    // Struct chứa thông tin về quy trình của dự án
    struct Process {
        string id;
        string processType;
        string name;
        uint256 amount;
        string note;
        string time;
    }

    // Struct chứa thông tin về dự đoán của dự án
    struct Expect {
        string id;  // Thêm trường ID
        string amount;
        string note;
        string time;
    }

    // Struct chứa thông tin về hình ảnh
    struct Image {
        string id;
        string hash;
        string imageUrl;
        string time;
    }

    // Struct chứa thông tin về thời tiết
    struct Weather {
        string id;
        string date;
        string description;
        uint256 temp;
        uint256 humidity;
        uint256 speed;
    }

    event ProjectAdded(
        string indexed projectId,
        string name,
        string farmID,
        string initDate,
        string seed,
        uint256 amount,
        string[] images,
        string expect
    );

    event InputUpdated(
        string indexed projectId,
        string name,
        string farmID,
        string initDate,
        string seed,
        uint256 amount,
        string[] images,
        string expect
    );

    event OutputAdded(
        string indexed projectId,
        string outputId,
        uint256 amount,
        uint256 amount_perOne,
        string[] images,
        string time,
        string npp
    );

    event ProcessAdded(
        string indexed projectId,
        string processId,
        string processType,
        string processName,
        uint256 amount,
        string note,
        string time
    );

    event ExpectAdded(
        string indexed projectId,
        string expectId,
        string amount,
        string note,
        string time
    );

    event ImageAdded(
        string indexed projectId,
        string imageId,
        string hash,
        string imageUrl,
        string time
    );

    event WeatherAdded(
        string indexed projectId,
        string weatherId,
        string date,
        string description,
        uint256 temp,
        uint256 humidity,
        uint256 speed
    );


    // Mapping lưu trữ thông tin của các dự án
    mapping(string => Project) public projects;

    // Hàm thêm một dự án mới
    function addProject(
        string memory name,
        string memory id,
        string memory farmID,
        Input memory input
    ) public {
        Project storage project = projects[id];
        project.name = name;
        project.id = id;
        project.farmID = farmID;
        project.input = input;

        emit ProjectAdded(
            id,
            name,
            farmID,
            input.initDate,
            input.seed,
            input.amount,
            input.images,
            input.expect
        );
    }

    // Hàm cập nhật thông tin đầu ra của một dự án
    function addOutput(string memory projectId, Output memory output) public {
        Project storage project = projects[projectId];
        project.outputs[output.id] = output;
        string memory outputId = output.id;

        emit OutputAdded(
            projectId,
            output.id,
            output.amount,
            output.amount_perOne,
            output.images,
            output.time,
            output.npp
        );
    }

    // Hàm cập nhật thông tin quy trình của một dự án
    function addProcess(string memory projectId, Process memory process) public {
        Project storage project = projects[projectId];
        project.processes[process.id] = process;

        emit ProcessAdded(
            projectId,
            process.id,
            process.processType,
            process.name,
            process.amount,
            process.note,
            process.time
        );
    }

    // Hàm cập nhật thông tin dự đoán của một dự án
    function addExpect(string memory projectId, Expect memory expect) public {
        Project storage project = projects[projectId];
        project.expects[expect.id] = expect;

        emit ExpectAdded(
            projectId,
            expect.id,
            expect.amount,
            expect.note,
            expect.time
        );
    }

    // Hàm thêm mới thông tin hình ảnh cho một dự án
    function addImage(string memory projectId, Image memory newImage) public {
        Project storage project = projects[projectId];
        project.images.push(newImage);

        emit ImageAdded(
            projectId,
            newImage.id,
            newImage.hash,
            newImage.imageUrl,
            newImage.time
        );
    }

    // Hàm thêm mới thông tin thời tiết cho một dự án
    function addWeather(string memory projectId, Weather memory newWeather) public {
        Project storage project = projects[projectId];
        project.weather.push(newWeather);

        emit WeatherAdded(
            projectId,
            newWeather.id,
            newWeather.date,
            newWeather.description,
            newWeather.temp,
            newWeather.humidity,
            newWeather.speed
        );
    }

    // Hàm cập nhật thông tin đầu vào của một dự án
    function updateInput(string memory projectId, Input memory input) public {
        Project storage project = projects[projectId];
        project.input = input;

        emit InputUpdated(
            project.id,
            project.name,
            project.farmID,
            input.initDate,
            input.seed,
            input.amount,
            input.images,
            input.expect
        );
    }

    // Hàm cập nhật thông tin đầu ra cụ thể của một dự án
    function updateOutput(string memory projectId, string memory outputId, Output memory updatedOutput) public {
        Project storage project = projects[projectId];
        project.outputs[outputId] = updatedOutput;

        emit OutputAdded(
            projectId,
            updatedOutput.id,
            updatedOutput.amount,
            updatedOutput.amount_perOne,
            updatedOutput.images,
            updatedOutput.time,
            updatedOutput.npp
        );
    }

    // Hàm cập nhật thông tin dự đoán cụ thể của một dự án
    function updateExpect(string memory projectId, string memory expectId, Expect memory updatedExpect) public {
        Project storage project = projects[projectId];
        project.expects[expectId] = updatedExpect;

        emit ExpectAdded(
            projectId,
            updatedExpect.id,
            updatedExpect.amount,
            updatedExpect.note,
            updatedExpect.time
        );
    }

    // Hàm cập nhật thông tin quy trình cụ thể của một dự án
    function updateProcess(string memory projectId, string memory processId, Process memory updatedProcess) public {
        Project storage project = projects[projectId];
        project.processes[processId] = updatedProcess;

        emit ProcessAdded(
            projectId,
            updatedProcess.id,
            updatedProcess.processType,
            updatedProcess.name,
            updatedProcess.amount,
            updatedProcess.note,
            updatedProcess.time
        );
    }
}
