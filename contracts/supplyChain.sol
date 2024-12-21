// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {

    // User roles enum
    enum UserType { Supplier, Manufacturer, Regulator, Logistics, Retailer }

    // Structs to store product and certification data
    struct Product {
        string productName;
        string supplierName;
        string certificationDetails;
        string currentCheckpoint;
        bool isDelivered;
        address owner;
        Certification[] certifications;
    }

    struct Certification {
        string certifyingAuthority;
        string certificationType;
        uint256 timestamp;
    }

    // Mappings for product data and user roles
    mapping(string => Product) private products;
    mapping(address => UserType) private users;
    address public owner;

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute this.");
        _;
    }

    // Event declarations
    event ProductRegistered(string productId, string productName, address indexed owner);
    event LocationUpdated(string productId, string location, string checkpoint);
    event CertificationAdded(string productId, string certifyingAuthority, string certificationType);
    event ProductDelivered(string productId, string location);
    event UserRegistered(address indexed user, UserType userType);

    constructor() {
        owner = msg.sender;
    }

    // Function to register a user as Supplier, Manufacturer, Regulator, Logistics, or Retailer
    function registerUser(UserType userType) public {
        require(users[msg.sender] == UserType(0), "User is already registered");
        users[msg.sender] = userType;

        emit UserRegistered(msg.sender, userType);
    }

    // Function to get the user type
    function getUserType(address user) public view returns (UserType) {
        return users[user];
    }

    /**
     * Register a product on the blockchain.
     */
    function registerProduct(
        string memory productId,
        string memory productName,
        string memory supplierName,
        string memory certificationDetails
    ) public onlyOwner {
        require(bytes(products[productId].productName).length == 0, "Product already exists.");

        Product storage product = products[productId];
        product.productName = productName;
        product.supplierName = supplierName;
        product.certificationDetails = certificationDetails;
        product.currentCheckpoint = "Registered";
        product.isDelivered = false;
        product.owner = msg.sender;

        product.certifications.push(Certification({
            certifyingAuthority: "Initial Certification",
            certificationType: "Verified",
            timestamp: block.timestamp
        }));

        emit ProductRegistered(productId, productName, msg.sender);
    }

    /**
     * Update product's location during its journey.
     */
    function updateLocation(
        string memory productId,
        string memory location,
        string memory checkpoint
    ) public {
        require(bytes(products[productId].productName).length != 0, "Product does not exist.");
        require(!products[productId].isDelivered, "Product has already been delivered.");

        Product storage product = products[productId];
        product.currentCheckpoint = checkpoint;

        emit LocationUpdated(productId, location, checkpoint);
    }

    /**
     * Add certification details for a product.
     */
    function addCertification(
        string memory productId,
        string memory certifyingAuthority,
        string memory certificationType
    ) public {
        require(bytes(products[productId].productName).length != 0, "Product does not exist.");

        Product storage product = products[productId];
        product.certifications.push(Certification({
            certifyingAuthority: certifyingAuthority,
            certificationType: certificationType,
            timestamp: block.timestamp
        }));

        emit CertificationAdded(productId, certifyingAuthority, certificationType);
    }

    /**
     * Mark a product as delivered to its final destination.
     */
    function markAsDelivered(string memory productId, string memory location) public {
        require(bytes(products[productId].productName).length != 0, "Product does not exist.");
        require(!products[productId].isDelivered, "Product has already been delivered.");

        Product storage product = products[productId];
        product.isDelivered = true;

        emit ProductDelivered(productId, location);
    }

    /**
     * Get product details including its certifications.
     */
    function getProduct(string memory productId)
        public
        view
        returns (
            string memory productName,
            string memory supplierName,
            string memory certificationDetails,
            string memory currentCheckpoint,
            bool isDelivered,
            Certification[] memory certifications
        )
    {
        Product storage product = products[productId];
        require(bytes(product.productName).length != 0, "Product does not exist.");

        return (
            product.productName,
            product.supplierName,
            product.certificationDetails,
            product.currentCheckpoint,
            product.isDelivered,
            product.certifications
        );
    }
}
