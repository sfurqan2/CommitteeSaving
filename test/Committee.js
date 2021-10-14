const Committee = artifacts.require('Committee');
const web3 = require('web3');

const utils = require("./helpers/utils");
var { expect } = require('chai');

// const participants = ["Bob", "Mike", "John", "Smith"];

contract("Committee", (accounts) => {
    let [Bob, Mike, John, Smith] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await Committee.new();
    });

    it("should create a new committee", async() => {
        const result = await contractInstance.createCommittee("Random", Mike, web3.utils.toWei("0.0002", "ether"), {
            from: Bob,
            value: web3.utils.toWei("0.0002", "ether")
        });
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args.name).to.equal("Random");
    });
    
    context("user joining a new committee", async() => {

        it("should succeed with right amount of ether", async() => {
            const result = await contractInstance.createCommittee("Random", Mike, web3.utils.toWei("0.0002", "ether"), {
                from: Bob,
                value: web3.utils.toWei("0.0002", "ether")
            });
    
            const result2 = await contractInstance.joinCommittee(result.logs[0].args.committeeId, {
                from: John,
                value: web3.utils.toWei("0.0002", "ether")
            });
    
            expect(result2.receipt.status).to.equal(true);
        });
    
        it("should not succeed with wrong amount of ether", async() => {
            const result = await contractInstance.createCommittee("Random", Mike, web3.utils.toWei("0.0002", "ether"), {
                from: Bob,
                value: web3.utils.toWei("0.0002", "ether")
            });
    
            await utils.shouldThrow(
                contractInstance.joinCommittee(result.logs[0].args.committeeId, {
                    from: John,
                    value: web3.utils.toWei("0.0001", "ether")
                })
            );
    
        });
    });

    context("in case of withdrawing money", async() => {
        it("other users should fail", async() => {
            const result = await contractInstance.createCommittee("Random", Mike, web3.utils.toWei("0.0002", "ether"), {
                from: Bob,
                value: web3.utils.toWei("0.0002", "ether")
            });
    
            const result2 = await contractInstance.joinCommittee(result.logs[0].args.committeeId, {
                from: John,
                value: web3.utils.toWei("0.0002", "ether")
            });
            
            await utils.shouldThrow(
                contractInstance.withdraw(result.logs[0].args.committeeId, {
                    from: John,
                    value: web3.utils.toWei("0.0002", "ether")
                })
            );
        });

        it("stakeholder should succeed", async() => {
            
            const result = await contractInstance.createCommittee("Random", Mike, web3.utils.toWei("0.0002", "ether"), {
                from: Bob,
                value: web3.utils.toWei("0.0002", "ether")
            });
    
            await contractInstance.joinCommittee(result.logs[0].args.committeeId, {
                from: John,
                value: web3.utils.toWei("0.0002", "ether")
            });
            
            await contractInstance.approveWithdrawal( result.logs[0].args.committeeId, { from: John });
            const result3 = await contractInstance.withdraw(result.logs[0].args.committeeId, {
                from: Mike
            });

            expect(result3.logs[0].args.stakeholder).to.equal(Mike);
            expect(result3.logs[0].args.balance.toString()).to.equal(web3.utils.toWei("0.0004", "ether").toString());

        });
    });

});