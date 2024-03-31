// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VideoHashContract {
    // Struct to represent video metadata
    struct Video {
        string hash;
        uint256 date; // Date represented as timestamp
    }

    // Struct to represent connection loss metadata
    struct ConnectionLoss {
        uint256 date; // Date represented as timestamp
        string connectionLoss; // Description of connection loss
        uint256 totalLossPerDay; // Total loss per day
    }

    // Struct to represent camera metadata
    struct Camera {
        address owner; // Owner of the camera
        Video[] videos; // Array of videos
        ConnectionLoss[] connectionLosses; // Array of connection losses
    }

    // Mapping to store cameras by ID
    mapping(uint256 => Camera) public cameras;

    // Counter for generating camera IDs
    uint256 public cameraCount;

    // Event emitted when a new camera is added
    event CameraAdded(uint256 indexed cameraId, address indexed owner);

    // Function to add a new camera
    function addCamera() external returns (uint256) {
        uint256 newCameraId = cameraCount;
        cameras[newCameraId].owner = msg.sender; // Assign the owner of the camera
        cameraCount++;
        emit CameraAdded(newCameraId, msg.sender);
        return newCameraId;
    }

    function getCamera(uint256 cameraId) public view returns (address, Video[] memory, ConnectionLoss[] memory) {
        Camera storage camera = cameras[cameraId];
        return (camera.owner, camera.videos, camera.connectionLosses);
    }

    // Function to add a video hash for a specific camera
    function addVideo(uint256 cameraId, string memory videoHash, uint256 date) external {
        // Create a new video metadata
        Video memory newVideo = Video(videoHash, date);
        // Add the video to the camera's videos array
        cameras[cameraId].videos.push(newVideo);
    }

    // Function to add a connection loss for a specific camera
    function addConnectionLoss(uint256 cameraId, uint256 date, string memory connectionLoss, uint256 totalLossPerDay) external {
        // Create a new connection loss metadata
        ConnectionLoss memory newConnectionLoss = ConnectionLoss(date, connectionLoss, totalLossPerDay);
        // Add the connection loss to the camera's connectionLosses array
        cameras[cameraId].connectionLosses.push(newConnectionLoss);
    }

    // Function to get all video hashes for a specific camera
    function getVideosByCamera(uint256 cameraId) external view returns (Video[] memory) {
        return cameras[cameraId].videos;
    }

    // Function to get videos by date range for a specific camera
    function getVideosByDateRange(uint256 cameraId, uint256 startTime, uint256 endTime) external view returns (Video[] memory) {
        Video[] memory result;
        uint256 resultIndex = 0;
        uint256 videoCount = cameras[cameraId].videos.length;
        for (uint256 i = 0; i < videoCount; i++) {
            if (cameras[cameraId].videos[i].date >= startTime && cameras[cameraId].videos[i].date <= endTime) {
                result[resultIndex] = cameras[cameraId].videos[i];
                resultIndex++;
            }
        }
        return result;
    }

    // Function to get connection losses by camera
    function getConnectionLossByCamera(uint256 cameraId) external view returns (ConnectionLoss[] memory) {
        return cameras[cameraId].connectionLosses;
    }

    // Function to get connection losses by date range for a specific camera
    function getConnectionLossByDateRange(uint256 cameraId, uint256 startTime, uint256 endTime) external view returns (ConnectionLoss[] memory) {
        ConnectionLoss[] memory result;
        uint256 resultIndex = 0;
        uint256 lossCount = cameras[cameraId].connectionLosses.length;
        for (uint256 i = 0; i < lossCount; i++) {
            if (cameras[cameraId].connectionLosses[i].date >= startTime && cameras[cameraId].connectionLosses[i].date <= endTime) {
                result[resultIndex] = cameras[cameraId].connectionLosses[i];
                resultIndex++;
            }
        }
        return result;
    }
}