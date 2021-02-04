const Block = require("./src/block");
/**
 *          BlockchainController
 *       (Do not change this code)
 * 
 * This class expose the endpoints that the client applications will use to interact with the 
 * Blockchain dataset
 */
class BlockchainController {

    //The constructor receive the instance of the express.js app and the Blockchain class
    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        // All the endpoints methods needs to be called in the constructor to initialize the route.
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
        this.getBlochainValidation();
        this.getBlockData();
        this.getBlockchain();
    }

    // Enpoint to Get a Block by Height (GET Endpoint)
    getBlockByHeight() {
        this.app.get("/blockByHeight/:height", async (req, res) => {
            const { height } = req.params;
            if (height) {
                const parsedHeight = parseInt(height);
                let block = await this.blockchain.getBlockByHeight(parsedHeight);
                if(block){
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

    // Endpoint that allows user to request Ownership of a Wallet address (POST Endpoint)
    requestOwnership() {
        this.app.post("/requestValidation", async (req, res) => {
            const { address } = req.body;
            if (address) {
                const message = await this.blockchain.requestMessageOwnershipVerification(address);
                if(message){
                    return res.status(200).json(message);
                } else {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // Endpoint that allow Submit a Star, yu need first to `requestOwnership` to have the message (POST endpoint)
    submitStar() {
        this.app.post("/submitStar", async (req, res) => {
            const {
                address,
                message,
                signature,
                star,
            } = req.body;
            if(address && message && signature && star) {
                try {
                    let block = await this.blockchain.submitStar(address, message, signature, star);
                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(500).send("An error happened!");
                    }
                } catch (error) {
                    return res.status(500).send(error);
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // This endpoint allows you to retrieve the block by hash (GET endpoint)
    getBlockByHash() {
        this.app.get("/blockByHash/:hash", async (req, res) => {
            const { hash } = req.params;
            if (hash) {
                const block = await this.blockchain.getBlockByHash(hash);
                if(block){
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }

        });
    }

    // This endpoint allows you to request the list of Stars registered by an owner
    getStarsByOwner() {
        this.app.get("/blocks/:address", async (req, res) => {
            const { address } = req.params;
            if (address) {
                try {
                    let stars = await this.blockchain.getStarsByWalletAddress(address);
                    if(stars){
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } catch (error) {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }


    // This endpoint allows you to validate which blocks have been tempered with or have a wrong previous block hash
    getBlochainValidation() {
        this.app.get("/blockchainValidation", async (req, res) => {
            try {
                const blockErrors = await this.blockchain.validateChain();
                return res.status(200).json(blockErrors);
            } catch {
                return res.status(500).send("Blockchain Not Found!");
            }
        });
    }

    // This endpoint allows you to get a block by hash and decode its data
    getBlockData() {
        this.app.get("/blocks/data/:hash", async (req, res) => {
            const { hash } = req.params;
            if (hash) {
                try {
                    const block = await this.blockchain.getBlockByHash(hash).then(foundBlock => foundBlock.getBData());
                    return res.status(200).json(block);
                } catch {
                    return res.status(500).send("Block Not Found! Review the Parameters");
                }
            }
        });
    }

    // This endpoint allows you to get the information of the whole blockchain
    getBlockchain() {
        this.app.get("/blockchain", async (req, res) => {
            try {
                return res.status(200).json(this.blockchain);
            } catch {
                return res.status(500).send("Blockchain Not Found!");
            }
        });
    }
}

module.exports = (app, blockchainObj) => { return new BlockchainController(app, blockchainObj);}