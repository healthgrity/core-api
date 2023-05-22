// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Healthgrity {
    struct ExamReport {
        uint id;
        string data;
    }

    ExamReport[] private examReports;

    function addExamReport(uint _id, string memory _data) public {
        examReports.push(ExamReport(_id, _data));
    }

    function getExamReport(uint _id) public view returns (ExamReport memory) {
        for(uint i = 0; i < examReports.length; i++) {
            if(examReports[i].id == _id) {
                return examReports[i];
            }
        }
        revert("Exam report not found");
    }

    function getExamReports() public view returns (ExamReport[] memory) {
        return examReports;
    }
}