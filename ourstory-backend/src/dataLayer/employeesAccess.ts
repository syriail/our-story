import { Employee } from 'src/models';
import {createDynamodbClient} from './dynamodb-infrastructure'

class EmployeesAccess{
    constructor (
        private readonly documentClient = createDynamodbClient(),
        private readonly employeesTable = process.env.EMPLOYEES_TABLE,
    ){}
    async getEmployeesByIds(ids:string[]):Promise<Employee[]>{
        if(!ids.length) return []
        try{
            let requests = {}
            const keys = ids.map((id)=>{return {id}})
            requests[this.employeesTable] = {
                    Keys: keys
                }
        const batchGet: AWS.DynamoDB.DocumentClient.BatchGetItemInput = {
            RequestItems: requests
        }
        const response = await this.documentClient.batchGet(batchGet).promise()
        const items = response.Responses[this.employeesTable]
        return items as Employee[]
        }catch(error){
            console.log('Error Call getEmployeesByIds with: ' + ids)
            console.log(error)
            throw error
        }
        
    }
    async getEmployee(id: string): Promise<Employee>{
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: this.employeesTable,
            Key:{
                id
            }
        }
        const response = await this.documentClient.get(params).promise()
        return response.Item as Employee
    }
    async createEmployee(employee: Employee){
        try{
            const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
                TableName: this.employeesTable,
                Item:employee
            }
            await this.documentClient.put(params).promise()
        }catch(error){
            throw error
        }
        
    }
}

export default EmployeesAccess