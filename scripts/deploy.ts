import { ethers } from "hardhat";

async function main() {
  const GoalVault = await ethers.getContractFactory("GoalVault");
  const vault = await GoalVault.deploy();
  await vault.waitForDeployment();

  const GoalManager = await ethers.getContractFactory("GoalManager");
  const manager = await GoalManager.deploy();
  await manager.waitForDeployment();

  const RitualIdentityRegistry = await ethers.getContractFactory("RitualIdentityRegistry");
  const identity = await RitualIdentityRegistry.deploy();
  await identity.waitForDeployment();

  console.log("GoalVault:", await vault.getAddress());
  console.log("GoalManager:", await manager.getAddress());
  console.log("RitualIdentityRegistry:", await identity.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
