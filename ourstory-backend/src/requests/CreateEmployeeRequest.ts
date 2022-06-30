import { EmployeeRole } from "src/models"

export interface CreateEmployeeRequest{
    locale: string
    firstName: string
    lastName: string
    roles:EmployeeRole[]
}