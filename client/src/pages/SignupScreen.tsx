import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { User } from "../../../server/types/User"
import { Input, Box, Button, useToast, Text, Center, ButtonGroup, Stack } from "@chakra-ui/react";
import { useUserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
const defaultFormFields = {
  name: '',
  email: '',
  password: '',
}

const SignupScreen: React.FC = () => {
  const { createNewUser, user } = useUserContext();
  // react hooks
  const [formFields, setFormFields] = useState(defaultFormFields)
  const { name, email, password } = formFields

  const toast = useToast();
  const resetFormFields = () => {
    return (
      setFormFields(defaultFormFields)
    );
  }
  // handle input changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormFields({ ...formFields, [name]: value })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const tempUser: User = {
      id: 0,
      name: name,
      email: email,
      password: password
    }
    await createNewUser(tempUser)
  }

  const renderRedirect = () => {
    if (user) {
      return <Navigate to="/" />
    }
  }
  return (
    <Center
      height={"80vh"}
      alignContent={"center"}>
      {renderRedirect()}


      <form onSubmit={handleSubmit}>
        <Stack>
          <Text>
            Sign Up to have fun!
          </Text>
          <Input
            placeholder="Name"
            type="name"
            required
            name="name"
            value={name}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            type="email"
            required
            name="email"
            value={email}
            onChange={handleChange}
          />
          <Input
            placeholder="Password"
            type='password'
            required
            name='password'
            value={password}
            onChange={handleChange}
          />
          <ButtonGroup>
            <Button type="submit">Sign Up</Button>
            <Button type="button" onClick={resetFormFields}>Clear</Button>
          </ButtonGroup>
        </Stack>
      </form>
    </Center>);
}

export default SignupScreen