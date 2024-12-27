import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { bookingList, bookingStore, bookingUpdate } from '../store/booking';
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
export default function BookingForm(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        bookingDate: null,
        bookingType: '',
        bookingSlot: '',
        bookingTimeShow: '',
        bookingTime: '',
    });

    useEffect(() => {
        if (props.bookingData) {
            if (props.bookingData.bookingTime) {
                const moment = require('moment-timezone')
                const timeParts = props.bookingData.bookingTime.split(':');
                const currentDate = new Date();
                currentDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]), 0);
                props.bookingData.bookingTimeShow = moment(currentDate).tz('Asia/Kolkata', true).toDate();
            }
            setFormData(props.bookingData)
        }
    }, [])
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.name == 'bookingType' && e.target.value == 'Full Day') {
            formData.bookingSlot = ''
            formData.bookingTime = ''
            formData.bookingTimeShow = ''
        }
        if (e.target.name == 'bookingType' && e.target.value == 'Half Day') {
            formData.bookingSlot = ''
            formData.bookingTime = ''
            formData.bookingTimeShow = ''
        }
        if (e.target.name == 'bookingType' && e.target.value == 'Custom') {
            formData.bookingSlot = ''
            formData.bookingTime = ''
            formData.bookingTimeShow = ''
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date) => {
        console.log(date);

        setFormData({ ...formData, bookingDate: moment(date).format('YYYY-MM-DD') });
    };

    const handleTimeChange = (time) => {
        console.log(time);

        setFormData({ ...formData, bookingTime: moment(time).format('HH:mm'), bookingTimeShow: time });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        let response;
        if (!formData.id) {
            response = await dispatch(bookingStore(formData)).unwrap()
            if (response?.success) {
                dispatch(bookingList())
            }
        } else {
            response = await dispatch(bookingUpdate(formData)).unwrap()
            if (response?.success) {
                dispatch(bookingList())
                props.setShowEditModal(false)
            }
        }
        if (response && response.success) {
            reset()
        }
        setLoading(false)
    };
    const handleLogout=()=>{
        localStorage.clear()
        navigate('/login')
    }
    const reset = () => {
        setFormData({
            customerName: '',
            customerEmail: '',
            bookingDate: null,
            bookingType: '',
            bookingSlot: '',
            bookingTime: null,
        })
    }

    return (
        <div className=' container my-5'>
            <div className='border-from '>
                {!formData?.id && <h2 className="d-flex justify-content-between mb-4 p-3 form-titla">Booking Form
                    <Button onClick={handleLogout}>
                        Logout
                    </Button>
                </h2>}
                <Form onSubmit={handleSubmit} className="pt-5 px-3">
                    <Row>
                        <Col md={4} className='mb-3'>
                            <Form.Group >
                                <Form.Label className="form-label">Customer Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} className='mb-3'>
                            <Form.Group >
                                <Form.Label>Customer Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} className='mb-3'>
                            <Form.Group className='d-flex flex-column'>
                                <Form.Label>Booking Date</Form.Label>
                                <DatePicker
                                    selected={formData.bookingDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="Select a date"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} className='mb-3'>
                            <Form.Group >
                                <Form.Label>Booking Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="bookingType"
                                    value={formData.bookingType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Booking Type</option>
                                    <option value="Full Day">Full Day</option>
                                    <option value="Half Day">Half Day</option>
                                    <option value="Custom">Custom</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        {formData.bookingType === 'Half Day' && (
                            <Col md={4} className='mb-3'>
                                <Form.Group className='d-flex flex-column'>
                                    <Form.Label>Booking Slot</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="bookingSlot"
                                        value={formData.bookingSlot}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Slot</option>
                                        <option value="First Half">First Half</option>
                                        <option value="Second Half">Second Half</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        )}

                        {formData.bookingType === 'Custom' && (
                            <Col md={4} className='mb-3'>
                                <Form.Group className='d-flex flex-column'>
                                    <Form.Label>Booking Time</Form.Label>
                                    <DatePicker
                                        selected={formData.bookingTimeShow}
                                        onChange={handleTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Time"
                                        dateFormat="HH:mm"
                                        className="form-control"
                                        placeholderText="Select a time"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>
                    <div className="d-flex justify-content-end">
                        <LoadingButton
                            size="md"
                            loading={loading}
                            className="mb-4"
                            variant="contained"
                            color="primary"
                            type='submit'
                        >
                            <span> {formData.id ? 'Update' : "Submit"}</span>
                        </LoadingButton>
                        {!formData.id && <LoadingButton
                            size="md"
                            loading={loading}
                            className="mb-4 mx-2"
                            variant="contained"
                            color="primary"
                            onClick={reset}
                        >
                            <span>Reset</span>
                        </LoadingButton>}
                    </div>
                </Form>
            </div>

        </div>

    );
}
