const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain Contract", function () {
    let supplyChain, owner, addr1;
    const productId = "prod123";
    const productName = "Product A";
    const supplierName = "Supplier X";
    const certificationDetails = "Organic Certification";

    beforeEach(async function () {
        // Get the ContractFactory and Signers
        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        [owner, addr1] = await ethers.getSigners();

        // Deploy the contract
        supplyChain = await SupplyChain.deploy();
    });

    describe("Product Registration", function () {
        it("should register a product", async function () {
            await expect(supplyChain.registerProduct(productId, productName, supplierName, certificationDetails))
                .to.emit(supplyChain, "ProductRegistered")
                .withArgs(productId, productName, owner.address);

            const product = await supplyChain.getProduct(productId);
            expect(product.productName).to.equal(productName);
            expect(product.supplierName).to.equal(supplierName);
            expect(product.certificationDetails).to.equal(certificationDetails);
        });
    });

    describe("Location Update", function () {
        it("should update the product location", async function () {
            await supplyChain.registerProduct(productId, productName, supplierName, certificationDetails);
            await expect(supplyChain.updateLocation(productId, "Warehouse 1", "Shipped"))
                .to.emit(supplyChain, "LocationUpdated")
                .withArgs(productId, "Warehouse 1", "Shipped");

            const product = await supplyChain.getProduct(productId);
            expect(product.currentCheckpoint).to.equal("Shipped");
        });
    });

    describe("Add Certification", function () {
        it("should add certification to product", async function () {
            await supplyChain.registerProduct(productId, productName, supplierName, certificationDetails);
            await supplyChain.addCertification(productId, "Certifying Authority", "Fair Trade");

            const product = await supplyChain.getProduct(productId);
            expect(product.certifications.length).to.equal(2); // Initial + added
            expect(product.certifications[1].certifyingAuthority).to.equal("Certifying Authority");
            expect(product.certifications[1].certificationType).to.equal("Fair Trade");
        });
    });

    describe("Product Delivery", function () {
        it("should mark product as delivered", async function () {
            await supplyChain.registerProduct(productId, productName, supplierName, certificationDetails);
            await supplyChain.markAsDelivered(productId, "Store 1");

            const product = await supplyChain.getProduct(productId);
            expect(product.isDelivered).to.equal(true);
        });
    });

    describe("Access control", function () {
        it("should not allow non-owner to register a product", async function () {
            await expect(
                supplyChain.connect(addr1).registerProduct(productId, productName, supplierName, certificationDetails)
            ).to.be.revertedWith("Only contract owner can execute this.");
        });
    });
});
