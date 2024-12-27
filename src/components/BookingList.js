import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Row, Col, Modal } from 'react-bootstrap';
import moment from 'moment'
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import BookingForm from './BookingForm';
import { bookingDelete, bookingList } from '../store/booking';
import { useDispatch, useSelector } from 'react-redux';

const BookingList = () => {
    const dispatch = useDispatch()

    const bookings = useSelector(state => state.booking.bookingData);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(5);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editBooking, setEditBooking] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        fetchBookings();
    }, []);
    const fetchBookings = async () => {
        // const dummyData = [
        //     { id: 1, customerName: 'John Doe', bookingDate: '2024-12-01', bookingType: 'Full Day', bookingSlot: 'First Half', bookingTime: '9:00 AM' },
        //     { id: 2, customerName: 'Jane Smith', bookingDate: '2024-12-02', bookingType: 'Half Day', bookingSlot: 'Second Half', bookingTime: '' },
        //     { id: 3, customerName: 'Alice Johnson', bookingDate: '2024-12-03', bookingType: 'Custom', bookingSlot: '', bookingTime: '2:00 PM' },
        //     { id: 4, customerName: 'Bob Lee', bookingDate: '2024-12-04', bookingType: 'Full Day', bookingSlot: 'First Half', bookingTime: '10:00 AM' },
        //     { id: 5, customerName: 'Charlie Brown', bookingDate: '2024-12-05', bookingType: 'Half Day', bookingSlot: 'First Half', bookingTime: '' },
        //     { id: 6, customerName: 'Dave Wilson', bookingDate: '2024-12-06', bookingType: 'Custom', bookingSlot: '', bookingTime: '3:00 PM' },
        //     { id: 7, customerName: 'Eve Green', bookingDate: '2024-12-07', bookingType: 'Full Day', bookingSlot: 'Second Half', bookingTime: '11:00 AM' },
        //     { id: 8, customerName: 'Frank Black', bookingDate: '2024-12-08', bookingType: 'Half Day', bookingSlot: 'First Half', bookingTime: '' },
        //     { id: 9, customerName: 'Grace White', bookingDate: '2024-12-09', bookingType: 'Full Day', bookingSlot: 'Second Half', bookingTime: '12:00 PM' },
        //     { id: 10, customerName: 'Hannah Blue', bookingDate: '2024-12-10', bookingType: 'Custom', bookingSlot: '', bookingTime: '4:00 PM' },
        // ];
        const response = await dispatch(bookingList()).unwrap();
    };

    // Calculate the current bookings to display on the current page


    // Change page function
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleEdit = (booking) => {
        setEditBooking({...booking,bookingTimeShow:''});
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        let response = await dispatch(bookingDelete(id)).unwrap()
        if (response && response.success) {
            fetchBookings();
        }
    };
    // Calculate total pages
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Bookings List</h2>

            {/* Bookings Table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Booking Date</th>
                        <th>Booking Type</th>
                        <th>Booking Slot</th>
                        <th>Booking Time</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.customerName}</td>
                            <td>{booking.bookingDate ? moment(booking.bookingDate).format('DD/MM/YYYY') : '-'}</td>
                            <td>{booking.bookingType}</td>
                            <td>{booking.bookingSlot || 'N/A'}</td>
                            <td>{booking.bookingTime || 'N/A'}</td>
                            <td className='text-center'>
                                <Button variant="warning" onClick={() => handleEdit(booking)}>
                                    <PencilSquare />
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(booking.id)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    <Trash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination Controls */}
            <Row>
                <Col className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </Col>
            </Row>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size='lg'>        <Modal.Header closeButton>
                <Modal.Title>Update Booking</Modal.Title>
            </Modal.Header>

                <BookingForm bookingData={editBooking} setShowEditModal={setShowEditModal} />
            </Modal>
        </div>
    );
};

export default BookingList;
