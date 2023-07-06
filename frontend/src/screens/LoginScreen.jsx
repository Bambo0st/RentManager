import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'

import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'

import { toast } from 'react-toastify'

import Loader from '../components/Loader'
const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth)     //userInfo in authSlice,auth is a state(look at redux dev tools)
    useEffect(() => {           //this is if logged in info is saved then redirect to that site
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo]);


    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }))
            navigate('/')
        }
        catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        < FormContainer>
            <h1>Sign In</h1>
            <Form onSubmit={submitHandler}>
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
                {isLoading && <Loader />}
                <Row>
                    <Button type='submit' variant='primary' className='mx-auto mt-3' style={{ width: '200px' }}>
                        Sign In
                    </Button>
                </Row>


                <Row className='py-3'>
                    <Col>
                        New Customer? <Link to='/register'>Register</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer >
    )
}

export default LoginScreen;