import { variables } from './Variables';
import DeleteEmployee from './DeleteEmployee';
import EditEmployee from './EditEmployee';
import React, { useEffect, useRef, useState } from 'react';

import Button from '../node_modules/react-bootstrap/esm/Button';
import Modal from '../node_modules/react-bootstrap/esm/Modal';
import Form from '../node_modules/react-bootstrap/esm/Form';
import ListGroup from '../node_modules/react-bootstrap/esm/ListGroup';
import InputGroup from '../node_modules/react-bootstrap/esm/InputGroup';
import Pagination from '../node_modules/react-bootstrap/esm/Pagination';


export default function Employees() {
        
    const [employees, setemployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fitchData = (page) => {
        fetch(variables.API_URL + 'employees/GetEmployees/'+page)
        .then(response => response.json())
        .then(data => {
            setemployees(data.Employees);
            setTotalItems(data.TotalCount); 
        });
    }

    useEffect(() => {
        fitchData(currentPage);
    });
    
    const [show, setShow] = useState(false);

    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState("");
  
    const clr = useRef(null);
    const handleClose = () => setShow(false);
    const handleShow = () =>{
        setName("");
        setAge(0);
        setAddresses([]);
        setNewAddress("");
        setShow(true);
    };
    
    const handleSave = () => {
        fetch(variables.API_URL + 'employees/',{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: 0,
                Name: name,
                Age: age,
                Addresses: addresses
            })
        })
        .then(response => response.json())
        .then(result => {
            alert(result)
        },(erroe)=>{
            alert(erroe)
        });
        
        handleClose();
    };
    
    const handleRemoveAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const handleAddressChange = (index, value) => {
        const updatedAddresses = [...addresses];
        updatedAddresses[index].Description = value;
        setAddresses(updatedAddresses);
    };
    
    const handleAddAddress = () => {
        const address = {
            Id: 0,
            Description: newAddress,
            EmployeeId: 0
        };

        setAddresses([...addresses, address]);
        setNewAddress("");
        clr.current.value = "";
    };
    
    return (
        <div> 
            <div style={{margin: 60}}>
                <hr></hr>
                <button type="button" className="btn btn-primary m-2 float-start" onClick={handleShow}>Add New</button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th hidden={true}>Id</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Addresses</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((item) => (
                            <tr>
                                <td key={item.Id} hidden={true}>{item.Id}</td>
                                <td>{item.Name}</td>
                                <td>{item.Age}</td>
                                <td>
                                    <ul>
                                        {item.Addresses.map((address, index) => (
                                            <li key={address.Id}>{address.Description}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <EditEmployee emp={item}/>
                                    <DeleteEmployee emp={item} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination>
                    <Pagination.First 
                    disabled={currentPage === 1 ? true : false}
                    onClick={() => setCurrentPage(1)}/>
                    <Pagination.Prev 
                    disabled={currentPage === 1 ? true : false}
                    onClick={() => setCurrentPage(currentPage - 1)}/>
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next 
                    disabled={currentPage >= totalItems / 2 ? true : false}
                    onClick={() => setCurrentPage(currentPage + 1)}/>
                    <Pagination.Last 
                    disabled={currentPage >= totalItems / 2 ? true : false}
                    onClick={() => setCurrentPage(totalItems % 2 > 0? (totalItems +1)/2: totalItems/2)}/>
                </Pagination>
            </div>

            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}
            backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Add New Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="name">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="age">
                            <Form.Label>Age:</Form.Label>
                            <Form.Control type="number" value={age} onChange={(e) => setAge(Number.parseInt(e.target.value))} />
                        </Form.Group>
                        <Form.Group controlId="addresses">
                            <Form.Label>Addresses:</Form.Label>
                            <ListGroup>
                            {addresses.map((address, index) => (
                                <ListGroup.Item key={index}>
                                    <InputGroup>
                                        <Form.Control type="text"
                                        value={address.Description}
                                        onChange={(e) => handleAddressChange(index, e.target.value)}
                                        required
                                        />
                                        <Button variant="danger" onClick={() => handleRemoveAddress(index)}>
                                            Remove
                                        </Button>
                                    </InputGroup>
                                </ListGroup.Item>
                            ))}
                            </ListGroup>
                                <div className='input-group-text'>
                                    <Form.Label>New Address:</Form.Label>
                                    <input ref={clr} type="text" className='form-control' 
                                    onChange={(e) => setNewAddress(e.target.value)} />
                                    <Button variant="secondary" onClick={handleAddAddress}>Add Address</Button>
                                </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => handleSave()}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

