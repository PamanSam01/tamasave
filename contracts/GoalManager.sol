// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GoalManager {
    error NotScheduleOwner();
    error ScheduleNotFound();

    enum ScheduleStatus {
        Active,
        Paused,
        Canceled
    }

    struct Schedule {
        address owner;
        uint256 goalId;
        uint256 amount;
        uint64 cadenceSeconds;
        uint64 nextRunAt;
        ScheduleStatus status;
    }

    mapping(bytes32 => Schedule) public schedules;
    bytes32[] public scheduleIds;
    mapping(uint256 => bytes32) public goalToSchedule;

    event ScheduleCreated(
        bytes32 indexed scheduleId,
        address indexed owner,
        uint256 indexed goalId,
        uint256 amount,
        uint64 cadenceSeconds,
        uint64 nextRunAt
    );
    event SchedulePaused(bytes32 indexed scheduleId);
    event ScheduleResumed(bytes32 indexed scheduleId);
    event ScheduleCanceled(bytes32 indexed scheduleId);

    function createSchedule(
        uint256 goalId,
        uint256 amount,
        uint64 cadenceSeconds
    ) external returns (bytes32 scheduleId) {
        scheduleId = keccak256(abi.encode(msg.sender, goalId, amount, cadenceSeconds, block.timestamp, scheduleIds.length));

        schedules[scheduleId] = Schedule({
            owner: msg.sender,
            goalId: goalId,
            amount: amount,
            cadenceSeconds: cadenceSeconds,
            nextRunAt: uint64(block.timestamp) + cadenceSeconds,
            status: ScheduleStatus.Active
        });
        scheduleIds.push(scheduleId);
        goalToSchedule[goalId] = scheduleId;

        emit ScheduleCreated(
            scheduleId,
            msg.sender,
            goalId,
            amount,
            cadenceSeconds,
            uint64(block.timestamp) + cadenceSeconds
        );
    }

    function pauseSchedule(bytes32 scheduleId) external {
        Schedule storage schedule = _ownedSchedule(scheduleId);
        schedule.status = ScheduleStatus.Paused;
        emit SchedulePaused(scheduleId);
    }

    function resumeSchedule(bytes32 scheduleId) external {
        Schedule storage schedule = _ownedSchedule(scheduleId);
        schedule.status = ScheduleStatus.Active;
        schedule.nextRunAt = uint64(block.timestamp) + schedule.cadenceSeconds;
        emit ScheduleResumed(scheduleId);
    }

    function cancelSchedule(bytes32 scheduleId) external {
        Schedule storage schedule = _ownedSchedule(scheduleId);
        schedule.status = ScheduleStatus.Canceled;
        emit ScheduleCanceled(scheduleId);
    }

    function _ownedSchedule(bytes32 scheduleId) internal view returns (Schedule storage schedule) {
        schedule = schedules[scheduleId];
        if (schedule.owner == address(0)) revert ScheduleNotFound();
        if (schedule.owner != msg.sender) revert NotScheduleOwner();
    }
}
