// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RitualIdentityRegistry {
    error InvalidUsername();
    error UsernameTaken();
    error IdentityAlreadyClaimed();

    struct Identity {
        string username;
        string pfp;
        uint64 memberSince;
    }

    mapping(bytes32 => address) public ownerOfUsername;
    mapping(address => Identity) public identityOf;

    event UsernameClaimed(address indexed owner, string username, uint64 memberSince);
    event ProfileUpdated(address indexed owner, string username, string pfp);

    function claimUsername(string calldata username) external {
        bytes memory raw = bytes(username);
        if (raw.length < 10 || raw.length > 23) revert InvalidUsername();
        if (!_endsWithRitual(raw)) revert InvalidUsername();
        if (bytes(identityOf[msg.sender].username).length != 0) revert IdentityAlreadyClaimed();

        bytes32 labelHash = keccak256(raw);
        if (ownerOfUsername[labelHash] != address(0)) revert UsernameTaken();

        ownerOfUsername[labelHash] = msg.sender;
        identityOf[msg.sender] = Identity({
            username: username,
            pfp: "",
            memberSince: uint64(block.timestamp)
        });

        emit UsernameClaimed(msg.sender, username, uint64(block.timestamp));
    }

    function updateProfile(string calldata newUsername, string calldata newPfp) external {
        Identity storage currentIdentity = identityOf[msg.sender];
        if (bytes(currentIdentity.username).length == 0) revert("No identity claimed");

        // If username changes, validate and update ownership
        if (keccak256(bytes(currentIdentity.username)) != keccak256(bytes(newUsername))) {
            bytes memory raw = bytes(newUsername);
            if (raw.length < 10 || raw.length > 23) revert InvalidUsername();
            if (!_endsWithRitual(raw)) revert InvalidUsername();

            bytes32 newLabelHash = keccak256(raw);
            if (ownerOfUsername[newLabelHash] != address(0)) revert UsernameTaken();

            // Release old username
            bytes32 oldLabelHash = keccak256(bytes(currentIdentity.username));
            ownerOfUsername[oldLabelHash] = address(0);

            // Set new username
            ownerOfUsername[newLabelHash] = msg.sender;
            currentIdentity.username = newUsername;
        }

        currentIdentity.pfp = newPfp;

        emit ProfileUpdated(msg.sender, newUsername, newPfp);
    }

    function isAvailable(string calldata username) external view returns (bool) {
        bytes memory raw = bytes(username);
        return raw.length >= 10 && raw.length <= 23 && _endsWithRitual(raw) && ownerOfUsername[keccak256(raw)] == address(0);
    }

    function _endsWithRitual(bytes memory raw) internal pure returns (bool) {
        bytes memory suffix = ".ritual";
        if (raw.length < suffix.length) return false;

        for (uint256 i = 0; i < suffix.length; i++) {
            if (raw[raw.length - suffix.length + i] != suffix[i]) return false;
        }

        return true;
    }
}
