pragma solidity ^0.8.0;

contract ProductRegistry {
    // Struct để lưu trữ thông tin của mỗi sản phẩm
    struct Product {
        address owner; // Địa chỉ của chủ sở hữu sản phẩm
        uint256 timeGenerate;
        bool purchased; // Trạng thái đã mua của sản phẩm
        string purchaseInfo; // Thông tin về mua hàng
        string generateQRInfo; // Thông tin về việc generate QR
        string privateId;
    }

    // Struct để lưu trữ thông tin của mỗi dự án
    struct Project {
        address owner; // Địa chỉ của chủ sở hữu sản phẩm
        string projectId; // Id của dự án
        string[] productIds; // New array to store productIds
        mapping(string => Product) products; // Mapping từ productId sang Product
    }

    // Mapping để lưu trữ thông tin của các dự án
    mapping(string => Project) public projects;

    // Event được gửi khi một sản phẩm được tạo QR
    event QRGenerated(string projectId, string generateQRInfo, uint256 timeGenerate);

    // Event được gửi khi một sản phẩm được mua
    event ProductPurchased(string projectId, string privateId, string purchaseInfo);

    // Hàm để tạo QR và khởi tạo trạng thái của các sản phẩm
    function generateQR(string memory projectId, uint256 numberOfQR, string[] memory privateIds, string memory generateQRInfo, uint256 timeGenerate) public {
        require(numberOfQR > 0, "Number of QR must be greater than 0.");
        require(numberOfQR == privateIds.length, "Number of QR does not match the number of private IDs.");

        // Tạo dự án nếu chưa tồn tại
        if (bytes(projects[projectId].projectId).length == 0) {
            projects[projectId].projectId = projectId;
            projects[projectId].owner = msg.sender;
        }

        for (uint256 i = 0; i < numberOfQR; i++) {
            string memory privateId = privateIds[i];
            projects[projectId].products[privateId].owner = msg.sender;
            projects[projectId].products[privateId].purchased = false;
            projects[projectId].products[privateId].generateQRInfo = generateQRInfo;
            projects[projectId].products[privateId].timeGenerate = timeGenerate;
            projects[projectId].products[privateId].privateId = privateId;
            projects[projectId].productIds.push(privateId); // Store the productId
        }

        // Gửi sự kiện QRGenerated với thông tin generateQRInfo
        emit QRGenerated(projectId, generateQRInfo, timeGenerate);
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

    // Hàm để lấy thông tin của sản phẩm dựa trên projectId
    function getProductByProjectId(string memory projectId) public view returns (Product[] memory) {
        require(msg.sender == projects[projectId].owner, "Only the owner can call this function.");
        uint256 productCount = projects[projectId].productIds.length;
        Product[] memory productList = new Product[](productCount);
        for (uint256 i = 0; i < productCount; i++) {
            string memory productId = projects[projectId].productIds[i];
            productList[i] = projects[projectId].products[productId];
        }
        return productList;
    }

    // Hàm để lấy thông tin của một sản phẩm dựa trên projectId và privateId
    function getProductInfo(string memory projectId, string memory privateId) public view returns (address, uint256, bool, string memory, string memory, string memory) {
        Product memory product = projects[projectId].products[privateId];
        return (product.owner, product.timeGenerate, product.purchased, product.purchaseInfo, product.generateQRInfo, product.privateId);
    }
}
