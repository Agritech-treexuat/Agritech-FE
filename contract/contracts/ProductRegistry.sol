pragma solidity ^0.8.0;

contract ProductRegistry {
    // Struct để lưu trữ thông tin của mỗi sản phẩm
    struct Product {
        address owner; // Địa chỉ của chủ sở hữu sản phẩm
        bool purchased; // Trạng thái đã mua của sản phẩm
        string purchaseInfo; // Thông tin về mua hàng
        string generateQRInfo; // Thông tin về việc generate QR
    }

    // Struct để lưu trữ thông tin của mỗi dự án
    struct Project {
        string projectId; // Id của dự án
        mapping(string => Product) products; // Mapping từ productId sang Product
    }

    // Mapping để lưu trữ thông tin của các dự án
    mapping(string => Project) public projects;

    // Event được gửi khi một sản phẩm được tạo QR
    event QRGenerated(string projectId, string generateQRInfo);

    // Event được gửi khi một sản phẩm được mua
    event ProductPurchased(string projectId, string privateId, string purchaseInfo);

    // Hàm để tạo QR và khởi tạo trạng thái của các sản phẩm
    function generateQR(string memory projectId, uint256 numberOfQR, string[] memory privateIds, string memory generateQRInfo) public {
        require(numberOfQR > 0, "Number of QR must be greater than 0.");
        require(numberOfQR == privateIds.length, "Number of QR does not match the number of private IDs.");

        // Tạo dự án nếu chưa tồn tại
        if (bytes(projects[projectId].projectId).length == 0) {
            projects[projectId].projectId = projectId;
        }

        for (uint256 i = 0; i < numberOfQR; i++) {
            string memory privateId = privateIds[i];
            projects[projectId].products[privateId].owner = msg.sender;
            projects[projectId].products[privateId].purchased = false;
            projects[projectId].products[privateId].generateQRInfo = generateQRInfo;
        }

        // Gửi sự kiện QRGenerated với thông tin generateQRInfo
        emit QRGenerated(projectId, generateQRInfo);
    }

    // Hàm để mua sản phẩm và ghi thông tin lên blockchain
    function purchaseProduct(string memory projectId, string memory privateId, string memory purchaseInfo) public {
        // Kiểm tra xem sản phẩm đã được mua chưa
        require(!projects[projectId].products[privateId].purchased, "Product has already been purchased.");

        // Ghi thông tin mua hàng lên blockchain
        projects[projectId].products[privateId].purchased = true;
        projects[projectId].products[privateId].purchaseInfo = purchaseInfo;

        // Gửi sự kiện ProductPurchased
        emit ProductPurchased(projectId, privateId, purchaseInfo);
    }

    // Hàm để kiểm tra trạng thái mua của sản phẩm
    function checkProductStatus(string memory projectId, string memory privateId) public view returns (bool) {
        return projects[projectId].products[privateId].purchased;
    }
}
