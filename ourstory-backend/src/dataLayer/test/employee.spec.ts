// import EmployeesAccess, {
//   mockGetEmployee,
// } from "../src/dataLayer/employeesAccess"
// import { getEmployee, createEmployee } from "../src/businessLogic/employees"

// jest.mock("../src/dataLayer/employeesAccess")
// //console.log(process.env.NODE_ENV)

// beforeEach(() => {
//   //EmployeesAccess.mockClear()
//   mockGetEmployee.mockClear()
// })
// //myMock.mockReturnValueOnce(10)
import * as AWSXRay from "aws-xray-sdk"
import { EmployeeRole } from '../../models'
import EmployeesAccess from "../employeesAccess"
const seededEmployees = require('../../../db-seeds/employees.json')
AWSXRay.setContextMissingStrategy("IGNORE_ERROR")
const employeesAccess = new EmployeesAccess()

describe("data access getEmployee", () => {
  it("Should return the employee of id: 2 which was seed while starting db", async () => {
    const employeeId = '2'
    const expectedEmployee = seededEmployees.find(employee => employee.id === employeeId)
    const receivedEmployee = await employeesAccess.getEmployee(employeeId)
    expect(receivedEmployee).toStrictEqual(expectedEmployee)
  })
  it("should return the the same employee after creating it", async () => {
    const employee = {
      id: "12345",
      firstName: "Hussein",
      lastName: "Ghrer",
      roles: [EmployeeRole.ADMIN],
      locale: "en",
    }
    await employeesAccess.createEmployee(employee)
    const item = await employeesAccess.getEmployee("12345")
    expect(item).toStrictEqual(employee)
  })
  it("should return undefined", async () => {
    const item = await employeesAccess.getEmployee("54321")
    expect(item).toBeUndefined()
  })
})

describe('Data Access getEmployeesByIds', ()=>{
  it('Should return two employees', async()=>{
    const ids = ['1', '2']
    const expectedEmployees = seededEmployees.filter(employee => ids.includes(employee.id) )
    const receivedEmployees = await employeesAccess.getEmployeesByIds(ids)
    expect(receivedEmployees).toStrictEqual(expectedEmployees)
  })
  it('Should return empty list', async()=>{
    const expectedEmployees = []
    const receivedEmployees = await employeesAccess.getEmployeesByIds(['9898989'])
    expect(receivedEmployees).toStrictEqual(expectedEmployees)
  })
  it('Should return empty list', async()=>{
    const expectedEmployees = []
    const receivedEmployees = await employeesAccess.getEmployeesByIds([])
    expect(receivedEmployees).toStrictEqual(expectedEmployees)
  })
})
