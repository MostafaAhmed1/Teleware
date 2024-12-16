import { useState } from 'react';
import Button from '../node_modules/react-bootstrap/esm/Button';
import Modal from '../node_modules/react-bootstrap/esm/Modal';
import Form from '../node_modules/react-bootstrap/esm/Form';
import ListGroup from '../node_modules/react-bootstrap/esm/ListGroup';
import InputGroup from '../node_modules/react-bootstrap/esm/InputGroup';
import { useRef } from 'react';
import { variables } from './Variables';

export default function EditEmployee(props) {

    const [show, setShow] = useState(false);
      
    const [name, setName] = useState(props.emp.Name);
    const [age, setAge] = useState(props.emp.Age);
    const [addresses, setAddresses] = useState(props.emp.Addresses);
    const [newAddress, setNewAddress] = useState("");
    
    const clr = useRef(null);
    const handleClose = () => setShow(false);
    const handleShow = () =>{
        setName(props.emp.Name);
        setAge(props.emp.Age);
        setAddresses(props.emp.Addresses);
        setNewAddress("");
        setShow(true);
    };
    
    const handleEdit = (emp) => {
        fetch(variables.API_URL + 'employees/'+emp.Id,{
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: emp.Id,
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
            EmployeeId: props.emp.Id
        };

        setAddresses([...addresses, address]);
        setNewAddress("");
        clr.current.value = "";
    };

    return (
        <>
            <button type="button" className="btn btn-light mr-1" onClick={handleShow}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>
            </button>

            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}
            backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Editing Employee : {props.emp.Name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="name">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="age">
                            <Form.Label>Age:</Form.Label>
                            <Form.Control type="number" value={age} onChange={(e) => setAge(e.target.value)} />
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
                    <Button variant="primary" onClick={() => handleEdit(props.emp)}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

