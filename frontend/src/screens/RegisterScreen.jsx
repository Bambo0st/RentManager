import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/usersApiSlice'

import { toast } from 'react-toastify'

import Loader from '../components/Loader'
import { setCredentials } from '../slices/authSlice'

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth)     //userInfo in authSlice,auth is a state(look at redux dev tools)
    useEffect(() => {           //this is if logged in info is saved then redirect to that site
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo]);


    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
        }
        else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }))
                navigate('/')
            }
            catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }

    }

    return (
        < FormContainer>
            <h1>Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => {
                        setName(e.target.value);
                    }}>
                    </Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => {
                        setEmail(e.target.value);
                    }}>
                    </Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}>
                    </Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='confirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Re-enter the Password'
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}>
                    </Form.Control>
                </Form.Group>
                {isLoading && <Loader />}
                <Row>
                    <Button type='submit' variant='primary' className='mx-auto mt-3' style={{ width: '200px' }}>
                        Sign Up
                    </Button>
                </Row>


                <Row className='py-3'>
                    <Col style={{ textAlign: 'center' }}>
                        Already have an account?<Link to='/login'>Log-in</Link>
                    </Col>
                </Row>
            </Form >
        </FormContainer >
    )
}

export default RegisterScreen;