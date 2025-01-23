from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from fastapi import File, UploadFile
import openpyxl
from fastapi import FastAPI, File, UploadFile, HTTPException
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Employee(BaseModel):
    id: int
    name: str
    position: str

employees: List[Employee] = []

next_id = 1

@app.get("/employees", response_model=List[Employee])
def get_employees():
    return employees

@app.post("/employees", response_model=Employee)
def add_employee(employee: Employee):
    if employees:
        max_id = max(emp.id for emp in employees)
    else:
        max_id = 0
    employee.id = max_id + 1
    employees.append(employee)
    return employee

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int):
    global employees
    for emp in employees:
        if emp.id == employee_id:
            employees = [e for e in employees if e.id != employee_id]
            return {"message": "Employee deleted successfully!"}
    raise HTTPException(status_code=404, detail="Employee not found")

@app.put("/employees/{employee_id}")
def update_employee(employee_id: int, updated_employee: Employee):
    for i, emp in enumerate(employees):
        if emp.id == employee_id:
            employees[i] = updated_employee
            return {"message": "Employee updated successfully!"}
    raise HTTPException(status_code=404, detail="Employee not found")

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        from io import BytesIO
        excel_file = BytesIO(file_content)
        wb = openpyxl.load_workbook(excel_file)
        sheet = wb.active

        employees = []
        data = []
        for row in sheet.iter_rows(min_row=2, values_only=True): 
            if row and all(cell is not None for cell in row):  
                employees.append({"ID":row[0], "name": row[1], "position": row[2]}) 

        return {"message": "File processed successfully!", "data": employees}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")



@app.put("/employees")
def update_employees(new_employees: List[Employee]):
    global employees  
    employees = [Employee(**emp.dict()) for emp in new_employees] 
    return {"message": "Employees updated successfully!", "data": employees}


@app.get("/")
def root():
    return {"message": "HR Management Platform API is running!"}
