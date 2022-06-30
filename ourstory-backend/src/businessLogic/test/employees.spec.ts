import * as AWSXRay from "aws-xray-sdk"
import { EmployeeRole } from '../../models'
import { getEmployee, createEmployee } from "../employees"
AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

describe("business logic getEmployee", () => {
  it("Should return the employee of id: 2 which was seed while starting db", async () => {
    const employee = {
      id: "2",
      firstName: "Mike",
      lastName: "Smith",
      roles: [EmployeeRole.EDITOR],
      locale: "en",
    }
    const item = await getEmployee("2")
    expect(item).toStrictEqual(employee)
  })
  it("should return the the same employee after creating it", async () => {
    const employee = {
      id: "12345",
      firstName: "Hussein",
      lastName: "Ghrer",
      roles: [EmployeeRole.ADMIN],
      locale: "en",
    }
    await createEmployee(employee)
    const item = await getEmployee("12345")
    expect(item).toStrictEqual(employee)
  })
  it("should return undefined", async () => {
    const item = await getEmployee("54321")
    expect(item).toBeUndefined()
  })
})
