import EmployeesAccess from '../dataLayer/employeesAccess';
import { Employee } from 'src/models';
import * as uuid from 'uuid'
import { CreateEmployeeRequest } from "src/requests/CreateEmployeeRequest";


const employeesAccess = new EmployeesAccess()
export const createEmployee = async (request: CreateEmployeeRequest)=>{
    
    const id = uuid.v4()
    await employeesAccess.createEmployee({
        id,
        firstName: request.firstName,
        lastName: request.lastName,
        locale: request.locale,
        roles: request.roles
    })
}

export const getEmployee = async(id: string):Promise<Employee> =>{
    return await employeesAccess.getEmployee(id)
}